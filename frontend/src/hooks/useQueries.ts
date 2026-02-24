import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductCategory } from '../backend';
import { ExternalBlob } from '../backend';

// Create a new product
export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      category: ProductCategory;
      price: bigint;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createProduct(
        data.id,
        data.name,
        data.category,
        data.price,
        data.image
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-by-category'] });
    },
  });
}

// Get all products
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

// Get products by category
export function useGetProductsByCategory(category: ProductCategory) {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products-by-category', category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductsByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}
