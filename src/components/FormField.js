import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

// Label + TextInput + error text. Every other prop (value, onChangeText,
// keyboardType, secureTextEntry...) goes straight to the TextInput.
// `error` is a plain string (e.g. errors.email?.message), so this component
// doesn't depend on React Hook Form. React 19: `ref` is a normal prop.
export default function FormField({ label, error, style, ref, ...inputProps }) {
  const c = useThemeColors();

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: c.text }]}>{label}</Text>}
      <TextInput
        ref={ref}
        placeholderTextColor={c.textMuted}
        {...inputProps}
        style={[
          styles.input,
          {
            backgroundColor: c.surface,
            color: c.text,
            borderColor: error ? c.danger : c.border,
          },
          style,
        ]}
      />
      {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  error: { fontSize: 13 },
});
