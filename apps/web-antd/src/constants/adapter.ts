import { createTheme } from '@mui/material';

// const themeConfig = {};

// const convertedTheme = convertThemeColorsToHex(themeConfig);
export const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 'calc(var(--radius) - 4px)',
            '& fieldset': {
              borderColor: 'hsl(var(--border))', // 设置输入框边框颜色
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 'calc(var(--radius) - 4px)', // 设置按钮的圆角
        },
      },
    },
  },
  palette: {
    common: {
      black: 'hsl(var(--foreground))',
      white: 'hsl(var(--background))',
    },
    primary: {
      main: 'hsl(var(--primary))',
      light: 'hsl(var(--primary) / 0.8)',
      dark: 'hsl(var(--primary) / 1.2)',
      contrastText: 'hsl(var(--primary-foreground))',
    },
    secondary: {
      main: 'hsl(var(--secondary))',
      light: 'hsl(var(--secondary) / 0.8)',
      dark: 'hsl(var(--secondary) / 1.2)',
      contrastText: 'hsl(var(--secondary-foreground))',
    },
    error: {
      main: 'hsl(var(--destructive))',
      light: 'hsl(var(--destructive) / 0.8)',
      dark: 'hsl(var(--destructive) / 1.2)',
      contrastText: 'hsl(var(--destructive-foreground))',
    },
    warning: {
      main: 'hsl(var(--warning))',
      light: 'hsl(var(--warning) / 0.8)',
      dark: 'hsl(var(--warning) / 1.2)',
      contrastText: 'hsl(var(--warning-foreground))',
    },
    info: {
      main: 'hsl(var(--info))',
      light: 'hsl(var(--info) / 0.8)',
      dark: 'hsl(var(--info) / 1.2)',
      contrastText: 'hsl(var(--info-foreground))',
    },
    success: {
      main: 'hsl(var(--success))',
      light: 'hsl(var(--success) / 0.8)',
      dark: 'hsl(var(--success) / 1.2)',
      contrastText: 'hsl(var(--success-foreground))',
    },
    text: {
      primary: 'hsl(var(--foreground))',
      secondary: 'hsl(var(--muted-foreground))',
      disabled: 'hsl(var(--muted-foreground) / 0.5)',
    },
    background: {
      paper: 'hsl(var(--card))',
      default: 'hsl(var(--background))',
    },
    divider: 'hsl(var(--border))',
    action: {
      active: 'hsl(var(--foreground) / 0.54)',
      hover: 'hsl(var(--accent-hover))',
      hoverOpacity: 0.04,
      selected: 'hsl(var(--accent))',
      selectedOpacity: 0.08,
      disabled: 'hsl(var(--muted-foreground) / 0.26)',
      disabledBackground: 'hsl(var(--muted) / 0.12)',
      disabledOpacity: 0.38,
      focus: 'hsl(var(--ring) / 0.12)',
      focusOpacity: 0.12,
      activatedOpacity: 0.12,
    },
  },
});
