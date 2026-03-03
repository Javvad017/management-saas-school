# Tailwind CSS v4 Setup - Complete Guide

## ✅ What Was Fixed

### 1. Updated `src/index.css`
**Old (v3):**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**New (v4):**
```css
@import "tailwindcss";
```

### 2. Removed `tailwind.config.js`
- Tailwind v4 doesn't require a config file
- Configuration is done directly in CSS using CSS variables
- The file has been deleted

### 3. Updated `postcss.config.cjs`
```javascript
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

### 4. Added Custom Color Utilities
Since Tailwind v4 doesn't include arbitrary color classes by default, we added:
- `.text-primary` - Primary text color (#1565C0)
- `.bg-primary` - Primary background color
- `.border-primary` - Primary border color
- `.hover:bg-primary-dark` - Hover state

## 📦 Dependencies

Make sure you have:
```json
{
  "@tailwindcss/postcss": "^4.x.x",
  "tailwindcss": "^4.x.x",
  "autoprefixer": "^10.x.x"
}
```

Install if missing:
```bash
npm install @tailwindcss/postcss tailwindcss autoprefixer
```

## 🎨 Custom Colors

Primary colors are defined as CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #1565C0;
  --color-primary-dark: #0D47A1;
  --color-primary-light: #1976D2;
}
```

## 🔧 Custom Components

All custom component classes are defined in `@layer components`:

- `.btn-primary` - Primary button style
- `.card` - Card container
- `.input-field` - Form input style
- `.badge-present` - Green badge for present status
- `.badge-absent` - Red badge for absent status
- `.nav-link` - Navigation link style
- `.nav-link-active` - Active navigation link

## 🚀 Usage

### Standard Tailwind Classes
All standard Tailwind classes work as expected:
```jsx
<div className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md">
  <p className="text-gray-900 font-bold">Hello World</p>
</div>
```

### Custom Primary Color
```jsx
<h1 className="text-primary">School Portal</h1>
<button className="bg-primary text-white">Click Me</button>
<div className="border-2 border-primary">Content</div>
```

### Custom Components
```jsx
<button className="btn-primary">Sign In</button>
<div className="card">Card Content</div>
<input className="input-field" />
<span className="badge-present">Present</span>
<span className="badge-absent">Absent</span>
```

## 🐛 Common Issues & Solutions

### Issue: "Cannot apply unknown utility class"
**Solution:** Make sure you're using `@import "tailwindcss";` not `@tailwind` directives.

### Issue: Custom colors not working
**Solution:** Check that CSS variables are defined in `:root` and utility classes are in `@layer utilities`.

### Issue: PostCSS errors
**Solution:** Verify `postcss.config.cjs` has `@tailwindcss/postcss` plugin.

### Issue: Styles not updating
**Solution:** 
1. Stop dev server
2. Delete `.vite` cache folder
3. Restart: `npm run dev`

## 📝 Migration Notes

### What Changed from v3 to v4:

1. **Import syntax**: `@import "tailwindcss"` instead of `@tailwind` directives
2. **Config file**: Optional, not required
3. **Custom colors**: Use CSS variables instead of config
4. **Plugin system**: Different approach for custom utilities
5. **PostCSS plugin**: Use `@tailwindcss/postcss` instead of `tailwindcss`

### What Stayed the Same:

- All standard utility classes
- Responsive modifiers (sm:, md:, lg:, etc.)
- State modifiers (hover:, focus:, etc.)
- Dark mode support
- Component layer system

## ✨ Benefits of v4

- **Faster builds**: Improved performance
- **Smaller bundle**: Better tree-shaking
- **Simpler config**: CSS-based configuration
- **Better DX**: Improved error messages
- **Modern CSS**: Uses latest CSS features

## 🔍 Debugging

### Check if Tailwind is working:
```jsx
<div className="bg-red-500 text-white p-4">
  If this is red with white text, Tailwind is working!
</div>
```

### Check custom colors:
```jsx
<div className="bg-primary text-white p-4">
  If this is blue (#1565C0), custom colors work!
</div>
```

### Inspect in DevTools:
1. Open browser DevTools (F12)
2. Inspect element
3. Check if Tailwind classes are applied
4. Look for CSS variables in Computed styles

## 📚 Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs)
- [Migration Guide](https://tailwindcss.com/docs/upgrade-guide)
- [PostCSS Plugin](https://github.com/tailwindlabs/tailwindcss-postcss)

## ✅ Verification Checklist

- [x] `@import "tailwindcss"` in index.css
- [x] `tailwind.config.js` removed
- [x] `postcss.config.cjs` updated
- [x] `@tailwindcss/postcss` installed
- [x] Custom colors defined as CSS variables
- [x] Custom utilities in `@layer utilities`
- [x] Custom components in `@layer components`
- [x] Dev server restarts successfully
- [x] No console errors
- [x] Styles render correctly

## 🎉 You're All Set!

Your project is now using Tailwind CSS v4 correctly. Run `npm run dev` to start developing!
