import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useGetAllProducts, useGetProductsByCategory } from '../hooks/useQueries';
import { ProductCategory } from '../backend';
import { Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels: Record<ProductCategory | 'all', string> = {
  all: 'All',
  [ProductCategory.pouch]: 'Pouches',
  [ProductCategory.keychain]: 'Keychains',
  [ProductCategory.sticker]: 'Stickers',
  [ProductCategory.poster]: 'Posters',
  [ProductCategory.others]: 'Others',
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

  // Fetch all products for counts and "All" view
  const { data: allProducts = [], isLoading: isLoadingAll } = useGetAllProducts();

  // Fetch filtered products when a specific category is selected
  const { data: filteredProducts = [], isLoading: isLoadingFiltered } = useGetProductsByCategory(
    selectedCategory as ProductCategory
  );

  // Determine which products to display
  const displayProducts = selectedCategory === 'all' ? allProducts : filteredProducts;
  const isLoading = selectedCategory === 'all' ? isLoadingAll : isLoadingFiltered;

  // Calculate category counts
  const categoryCounts = {
    all: allProducts.length,
    [ProductCategory.pouch]: allProducts.filter((p) => p.category === ProductCategory.pouch).length,
    [ProductCategory.keychain]: allProducts.filter((p) => p.category === ProductCategory.keychain).length,
    [ProductCategory.sticker]: allProducts.filter((p) => p.category === ProductCategory.sticker).length,
    [ProductCategory.poster]: allProducts.filter((p) => p.category === ProductCategory.poster).length,
    [ProductCategory.others]: allProducts.filter((p) => p.category === ProductCategory.others).length,
  };

  const categories: (ProductCategory | 'all')[] = [
    'all',
    ProductCategory.pouch,
    ProductCategory.keychain,
    ProductCategory.sticker,
    ProductCategory.poster,
    ProductCategory.others,
  ];

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-black text-foreground md:text-4xl lg:text-5xl">
            Our <span className="text-neon-blue">Collection</span>
          </h2>
          <p className="text-muted-foreground md:text-lg">
            Browse our exclusive anime merchandise collection
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-neon-blue text-background shadow-neon-sm'
                  : 'bg-card text-foreground border border-border/40 hover:border-neon-blue/50 hover:text-neon-blue'
              }`}
            >
              {categoryLabels[cat]}
              <span className="ml-2 text-xs opacity-75">
                ({categoryCounts[cat]})
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-border/40 bg-card">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 text-6xl">📦</div>
            <h3 className="mb-2 text-2xl font-bold text-foreground">No products available yet</h3>
            <p className="text-muted-foreground">
              {selectedCategory === 'all'
                ? 'Check back soon for new arrivals!'
                : `No ${categoryLabels[selectedCategory].toLowerCase()} available at the moment.`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
