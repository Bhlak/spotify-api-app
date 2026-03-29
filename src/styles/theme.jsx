export const theme = {
  colors: {
    primary: "#1DB954",
    primaryDark: "#1aa34a",
    primaryLight: "#1ed760",
    background: "#0f0f0f",
    surfaceLight: "#1a1a1a",
    surfaceMedium: "#282828",
    surfaceDark: "#121212",
    glass: "rgba(255, 255, 255, 0.08)",
    glassBorder: "rgba(255, 255, 255, 0.16)",
    text: "#ffffff",
    textSecondary: "#b3b3b3",
    textTertiary: "#7f7f7f",
    accent: "#1DB954",
    error: "#e74c3c",
    success: "#1DB954",
  },

  typography: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
      xs: "12px",
      sm: "14px",
      base: "16px",
      lg: "18px",
      xl: "20px",
      "2xl": "24px",
      "3xl": "32px",
      "4xl": "40px",
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    "2xl": "48px",
    "3xl": "64px",
  },

  borderRadius: {
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    full: "9999px",
  },

  shadows: {
    sm: "0 2px 8px rgba(0, 0, 0, 0.3)",
    md: "0 4px 16px rgba(0, 0, 0, 0.4)",
    lg: "0 8px 32px rgba(0, 0, 0, 0.5)",
    xl: "0 16px 64px rgba(0, 0, 0, 0.6)",
    glow: "0 0 20px rgba(29, 185, 84, 0.2)",
  },

  glassmorphism: {
    light: `
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.16);
    `,
    medium: `
      background: rgba(255, 255, 255, 0.12);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    `,
    dark: `
      background: rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    `,
  },

  transitions: {
    fast: "150ms ease-in-out",
    base: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },

  breakpoints: {
    mobile: "480px",
    tablet: "768px",
    desktop: "1024px",
    wide: "1440px",
  },
};
