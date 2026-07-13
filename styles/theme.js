import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1B8F3A",
    },
    secondary: {
      main: "#F4B400",
    },
    background: {
      default: "#F5F7FA",
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
});

export default theme;
