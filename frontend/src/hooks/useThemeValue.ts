import { useTheme } from 'next-themes';

/**
 * A replacement for Chakra UI's useColorModeValue hook
 * This hook returns a value based on the current theme (light or dark)
 * 
 * @param lightValue The value to use in light mode
 * @param darkValue The value to use in dark mode
 * @returns The appropriate value based on the current theme
 */
export function useThemeValue<T>(lightValue: T, darkValue: T): T {
  const { resolvedTheme } = useTheme();
  return resolvedTheme === 'dark' ? darkValue : lightValue;
}
