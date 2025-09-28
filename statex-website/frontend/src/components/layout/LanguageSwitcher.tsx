'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDownIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' }
];

interface LanguageSwitcherProps {
  currentLanguage: string;
  className?: string;
}

export default function LanguageSwitcher({ 
  currentLanguage, 
  className = '' 
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = async (newLanguage: string) => {
    try {
      // Close dropdown
      setIsOpen(false);

      // If switching to English, remove language prefix
      if (newLanguage === 'en') {
        // Remove language prefix from current path
        const newPath = pathname.replace(/^\/[a-z]{2}/, '') || '/';
        router.push(newPath);
        return;
      }

      // For other languages, add or replace language prefix
      let newPath: string;
      
      if (pathname.startsWith('/cs') || pathname.startsWith('/de') || pathname.startsWith('/fr')) {
        // Replace existing language prefix
        newPath = pathname.replace(/^\/[a-z]{2}/, `/${newLanguage}`);
      } else {
        // Add language prefix to English path
        newPath = `/${newLanguage}${pathname === '/' ? '' : pathname}`;
      }

      router.push(newPath);
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <GlobeAltIcon className="w-4 h-4 mr-2" />
        {currentLang && (
          <>
            <span className="mr-1">{currentLang.flag}</span>
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
            <span className="sm:hidden">{currentLang.code.toUpperCase()}</span>
          </>
        )}
        <ChevronDownIcon className="w-4 h-4 ml-2" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1" role="menu">
              {SUPPORTED_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  className={`${
                    language.code === currentLanguage
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700'
                  } group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900`}
                  role="menuitem"
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-gray-500">{language.name}</span>
                  </div>
                  {language.code === currentLanguage && (
                    <span className="ml-auto text-indigo-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}