import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useThemeColors } from '../hooks/useThemeColors';

// Wrapper for every form screen: keeps the focused field above the keyboard
// and the last button above the system navigation bar.
// Must be rendered inside a navigator screen (useHeaderHeight needs one).
export default function FormScreen({ children, contentContainerStyle }) {
  const c = useThemeColors();
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: c.background }]}
      // 'padding' on both platforms: with Android edge-to-edge (forced since
      // SDK 54) and in Expo Go, "resize" doesn't shrink the window, so we pad
      // ourselves. If the window does resize, the overlap is 0 and no padding
      // is added, so there's no double gap.
      behavior="padding"
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        style={styles.flex}
        // Without this, the first tap on a button only closes the keyboard.
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 16 + insets.bottom },
          contentContainerStyle,
        ]}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, padding: 16, gap: 12 },
});
