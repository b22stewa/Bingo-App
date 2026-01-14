import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './GameRoom.css';

const GameRoom = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [editingCell, setEditingCell] = useState(null); // [row, col] of cell being edited
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchGame();
    fetchCard();
  }, [gameId]);

  const fetchGame = async () => {
    try {
      const response = await api.get(`/games/${gameId}`);
      setGame(response.data.game);
    } catch (error) {
      setError('Failed to load game');
    } finally {
      setLoading(false);
    }
  };

  const fetchCard = async () => {
    try {
      const response = await api.get(`/cards/game/${gameId}`);
      if (response.data.cards.length > 0) {
        setCard(response.data.cards[0]);
      }
    } catch (error) {
      console.error('Failed to load card');
    }
  };

  const handleGenerateCard = async () => {
    setGenerating(true);
    setError('');

    try {
      const response = await api.post('/cards/generate', { game_id: gameId });
      
      if (response.data && response.data.card) {
        setCard(response.data.card);
      } else {
        // If response doesn't have card, fetch it
        await fetchCard();
      }
    } catch (error) {
      console.error('Create card error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to create card. Please try again.';
      setError(errorMessage);
      
      // If error says user already has a card, refresh to show it
      if (error.response?.data?.message?.includes('already has a card')) {
        setTimeout(() => {
          fetchCard();
        }, 500);
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleStartEdit = (row, col, currentText) => {
    // Don't allow editing free space
    if (row === 2 && col === 2) return;
    setEditingCell([row, col]);
    setEditText(currentText || '');
  };

  const handleSaveGoal = async (row, col) => {
    if (!card) return;

    try {
      const response = await api.put(`/cards/${card.id}/goal`, {
        row,
        col,
        goal: editText.trim()
      });
      setCard(response.data.card);
      setEditingCell(null);
      setEditText('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update goal');
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditText('');
  };

  const handleMarkGoal = async (row, col) => {
    if (!card) return;
    
    // Don't allow marking free space
    if (row === 2 && col === 2) return;

    try {
      const response = await api.post(`/cards/${card.id}/mark`, { row, col });
      setCard(response.data.card);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark goal');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!game) {
    return <div className="container">Game not found</div>;
  }

  const isGoalMarked = (row, col) => {
    if (!card || !card.marked_goals) return false;
    return card.marked_goals.some(g => g[0] === row && g[1] === col);
  };

  return (
    <div className="container">
      <div className="game-room-header">
        <h1>{game.room_name}</h1>
        {game.description && game.description !== '0' && game.description !== 0 && (
          <p className="game-description">{game.description}</p>
        )}
        <p>Status: <span className={`status-${game.status}`}>{game.status}</span></p>
        {card && Boolean(card.is_winner) && (
          <div className="winner-banner">🎉 Bingo! You completed a row, column, or diagonal! 🎉</div>
        )}
      </div>

      {!card ? (
        <div className="no-card">
          <p>Create your goal card to get started!</p>
          <button
            onClick={handleGenerateCard}
            className="btn btn-primary"
            disabled={generating}
          >
            {generating ? 'Creating...' : 'Create Goal Card'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      ) : (
        <div className="bingo-card-container">
          <h2>Your Goal Card</h2>
          <p className="instructions">
            Click on a cell to add or edit your goal. Click again to mark it as complete!
          </p>
          <div className="bingo-card">
            <div className="bingo-header">
              {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                <div key={letter} className="bingo-letter">
                  {letter}
                </div>
              ))}
            </div>
            {card.goals.map((row, rowIndex) => (
              <div key={rowIndex} className="bingo-row">
                {row.map((goal, colIndex) => {
                  const isFreeSpace = rowIndex === 2 && colIndex === 2;
                  const isMarked = isGoalMarked(rowIndex, colIndex);
                  const isEditing = editingCell && editingCell[0] === rowIndex && editingCell[1] === colIndex;

                  return (
                    <div
                      key={colIndex}
                      className={`bingo-cell ${
                        isFreeSpace ? 'free-space' : ''
                      } ${isMarked ? 'marked' : ''} ${
                        !isFreeSpace ? 'editable' : ''
                      } ${isEditing ? 'editing' : ''}`}
                      onClick={() => {
                        if (isFreeSpace) return;
                        if (isEditing) return;
                        if (goal && !isMarked) {
                          // If cell has text and isn't marked, mark it
                          handleMarkGoal(rowIndex, colIndex);
                        } else {
                          // Otherwise, start editing
                          handleStartEdit(rowIndex, colIndex, goal);
                        }
                      }}
                    >
                      {isEditing ? (
                        <div className="edit-form" onClick={(e) => e.stopPropagation()}>
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            placeholder="Enter your goal..."
                            className="goal-input"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) {
                                handleSaveGoal(rowIndex, colIndex);
                              } else if (e.key === 'Escape') {
                                handleCancelEdit();
                              }
                            }}
                          />
                          <div className="edit-buttons">
                            <button
                              onClick={() => handleSaveGoal(rowIndex, colIndex)}
                              className="btn-save"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="btn-cancel"
                            >
                              Cancel
                            </button>
                          </div>
                          <small>Ctrl+Enter to save, Esc to cancel</small>
                        </div>
                      ) : (
                        <div className="goal-content">
                          {isFreeSpace ? (
                            <span className="free-text">FREE</span>
                          ) : goal ? (
                            <span className="goal-text">{goal}</span>
                          ) : (
                            <span className="empty-goal">Click to add goal</span>
                          )}
                          {isMarked && <span className="checkmark">✓</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default GameRoom;

