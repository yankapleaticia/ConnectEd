# ConnectEd Theme Color System

## Logo Placement

Place your logo PNG or SVG file in the `public/` directory:

- **Recommended**: `public/logo.png` or `public/logo.svg`
- **Usage in components**:

```tsx
import Image from 'next/image';

<Image src="/logo.png" alt="ConnectEd" width={150} height={40} />
```

## Color System

All colors are defined in CSS variables in `app/globals.css` and available via TypeScript in `theme/colors.ts`.

### Using Colors in Components

#### Method 1: CSS Variables (Recommended)

```tsx
<div style={{ color: 'var(--color-primary)' }}>
  Primary text
</div>

<button 
  style={{ 
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-primary-text)'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
>
  Click me
</button>
```

#### Method 2: TypeScript Hook

```tsx
import { useColors } from '@/client/lib/useColors';

const colors = useColors();
// colors.primary.DEFAULT, colors.primary.hover, etc.
```

## Color Palette

### Primary (Trust Blue) - #2A519C
**Used for**: Main buttons, header highlights, active filters/tabs, primary links

- `--color-primary`: #2A519C
- `--color-primary-hover`: #1F3F7A
- `--color-primary-text`: #FFFFFF

### Secondary (Connect Pink) - #BF247A
**Used for**: Sign up/onboarding emphasis, profile highlights, community badges

- `--color-secondary`: #BF247A
- `--color-secondary-hover`: #A31F67
- `--color-secondary-text`: #FFFFFF

### Accent (Warm Yellow) - #F7C65C
**Used for**: Featured listings, highlights, info banners, "New" tags

- `--color-accent`: #F7C65C
- `--color-accent-text`: #2A2A2A

### Success (Fresh Green) - #35A675
**Used for**: Success messages, completed actions, verified states

- `--color-success`: #35A675
- `--color-success-text`: #FFFFFF

### Warning - #F7C65C
**Used for**: Form warnings, attention messages, soft alerts

- `--color-warning`: #F7C65C
- `--color-warning-text`: #2A2A2A

### Error (Danger) - #D64545
**Used for**: Validation errors, failed actions, deletion warnings

- `--color-error`: #D64545
- `--color-error-text`: #FFFFFF

### Backgrounds & Surfaces

- `--color-background`: #FFFFFF (Main background)
- `--color-surface`: #F7F8FA (Cards, elevated surfaces)
- `--color-border`: #EAECEF (Borders, dividers)

### Text Colors

- `--color-text-primary`: #1F2937 (Headings, main text)
- `--color-text-secondary`: #6B7280 (Body text, descriptions)
- `--color-text-muted`: #9CA3AF (Placeholder, meta text)

## Usage Examples

### Primary Button
```tsx
<button 
  style={{ 
    backgroundColor: 'var(--color-primary)',
    color: 'var(--color-primary-text)'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
>
  Primary Action
</button>
```

### Secondary Button (Sign Up)
```tsx
<button 
  style={{ 
    backgroundColor: 'var(--color-secondary)',
    color: 'var(--color-secondary-text)'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary-hover)'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-secondary)'}
>
  Sign Up
</button>
```

### Success Message
```tsx
<div 
  style={{ 
    backgroundColor: 'var(--color-success)',
    color: 'var(--color-success-text)',
    padding: '1rem',
    borderRadius: '0.5rem'
  }}
>
  Success message
</div>
```

### Error Message
```tsx
<div 
  style={{ 
    color: 'var(--color-error)'
  }}
>
  Error message
</div>
```

### Card/Surface
```tsx
<div 
  style={{ 
    backgroundColor: 'var(--color-surface)',
    border: `1px solid var(--color-border)`,
    padding: '1rem',
    borderRadius: '0.5rem'
  }}
>
  Card content
</div>
```
