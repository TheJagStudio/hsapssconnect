/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f5f7fa",
                    100: "#eaeff4",
                    200: "#d0dce7",
                    300: "#a8bfd1",
                    400: "#789cb8",
                    500: "#5780a0",
                    600: "#446785",
                    700: "#38546c",
                    800: "#31475b",
                    900: "#2d3d4d",
                    950: "#1e2833",
                },
                secondary: {
                    50: "#fff5ed",
                    100: "#ffe9d4",
                    200: "#ffcfa9",
                    300: "#ffa563",
                    400: "#fe8139",
                    500: "#fc5e13",
                    600: "#ed4309",
                    700: "#c52f09",
                    800: "#9c2710",
                    900: "#7e2210",
                    950: "#440f06",
                },
                background: "#fff8dc",
            },
            fontFamily: {
                haspss: ["hsapss", "sans-serif"],
                ShreeHindi: ["ShreeHindi", "sans-serif"],
            },
        },
    },
    plugins: [],
};
