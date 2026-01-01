import React from 'react';
import type { Attraction } from '../types';

interface Props {
    data: Attraction;
}

const AttractionCard: React.FC<Props> = ({ data }) => {
    // Use the first image if available, otherwise a placeholder
    const imageUrl = data.images && data.images.length > 0
        ? data.images[0].src
        : 'https://via.placeholder.com/400x300?text=No+Image';

    return (
        <div className="attraction-card">
            <div className="card-image-container">
                <img src={imageUrl} alt={data.name} className="card-image" loading="lazy" />
            </div>
            <div className="card-content">
                <h2>{data.name}</h2>
                <div className="meta">
                    {data.district && <span>📍 {data.district}</span>}
                </div>
                <p>{data.introduction}</p>
            </div>
        </div>
    );
};

export default AttractionCard;
