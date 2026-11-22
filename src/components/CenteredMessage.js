import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

// Full-screen loading spinner or message (splash while restoring the session,
// configuration errors, later also empty/error states).
export default function CenteredMessage({ loading = false, title, message }) {
  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {message && <Text style={styles.message}>{message}</Text>}
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
    backgroundColor: colors.background,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  message: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
});
