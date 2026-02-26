import { useEffect } from 'react';
import type { Product } from '../backend';
import { ProductCategory, Gender } from '../backend';
import { X } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';
import PhotoGallery from './PhotoGallery';
import ReviewsSection from './ReviewsSection';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  theme?: 'default' | 'male' | 'female';
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.pouch]: 'Pouch',
  [ProductCategory.keychain]: 'Keychain',
  [ProductCategory.sticker]: 'Sticker',
  [ProductCategory.poster]: 'Poster',
  [ProductCategory.others]: 'Others',
};

const genderLabels: Record<string, string> = {
  [Gender.male]: '♂ Male',
  [Gender.female]: '♀ Female',
  [Gender.unisex]: '✦ Unisex',
};

export default function ProductDetailModal({ product, onClose, theme = 'default' }: ProductDetailModalProps) {
  const isFemale = theme === 'female';

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const photos = product.photos && product.photos.filter((p) => p && p.trim() !== '').length > 0
    ? product.photos.filter((p) => p && p.trim() !== '')
    : product.imageUrl
    ? [product.imageUrl]
    : [];

  const formattedPrice = `Rs ${Number(product.price).toLocaleString()}`;

  // Theme-specific styles
  const overlayClass = isFemale
    ? 'bg-black/80'
    : 'bg-black/85';

  const modalBg = isFemale
    ? 'bg-gradient-to-b from-[#1a0a1a] via-[#1a0d1f] to-[#0d0a1a] border-pink-500/30'
    : 'bg-card border-border/40';

  const accentText = isFemale ? 'text-pink-400' : 'text-neon-blue';
  const accentBg = isFemale ? 'bg-pink-500/10 text-pink-300' : 'bg-neon-blue/10 text-neon-blue';
  const accentBorder = isFemale ? 'border-pink-500/30' : 'border-neon-blue/30';
  const pillActive = isFemale
    ? 'bg-pink-500 text-white border-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.5)]'
    : 'bg-neon-blue text-background border-neon-blue shadow-neon-sm';
  const pillInactive = isFemale
    ? 'bg-pink-500/10 text-pink-200 border-pink-500/30'
    : 'bg-background/50 text-foreground border-border/40';
  const instaBtnClass = isFemale
    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white shadow-[0_0_16px_rgba(236,72,153,0.4)]'
    : 'bg-neon-blue text-background hover:bg-neon-blue-bright hover:shadow-neon';

  return (
    <div
      className={`fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 ${overlayClass}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`relative w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border ${modalBg} shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-foreground hover:bg-foreground/20 transition-colors"
          aria-label="Close"
          style={{ minHeight: 'unset', minWidth: 'unset' }}
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-5 sm:p-6">
          {/* Photo Gallery */}
          <div className="mb-5">
            <PhotoGallery photos={photos} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${accentBg}`}>
                {categoryLabels[product.category]}
              </span>
              <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground ${accentBorder}`}>
                {genderLabels[product.gender] || product.gender}
              </span>
            </div>

            {/* Name */}
            <h2 className={`text-2xl font-black leading-tight ${isFemale ? 'text-pink-100' : 'text-foreground'}`}>
              {product.name}
            </h2>

            {/* Price */}
            <p className={`text-xl font-bold ${accentText}`}>{formattedPrice}</p>

            {/* Description */}
            {product.description && product.description.trim() !== '' && (
              <div className={`rounded-xl border ${accentBorder} bg-foreground/5 p-4`}>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Available Sizes
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className={`rounded-md px-3 py-1 text-xs font-bold border ${pillInactive}`}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Available Colors
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border ${pillInactive}`}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Pre-Order Button */}
            <a
              href="https://ig.me/m/anime_vibe_pk"
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-bold transition-all active:scale-95 ${instaBtnClass}`}
            >
              <SiInstagram className="h-4 w-4" />
              Pre-Order Now → DM on Instagram
            </a>
          </div>

          {/* Reviews */}
          <ReviewsSection
            productId={BigInt(product.id.replace(/\D/g, '') || '0')}
            theme={isFemale ? 'female' : 'default'}
          />
        </div>
      </div>
    </div>
  );
}
