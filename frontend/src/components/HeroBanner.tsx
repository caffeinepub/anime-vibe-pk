export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: 'url(/assets/generated/hero-banner.dim_1200x400.png)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background" />
      
      <div className="container relative px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-foreground md:text-5xl lg:text-6xl xl:text-7xl">
            <span className="inline-block animate-pulse-glow text-neon-blue">Anime Merch</span>
            <br />
            <span className="text-foreground">Pakistan</span>
          </h1>
          <div className="mt-6 inline-flex items-center gap-3 rounded-full border-2 border-neon-blue bg-neon-blue/10 px-6 py-3 text-lg font-bold text-neon-blue shadow-neon md:text-xl lg:px-8 lg:py-4 lg:text-2xl">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-blue opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-neon-blue"></span>
            </span>
            Pre-Orders Open
          </div>
        </div>
      </div>
    </section>
  );
}
