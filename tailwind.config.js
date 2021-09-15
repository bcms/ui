module.exports = {
  purge: [
    './index.html',
    './public/**/*.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  mode: 'jit',
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      green: ({ opacityValue }) => {
        return `rgba(36, 150, 129, ${opacityValue})`;
      },
      pink: ({ opacityValue }) => {
        return `rgba(236, 173, 169, ${opacityValue})`;
      },
      yellow: ({ opacityValue }) => {
        return `rgba(255, 205, 25, ${opacityValue})`;
      },
      red: ({ opacityValue }) => {
        return `rgba(245, 107, 88, ${opacityValue})`;
      },
      dark: ({ opacityValue }) => {
        return `rgba(19, 20, 26, ${opacityValue})`;
      },
      grey: ({ opacityValue }) => {
        return `rgba(151, 152, 171, ${opacityValue})`;
      },
      white: ({ opacityValue }) => {
        return `rgba(252, 252, 252, ${opacityValue})`;
      },
      inherit: 'inherit',
      initial: 'initial',
    },
    extend: {
      spacing: {
        1.25: '0.3125rem',
        4.5: '1.125rem',
        7.5: '1.875rem',
        15: '3.75rem',
        21.5: '5.375rem',
      },
      lineHeight: {
        1.07: '1.07em',
      },
      letterSpacing: {
        '-0.01': '-0.01em',
        '-0.03': '-0.03em',
        0.06: '0.06em',
      },
      borderRadius: {
        2.5: '0.625rem',
        3.5: '0.875rem',
        4.5: '1.125rem',
      },
      fontSize: {
        7: '1.75rem',
        9.5: '2.375rem',
        12.5: '3.125rem',
      },
      maxWidth: {
        150: '37.5rem',
      },
      boxShadow: {
        cardLg: '0px 0px 24px rgba(46, 46, 46, 0.12)',
        input: '0px 2px 10px rgba(151, 152, 171, 0.25)',
      },
      fontFamily: {
        bcmsFont: ['Hergon Grotesk', 'sans-serif'],
      },
      zIndex: {
        100: '100',
        200: '200',
      },
      screens: {
        xs: '500px',
        desktop: '900px',
      },
    },
  },
};
