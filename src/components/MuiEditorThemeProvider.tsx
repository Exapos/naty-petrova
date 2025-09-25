import * as React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { csCZ } from "@mui/material/locale";

const theme = createTheme(
  {
    palette: {
      mode: "light",
      primary: { main: "#2563eb" },
      secondary: { main: "#f50057" },
      background: { default: "#f7f7fa", paper: "#fff" },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: 'Inter, "Public Sans", Arial, sans-serif',
      fontWeightRegular: 400,
      fontWeightMedium: 600,
      fontWeightBold: 700,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: 8, textTransform: "none" },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
    },
  },
  csCZ
);

export default function MuiEditorThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
