import { useState, useEffect } from 'react';
import type { Attraction } from '../types';
import attractionsData from '../data/AttractionsAll.json';

export const useAttractions = () => {
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
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
                setAttractions(allData);
            } else {
                setError('Local data format error');
            }
        } catch (err: any) {
            setError('Failed to load local data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { attractions, loading, error, categories };
};
