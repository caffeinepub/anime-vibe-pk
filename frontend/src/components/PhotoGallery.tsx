import { useState } from 'react';
import PhotoLightbox from './PhotoLightbox';
import { ZoomIn } from 'lucide-react';

interface PhotoGalleryProps {
  photos: string[];
  productName: string;
}

const PLACEHOLDER = '/assets/generated/placeholder-poster.dim_300x300.png';

export default function PhotoGallery({ photos, productName }: PhotoGalleryProps) {
  const validPhotos = photos.filter((p) => p && p.trim() !== '');
  const displayPhotos = validPhotos.length > 0 ? validPhotos : [PLACEHOLDER];

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Primary image — square 1:1 ratio */}
      <div
        className="relative w-full overflow-hidden rounded-xl cursor-zoom-in group"
        style={{ aspectRatio: '1/1' }}
        onClick={() => openLightbox(activeIndex)}
      >
        <img
          src={displayPhotos[activeIndex]}
          alt={productName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-200">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg" />
        </div>
        {displayPhotos.length > 1 && (
          <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white font-medium">
            {activeIndex + 1} / {displayPhotos.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip — 1:1 square */}
      {displayPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayPhotos.map((photo, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative shrink-0 h-16 w-16 overflow-hidden rounded-lg border-2 transition-all ${
                activeIndex === idx
                  ? 'border-neon-blue shadow-neon-sm'
                  : 'border-border/40 hover:border-neon-blue/50 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={photo}
                alt={`${productName} photo ${idx + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PLACEHOLDER;
                }}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <PhotoLightbox
          photos={displayPhotos}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
