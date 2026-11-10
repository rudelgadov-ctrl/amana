import { ReactNode, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from 'react-router-dom';
import { useSiteImages } from '@/hooks/useSiteImages';
import { warmPageImages } from '@/lib/siteImageCache';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isLoading } = useLanguage();
  const { pathname } = useLocation();
  const { data: images } = useSiteImages();
  useEffect(() => {
    if (images) warmPageImages(images, pathname);
  }, [images, pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col animate-fade-in">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
