import { createMuiTheme } from "@material-ui/core/styles";

const fontFamily = [
  '"Segoe UI"',
  "SegoeUI",
  '"Microsoft JhengHei"',
  "微軟正黑體",
  '"SF Pro TC"',
  '"SF Pro Display"',
  '"SF Pro Icons"',
  '"PingFang TC"',
  '"Helvetica Neue"',
  '"Helvetica"',
  '"Arial"',
  "sans-serif",
].join(",");

const theme = createMuiTheme({
  typography: {
    fontFamily,
  }
});

export default theme;
