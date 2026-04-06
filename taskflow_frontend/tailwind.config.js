/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Legacy aliases — kept so no existing class breaks, updated to new palette
        primary:   '#00478d',
        secondary: '#515f74',
        danger:    '#ba1a1a',
        success:   '#005237',
        warning:   '#b9c7df',

        // Material Design 3 tokens
        'on-primary':               '#ffffff',
        'primary-container':        '#005eb8',
        'on-primary-container':     '#c8daff',
        'primary-fixed':            '#d6e3ff',
        'primary-fixed-dim':        '#a9c7ff',
        'on-primary-fixed':         '#001b3d',
        'on-primary-fixed-variant': '#00468c',
        'inverse-primary':          '#a9c7ff',
        'surface-tint':             '#005db6',

        'secondary-container':          '#d5e3fc',
        'on-secondary':                 '#ffffff',
        'on-secondary-container':       '#57657a',
        'secondary-fixed':              '#d5e3fc',
        'secondary-fixed-dim':          '#b9c7df',
        'on-secondary-fixed':           '#0d1c2e',
        'on-secondary-fixed-variant':   '#3a485b',

        'tertiary':                   '#005237',
        'on-tertiary':                '#ffffff',
        'tertiary-container':         '#006d4a',
        'on-tertiary-container':      '#65f2b5',
        'tertiary-fixed':             '#6ffbbe',
        'tertiary-fixed-dim':         '#4edea3',
        'on-tertiary-fixed':          '#002113',
        'on-tertiary-fixed-variant':  '#005236',

        'error':              '#ba1a1a',
        'on-error':           '#ffffff',
        'error-container':    '#ffdad6',
        'on-error-container': '#93000a',

        'surface':                    '#faf8ff',
        'surface-dim':                '#d2d9f4',
        'surface-bright':             '#faf8ff',
        'surface-container-lowest':   '#ffffff',
        'surface-container-low':      '#f2f3ff',
        'surface-container':          '#eaedff',
        'surface-container-high':     '#e2e7ff',
        'surface-container-highest':  '#dae2fd',
        'surface-variant':            '#dae2fd',
        'on-surface':                 '#131b2e',
        'on-surface-variant':         '#424752',
        'inverse-surface':            '#283044',
        'inverse-on-surface':         '#eef0ff',

        'outline':          '#727783',
        'outline-variant':  '#c2c6d4',
        'background':       '#faf8ff',
        'on-background':    '#131b2e',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg:   '0.5rem',
        xl:   '0.75rem',
        '2xl':'1rem',
        full: '9999px',
      },
      fontFamily: {
        sans:     ['Inter', 'sans-serif'],
        headline: ['Inter', 'sans-serif'],
        body:     ['Inter', 'sans-serif'],
        label:    ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.25s ease-out both',
        'fade-in':    'fadeIn 0.15s ease-out both',
        'scale-in':   'scaleIn 0.2s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
