# Fonts Directory

Place your custom font files here (e.g., Supra Power SE, Switzer, etc.)

## Supported formats
- `.woff2` (recommended)
- `.woff`
- `.ttf`
- `.otf`

## Usage
After adding fonts, update `src/index.css` with `@font-face` declarations:

```css
@font-face {
  font-family: 'Supra Power SE';
  src: url('/fonts/SupraPowerSE-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}
```
