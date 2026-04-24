/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gonexi: {
          primary: '#6366f1',      // Indigo - modern and trustworthy
          secondary: '#f59e0b',    // Amber - energetic and fast
          accent: '#ec4899',       // Pink - vibrant and modern
          light: '#f8fafc',        // Light gray
          dark: '#1e293b',         // Dark slate
          success: '#10b981',      // Emerald green
          warning: '#f59e0b',      // Amber
          error: '#ef4444',        // Red
          neutral: '#64748b',       // Slate gray
          gradient: {
            from: '#6366f1',
            to: '#ec4899'
          }
        }
      },
      fontFamily: {
        'gonexi': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'gonexi': '0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)',
        'gonexi-lg': '0 10px 15px -3px rgba(99, 102, 241, 0.1), 0 4px 6px -2px rgba(99, 102, 241, 0.05)',
      },
      backgroundImage: {
        'gonexi-gradient': 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
        'gonexi-gradient-light': 'linear-gradient(135deg, #f0f9ff 0%, #fdf2f8 100%)',
      }
    },
  },
  plugins: [],
}

