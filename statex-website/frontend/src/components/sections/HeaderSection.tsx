'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Container, LanguageSwitcher } from '@/components/atoms';
import { HeaderSectionConfig } from '@/types/templates';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useVariant, Variant } from '@/components/providers/VariantProvider';
import { Theme } from '@/lib/themeDetection';
import { getHeaderTranslation } from '@/lib/translations';
import { getLocalizedUrlWithFallback } from '@/lib/utils/localization';
import './HeaderSection.css';

export function HeaderSection(config: HeaderSectionConfig) {
  const { language: currentLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { variant: currentVariant, setVariant } = useVariant();
  const t = getHeaderTranslation(currentLanguage);

  // Generate navigation with proper native slugs and fallback handling
  const generateNavigation = () => [
    { label: t.navigation.services, href: getLocalizedUrlWithFallback('/services', currentLanguage) },
    { label: t.navigation.solutions, href: getLocalizedUrlWithFallback('/solutions', currentLanguage) },
    { label: t.navigation.about, href: getLocalizedUrlWithFallback('/about', currentLanguage) },
    { label: t.navigation.contact, href: getLocalizedUrlWithFallback('/contact', currentLanguage) },
    { label: t.navigation.freePrototype, href: getLocalizedUrlWithFallback('/free-prototype', currentLanguage) },
  ];

  const {
    title = 'Statex',
    navigation = generateNavigation(),
    cta = { text: t.cta.getStarted, href: getLocalizedUrlWithFallback('/contact', currentLanguage) },
    variant = 'default',
    showLanguageSwitcher = true,
    showThemeToggle = true,
    showVariantToggle = true,
    className = '',
  } = config;

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Theme toggle
  const handleThemeToggle = () => {
    const themes: Theme[] = ['light', 'dark', 'eu', 'uae'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]!);
  };

  // Variant toggle
  const handleVariantToggle = () => {
    const variants: Variant[] = ['modern', 'classic', 'minimal', 'corporate'];
    const currentIndex = variants.indexOf(currentVariant);
    const nextIndex = (currentIndex + 1) % variants.length;
    setVariant(variants[nextIndex]!);
  };

  const renderLanguageSwitcher = () => {
    if (!showLanguageSwitcher) return null;

    return (
      <LanguageSwitcher
        className="stx-header__language-switcher"
        showFlags={true}
        showLabels={true}
        variant="dropdown"
      />
    );
  };

  const renderActions = () => (
    <div className="stx-header__actions">
      {renderLanguageSwitcher()}

      {showThemeToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleThemeToggle}
          className="stx-header__theme-toggle"
          aria-label={t.aria.switchTheme}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </Button>
      )}

      {showVariantToggle && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleVariantToggle}
          className="stx-header__variant-toggle"
          aria-label={t.aria.switchFrontend}
        >
          ⚡
        </Button>
      )}

      <a href={cta.href} className="stx-header__cta">
        {cta.text}
      </a>
    </div>
  );

  const renderMobileMenu = () => (
    <>
              <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileOpen(v => !v)}
          className={`stx-header__mobile-menu${mobileOpen ? ' stx-header__mobile-menu--open' : ''}`}
          aria-label={t.aria.openMenu}
          aria-expanded={mobileOpen}
        >
        <span className="stx-header__mobile-menu-line" />
        <span className="stx-header__mobile-menu-line" />
        <span className="stx-header__mobile-menu-line" />
      </Button>

      {mobileOpen && (
        <nav className="stx-header__mobile-nav" aria-label={t.aria.mobileNavigation}>
          <ul className="stx-header__mobile-links">
            {navigation.map(link => (
              <li key={link.href} className="stx-header__mobile-link-item">
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="stx-header__mobile-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="stx-header__mobile-link-item">
              <a
                href={cta.href}
                onClick={() => setMobileOpen(false)}
                className="stx-header__mobile-link stx-header__mobile-link--cta"
              >
                {cta.text}
              </a>
            </li>
            {showLanguageSwitcher && (
              <li className="stx-header__mobile-link-item">
                <div className="stx-header__mobile-lang">
                  {renderLanguageSwitcher()}
                </div>
              </li>
            )}
            {showThemeToggle && (
              <li className="stx-header__mobile-link-item">
                <Button
                  variant="ghost"
                  onClick={handleThemeToggle}
                  className="stx-header__theme-toggle"
                  aria-label={t.aria.switchTheme}
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </Button>
              </li>
            )}
            {showVariantToggle && (
              <li className="stx-header__mobile-link-item">
                <Button
                  variant="ghost"
                  onClick={handleVariantToggle}
                  className="stx-header__variant-toggle"
                  aria-label={t.aria.switchFrontend}
                >
                  ⚡
                </Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </>
  );

  const headerClasses = `stx-header stx-header--${variant} ${className}`;

  return (
    <header className={headerClasses} data-testid="stx-header-section">
      <Container size="80vw">
        {/* Logo */}
        <Link href="/" className="stx-header__logo">
          {title}
        </Link>
        {/* Desktop Navigation */}
        <nav className="stx-header__nav" aria-label={t.aria.mainNavigation}>
          <ul className="stx-header__menu">
            {navigation.map(link => (
              <li key={link.href} className="stx-header__menu-item">
                <a href={link.href} className="stx-header__menu-link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* Actions */}
        {renderActions()}
        {/* Mobile Menu */}
        {renderMobileMenu()}
      </Container>
    </header>
  );
}
