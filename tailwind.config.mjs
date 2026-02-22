import path from 'path'

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    path.join(process.cwd(), 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(process.cwd(), 'app/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(process.cwd(), 'pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(process.cwd(), 'components/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

export default config
