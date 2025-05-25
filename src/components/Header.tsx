import { Link } from 'react-router-dom';
import { BookOpen, PenTool } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { isAdmin, isAuthenticated } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            <BookOpen className="h-6 w-6" />
            Quantitative Trading Blog
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Trang chủ
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              Giới thiệu
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Quản trị
              </Link>
            )}
          </nav>

          {/* User menu and actions */}
          <div className="flex items-center gap-4">
            {isAdmin && isAuthenticated && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin" className="flex items-center gap-2">
                  <PenTool className="h-4 w-4" />
                  Viết bài
                </Link>
              </Button>
            )}
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
