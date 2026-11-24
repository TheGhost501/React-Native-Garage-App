import { ActivityIndicator, Keyboard, Pressable, StyleSheet, Text } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

// Shared button. While `loading` it shows a spinner and ignores presses,
// so a form can't be submitted twice.
export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}) {
  const c = useThemeColors();
  const isDisabled = disabled || loading;

  const palette = {
    primary: { bg: c.primary, fg: '#FFFFFF', border: c.primary },
    danger: { bg: c.danger, fg: '#FFFFFF', border: c.danger },
    secondary: { bg: c.surface, fg: c.primary, border: c.border },
  }[variant] ?? { bg: c.primary, fg: '#FFFFFF', border: c.primary };

  // FormScreen uses keyboardShouldPersistTaps="handled", so the tap reaches
  // the button but the keyboard stays open. Close it here for every button.
  const handlePress = (event) => {
    Keyboard.dismiss();
    onPress?.(event);
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: palette.bg, borderColor: palette.border },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <Text style={[styles.title, { color: palette.fg }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
});
