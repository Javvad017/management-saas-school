# Fix Tailwind CSS PostCSS Error

## The Problem
You're getting an error because Tailwind CSS v4 changed how it works with PostCSS. However, the easiest solution is to use Tailwind v3 which is stable and works perfectly.

## Solution Steps

### Step 1: Close All Running Processes
**IMPORTANT:** Close any running dev servers or Electron processes first!
- Press `Ctrl+C` in any terminal running `npm run dev`
- Close any Electron windows that are open
- Wait a few seconds for processes to fully terminate

### Step 2: Install Dependencies
Run this command:
```bash
npm install
```

If you still get the EBUSY error, restart your computer and try again.

### Step 3: Verify the Files Were Updated

The following files have already been updated for you:

#### `postcss.config.js` (Updated ✓)
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### `tailwind.config.js` (Updated ✓)
```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
      },
    },
  },
  plugins: [],
}
```

#### `package.json` (Updated ✓)
The devDependencies section now has:
- `vite: ^5.4.11` (downgraded from v6 for compatibility)
- Removed `electron-vite` (not needed)
- Kept `tailwindcss: ^3.4.17`

### Step 4: Run the App
After npm install completes successfully:
```bash
npm run dev
```

## Alternative: If You Want Tailwind v4

If you really want to use Tailwind v4 (not recommended for now), follow these steps:

### 1. Close all processes (same as above)

### 2. Install the new package
```bash
npm install @tailwindcss/postcss --legacy-peer-deps
```

### 3. Update `postcss.config.js`
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### 4. Update `src/index.css`
```css
@import "tailwindcss";
```

### 5. Remove `tailwind.config.js`
Tailwind v4 uses CSS-based configuration instead.

## Troubleshooting

### Error: EBUSY or file locked
- Close ALL terminals and Electron windows
- Restart VS Code or your IDE
- If still failing, restart your computer

### Error: Module not found
- Delete `node_modules` folder (after closing all processes)
- Delete `package-lock.json`
- Run `npm install` again

### Tailwind styles not working
- Make sure `src/index.css` is imported in `src/main.jsx`
- Check browser console for errors
- Try clearing browser cache (Ctrl+Shift+R)
