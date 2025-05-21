
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        <Button 
          onClick={toggleTheme}
          variant="outline" 
          size="icon"
          className={`h-12 w-12 rounded-l-xl rounded-r-none border-r-0 shadow-lg ${
            isDarkMode 
              ? 'bg-black border-white/20 hover:bg-black/80' 
              : 'bg-white border-black/10 hover:bg-gray-100'
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-6 w-6 text-yellow-400" />
          ) : (
            <Moon className="h-6 w-6 text-blue-700" />
          )}
          <span className="sr-only">{isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}</span>
        </Button>
      </div>
    </div>
  );
};

export default ThemeToggle;
