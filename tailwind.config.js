const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blueGray: colors.slate,
        coolGray: colors.gray,
        gray: colors.zinc,
        trueGray: colors.neutral,
        warmGray: colors.stone,
        orange: colors.orange,
        yellow: colors.amber,
        lime: colors.lime,
        teal: colors.teal,
        cyan: colors.cyan,
        sky: colors.sky,
        purple: colors.violet,
        fuchsia: colors.fuchsia,
        pink: colors.pink,
        rose: colors.rose
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography')
  ],
}
