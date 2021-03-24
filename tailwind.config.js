// See default config https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    extend: {
      width: {
        '28': '8rem'
      },
      height: {
        'shop-banner': "450px"
      },
      colors: {
        'smoke-darkest': 'rgba(0, 0, 0, 0.9)',
        'smoke-darker': 'rgba(0, 0, 0, 0.75)',
        'smoke-dark': 'rgba(0, 0, 0, 0.6)',
        'smoke': 'rgba(0, 0, 0, 0.5)',
        'smoke-light': 'rgba(0, 0, 0, 0.4)',
        'smoke-lighter': 'rgba(0, 0, 0, 0.25)',
        'smoke-lightest': 'rgba(0, 0, 0, 0.1)',
        primary: {
          default: '#E1274E',
          lighter: '#ff446b'
        }
      },
      inset: {
        full: '100%'
      },
      maxWidth: {
        '1/5': '20%'
      },
      zIndex: {
        '11': 11,
        '50': 50,
        '60': 60,
        '70': 70,
        '100': 100,
        'topmost': 99999,
        'topmost-2': 999999,
      },
      minHeight: {
        'area-loader': '370px'
      }
    }
  },
  variants: {}
}