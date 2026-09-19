import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAppSelector } from '../store';

export interface Product {
  id: string;
  name: string;
  price: number;
  category?: string;
  imageUrl?: string;
}

const API_RESOURCE_URL = 'http://localhost:5001/api/Products';

export const useProducts = () => {
  const filters = useAppSelector((state) => state.filters);

  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const response = await axios.get<Product[]>(API_RESOURCE_URL, {
        params: {
          category: filters.categoryId || undefined,
          search: filters.searchTerm || undefined,
        },
      });
      return response.data;
    },
    staleTime: 60 * 1000, // Cache dữ liệu trong 1 phút
  });
};