import { colors } from '../theme/colors';

// Single source of colors for components. Phase 11 switches this to
// light/dark based on useColorScheme(); components don't change.
export function useThemeColors() {
  return colors;
}
