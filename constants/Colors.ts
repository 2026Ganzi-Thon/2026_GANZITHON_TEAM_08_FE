/** Shared app palette. Use these tokens instead of inline color values. */
export const palette = {
  primary: '#9391EE',
  background: '#EFEFFB',
  white: '#FFFFFF',
  text: '#333333',
  textStrong: '#48465E',
  textHeading: '#55536F',
  textLabel: '#66638F',
  textMuted: '#808080',
  textSubtle: '#9491B2',
  textDivider: '#9693B2',
  textAgreement: '#807D99',
  textLink: '#88849F',
  placeholder: '#9B9AA8',
  divider: '#DAD9F2',
  kakaoBackground: '#FEE500',
  kakaoText: '#392020',
} as const;

const tintColorLight = palette.primary;
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
