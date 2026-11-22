import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

// Temporary scaffold screen: shows its name, the route params it received,
// and buttons for navigating onward. Replaced by real UI during implementation.
export default function PlaceholderScreen({ title, params, actions = [] }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.todo}>Placeholder: not implemented yet</Text>

      {params && Object.keys(params).length > 0 && (
        <View style={styles.params}>
          <Text style={styles.paramsLabel}>Route params</Text>
          <Text style={styles.paramsValue}>{JSON.stringify(params, null, 2)}</Text>
        </View>
      )}

      {actions.map((action) => (
        <Pressable
          key={action.label}
          onPress={action.onPress}
          style={({ pressed }) => [styles.button, action.danger && styles.danger, pressed && styles.pressed]}
        >
          <Text style={styles.buttonText}>{action.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, gap: 12, backgroundColor: colors.background },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  todo: { color: colors.textMuted, marginBottom: 8 },
  params: { padding: 12, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  paramsLabel: { fontWeight: '600', color: colors.textMuted, marginBottom: 4 },
  paramsValue: { fontFamily: 'monospace', color: colors.text },
  button: { padding: 14, borderRadius: 8, backgroundColor: colors.primary, alignItems: 'center' },
  danger: { backgroundColor: colors.danger },
  pressed: { opacity: 0.8 },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
