import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Github, Twitter, Mail } from 'lucide-react';
import { cn } from '../utils/cn';
import { categories } from '../data/tools';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">ToolVerseHub</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className={cn("text-sm font-medium hover:text-indigo-600 transition-colors", location.pathname === '/' ? 'text-indigo-600' : 'text-gray-600')}>Home</Link>
              <Link to="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">About</Link>
              <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Contact</Link>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search tools..." 
                  className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                />
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-4">
            <Link to="/" className="block text-base font-medium text-gray-900">Home</Link>
            <Link to="/about" className="block text-base font-medium text-gray-900">About</Link>
            <Link to="/contact" className="block text-base font-medium text-gray-900">Contact</Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-lg font-bold tracking-tight">ToolVerseHub</span>
              </Link>
              <p className="text-gray-500 text-sm max-w-xs mb-6">
                The ultimate destination for free, fast, and secure online tools. Empowering creators and professionals worldwide.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                <Github className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
                <Mail className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer" />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-500 hover:text-indigo-600">All Tools</Link></li>
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-indigo-600">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-indigo-600">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <Link to={`/${cat.slug}`} className="text-sm text-gray-500 hover:text-indigo-600">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-sm text-gray-500 hover:text-indigo-600">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm text-gray-500 hover:text-indigo-600">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">© 2026 ToolVerseHub. All rights reserved.</p>
            <p className="text-sm text-gray-400 mt-4 md:mt-0">Built for speed and SEO.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
