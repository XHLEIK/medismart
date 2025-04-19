/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0284c7", // More vibrant blue
        secondary: "#334155", // Slate gray that complements well
        accent: "#2563eb", // Brighter blue accent
        neutral: "#f8fafc", // Lighter, cleaner background
        "base-100": "#ffffff",
        info: "#38bdf8", // Light blue for informational content
        success: "#10b981", // Emerald green for success messages
        warning: "#f59e0b", // Amber for warnings
        error: "#ef4444", // Red for errors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideIn': 'slideIn 0.3s ease-out',
        'slideInRight': 'slideInRight 0.3s ease-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        medismart: {
          primary: "#0284c7",
          secondary: "#334155",
          accent: "#2563eb",
          neutral: "#f8fafc",
          "base-100": "#ffffff",
        },
      },
    ],
  },
} 