import { useState } from 'react';
import type { Product } from '../backend';
import { ProductCategory } from '../backend';

interface ProductCardProps {
  product: Product;
  onCardClick?: (product: Product) => void;
  theme?: 'default' | 'male' | 'female';
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.pouch]: 'Pouch',
  [ProductCategory.keychain]: 'Keychain',
  [ProductCategory.sticker]: 'Sticker',
  [ProductCategory.poster]: 'Poster',
  [ProductCategory.others]: 'Others',
};

const PLACEHOLDER = '/assets/generated/placeholder-poster.dim_300x300.png';

export default function ProductCard({ product, onCardClick, theme = 'default' }: ProductCardProps) {
  // Use first photo URL, fallback to imageUrl, then placeholder
  const validPhotos = product.photos?.filter((p) => p && p.trim() !== '') ?? [];
  const imageUrl = validPhotos[0] || product.imageUrl || PLACEHOLDER;

  const formattedPrice = `Rs ${Number(product.price).toLocaleString()}`;

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const hasSizes = product.sizes && product.sizes.length > 0;
  const hasColors = product.colors && product.colors.length > 0;

  const isFemale = theme === 'female';

  const cardHover = isFemale
    ? 'hover:border-pink-400/60 hover:shadow-[0_0_20px_rgba(236,72,153,0.35),0_0_40px_rgba(236,72,153,0.15)]'
    : 'hover:border-neon-blue/50 hover:shadow-neon-lg';

  const accentText = isFemale ? 'text-pink-400' : 'text-neon-blue';
  const accentBg = isFemale ? 'bg-pink-500/10 text-pink-300' : 'bg-neon-blue/10 text-neon-blue';
  const pillActive = isFemale
    ? 'bg-pink-500 text-white border-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]'
    : 'bg-neon-blue text-background border-neon-blue shadow-neon-sm';
  const pillHover = isFemale
    ? 'hover:border-pink-400/60 hover:text-pink-300'
    : 'hover:border-neon-blue/60 hover:text-neon-blue';
  const btnClass = isFemale
    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-[0_0_12px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]'
    : 'bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon';

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border/40 bg-card transition-all flex flex-col cursor-pointer ${cardHover}`}
      onClick={() => onCardClick?.(product)}
    >
      {/* Square 1:1 ratio */}
      <div className="overflow-hidden bg-background/50" style={{ aspectRatio: '1/1' }}>
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${accentBg}`}>
            {categoryLabels[product.category]}
          </span>
          {product.gender && product.gender !== 'unisex' && (
            <span className="inline-block rounded-full bg-card border border-border/40 px-3 py-1 text-xs font-semibold text-muted-foreground capitalize">
              {product.gender}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-2">
          {product.name}
        </h3>

        <div className={`mb-3 text-sm font-semibold ${accentText}`}>
          {formattedPrice}
        </div>

        {/* Sizes */}
        {hasSizes && (
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Size
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                  className={`rounded-md px-2.5 py-1 text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? pillActive
                      : `bg-background/50 text-foreground border-border/40 ${pillHover}`
                  }`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {hasColors && (
          <div className="mb-3" onClick={(e) => e.stopPropagation()}>
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Color
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold border transition-all ${
                    selectedColor === color
                      ? pillActive
                      : `bg-background/50 text-foreground border-border/40 ${pillHover}`
                  }`}
                  style={{ minHeight: 'unset', minWidth: 'unset' }}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-1" onClick={(e) => e.stopPropagation()}>
          <a
            href="https://ig.me/m/anime_vibe_pk"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all active:scale-95 ${btnClass}`}
          >
            <span>Pre-Order Now → DM on Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
