import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
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
      // iOS doesn't resize the window for the keyboard, so pad the content.
      // Android resizes it itself (app.json: softwareKeyboardLayoutMode "resize").
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
