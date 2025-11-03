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
      setCard(response.data.card);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate card');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkNumber = async (number) => {
    if (!card || card.marked_numbers?.includes(number)) return;

    try {
      const response = await api.post(`/cards/${card.id}/mark`, { number });
      setCard(response.data.card);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to mark number');
    }
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!game) {
    return <div className="container">Game not found</div>;
  }

  return (
    <div className="container">
      <div className="game-room-header">
        <h1>{game.room_name}</h1>
        <p>Status: {game.status}</p>
      </div>

      {!card ? (
        <div className="no-card">
          <p>You don't have a bingo card yet.</p>
          <button
            onClick={handleGenerateCard}
            className="btn btn-primary"
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate Bingo Card'}
          </button>
          {error && <div className="error-message">{error}</div>}
        </div>
      ) : (
        <div className="bingo-card-container">
          <h2>Your Bingo Card</h2>
          <div className="bingo-card">
            <div className="bingo-header">
              {['B', 'I', 'N', 'G', 'O'].map((letter) => (
                <div key={letter} className="bingo-letter">
                  {letter}
                </div>
              ))}
            </div>
            {card.numbers.map((row, rowIndex) => (
              <div key={rowIndex} className="bingo-row">
                {row.map((number, colIndex) => {
                  const isFreeSpace = rowIndex === 2 && colIndex === 2;
                  const isMarked = card.marked_numbers?.includes(number);
                  const isClickable = !isFreeSpace && game.status === 'active';

                  return (
                    <div
                      key={colIndex}
                      className={`bingo-cell ${
                        isFreeSpace ? 'free-space' : ''
                      } ${isMarked ? 'marked' : ''} ${
                        isClickable ? 'clickable' : ''
                      }`}
                      onClick={
                        isClickable && !isMarked
                          ? () => handleMarkNumber(number)
                          : undefined
                      }
                    >
                      {isFreeSpace ? 'FREE' : number}
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

