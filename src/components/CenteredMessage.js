import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';
import AppButton from './AppButton';

// Full-screen loading spinner or message (splash while restoring the session,
// configuration errors, empty/error states). Pass actionLabel + onAction to
// show a button, e.g. "Retry" or "Add your first vehicle".
export default function CenteredMessage({ loading = false, title, message, actionLabel, onAction }) {
  const c = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      {loading && <ActivityIndicator size="large" color={c.primary} />}
      {title && <Text style={[styles.title, { color: c.text }]}>{title}</Text>}
      {message && <Text style={[styles.message, { color: c.textMuted }]}>{message}</Text>}
      {actionLabel && onAction && (
        <View style={styles.action}>
          <AppButton title={actionLabel} onPress={onAction} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  message: { fontSize: 15, textAlign: 'center' },
  action: { alignSelf: 'stretch', marginTop: 8 },
});
