/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#B11226",
                primaryHover: "#E50914",
                primaryActive: "#8C0F1E",
                darkBg: "#0A0A0A",
                secondaryBg: "#121212",
                cardBg: "#1C1C1C",
                textPrimary: "#FFFFFF",
                textSecondary: "#B3B3B3",
                textMuted: "#6B7280",
                seatAvailable: "#374151",
                seatSelected: "#E50914",
                seatBooked: "#1F2937",
                success: "#22C55E"
            },
            fontFamily: {
                bebas: ['"Bebas Neue"', 'cursive'],
                inter: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
