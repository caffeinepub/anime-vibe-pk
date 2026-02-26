import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

interface PhotoLightboxProps {
  photos: string[];
  initialIndex: number;
  onClose: () => void;
}

const PLACEHOLDER = '/assets/generated/placeholder-poster.dim_300x300.png';
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function PhotoLightbox({ photos, initialIndex, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Touch pinch state
  const lastPinchDistance = useRef<number | null>(null);

  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    resetZoom();
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    resetZoom();
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM));
      if (e.key === '-') setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM));
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  // Scroll wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => Math.min(Math.max(z + delta, MIN_ZOOM), MAX_ZOOM));
    if (zoom + delta <= MIN_ZOOM) setPan({ x: 0, y: 0 });
  };

  // Mouse drag for panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  // Touch events for pinch zoom
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDistance.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1 && zoom > 1) {
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        panX: pan.x,
        panY: pan.y,
      };
      setIsDragging(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && lastPinchDistance.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scale = distance / lastPinchDistance.current;
      setZoom((z) => Math.min(Math.max(z * scale, MIN_ZOOM), MAX_ZOOM));
      lastPinchDistance.current = distance;
    } else if (e.touches.length === 1 && isDragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPan({ x: dragStart.current.panX + dx, y: dragStart.current.panY + dy });
    }
  };

  const handleTouchEnd = () => {
    lastPinchDistance.current = null;
    setIsDragging(false);
    dragStart.current = null;
  };

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Zoom controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5">
        <button
          type="button"
          onClick={() => { setZoom((z) => Math.max(z - ZOOM_STEP, MIN_ZOOM)); if (zoom - ZOOM_STEP <= MIN_ZOOM) setPan({ x: 0, y: 0 }); }}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-40"
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-white text-xs font-medium w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM))}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-white/20 transition-colors disabled:opacity-40"
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation arrows */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image container */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center w-full h-full overflow-hidden"
        style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={photos[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[85vh] max-w-[90vw] object-contain select-none transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: 'center center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
          draggable={false}
          onError={(e) => {
            (e.target as HTMLImageElement).src = PLACEHOLDER;
          }}
        />
      </div>

      {/* Photo counter */}
      {photos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => { setCurrentIndex(idx); resetZoom(); }}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Hint text */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 text-xs">
        {zoom > 1 ? 'Drag to pan • Scroll to zoom' : 'Scroll or pinch to zoom'}
      </div>
    </div>
  );
}
