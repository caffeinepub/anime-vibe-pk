import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Review, ProductCategory } from '../backend';
import { Gender } from '../backend';

// Create a new product
export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      description: string;
      category: ProductCategory;
      price: bigint;
      photos: string[];
      imageUrl: string;
      sizes: string[];
      colors: string[];
      gender: Gender;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createProduct(
        data.id,
        data.name,
        data.description,
        data.category,
        data.price,
        data.photos,
        data.imageUrl,
        data.sizes,
        data.colors,
        data.gender
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

// Get reviews by product
export function useReviewsByProduct(productId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviews', productId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getReviewsByProduct(productId);
    },
    enabled: !!actor && !isFetching,
  });
}

// Add a review
export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      productId: bigint;
      reviewerName: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addReview(data.productId, data.reviewerName, data.rating, data.comment);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.productId.toString()] });
    },
  });
}

// Delete a single product by ID
export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-by-category'] });
    },
  });
}

// Delete all products
export function useDeleteAllProducts() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.deleteAllProducts();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products-by-category'] });
    },
  });
}
