import "../styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2E7D32",
    },
    secondary: {
      main: "#F9A825",
    },
    background: {
      default: "#F4F7F6",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
