# SEO Implementation Checklist

## 📋 Pre-Deployment SEO Verification

This checklist ensures all SEO requirements are properly implemented before code deployment. Use this as a final verification step.

## 🔗 Related Documentation
- [Technology Stack](technology.md) - Complete technology decisions and cost analysis
- [Architecture](architecture.md) - System architecture overview
- [Frontend Documentation](frontend.md) - Next.js 14+ implementation details
- [Backend Documentation](backend.md) - Fastify performance optimization
- [SEO Requirements](seo.md) - Complete SEO requirements document
- [Technical SEO Implementation](../content/technical-seo-implementation.md) - Detailed implementation guide
- [Optimized Resource Loading Strategy](optimized-resource-loading-strategy.md) - Performance optimization strategy
- [Testing](testing.md) - Vitest testing strategies
- [Business Requirements](../business/terms-of-reference.md) - Business goals and SEO targets

---

## 🏗 **Next.js 14+ SEO Implementation**

### **App Router SEO Configuration**
- [ ] **Metadata API** properly configured in layout.tsx and page.tsx files
  ```typescript
  export const metadata: Metadata = {
    title: 'Page Title | Statex',
    description: 'Page description with keywords',
    keywords: ['prototype development', 'AI automation', 'custom software'],
    authors: [{ name: 'Statex Team' }],
    robots: 'index, follow',
    alternates: {
      canonical: 'https://statex.cz/current-path'
    },
    openGraph: {
      title: 'Page Title',
      description: 'Page description',
      images: ['/og-image.jpg']
    }
  };
  ```

- [ ] **Dynamic Metadata** for CMS/database-driven pages
- [ ] **Sitemap Generation** via Next.js sitemap.xml route
- [ ] **Robots.txt** configured via Next.js robots.txt route
- [ ] **JSON-LD Schema** implemented in page components

### **Performance Optimization (Next.js)**
- [ ] **Image Component** used for all images with proper optimization
- [ ] **Font Optimization** with next/font for Google Fonts
- [ ] **Server Components** used for better performance
- [ ] **Streaming** implemented for improved loading
- [ ] **Static Generation** for SEO-critical pages

### **Fastify Backend SEO Support**
- [ ] **API Routes** optimized for SEO data fetching
- [ ] **Response Compression** enabled (Brotli/Gzip)
- [ ] **Caching Headers** properly configured
- [ ] **Structured Data API** for dynamic schema generation

---

## ✅ Technical SEO Checklist

### 🏗 HTML Structure & Meta Tags

#### **Every Page Must Have:**
- [ ] **Unique Title Tag** (55-60 characters)
  - [ ] Contains primary keyword
  - [ ] Follows format: "Primary Keyword | Secondary | Statex"
  - [ ] No duplicate titles across site

- [ ] **Meta Description** (150-160 characters)
  - [ ] Compelling and descriptive
  - [ ] Contains primary keyword naturally
  - [ ] Includes call-to-action
  - [ ] Unique across all pages

- [ ] **Canonical URL**
  - [ ] Points to correct URL version
  - [ ] Uses HTTPS protocol
  - [ ] No trailing slashes inconsistency

- [ ] **Open Graph Tags**
  ```html
  <meta property="og:title" content="Page Title">
  <meta property="og:description" content="Page Description">
  <meta property="og:image" content="https://statex.cz/images/og-image.jpg">
  <meta property="og:url" content="https://statex.cz/current-page">
  <meta property="og:type" content="website">
  ```

- [ ] **Twitter Card Tags**
  ```html
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Page Title">
  <meta name="twitter:description" content="Page Description">
  <meta name="twitter:image" content="https://statex.cz/images/twitter-card.jpg">
  ```

#### **HTML Semantic Structure:**
- [ ] **H1 Tag** (one per page, contains primary keyword)
- [ ] **H2-H6 Tags** (proper hierarchy, descriptive)
- [ ] **Alt Text** for all images (descriptive, keyword-rich where appropriate)
- [ ] **Internal Links** with descriptive anchor text
- [ ] **Breadcrumb Navigation** (with schema markup)

