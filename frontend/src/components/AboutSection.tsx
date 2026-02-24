import { Package, Truck, Shield } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="border-y border-border/40 bg-card/30 py-12 md:py-16">
      <div className="container px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Your favorite anime merch in Pakistan,{' '}
            <span className="text-neon-blue">COD available nationwide.</span>
          </h2>
          
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-6 transition-all hover:border-neon-blue/50 hover:shadow-neon-sm">
              <div className="rounded-full bg-neon-blue/10 p-3">
                <Package className="h-6 w-6 text-neon-blue" />
              </div>
              <h3 className="font-semibold text-foreground">Authentic Merch</h3>
              <p className="text-sm text-muted-foreground">Quality anime products</p>
            </div>
            
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-6 transition-all hover:border-neon-blue/50 hover:shadow-neon-sm">
              <div className="rounded-full bg-neon-blue/10 p-3">
                <Truck className="h-6 w-6 text-neon-blue" />
              </div>
              <h3 className="font-semibold text-foreground">Nationwide Delivery</h3>
              <p className="text-sm text-muted-foreground">We ship all over Pakistan</p>
            </div>
            
            <div className="flex flex-col items-center gap-3 rounded-lg border border-border/40 bg-background/50 p-6 transition-all hover:border-neon-blue/50 hover:shadow-neon-sm">
              <div className="rounded-full bg-neon-blue/10 p-3">
                <Shield className="h-6 w-6 text-neon-blue" />
              </div>
              <h3 className="font-semibold text-foreground">Cash on Delivery</h3>
              <p className="text-sm text-muted-foreground">Pay when you receive</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
