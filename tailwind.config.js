/** @type {import('tailwindcss').Config} */

// import withMT from "@material-tailwind/react/utils/withMT";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("@tailwindcss/forms")],
};
