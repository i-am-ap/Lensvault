/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#050816",
        ink: "#e5eef8",
        muted: "#8ea2c0",
        line: "rgba(148, 163, 184, 0.16)"
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ['"Manrope"', "sans-serif"]
      },
      boxShadow: {
        glow: "0 24px 80px rgba(34, 211, 238, 0.18)",
        panel: "0 25px 80px rgba(5, 8, 22, 0.45)"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.8s linear infinite",
        "fade-up": "fade-up 0.7s ease both"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
