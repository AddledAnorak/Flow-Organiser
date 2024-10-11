/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/*.{js,tsx,ts,jsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'centered': '0 0 5px -3px rgb(0 0 0 / 0.1), 0 0 6px -4px rgb(0 0 0 / 0.1);',
      }
    },
  },
  plugins: [],
}