---

### 🔍 Schema Markup Verification

#### **Organization Schema (Homepage):**
- [ ] Organization name and legal name
- [ ] Complete address (Prague, Czech Republic)
- [ ] Contact information (phone, email)
- [ ] Social media profiles (sameAs)
- [ ] Services offered
- [ ] Area served (Europe, specific countries)

#### **Service Schema (Service Pages):**
- [ ] Service name and description
- [ ] Provider organization reference
- [ ] Area served
- [ ] Service category
- [ ] Offers catalog with individual services

#### **Article Schema (Blog Posts):**
- [ ] Headline and description
- [ ] Author information
- [ ] Publication and modification dates
- [ ] Article body
- [ ] Main entity of page

#### **FAQ Schema (Where Applicable):**
- [ ] Question and answer pairs
- [ ] Properly nested within relevant content
- [ ] Natural language questions

#### **LocalBusiness Schema:**
- [ ] Business name and address
- [ ] Geographic coordinates
- [ ] Opening hours
- [ ] Contact information
- [ ] Currencies accepted (EUR, CZK)

**Schema Validation:**
- [ ] Validates in [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] No errors in [Schema.org Validator](https://validator.schema.org/)

---

### 🚀 Performance & Core Web Vitals

#### **Core Web Vitals Targets:**
- [ ] **LCP (Largest Contentful Paint)**: <2.5s
- [ ] **FID (First Input Delay)**: <100ms
- [ ] **CLS (Cumulative Layout Shift)**: <0.1

#### **Additional Performance Metrics:**
- [ ] **TTFB (Time to First Byte)**: <600ms
- [ ] **Speed Index**: <3.4s
- [ ] **Total Blocking Time**: <200ms

#### **Performance Optimization Checklist:**
- [ ] **Image Optimization**
  - [ ] WebP format for modern browsers
  - [ ] AVIF format where supported
  - [ ] CSS images used for simple graphics (gradients, shapes, icons)
  - [ ] Appropriate image sizes and compression
  - [ ] Lazy loading for below-fold images
  - [ ] Responsive images with srcset
  - [ ] Reduced HTTP requests through CSS graphics

- [ ] **CSS Optimization**
  - [ ] Critical CSS inlined
  - [ ] Non-critical CSS deferred
  - [ ] Unused CSS removed
  - [ ] CSS minified

- [ ] **JavaScript Optimization**
  - [ ] Code splitting implemented
  - [ ] Unused JavaScript removed
  - [ ] JavaScript minified
  - [ ] Scripts loaded asynchronously where possible

- [ ] **Resource Loading** (follow [Optimized Resource Loading Strategy](optimized-resource-loading-strategy.md))
  - [ ] Page-specific code loading implemented
  - [ ] Shared resources cached efficiently
  - [ ] Critical resources preloaded
  - [ ] Fonts optimized (font-display: swap)
  - [ ] Third-party scripts audited
  - [ ] Unused code and assets removed

**Performance Testing:**
- [ ] Green scores in [PageSpeed Insights](https://pagespeed.web.dev/)
- [ ] Passes [Web.dev Measure](https://web.dev/measure/)

---

### 📱 Mobile & PWA SEO

#### **Mobile Optimization:**
- [ ] **Mobile-Friendly Design**
  - [ ] Responsive layout on all screen sizes
  - [ ] Text readable without zooming
  - [ ] Touch targets at least 44px
  - [ ] No horizontal scrolling

- [ ] **Viewport Configuration**
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ```

- [ ] **Mobile Performance**
  - [ ] Mobile PageSpeed score >90
  - [ ] Mobile LCP <3s

#### **PWA Requirements:**
- [ ] **Service Worker** implemented for caching
- [ ] **Web App Manifest** configured
- [ ] **Offline Functionality** for key pages
- [ ] **Installation Prompts** properly configured

**Mobile Testing:**
- [ ] Passes [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Tested on multiple devices and screen sizes

---

### 🌍 European Market & GDPR SEO

#### **Localization:**
- [ ] **Currency Display**: Euro (€) symbol used or local currency depending on the language and country
- [ ] **Date/Time Format**: European format (DD/MM/YYYY, 24h)
- [ ] **Address Format**: European address standards
- [ ] **Phone Format**: International format with country codes

#### **GDPR Compliance:**
- [ ] **Cookie Consent**: GDPR-compliant consent management
- [ ] **Privacy Policy**: Linked and accessible
- [ ] **Data Processing**: Clear data usage statements
- [ ] **User Rights**: Data export/deletion capabilities

#### **European Business Context:**
- [ ] **Legal Information**: EU business registration details
- [ ] **Compliance Statements**: GDPR, accessibility notices
- [ ] **European Terminology**: Business language and culture
- [ ] **Local Presence**: Prague address and Czech presence highlighted

---

### 🔗 URL Structure & Technical

#### **URL Standards:**
- [ ] **HTTPS Protocol** on all pages
- [ ] **Clean URL Structure** (no unnecessary parameters)
- [ ] **Consistent Trailing Slashes** (either always or never)
- [ ] **Descriptive URLs** with keywords where appropriate
- [ ] **Proper Redirects** (301 for permanent, 302 for temporary)

#### **Site Architecture:**
- [ ] **XML Sitemap** generated and submitted
- [ ] **Robots.txt** properly configured
- [ ] **Navigation Structure** logical and crawler-friendly
- [ ] **Internal Linking** strategic and natural
- [ ] **404 Error Pages** user-friendly and helpful

#### **Technical Implementation:**
- [ ] **SSL Certificate** valid and properly configured
- [ ] **CDN Configuration** optimized for European users
- [ ] **Server Response Times** <600ms TTFB
- [ ] **Gzip Compression** enabled for text resources

---

### 📊 Content SEO Verification

#### **Keyword Optimization:**
- [ ] **Primary Keywords** (2-4 per page)
  - [ ] Included in title tag
  - [ ] Present in H1 tag
  - [ ] Naturally integrated in content
  - [ ] Used in image alt text where appropriate

- [ ] **Secondary Keywords** (5-8 supporting terms)
  - [ ] Present in H2/H3 headings
  - [ ] Integrated throughout content
  - [ ] Used in internal link anchor text

- [ ] **Long-tail Keywords** for voice search
  - [ ] Question-based formats included
  - [ ] Natural language variations
  - [ ] FAQ sections optimized

#### **Content Quality:**
- [ ] **Unique Content** (no duplicate content issues)
- [ ] **Comprehensive Coverage** of topic
- [ ] **Proper Content Length** (minimum 300 words for service pages)
- [ ] **Regular Updates** planned for dynamic content

#### **European Market Content:**
- [ ] **Local SEO Elements**
  - [ ] "EU" mentions where relevant
  - [ ] European business context
  - [ ] Local market understanding

---

### 🛠 Development Integration

#### **Code Quality:**
- [ ] **Semantic HTML** used throughout
- [ ] **Valid HTML** (passes W3C validation)
- [ ] **Accessible Code** (WCAG 2.1 AA compliance)
- [ ] **Clean Code Structure** for maintainability

#### **SEO-Friendly Development:**
- [ ] **JavaScript SEO** (content accessible without JS)
- [ ] **Dynamic Content** properly handled for crawlers
- [ ] **AJAX Content** includes proper fallbacks
- [ ] **SPA Routing** (if applicable) SEO-optimized

---

## 🔍 Pre-Launch Testing Protocol

### **Manual Testing Steps:**

#### 1. **Technical Validation:**
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) - all green scores
- [ ] Validate schema in [Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Check mobile-friendliness in [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [ ] Verify SSL certificate and HTTPS
- [ ] Test all internal links for 404 errors

#### 2. **Content Review:**
- [ ] Proofread all meta tags and content
- [ ] Verify keyword targeting is natural and appropriate
- [ ] Check all images have proper alt text
- [ ] Verify CSS images used for simple graphics (icons, shapes, gradients)
- [ ] Review internal linking structure

#### 3. **Performance Testing:**
- [ ] Test page load times on 3G connection
- [ ] Verify Core Web Vitals meet targets
- [ ] Check resource loading optimization per [Optimized Resource Loading Strategy](optimized-resource-loading-strategy.md)
- [ ] Verify page-specific code loading
- [ ] Test shared resource caching
- [ ] Test offline functionality (PWA)

#### 4. **Cross-Browser Testing:**
- [ ] Chrome (latest version)
- [ ] Firefox (latest version)
- [ ] Safari (latest version)
- [ ] Edge (latest version)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## 📈 Post-Launch Monitoring Setup

### **Analytics Configuration:**
- [ ] **Google Analytics 4** properly configured
- [ ] **Google Search Console** verified and connected
- [ ] **GDPR-Compliant Tracking** implemented
- [ ] **Conversion Goals** set up for prototype requests

### **Monitoring Schedule:**
- [ ] **Weekly**: Core Web Vitals monitoring
- [ ] **Bi-weekly**: Keyword ranking checks
- [ ] **Monthly**: Full SEO audit and performance review
- [ ] **Quarterly**: European market expansion planning

---

## ⚠️ Common SEO Issues to Avoid

### **Technical Issues:**
- [ ] **Duplicate Content**: Ensure all pages have unique content
- [ ] **Missing Meta Tags**: Every page must have title and description
- [ ] **Broken Internal Links**: All links should work and be relevant
- [ ] **Missing Schema Markup**: Structured data required for rich results
- [ ] **Poor Performance**: Core Web Vitals must be green
- [ ] **Non-HTTPS Pages**: All pages must use HTTPS protocol

### **Content Issues:**
- [ ] **Keyword Stuffing**: Natural keyword integration only
- [ ] **Thin Content**: Substantial, valuable content on all pages
- [ ] **Missing Alt Text**: All images need descriptive alt attributes
- [ ] **Excessive Image Files**: Use CSS for simple graphics (gradients, shapes, icons)
- [ ] **Poor Internal Linking**: Strategic, helpful internal links required

### **European Market Issues:**
- [ ] **GDPR Non-Compliance**: Ensure privacy compliance
- [ ] **Missing Localization**: European formats and context required
- [ ] **Poor Mobile Experience**: Mobile-first design essential

---

## ✅ Final Approval Checklist

Before marking SEO implementation as complete:

### **Technical Lead Approval:**
- [ ] All technical SEO requirements met
- [ ] Performance targets achieved
- [ ] Schema markup validated
- [ ] Mobile optimization verified

### **Content Team Approval:**
- [ ] Keyword targeting strategy implemented
- [ ] Content quality standards met
- [ ] European market context appropriate
- [ ] Internal linking structure optimized

### **Compliance Team Approval:**
- [ ] GDPR requirements satisfied
- [ ] European business regulations met
- [ ] Privacy policies and notices compliant
- [ ] Accessibility standards achieved

---

## 📞 Support & Resources

### **SEO Testing Tools:**
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)
- [GTmetrix Performance Testing](https://gtmetrix.com/)

### **Documentation References:**
- [SEO Requirements](seo.md) - Complete requirements document
- [Technical SEO Implementation](../content/technical-seo-implementation.md)
- [European SEO Localization](../content/european-seo-localization.md)
- [Schema Markup Implementation](../content/schema-markup-implementation.md)
- [Optimized Resource Loading Strategy](optimized-resource-loading-strategy.md) - Performance optimization

---

**✅ SEO Implementation Status: READY FOR VERIFICATION**

*This checklist must be completed and verified before any production deployment.*

---

*Last Updated: 2025-06-27*
*Document Owner: Development Team*
*Review Cycle: Before each deployment* 