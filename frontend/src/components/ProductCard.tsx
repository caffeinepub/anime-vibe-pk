import type { Product } from '../backend';
import { ProductCategory } from '../backend';

interface ProductCardProps {
  product: Product;
}

const categoryLabels: Record<ProductCategory, string> = {
  [ProductCategory.pouch]: 'Pouch',
  [ProductCategory.keychain]: 'Keychain',
  [ProductCategory.sticker]: 'Sticker',
  [ProductCategory.poster]: 'Poster',
  [ProductCategory.others]: 'Others',
};

export default function ProductCard({ product }: ProductCardProps) {
  // Get image URL from ExternalBlob
  const imageUrl = product.image.getDirectURL();
  
  // Format price
  const formattedPrice = `Rs ${Number(product.price).toLocaleString()}`;

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-neon-blue/50 hover:shadow-neon-lg">
      <div className="aspect-square overflow-hidden bg-background/50">
        <img
          src={imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>
      
      <div className="p-4">
        <div className="mb-2 inline-block rounded-full bg-neon-blue/10 px-3 py-1 text-xs font-semibold text-neon-blue">
          {categoryLabels[product.category]}
        </div>
        
        <h3 className="mb-2 text-lg font-bold text-foreground line-clamp-2">
          {product.name}
        </h3>
        
        <div className="mb-4 text-sm font-semibold text-neon-blue">
          {formattedPrice}
        </div>
        
        <a
          href="https://ig.me/m/anime_vibe_pk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-neon-blue px-4 py-2.5 text-sm font-bold text-background transition-all hover:bg-neon-blue-bright hover:shadow-neon active:scale-95"
        >
          <span>Pre-Order Now → DM on Instagram</span>
        </a>
      </div>
    </div>
  );
}
