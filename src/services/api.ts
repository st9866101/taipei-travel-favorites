import type { ApiResponse } from '../types';

export const getAttractions = async (page: number = 1): Promise<ApiResponse> => {
    const response = await fetch(`https://www.travel.taipei/open-api/zh-tw/Attractions/All?page=${page}`);

    if (!response.ok) {
        throw new Error(`Error fetching attractions: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};
