import { useEffect, useState } from 'react';
import type { Attraction } from './types';
import AttractionCard from './components/AttractionCard';
import Pagination from './components/Pagination';
import './styles/main.scss';
import attractionsData from './data/AttractionsAll.json';

import CategoryFilter from './components/CategoryFilter';

function App() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);


  const STORAGE_KEY = 'taipei_travel_favorites';

  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(fid => fid !== id);
      } else {
        return [...prev, id];
      }
    })
  };

  const PAGE_SIZE = 10;

  const [isFavoritesView, setIsFavoritesView] = useState(false);

  useEffect(() => {
    // 暫時使用本地 JSON 資料進行開發測試
    setLoading(true);
    try {
      if (attractionsData && Array.isArray(attractionsData.data)) {
        const allData = attractionsData.data as any as Attraction[];

        const uniqueCategories = new Map<number, string>();
        allData.forEach(item => {
          if (item.category && Array.isArray(item.category)) {
            item.category.forEach(cat => {
              if (!uniqueCategories.has(cat.id)) {
                uniqueCategories.set(cat.id, cat.name);
              }
            });
          }
        });
        const categoryList = Array.from(uniqueCategories.entries()).map(([id, name]) => ({ id, name }));
        setCategories(categoryList.sort((a, b) => a.id - b.id));

        let filteredData = allData;

        if (isFavoritesView) {
          filteredData = filteredData.filter(item => favorites.includes(item.id));
        }


        if (selectedCategoryId !== null) {
          filteredData = filteredData.filter(item =>
            item.category && item.category.some(c => c.id === selectedCategoryId)
          );
        }

        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const currentData = filteredData.slice(startIndex, endIndex);

        setAttractions(currentData);
        setTotal(filteredData.length);
      } else {
        setError('Local data format error');
      }
    } catch (err: any) {
      setError('Failed to load local data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategoryId, isFavoritesView, favorites]);

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(1);
  };

  const handleViewChange = (viewFavorites: boolean) => {
    setIsFavoritesView(viewFavorites);
    setPage(1);
    setSelectedCategoryId(null);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="container">
      <header className="header">
        <h1>台北旅遊景點 (Taipei Travel)</h1>
        <div className="nav-links">
          <button
            className={!isFavoritesView ? 'active' : ''}
            onClick={() => handleViewChange(false)}
          >
            首頁 (Home)
          </button>
          <button
            className={isFavoritesView ? 'active' : ''}
            onClick={() => handleViewChange(true)}
          >
            我的最愛 ({favorites.length})
          </button>
        </div>
      </header>

      <CategoryFilter
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={handleCategoryChange}
      />

      {loading && <div className="loading">資料載入中... (Loading...)</div>}

      {error && <div className="error">
        <p>{error}</p>
      </div>}

      {!loading && !error && (
        <>
          {attractions.length === 0 ? (
            <div className="loading">
              {isFavoritesView ? '尚未加入任何最愛景點' : '沒有符合條件的景點'}
            </div>
          ) : (
            <>
              <div className="attraction-list">
                {attractions.map(item => (
                  <AttractionCard
                    key={item.id}
                    data={item}
                    isFavorite={favorites.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
