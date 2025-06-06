
# Internationalization (i18n) Setup

## Overview
This application uses `react-i18next` for internationalization with support for multiple languages and lazy loading of translation files.

## Current Languages
- English (en) - Default
- Spanish (es)

## Adding New Languages

### 1. Create Translation Files
Create new folders in `public/locales/{language-code}/` with the following JSON files:
- `common.json` - Common UI elements (buttons, form labels)
- `auth.json` - Authentication related text
- `landing.json` - Landing page content

### 2. Update Language Selector
Add the new language to the `availableLanguages` array in `src/hooks/useLocale.ts`:

```typescript
availableLanguages: [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' }, // New language
]
```

### 3. Configure i18n
The language will be automatically detected and loaded from the translation files.

## Usage in Components

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('landing.heroTitle1', 'Default text if translation missing')}</h1>
      <button>{t('common.signIn', 'Sign In')}</button>
    </div>
  );
};
```

## Translation Key Structure
- `common.*` - Shared UI elements
- `auth.*` - Authentication flows
- `landing.*` - Landing page content
- Namespace.key format: `t('namespace.key', 'fallback')`

## Language Persistence
User language preference is stored in `localStorage` as `preferred-language` and persists across sessions.
