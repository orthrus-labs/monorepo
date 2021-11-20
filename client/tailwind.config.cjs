const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {},
    height: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '600px',
     },
     margin: {
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '48px',
     }
  },

  plugins: [
    require('daisyui'),
  ],

  daisyui: {
    themes: [
      //'light'
      //'CMYK'
      //'cyberpunk'
      'wireframe'
    ]
  }
};

module.exports = config;
