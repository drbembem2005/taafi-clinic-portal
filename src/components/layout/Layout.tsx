
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatBot from '../shared/ChatBot';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <ChatBot />
      <Footer />
    </div>
  );
};

export default Layout;
