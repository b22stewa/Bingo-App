import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roomName, setRoomName] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await api.get('/games');
      setGames(response.data.games);
    } catch (error) {
      setError('Failed to load games');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGame = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      const response = await api.post('/games', {
        room_name: roomName || `Game ${Date.now()}`
      });
      navigate(`/game/${response.data.game.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create game');
    } finally {
      setCreating(false);
      setRoomName('');
    }
  };

  const handleJoinGame = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Game Dashboard</h1>
      
      <div className="create-game-section">
        <h2>Create New Game</h2>
        <form onSubmit={handleCreateGame} className="create-game-form">
          <input
            type="text"
            placeholder="Room name (optional)"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="form-control"
          />
          <button type="submit" className="btn btn-primary" disabled={creating}>
            {creating ? 'Creating...' : 'Create Game'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="games-section">
        <h2>Available Games</h2>
        {games.length === 0 ? (
          <p>No games available. Create one to get started!</p>
        ) : (
          <div className="games-list">
            {games.map((game) => (
              <div key={game.id} className="game-card">
                <h3>{game.room_name}</h3>
                <p>Status: {game.status}</p>
                <p>Created: {new Date(game.created_at).toLocaleString()}</p>
                <button
                  onClick={() => handleJoinGame(game.id)}
                  className="btn btn-primary"
                >
                  Join Game
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

