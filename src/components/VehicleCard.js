import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../hooks/useThemeColors';

// One vehicle in the Garage list. Photo comes in Phase 7 (placeholder icon until then),
// the status badge in Phase 10 (see the marked spot below).
export default function VehicleCard({ vehicle, onPress }) {
  const c = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: c.surface, borderColor: c.border },
        pressed && styles.pressed,
      ]}
    >
      {vehicle.photoUrl ? (
        <Image source={{ uri: vehicle.photoUrl }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.placeholder, { backgroundColor: c.background }]}>
          <Ionicons name="car-sport" size={32} color={c.textMuted} />
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.title, { color: c.text }]} numberOfLines={1}>
          {vehicle.make} {vehicle.model} ({vehicle.year})
        </Text>
        <Text style={[styles.detail, { color: c.textMuted }]}>{vehicle.plate}</Text>
        <Text style={[styles.detail, { color: c.textMuted }]}>
          {/* Guard: a document edited by hand may lack the field; don't crash the whole list */}
          {typeof vehicle.currentMileage === 'number'
            ? `${vehicle.currentMileage.toLocaleString()} km`
            : 'Mileage not set'}
        </Text>
        {/* Phase 10: status badge (OK / Due soon / Overdue) goes here */}
      </View>

      <Ionicons name="chevron-forward" size={20} color={c.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  pressed: { opacity: 0.7 },
  photo: { width: 64, height: 64, borderRadius: 8 },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: '700' },
  detail: { fontSize: 14 },
});
