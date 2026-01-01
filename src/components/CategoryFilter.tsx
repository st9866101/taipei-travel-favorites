import React from 'react';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    selectedCategoryId: number | null;
    onCategoryChange: (categoryId: number | null) => void;
}

const CategoryFilter: React.FC<Props> = ({ categories, selectedCategoryId, onCategoryChange }) => {
    return (
        <div className="category-filter">
            <label htmlFor="category-select">篩選分類：</label>
            <select
                id="category-select"
                value={selectedCategoryId || ''}
                onChange={(e) => {
                    const value = e.target.value;
                    onCategoryChange(value ? Number(value) : null);
                }}
            >
                <option value="">全部景點 (All)</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CategoryFilter;
