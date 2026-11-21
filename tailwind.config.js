/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // JJ Nutrition White & Rich Brand Blue Direction (#044AA3)
        white: '#FFFFFF',
        surface: {
          light: '#F4F8FC',     // Secondary background
          pale: '#E6EEF8',      // Light blue surface
          decorative: '#D0E0F2',// Light blue decorative
        },
        accent: {
          DEFAULT: '#044AA3', // Primary brand blue: Rich clinical blue (#044AA3)
          sky: '#044AA3',
          strong: '#033B85',  // Strong / Hover accent: Rich deeper blue (#033B85)
          dark: '#022B60',    // Active accent (#022B60)
          light: '#E6EEF8',   // Light blue surface tint
          decorative: '#D0E0F2',// Subtle decorative accent
          border: '#CDE0F3',  // Restrained blue-tinted border
        },
        navy: {
          DEFAULT: '#111827', // Primary typography: Near-black (#111827)
          dark: '#0B192C',
          card: '#152C48',
        },
        slate: {
          DEFAULT: '#333333', // Secondary content & descriptions (#333333)
          body: '#1A1A1A',    // Body content: Dark black (#1A1A1A)
          subtle: '#555555',  // Metadata & less prominent labels (#555555)
          light: '#555555',
        },
        border: {
          blue: '#CDE0F3',    // Borders
          DEFAULT: '#CDE0F3',
        },

        // Mapped legacy tokens for full-site consistency
        cream: {
          DEFAULT: '#FFFFFF', // Pure white dominant
          light: '#FFFFFF',
          dark: '#F4F8FC',    // Very light blue secondary
        },
        dark: {
          DEFAULT: '#111827', // Near-black replacing old navy/brown
          pure: '#0B192C',
          surface: '#12253E',
          card: '#172E4C',
        },
        muted: {
          DEFAULT: '#555555', // Metadata (#555555)
          light: '#333333',   // Secondary content (#333333)
          dark: '#555555',
        }
      },
      fontFamily: {
        heading: ['"playfair-a"', '"Playfair Display"', 'Georgia', 'serif'],
        subheading: ['Inter', 'system-ui', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['"playfair-a"', '"Playfair Display"', 'Georgia', 'serif'],
        serif: ['"playfair-a"', '"Playfair Display"', '"Abhaya Libre"', 'Georgia', 'serif'],
        script: ['Praise', '"Alex Brush"', 'cursive'],
        sans: ['"Clash Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.15em',
        tightest: '-0.03em',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
