/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "variable-collection-color1": "var(--variable-collection-color1)",
        "variable-collection-color2": "var(--variable-collection-color2)",
        "variable-collection-color3": "var(--variable-collection-color3)",
        "variable-collection-color4": "var(--variable-collection-color4)",
        "variable-collection-color5": "var(--variable-collection-color5)",
        "variable-collection-color6": "var(--variable-collection-color6)",
        "variable-collection-color7": "var(--variable-collection-color7)",
        "variable-collection-color8": "var(--variable-collection-color8)",
      },
    },
  },
  plugins: [],
};
