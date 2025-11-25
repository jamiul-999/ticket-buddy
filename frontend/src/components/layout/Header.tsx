import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Bus size={32} />
            <span className="text-xl font-bold">TicketBuddy</span>
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/"
              className={`font-medium transition-colors ${
                isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Home
            </Link>
            <Link
              to="/bookings"
              className={`font-medium transition-colors ${
                isActive('/bookings') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              My Bookings
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};