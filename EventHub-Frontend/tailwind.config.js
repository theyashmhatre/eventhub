/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        gray: {
          550: "#EFEFEF",
          650: "#A9A9A9",
        },
        purple: {
          550: "#94618E",
        }
      }
    },
  },
  plugins: [],
}
