/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './src/types/**/*.{js,ts,jsx,tsx,mdx}',
    './src/styles/**/*.{js,ts,jsx,tsx,mdx}',
    './src/test/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Brand Color Palette (Color-blind friendly) - Using CSS Custom Properties
      colors: {
        // Primary Colors - Technology, reliability, innovation
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)', // Main brand color
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
          blue: '#0066CC',
          'blue-light': '#3385DD',
          'blue-dark': '#004499',
        },
        // Accent Colors - Interactive elements, CTAs
        accent: {
          50: 'var(--color-accent-50)',
          100: 'var(--color-accent-100)',
          200: 'var(--color-accent-200)',
          300: 'var(--color-accent-300)',
          400: 'var(--color-accent-400)',
          500: 'var(--color-accent-500)', // Main accent color
          600: 'var(--color-accent-600)',
          700: 'var(--color-accent-700)',
          800: 'var(--color-accent-800)',
          900: 'var(--color-accent-900)',
          950: 'var(--color-accent-950)',
          green: '#00CC66',
          'green-light': '#33DD88',
          'green-dark': '#009944',
        },
        // Neutral Colors - Backgrounds, text, subtle elements
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },
        // Status Colors
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
        // Form Design Tokens
        form: {
          background: 'var(--form-background)',
          border: 'var(--form-border-color)',
          'border-focus': 'var(--form-border-color-focus)',
          'text-color': 'var(--form-text-color)',
          'placeholder-color': 'var(--form-placeholder-color)',
          'error-color': 'var(--form-error-color)',
          'success-color': 'var(--form-success-color)',
        },
      },
      // Typography Scale
      fontFamily: {
        sans: ['var(--font-family-sans)'],
        mono: ['var(--font-family-mono)'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.1' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.1' }],
        '8xl': ['6rem', { lineHeight: '1.1' }],
        '9xl': ['8rem', { lineHeight: '1.1' }],
        // Fluid typography utilities
        'fluid-xs': ['clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', { lineHeight: '1.4' }],
        'fluid-sm': ['clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', { lineHeight: '1.5' }],
        'fluid-base': ['clamp(1rem, 0.9rem + 0.5vw, 1.125rem)', { lineHeight: '1.6' }],
        'fluid-lg': ['clamp(1.125rem, 1rem + 0.625vw, 1.25rem)', { lineHeight: '1.5' }],
        'fluid-xl': ['clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)', { lineHeight: '1.4' }],
        'fluid-2xl': ['clamp(1.5rem, 1.3rem + 1vw, 2rem)', { lineHeight: '1.3' }],
        'fluid-3xl': ['clamp(1.875rem, 1.6rem + 1.375vw, 2.5rem)', { lineHeight: '1.2' }],
        'fluid-4xl': ['clamp(2.25rem, 1.9rem + 1.75vw, 3rem)', { lineHeight: '1.1' }],
        'fluid-5xl': ['clamp(3rem, 2.5rem + 2.5vw, 4rem)', { lineHeight: '1' }],
        'fluid-6xl': ['clamp(3.75rem, 3rem + 3.75vw, 5rem)', { lineHeight: '1' }],
      },
      // Spacing Scale (8px baseline grid)
      spacing: {
        xs: 'var(--space-xs)',
        sm: 'var(--space-sm)',
        md: 'var(--space-md)',
        lg: 'var(--space-lg)',
        xl: 'var(--space-xl)',
        '2xl': 'var(--space-2xl)',
        '3xl': 'var(--space-3xl)',
        '4xl': 'var(--space-4xl)',
        '5xl': 'var(--space-5xl)',
        '6xl': 'var(--space-6xl)',
        // Fluid spacing utilities
        'fluid-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'fluid-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'fluid-md': 'clamp(1rem, 3vw, 1.5rem)',
        'fluid-lg': 'clamp(1.5rem, 4vw, 2rem)',
        'fluid-xl': 'clamp(2rem, 5vw, 3rem)',
        'fluid-2xl': 'clamp(3rem, 6vw, 4rem)',
        'fluid-3xl': 'clamp(4rem, 8vw, 6rem)',
      },
      // Border Radius
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      // Custom Breakpoints (Mobile-first)
      screens: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      // Animation & Transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        loading: 'loading 1.5s infinite',
        wave: 'wave 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        loading: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        wave: {
          '0%': { height: '10px' },
          '100%': { height: '25px' },
        },
      },
      // Form-specific styling
      height: {
        'form-input': 'var(--form-input-height)',
        'form-button': 'var(--form-button-height)',
      },
      padding: {
        'form-input': 'var(--form-input-padding)',
      },
      // Box Shadows
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        inner: 'var(--shadow-inner)',
        glow: 'var(--shadow-glow)',
        'glow-accent': 'var(--shadow-glow-accent)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class-based form styling
    }),

    // Custom utilities
    function ({ addUtilities, theme }) {
      addUtilities({
        '.text-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.accent.500')})`,
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.bg-gradient-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.primary.600')})`,
        },
        '.bg-gradient-accent': {
          background: `linear-gradient(135deg, ${theme('colors.accent.500')}, ${theme('colors.accent.600')})`,
        },
        '.bg-gradient-hero': {
          background: `linear-gradient(135deg, ${theme('colors.gray.50')} 0%, #E0F2FE 50%, ${theme('colors.gray.50')} 100%)`,
        },
        '.btn-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.primary.600')})`,
          color: 'white',
          padding: '12px 24px',
          'border-radius': theme('borderRadius.full'),
          'font-weight': '600',
          transition: 'all 0.3s ease',
          'box-shadow': `0 4px 15px ${theme('colors.primary.500')}20`,
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': `0 8px 25px ${theme('colors.primary.500')}30`,
          },
        },
        '.btn-secondary': {
          background: `linear-gradient(135deg, ${theme('colors.accent.500')}, ${theme('colors.accent.600')})`,
          color: 'white',
          padding: '12px 24px',
          'border-radius': theme('borderRadius.full'),
          'font-weight': '600',
          transition: 'all 0.3s ease',
          'box-shadow': `0 4px 15px ${theme('colors.accent.500')}20`,
          '&:hover': {
            transform: 'translateY(-2px)',
            'box-shadow': `0 8px 25px ${theme('colors.accent.500')}30`,
          },
        },
      });
    },
  ],
};
