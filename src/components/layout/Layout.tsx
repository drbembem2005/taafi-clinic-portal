
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../shared/ChatBot';
import MobileNavigation from './MobileNavigation';
import FloatingActionButtons from '../shared/FloatingActionButtons';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pb-16 lg:pb-0">{children}</main>
      <ChatBot />
      <FloatingActionButtons />
      <MobileNavigation />
      <Footer />
    </div>
  );
};

export default Layout;
