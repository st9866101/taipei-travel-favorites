import { useEffect, useState } from 'react';
// import { getAttractions } from './services/api';
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

  // Filtering state
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Taipei Open API usually returns 30 items per page by default, but we use 10 for local testing
  const PAGE_SIZE = 10;

  useEffect(() => {
    // 暫時使用本地 JSON 資料進行開發測試
    setLoading(true);
    try {
      if (attractionsData && Array.isArray(attractionsData.data)) {
        const allData = attractionsData.data as any as Attraction[];

        const uniqueCategories = new Map();
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
        if (selectedCategoryId !== null) {
          filteredData = allData.filter(item =>
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
  }, [page, selectedCategoryId]);

  const handleCategoryChange = (id: number | null) => {
    setSelectedCategoryId(id);
    setPage(1); // Reset to first page when filter changes
  };

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="container">
      <header className="header">
        <h1>台北旅遊景點 (Taipei Travel)</h1>
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
          <div className="attraction-list">
            {attractions.map(item => (
              <AttractionCard key={item.id} data={item} />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}

export default App;
