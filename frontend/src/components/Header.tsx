import { SiInstagram } from 'react-icons/si';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <a href="/" className="flex items-center transition-transform hover:scale-105">
          <img 
            src="/assets/generated/logo.dim_200x80.png" 
            alt="Anime_Vibe_PK Logo" 
            className="h-10 w-auto md:h-12"
          />
        </a>
        
        <a
          href="https://instagram.com/anime_vibe_pk"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg bg-neon-blue/10 px-4 py-2 text-sm font-medium text-neon-blue transition-all hover:bg-neon-blue/20 hover:shadow-neon active:scale-95 md:px-6 md:py-2.5 md:text-base"
        >
          <SiInstagram className="h-5 w-5" />
          <span className="hidden sm:inline">Instagram</span>
        </a>
      </div>
    </header>
  );
}
