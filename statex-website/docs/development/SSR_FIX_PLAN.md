# SSR Fix Plan - Постепенное исправление страниц

## 🎯 Цель
Исправить все страницы с SSR проблемами, чтобы они работали в production без ошибок.

## 🚨 Проблема
Множественные страницы используют `useTemplateBuilder()` и другие client hooks на сервере, что вызывает ошибки при сборке.

## 📋 Страницы для исправления

### 1. **Design System** ✅ (Исправлено)
- **Файл**: `/design-system/page.tsx`
- **Проблема**: `useTemplateBuilder()` на сервере
- **Решение**: Создан `DesignSystemContent.tsx` с `'use client'`

### 2. **Legal Pages** ✅ (Частично исправлено)
- **Файлы**: 
  - `/legal/legal-disclaimers/page.tsx` ✅
  - `/legal/gdpr-compliance/page.tsx` ✅
- **Проблема**: `useTemplateBuilder()` на сервере
- **Решение**: Созданы Content компоненты с `'use client'`

### 3. **Free Prototype Pages** ❌ (Требует исправления)
- **Файлы**: 
  - `/free-prototype/requirements/page.tsx`
  - `/free-prototype/what-you-get/page.tsx`
- **Проблема**: `useTemplateBuilder()` на сервере
- **Решение**: Создать Content компоненты

### 4. **About Pages** ❌ (Требует исправления)
- **Файлы**: 
  - `/about/czech-presence/page.tsx`
- **Проблема**: `useTemplateBuilder()` на сервере
- **Решение**: Создать Content компоненты

### 5. **Search Page** ✅ (Исправлено)
- **Файл**: `/search/page.tsx`
- **Проблема**: `useTemplateBuilder()` на сервере
- **Решение**: Создан `SearchContent.tsx` с `'use client'`

### 6. **Prototype Page** ❌ (Требует исправления)
- **Файл**: `/prototype/page.tsx`
- **Проблема**: `useABTest()` на сервере
- **Решение**: Создать Content компонент

## 🔧 Шаблон исправления

### Шаг 1: Создать Content компонент
```tsx
// ComponentNameContent.tsx
'use client';

import { useTemplateBuilder } from '@/hooks/useTemplateBuilder';
import { TemplateRenderer } from '@/components/templates/TemplateRenderer';

export default function ComponentNameContent() {
  const template = useTemplateBuilder()
    // ... существующий код template
    .build();

  return <TemplateRenderer template={template} />;
}
```

### Шаг 2: Обновить основную страницу
```tsx
// page.tsx
import { Metadata } from 'next';
import { HeroSpacer } from '@/components/atoms';
import ComponentNameContent from './ComponentNameContent';

export const metadata: Metadata = {
  // ... существующие метаданные
};

export default function PageName() {
  return (
    <>
      <HeroSpacer />
      <ComponentNameContent />
    </>
  );
}
```

## 📅 План выполнения

### **Фаза 1: Критические страницы** (Сегодня)
- [x] Design System
- [x] Legal Disclaimers
- [x] GDPR Compliance
- [x] Search

### **Фаза 2: Free Prototype** (Завтра)
- [ ] Requirements
- [ ] What You Get

### **Фаза 3: About Pages** (Послезавтра)
- [ ] Czech Presence

### **Фаза 4: Prototype** (Конец недели)
- [ ] Main Prototype Page

## 🧪 Тестирование

После каждого исправления:
1. Запустить `npm run build`
2. Проверить, что ошибка исчезла
3. Проверить, что страница работает в development

## 🎯 Результат

После завершения всех исправлений:
- ✅ Production build будет работать без ошибок
- ✅ Все страницы будут доступны
- ✅ SSR проблемы будут решены
- ✅ Сайт можно будет развернуть на production

## 📝 Примечания

- **Временное решение**: Страницы временно отключались для успешной сборки
- **Постепенное исправление**: Исправляем по одной странице для контроля качества
- **Шаблон**: Используем единый подход для всех страниц
- **Тестирование**: Каждое исправление тестируем локально
