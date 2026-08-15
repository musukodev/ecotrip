import { TextStyle } from 'react-native';

export const Colors = {
  primary: '#0D2B22',
  primaryDark: '#071D17',
  accent: '#1C4A3E',

  green: '#2d6a4f',
  greenLight: '#40916c',
  greenSoft: '#74c69d',
  greenPale: '#b7e4c7',

  ocean: '#0077b6',
  oceanLight: '#48cae4',
  coral: '#e76f51',
  coralLight: '#f4a261',

  sun: '#F5A623',
  danger: '#e63946',

  background: '#F4F7F4',
  card: '#FFFFFF',
  tabBackground: '#E4EBE3',
  textPrimary: '#0D2B22',
  textSecondary: '#4B5563',
  textMuted: '#8C98A4',
  placeholder: '#A0AEC0',
  border: '#E2E8F0',
  divider: '#E2E8F0',
  white: '#FFFFFF',
  disabled: '#0D2B2280',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const font: Record<string, TextStyle> = {
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
  },
};
