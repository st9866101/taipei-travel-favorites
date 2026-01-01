import { useState, useMemo } from 'react';
import { useAttractions } from '../hooks/useAttractions';
import type { Attraction } from '../types';
import AttractionCard from '../components/AttractionCard';
import Pagination from '../components/Pagination';
import CategoryFilter from '../components/CategoryFilter';

import EditAttractionModal from '../components/EditAttractionModal';

interface Props {
    favorites: number[];
    onToggleFavorite: (id: number) => void;
    editedAttractions: Record<number, Attraction>;
    onSaveAttraction: (updated: Attraction) => void;
    onRemoveFavorites: (ids: number[]) => void;
}

const PAGE_SIZE = 10;

const FavoritesPage: React.FC<Props> = ({ favorites, onToggleFavorite, editedAttractions, onSaveAttraction, onRemoveFavorites }) => {
    const { attractions, loading, error, categories } = useAttractions(editedAttractions);
    const [page, setPage] = useState(1);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [editingAttraction, setEditingAttraction] = useState<Attraction | null>(null);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleEditClick = (attraction: Attraction) => {
        setEditingAttraction(attraction);
    };

    const handleSave = (updated: Attraction) => {
        onSaveAttraction(updated);
    };

    const handleSelect = (id: number, selected: boolean) => {
        setSelectedIds(prev => {
            if (selected) {
                return [...prev, id];
            } else {
                return prev.filter(sid => sid !== id);
            }
        });
    };

    const handleBulkRemove = () => {
        if (selectedIds.length > 0) {
            onRemoveFavorites(selectedIds);
            setSelectedIds([]);
        }
    };

    const filteredData = useMemo(() => {
        // First filter by favorites
        let data = attractions.filter(item => favorites.includes(item.id));

        // Then filter by category
        if (selectedCategoryId !== null) {
            data = data.filter(item =>
                item.category && item.category.some(c => c.id === selectedCategoryId)
            );
        }
        return data;
    }, [attractions, favorites, selectedCategoryId]);

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
        <div className="favorites-page">
            <CategoryFilter
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={handleCategoryChange}
            />

            {filteredData.length === 0 ? (
                <div className="loading">
                    {favorites.length === 0 ? '尚未加入任何最愛景點' : '沒有符合條件的最愛景點'}
                </div>
            ) : (
                <>
                    <div className="bulk-actions" style={{ marginBottom: '16px', textAlign: 'right' }}>
                        <button
                            className="btn-remove-selected"
                            disabled={selectedIds.length === 0}
                            onClick={handleBulkRemove}
                        >
                            移除選取項目 ({selectedIds.length}) (Remove Selected)
                        </button>
                    </div>

                    <div className="attraction-list">
                        {currentData.map(item => (
                            <AttractionCard
                                key={item.id}
                                data={item}
                                isFavorite={favorites.includes(item.id)}
                                onToggleFavorite={onToggleFavorite}
                                onEdit={() => handleEditClick(item)}
                                selectable={true}
                                isSelected={selectedIds.includes(item.id)}
                                onSelect={handleSelect}
                            />
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />

                    {editingAttraction && (
                        <EditAttractionModal
                            attraction={editingAttraction}
                            isOpen={!!editingAttraction}
                            onClose={() => setEditingAttraction(null)}
                            onSave={handleSave}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default FavoritesPage;
