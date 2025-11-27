/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#5bc5a7', // BillBuddy green-ish
                secondary: '#333333',
            }
        },
    },
    plugins: [],
}
