import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import GenderThemeAnimation from '../components/GenderThemeAnimation';
import { useGetAllProducts, useGetProductsByCategory } from '../hooks/useQueries';
import { ProductCategory, Gender } from '../backend';
import type { Product } from '../backend';
import { Skeleton } from '@/components/ui/skeleton';

const categoryLabels: Record<ProductCategory | 'all', string> = {
  all: 'All',
  [ProductCategory.pouch]: 'Pouches',
  [ProductCategory.keychain]: 'Keychains',
  [ProductCategory.sticker]: 'Stickers',
  [ProductCategory.poster]: 'Posters',
  [ProductCategory.others]: 'Others',
};

type GenderFilter = 'all' | 'male' | 'female';

const genderLabels: Record<GenderFilter, string> = {
  all: 'All',
  male: 'Male',
  female: 'Female',
};

const genderIcons: Record<GenderFilter, string> = {
  all: '✦',
  male: '♂',
  female: '♀',
};

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  const [selectedGender, setSelectedGender] = useState<GenderFilter>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [femaleAnimKey, setFemaleAnimKey] = useState(0);
  const [showFemaleAnim, setShowFemaleAnim] = useState(false);

  // Fetch all products for counts and "All" view
  const { data: allProducts = [], isLoading: isLoadingAll } = useGetAllProducts();

  // Fetch filtered products when a specific category is selected
  const { data: filteredProducts = [], isLoading: isLoadingFiltered } = useGetProductsByCategory(
    selectedCategory as ProductCategory
  );

  // Determine base product list by category
  const categoryProducts = selectedCategory === 'all' ? allProducts : filteredProducts;
  const isLoading = selectedCategory === 'all' ? isLoadingAll : isLoadingFiltered;

  // Apply gender filter on top of category filter
  const displayProducts = categoryProducts.filter((product) => {
    if (selectedGender === 'all') return true;
    if (selectedGender === 'male') {
      return product.gender === Gender.male || product.gender === Gender.unisex;
    }
    if (selectedGender === 'female') {
      return product.gender === Gender.female || product.gender === Gender.unisex;
    }
    return true;
  });

  // Calculate category counts (based on gender filter)
  const genderFilteredAll = allProducts.filter((product) => {
    if (selectedGender === 'all') return true;
    if (selectedGender === 'male') return product.gender === Gender.male || product.gender === Gender.unisex;
    if (selectedGender === 'female') return product.gender === Gender.female || product.gender === Gender.unisex;
    return true;
  });

  const categoryCounts = {
    all: genderFilteredAll.length,
    [ProductCategory.pouch]: genderFilteredAll.filter((p) => p.category === ProductCategory.pouch).length,
    [ProductCategory.keychain]: genderFilteredAll.filter((p) => p.category === ProductCategory.keychain).length,
    [ProductCategory.sticker]: genderFilteredAll.filter((p) => p.category === ProductCategory.sticker).length,
    [ProductCategory.poster]: genderFilteredAll.filter((p) => p.category === ProductCategory.poster).length,
    [ProductCategory.others]: genderFilteredAll.filter((p) => p.category === ProductCategory.others).length,
  };

  const categories: (ProductCategory | 'all')[] = [
    'all',
    ProductCategory.pouch,
    ProductCategory.keychain,
    ProductCategory.sticker,
    ProductCategory.poster,
    ProductCategory.others,
  ];

  const genderFilters: GenderFilter[] = ['all', 'male', 'female'];

  // Trigger female animation when switching to female tab
  const handleGenderChange = (g: GenderFilter) => {
    setSelectedGender(g);
    if (g === 'female') {
      setFemaleAnimKey((k) => k + 1);
      setShowFemaleAnim(true);
    } else {
      setShowFemaleAnim(false);
    }
  };

  // Auto-hide animation after it plays
  useEffect(() => {
    if (showFemaleAnim) {
      const t = setTimeout(() => setShowFemaleAnim(false), 5000);
      return () => clearTimeout(t);
    }
  }, [femaleAnimKey, showFemaleAnim]);

  // Theme classes based on gender
  const isFemale = selectedGender === 'female';
  const isMale = selectedGender === 'male';

  const sectionBg = isFemale
    ? 'bg-gradient-to-b from-[#1a0a1a] via-[#1a0d1f] to-[#0d0a1a]'
    : 'bg-background';

  const titleAccent = isFemale ? 'text-pink-400' : 'text-neon-blue';

  const genderBtnActive = (g: GenderFilter) => {
    if (g === 'female') return 'bg-pink-500 text-white shadow-[0_0_12px_rgba(236,72,153,0.5)]';
    if (g === 'male') return 'bg-neon-blue text-background shadow-neon-sm';
    return 'bg-neon-blue text-background shadow-neon-sm';
  };

  const genderBtnInactive = (g: GenderFilter) => {
    if (isFemale) return 'bg-card text-foreground border border-pink-500/20 hover:border-pink-400/50 hover:text-pink-300';
    return 'bg-card text-foreground border border-border/40 hover:border-neon-blue/50 hover:text-neon-blue';
  };

  const catBtnActive = isFemale
    ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]'
    : 'bg-neon-blue text-background shadow-neon-sm';

  const catBtnInactive = isFemale
    ? 'bg-card text-foreground border border-pink-500/20 hover:border-pink-400/50 hover:text-pink-300'
    : 'bg-card text-foreground border border-border/40 hover:border-neon-blue/50 hover:text-neon-blue';

  return (
    <section className={`py-12 md:py-16 lg:py-20 transition-colors duration-700 ${sectionBg}`}>
      {/* Female entrance animation */}
      <GenderThemeAnimation active={showFemaleAnim} key={femaleAnimKey} />

      {/* Female theme decorative background elements */}
      {isFemale && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-10 left-1/4 h-64 w-64 rounded-full bg-pink-500/5 blur-3xl" />
          <div className="absolute bottom-20 right-1/4 h-48 w-48 rounded-full bg-purple-500/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-pink-400/3 blur-3xl" />
        </div>
      )}

      <div className="container px-4 relative">
        <div className="mb-10 text-center">
          {isFemale ? (
            <>
              <div className="mb-2 text-3xl animate-bounce-gentle">🌸✨💕</div>
              <h2 className="mb-3 text-3xl font-black md:text-4xl lg:text-5xl font-waifu">
                <span className="text-pink-300">Kawaii</span>{' '}
                <span className="text-pink-400 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)]">Collection</span>
                <span className="text-pink-300"> ✨</span>
              </h2>
              <p className="text-pink-300/70 md:text-lg font-waifu">
                Cute anime merch just for you~ 💖
              </p>
            </>
          ) : (
            <>
              <h2 className="mb-3 text-3xl font-black text-foreground md:text-4xl lg:text-5xl">
                Our <span className={titleAccent}>Collection</span>
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Browse our exclusive anime merchandise collection
              </p>
            </>
          )}
        </div>

        {/* Gender Filter */}
        <div className="mb-5 flex justify-center gap-3">
          {genderFilters.map((g) => (
            <button
              key={g}
              onClick={() => handleGenderChange(g)}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-bold transition-all duration-300 ${
                selectedGender === g
                  ? genderBtnActive(g)
                  : genderBtnInactive(g)
              }`}
            >
              <span className="text-base leading-none">{genderIcons[g]}</span>
              {genderLabels[g]}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat ? catBtnActive : catBtnInactive
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
            <div className="mb-4 text-6xl">{isFemale ? '🌸' : '📦'}</div>
            <h3 className={`mb-2 text-2xl font-bold ${isFemale ? 'text-pink-300 font-waifu' : 'text-foreground'}`}>
              {isFemale ? 'No kawaii items yet~' : 'No products available yet'}
            </h3>
            <p className={isFemale ? 'text-pink-300/60' : 'text-muted-foreground'}>
              {selectedCategory === 'all' && selectedGender === 'all'
                ? 'Check back soon for new arrivals!'
                : `No ${selectedGender !== 'all' ? genderLabels[selectedGender] + ' ' : ''}${selectedCategory !== 'all' ? categoryLabels[selectedCategory].toLowerCase() : 'products'} available at the moment.`}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && displayProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onCardClick={setSelectedProduct}
                theme={selectedGender === 'female' ? 'female' : selectedGender === 'male' ? 'male' : 'default'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          theme={selectedGender === 'female' ? 'female' : selectedGender === 'male' ? 'male' : 'default'}
        />
      )}
    </section>
  );
}
