import { useState, useMemo } from 'react';
import { useAttractions } from '../hooks/useAttractions';
import AttractionCard from '../components/AttractionCard';
import Pagination from '../components/Pagination';
import CategoryFilter from '../components/CategoryFilter';

interface Props {
    favorites: number[];
    onToggleFavorite: (id: number) => void;
}

const PAGE_SIZE = 10;

const HomePage: React.FC<Props> = ({ favorites, onToggleFavorite }) => {
    const { attractions, loading, error, categories } = useAttractions();
    const [page, setPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

    const filteredData = useMemo(() => {
        let data = attractions;
        if (selectedCategoryId !== null) {
            data = data.filter(item =>
                item.category && item.category.some(c => c.id === selectedCategoryId)
            );
        }
        return data;
    }, [attractions, selectedCategoryId]);

    const currentData = useMemo(() => {
        const startIndex = (page - 1) * PAGE_SIZE;
        const endIndex = startIndex + PAGE_SIZE;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, page]);

    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE) || 1;

    const handleCategoryChange = (id: number | null) => {
        setSelectedCategoryId(id);
        setPage(1);
    };

    if (loading) return <div className="loading">資料載入中... (Loading...)</div>;
    if (error) return <div className="error"><p>{error}</p></div>;

    return (
        <div className="home-page">
            <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
            />

            {currentData.length === 0 ? (
                <div className="loading">沒有符合條件的景點</div>
            ) : (
                <>
                    <div className="attraction-list">
                        {currentData.map(item => (
                            <AttractionCard
                                key={item.id}
                                data={item}
                                isFavorite={favorites.includes(item.id)}
                                onToggleFavorite={onToggleFavorite}
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
        </div>
    );
};

export default HomePage;
