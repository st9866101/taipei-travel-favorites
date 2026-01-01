import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import type { Attraction } from './types'; // Add import
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import './styles/main.scss';

function App() {
  const STORAGE_KEY = 'taipei_travel_favorites';

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const EDITS_STORAGE_KEY = 'taipei_travel_edits';
  const [editedAttractions, setEditedAttractions] = useState<Record<number, Attraction>>(() => {
    try {
      const saved = localStorage.getItem(EDITS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(EDITS_STORAGE_KEY, JSON.stringify(editedAttractions));
  }, [editedAttractions]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSaveAttraction = (updated: Attraction) => {
    setEditedAttractions(prev => ({
      ...prev,
      [updated.id]: updated
    }));
  };

  return (
    <BrowserRouter>
      <div className="container">
        <header className="header">
          <h1>台北旅遊景點 (Taipei Travel)</h1>
          <nav className="nav-links">
            <NavLink
              to="/"
              end
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              首頁 (Home)
            </NavLink>
            <NavLink
              to="/favorites"
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              我的最愛 ({favorites.length})
            </NavLink>
          </nav>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                editedAttractions={editedAttractions}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <FavoritesPage
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                editedAttractions={editedAttractions}
                onSaveAttraction={handleSaveAttraction}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
