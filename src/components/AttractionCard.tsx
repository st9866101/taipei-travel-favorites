import React from 'react';
import type { Attraction } from '../types';

interface Props {
    data: Attraction;
    isFavorite: boolean;
    onToggleFavorite: (id: number) => void;
    onEdit?: () => void;
    selectable?: boolean;
    isSelected?: boolean;
    onSelect?: (id: number, selected: boolean) => void;
}

const AttractionCard: React.FC<Props> = ({
    data,
    isFavorite,
    onToggleFavorite,
    onEdit,
    selectable,
    isSelected,
    onSelect
}) => {
    const imageUrl = data.images && data.images.length > 0
        ? data.images[0].src
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="attraction-card">
            <div className="card-image-container">
                <img src={imageUrl} alt={data.name} className="card-image" loading="lazy" />
            </div>
            <div className="card-content">
                <div className="card-header d-flex justify-content-between">
                    <div className="d-flex align-items-center">
                        {selectable && (
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => onSelect && onSelect(data.id, e.target.checked)}
                                className="card-checkbox"
                            />
                        )}
                        <h2>{data.name}</h2>
                    </div>
                    <div>
                        {onEdit && (
                            <button
                                className="edit-btn"
                                onClick={onEdit}
                                title="編輯 (Edit)"
                            >
                                ✏️
                            </button>
                        )}
                        <button
                            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                            onClick={() => onToggleFavorite(data.id)}
                            title={isFavorite ? "移除最愛" : "加入最愛"}
                        >
                            {isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
                <div className="meta">
                    {data.district && <span>📍 {data.district}</span>}
                </div>
                <p>{data.introduction}</p>
            </div>
        </div>
    );
};

export default AttractionCard;
