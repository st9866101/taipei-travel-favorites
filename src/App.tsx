import { useEffect, useState } from 'react';
// import { getAttractions } from './services/api';
import type { Attraction } from './types';
import AttractionCard from './components/AttractionCard';
import Pagination from './components/Pagination';
import './styles/main.scss';
import attractionsData from './data/AttractionsAll.json';

function App() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Taipei Open API usually returns 30 items per page by default, but we use 10 for local testing
  const PAGE_SIZE = 10;

  useEffect(() => {
    // 暫時使用本地 JSON 資料進行開發測試
    setLoading(true);
    try {
      // 模擬從 JSON 讀取
      if (attractionsData && Array.isArray(attractionsData.data)) {
        // cast to any then to Attraction[] to bypass strict typs if JSON structure slightly differs
        const allData = attractionsData.data as any as Attraction[];

        // Client-side pagination logic
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        const currentData = allData.slice(startIndex, endIndex);

        setAttractions(currentData);
        setTotal(allData.length);
      } else {
        setError('Local data format error');
      }
    } catch (err: any) {
      setError('Failed to load local data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]); // Add page dependency for client-side pagination

  const totalPages = Math.ceil(total / PAGE_SIZE) || 1;

  return (
    <div className="container">
      <header className="header">
        <h1>台北旅遊景點 (Taipei Travel)</h1>
      </header>

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
