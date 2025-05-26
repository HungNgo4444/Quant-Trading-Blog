import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { blogService } from '@/lib/blogService';
import Index from '@/pages/Index';
import BlogPost from '@/pages/BlogPost';
import About from '@/pages/About';
import Auth from '@/pages/Auth';
import AdminSafe from '@/pages/AdminSafe';
import AdminSimple from '@/pages/AdminSimple';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

function App() {
  // Clean up old view records on app initialization
  useEffect(() => {
    blogService.cleanupOldViewRecords();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:id" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminSafe />} />
            <Route path="/admin/panel" element={<AdminSimple />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
