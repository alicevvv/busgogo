module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {
        screens: {
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
        },
        colors:{
            primary:'#343E4B',
            secondary:'#999FA5',
            warning:'#E2A12E',
            light:'#FBFBF8',
        }
      },
    },
    plugins: [],
  }