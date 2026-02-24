import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import AboutSection from './components/AboutSection';
import AdminPage from './pages/AdminPage';
import ProductsPage from './pages/ProductsPage';
import Footer from './components/Footer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1">
          <HeroBanner />
          <AboutSection />
          <AdminPage />
          <ProductsPage />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
