import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/src/components/theme-provider';
import { Toaster } from '@/src/components/ui/sonner';
import Header from '@/src/components/header';
import HomePage from '@/pages/Home';
import BrowsePage from '@/pages/Browse';
import ItemPage from '@/pages/Item';
import AuthPage from '@/pages/Auth';
import PostPage from '@/pages/Post';
import ProfilePage from '@/pages/Profile';
import MessagesPage from '@/pages/Messages';
import AboutPage from '@/pages/About';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
