/** @type {import('tailwindcss').Config} */
module.exports = {
  // The theme switcher toggles .dark on <html>.
  darkMode: 'class',
  // Classes are also built as strings inside the JS modules, so scan them too.
  content: ['./public/index.html', './public/js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        // Georgia (Tailwind's default serif) has no Vietnamese glyphs and breaks diacritics.
        serif: ['"Playfair Display"', '"Noto Serif SC"', 'serif']
      },
      colors: {
        cinnabar: {
          50: '#fdf3f3', 100: '#fbe4e4', 200: '#f7cece', 300: '#f0abab', 400: '#e57a7a',
          500: '#d54d4d', 600: '#b83232', 700: '#9b2626', 800: '#8b1e1e', 900: '#6e1414'
        },
        orientalgold: {
          50: '#fdfbf7', 100: '#faf5eb', 200: '#f4ebd3', 300: '#ecd9af', 400: '#dfbe76',
          500: '#c59a3f', 600: '#aa7e2e', 700: '#8e6323', 800: '#754f21', 900: '#61401e'
        },
        orientaljade: {
          50: '#f2f8f6', 100: '#e1efe9', 200: '#c4ded5', 300: '#9bc5b8', 400: '#6ea697',
          500: '#4d897b', 600: '#396d62', 700: '#2d574f', 800: '#264640', 900: '#1e4d43'
        }
      }
    }
  }
};
