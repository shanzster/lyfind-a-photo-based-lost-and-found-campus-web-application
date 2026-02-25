import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from '@/contexts/AdminAuthContext';
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
import PhotoMatchPage from '@/pages/lycean/PhotoMatch';
import DiagnosticTest from '@/pages/lycean/DiagnosticTest';
import MyItemsPage from '@/pages/lycean/MyItems';

// Faculty pages
import FacultyLoginPage from '@/pages/faculty/FacultyLogin';

// Admin pages
import AdminLoginPage from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import PendingApprovals from '@/pages/admin/PendingApprovals';
import UsersManagement from '@/pages/admin/UsersManagement';
import UserDetails from '@/pages/admin/UserDetails';
import ItemsManagement from '@/pages/admin/ItemsManagement';
import ItemDetails from '@/pages/admin/ItemDetails';
import ReportsManagement from '@/pages/admin/ReportsManagement';
import MessagesMonitoring from '@/pages/admin/MessagesMonitoring';
import AIMatching from '@/pages/admin/AIMatching';
import Analytics from '@/pages/admin/Analytics';
import ActivityLogs from '@/pages/admin/ActivityLogs';
import Settings from '@/pages/admin/Settings';

// Protected Admin Route Component
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, adminProfile, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2f1632]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff7400]"></div>
      </div>
    );
  }

  if (!user || !adminProfile) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const location = useLocation();
  
  // Hide header on Lycean, Faculty, and Admin pages
  const isLyceanPage = location.pathname.startsWith('/browse') || 
                       location.pathname.startsWith('/item') || 
                       location.pathname.startsWith('/post') || 
                       location.pathname.startsWith('/profile') || 
                       location.pathname.startsWith('/messages') ||
                       location.pathname.startsWith('/photo-match') ||
                       location.pathname.startsWith('/diagnostic') ||
                       location.pathname.startsWith('/my-items');
  
  const isFacultyPage = location.pathname.startsWith('/faculty');
  const isAdminPage = location.pathname.startsWith('/admin');
  
  const shouldShowHeader = !isLyceanPage && !isFacultyPage && !isAdminPage;

  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <AuthProvider>
        <AdminAuthProvider>
          <div className="min-h-screen bg-background">
            {shouldShowHeader && <Header />}
            <Routes>
              {/* Visitor Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/developer" element={<DeveloperPage />} />
              <Route path="/institution" element={<InstitutionPage />} />
              
              {/* Lycean Routes */}
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/item/:id" element={<ItemPage />} />
              <Route path="/post" element={<PostPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/my-items" element={<MyItemsPage />} />
              <Route path="/photo-match" element={<PhotoMatchPage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/diagnostic" element={<DiagnosticTest />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty/login" element={<FacultyLoginPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/approvals" 
                element={
                  <ProtectedAdminRoute>
                    <PendingApprovals />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedAdminRoute>
                    <UsersManagement />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <ProtectedAdminRoute>
                    <UserDetails />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/items" 
                element={
                  <ProtectedAdminRoute>
                    <ItemsManagement />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/items/:id" 
                element={
                  <ProtectedAdminRoute>
                    <ItemDetails />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedAdminRoute>
                    <ReportsManagement />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/messages" 
                element={
                  <ProtectedAdminRoute>
                    <MessagesMonitoring />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/ai-matching" 
                element={
                  <ProtectedAdminRoute>
                    <AIMatching />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedAdminRoute>
                    <Analytics />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/logs" 
                element={
                  <ProtectedAdminRoute>
                    <ActivityLogs />
                  </ProtectedAdminRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedAdminRoute>
                    <Settings />
                  </ProtectedAdminRoute>
                } 
              />
            </Routes>
            <Toaster />
          </div>
        </AdminAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
