import { SiInstagram } from 'react-icons/si';
import { Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="container px-4 py-12 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h3 className="mb-6 text-2xl font-bold text-foreground md:text-3xl">
              Get in <span className="text-neon-blue">Touch</span>
            </h3>
            
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://instagram.com/anime_vibe_pk"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/50 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-neon-blue/50 hover:bg-neon-blue/10 hover:text-neon-blue hover:shadow-neon-sm"
              >
                <SiInstagram className="h-5 w-5" />
                <span>@anime_vibe_pk</span>
              </a>
              
              <a
                href="mailto:anime_vibe_pk@gmail.com"
                className="flex items-center gap-2 rounded-lg border border-border/40 bg-background/50 px-6 py-3 text-sm font-medium text-foreground transition-all hover:border-neon-blue/50 hover:bg-neon-blue/10 hover:text-neon-blue hover:shadow-neon-sm"
              >
                <Mail className="h-5 w-5" />
                <span className="hidden sm:inline">anime_vibe_pk@gmail.com</span>
                <span className="sm:hidden">Email Us</span>
              </a>
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © {currentYear} Anime_Vibe_PK. All rights reserved.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Built with <span className="text-neon-blue">❤</span> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-neon-blue transition-colors hover:text-neon-blue-bright"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
