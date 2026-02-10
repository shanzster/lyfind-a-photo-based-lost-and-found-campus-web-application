import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/header';

// Visitor pages
import HomePage from '@/pages/visitor/Home';
import AboutPage from '@/pages/visitor/About';
import ServicesPage from '@/pages/visitor/Services';
import AuthPage from '@/pages/visitor/Auth';
import LoginPage from '@/pages/visitor/Login';
import RegisterPage from '@/pages/visitor/Register';
import DeveloperPage from '@/pages/visitor/Developer';
import InstitutionPage from '@/pages/visitor/Institution';

// Lycean pages
import BrowsePage from '@/pages/lycean/Browse';
import ItemPage from '@/pages/lycean/Item';
import PostPage from '@/pages/lycean/Post';
import ProfilePage from '@/pages/lycean/Profile';
import MessagesPage from '@/pages/lycean/Messages';

// Faculty pages
import FacultyLoginPage from '@/pages/faculty/FacultyLogin';

// Admin pages
import AdminLoginPage from '@/pages/admin/AdminLogin';

export default function App() {
  const location = useLocation();
  
  // Hide header on Lycean, Faculty, and Admin pages
  const isLyceanPage = location.pathname.startsWith('/browse') || 
                       location.pathname.startsWith('/item') || 
                       location.pathname.startsWith('/post') || 
                       location.pathname.startsWith('/profile') || 
                       location.pathname.startsWith('/messages');
  
  const isFacultyPage = location.pathname.startsWith('/faculty');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const shouldShowHeader = !isLyceanPage && !isFacultyPage && !isAdminPage;

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <div className="min-h-screen bg-background">
        {shouldShowHeader && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/institution" element={<InstitutionPage />} />
          <Route path="/faculty/login" element={<FacultyLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
