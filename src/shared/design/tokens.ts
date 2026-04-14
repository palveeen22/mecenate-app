export const Colors = {
  background: '#FFFFFF',
  surface: '#FAFAFA',
  surfaceElevated: '#F0F0F0',
  surfaceBorder: '#E8E8E8',
  surfaceSubtle: '#F5F8FD',
  border: '#E8ECEF',

  primary: '#6115CD', //deafult
  primaryElevated: '#4E11A4', //hover
  primaryDark: '#3A0D7B', // pressed
  primaryDim: '#D5C9FF', // disable 

  icon: '#57626F',
  iconLight: '#A4AAB0',


  text: '#111416',
  textSecondary: '#5A5A5A',
  textMuted: '#999999',

  like: '#FF2B75',
  likeElevated: '#EA276B',
  likeDark: '#DE2465',
  likeLight: '#FFBAD2',

  actionDefault: '#EFF2F7', //deafult
  actionHover: '#DDDDDD', // hover
  actionPressed: '#D4D4D4', //pressed
  actionDisabled: '#FFFFFF', //disable


  error: '#EF4444',
  errorDim: 'rgba(239, 68, 68, 0.12)',

  inputHover: '#E6E9EF',


  white: '#FFFFFF',
  black: '#000000',
  grey: '#F3F3F3',
  transparent: 'transparent',

  skeleton: 'rgba(238, 239, 241, 0.8)'
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const Typography = {
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
