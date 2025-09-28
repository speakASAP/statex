# URL Structure Documentation

## 📌 Overview

This document outlines the URL structure for the Statex website, designed to support multiple languages and regions while maintaining a single domain. The structure follows SEO best practices and provides a consistent user experience across all markets.

## 🌐 Base Structure

All URLs follow this pattern:

```
https://statex.cz/[country]-[lang]/[path]
```

### Components:
- `[country]`: Two-letter country code (e.g., `cz`, `de`, `ch`, `ae`)
- `[lang]`: Two-letter language code (e.g., `en`, `cs`, `de`, `fr`, `it`, `ar`)
- `[path]`: Page path in the specified language

## 🔄 URL Patterns

### 1. Default Language for Country
When using the default language for a country, the URL omits the language code:

```
https://statex.cz/[country]/[path]
```

**Examples:**
- `https://statex.cz/cz/o-nas` (Czech in Czech Republic)
- `https://statex.cz/de/leistungen` (German in Germany)
- `https://statex.cz/ch/dienstleistungen` (German in Switzerland)

### 2. Non-Default Language for Country
When using a non-default language, both country and language codes are included:

```
https://statex.cz/[country]-[lang]/[path]
```

**Examples:**
- `https://statex.cz/cz-en/about` (English in Czech Republic)
- `https://statex.cz/ch-fr/services` (French in Switzerland)
- `https://statex.cz/ae-ar/من-نحن` (Arabic in UAE)

## 🌍 Supported Countries and Default Languages

| Country Code | Country        | Default Language | Other Supported Languages |
|-------------|----------------|------------------|---------------------------|
| `cz`        | Czech Republic | `cs` (Czech)     | `en`                      |
| `de`        | Germany        | `de` (German)    | `en`                      |
| `ch`        | Switzerland    | `de` (German)    | `fr`, `it`, `en`          |
| `ae`        | UAE            | `en` (English)   | `ar`                      |


## 📂 Content Paths

### Common Paths

| Path                     | Description                   | Example URL (German in Germany)       |
|--------------------------|-------------------------------|---------------------------------------|
| `/`                      | Homepage                      | `https://statex.cz/de/`               |
| `/about`                 | About Us                      | `https://statex.cz/de/ueber-uns`      |
| `/services`              | Services overview             | `https://statex.cz/de/leistungen`     |
| `/services/[service]`    | Specific service              | `https://statex.cz/de/leistungen/webentwicklung` |
| `/blog`                  | Blog index                    | `https://statex.cz/de/blog`           |
| `/blog/[year]/[slug]`    | Blog post                     | `https://statex.cz/de/blog/2024/kuenstliche-intelligenz` |
| `/contact`               | Contact page                  | `https://statex.cz/de/kontakt`        |
| `/prototype/new`         | New prototype form            | `https://statex.cz/de/prototyp/neu`   |


## 🔧 Technical Implementation

### Next.js Configuration

```typescript
// next.config.js
module.exports = {
  i18n: {
    locales: [
      // Default languages
      'cz', 'de', 'ch', 'ae',
      // Language variations
      'cz-en', 'de-en', 'ch-fr', 'ch-it', 'ch-en', 'ae-ar'
    ],
    defaultLocale: 'cz',
    localeDetection: true,
  }
}
```

### File Structure

```
/pages/
  /[locale]/
    index.js              # Homepage
    about.js              # About Us
    services/
      index.js           # Services overview
      [service].js        # Individual service
    blog/
      index.js           # Blog index
      [year]/
        [slug].js      # Blog post
    contact.js            # Contact page
    prototype/
      new.js            # New prototype form
```

### Redirect Rules

1. **Root Domain Access**
   - `statex.cz` → Redirects based on user's country/language (location by IP and browser language)
   - `statex.cz/any-path` → Redirects to localized version
   - There should be only 1 redirect from statex.cz to page localiozed version. We need to create final url and make redirect only once to destination page.

2. **Canonical URLs**
   - Each page has a self-referencing canonical URL
   - Language versions link to each other using `hreflang`

## 🔍 SEO Considerations

### Canonical URLs
Each page includes a canonical URL in the format:
```html
<link rel="canonical" href="https://statex.cz/[country]-[lang]/[path]" />
```

### Hreflang Tags
Hreflang tags are automatically generated for all language variations:
```html
<link rel="alternate" hreflang="de" href="https://statex.cz/de/..." />
<link rel="alternate" hreflang="de-ch" href="https://statex.cz/ch-de/..." />
<link rel="alternate" hreflang="fr-ch" href="https://statex.cz/ch-fr/..." />
<link rel="alternate" hreflang="en" href="https://statex.cz/[country]-en/..." />
```

### Sitemap
Dynamic sitemap is generated at `/sitemap.xml` with all localized URLs.

## 📝 Content Guidelines

When creating new content:
1. Use relative paths for internal links
2. Always use the `[locale]` parameter in Next.js routing
3. Store content in the appropriate language directory
4. Follow the naming conventions for consistency

## 🔗 Related Documentation

- [Content Management Guidelines](../content/content-management-guidelines.md)
- [SEO Strategy](../seo/strategy.md)
- [Multilingual Content](../content/multilingual-guide.md)
