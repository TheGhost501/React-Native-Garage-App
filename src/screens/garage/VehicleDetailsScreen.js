import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import AppButton from '../../components/AppButton';
import CenteredMessage from '../../components/CenteredMessage';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { deleteVehicle, getVehicle } from '../../services/vehicleService';

export default function VehicleDetailsScreen({ navigation, route }) {
  const { vehicleId } = route.params;
  const { user } = useAuth();
  const c = useThemeColors();

  const [vehicle, setVehicle] = useState(null); // null = not loaded yet OR not found; `loading` tells them apart
  const [loading, setLoading] = useState(true); // first load only → full-screen spinner
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh spinner
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Same reload pattern as the list. getVehicle returns null when the doc is gone,
  // so a refresh after a console delete lands on "Vehicle not found".
  const load = useCallback(async () => {
    try {
      const data = await getVehicle(user.uid, vehicleId);
      setVehicle(data);
      setError(null); // only after success (see the list screen)
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid, vehicleId]);

  // Reloads when coming back from the edit form.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Header shows which car this is; falls back to the stack's "Vehicle".
  useLayoutEffect(() => {
    if (vehicle) {
      navigation.setOptions({ title: `${vehicle.make} ${vehicle.model}` });
    }
  }, [navigation, vehicle]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const retry = () => {
    setLoading(true);
    load();
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVehicle(user.uid, vehicleId);
      navigation.popToTop(); // to the list, never back to a details screen for a deleted car
    } catch (e) {
      setDeleting(false); // only on failure: on success this screen is gone
      Alert.alert('Could not delete', e.message);
    }
  };

  const confirmDelete = () =>
    Alert.alert('Delete vehicle?', 'This also deletes its service history.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: handleDelete },
    ]);

  if (loading) {
    return <CenteredMessage loading />;
  }

  if (error && !vehicle) {
    return (
      <CenteredMessage
        title="Couldn't load this vehicle"
        message="Check your internet connection and try again."
        actionLabel="Retry"
        onAction={retry}
      />
    );
  }

  if (!vehicle) {
    return (
      <CenteredMessage
        title="Vehicle not found"
        message="It may have been deleted."
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  const rows = [
    ['Year', vehicle.year],
    ['Licence plate', vehicle.plate],
    ['Fuel type', vehicle.fuelType],
    [
      'Mileage',
      // Guard: a document edited by hand may lack the field
      typeof vehicle.currentMileage === 'number'
        ? `${vehicle.currentMileage.toLocaleString()} km`
        : 'Not set',
    ],
  ];

  return (
    <ScrollView
      style={{ backgroundColor: c.background }}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[c.primary]} tintColor={c.primary} />
      }
    >
      {/* A refresh failed but the vehicle is still on screen: keep it and say so. */}
      {error && (
        <Text style={[styles.banner, { color: c.danger }]}>Couldn't refresh. Pull down to try again.</Text>
      )}

      {/* Phase 7: the photo + "Change photo" go here */}
      {vehicle.photoUrl ? (
        <Image source={{ uri: vehicle.photoUrl }} style={styles.photo} />
      ) : (
        <View style={[styles.photo, styles.placeholder, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Ionicons name="car-sport" size={64} color={c.textMuted} />
        </View>
      )}

      <Text style={[styles.title, { color: c.text }]}>
        {vehicle.make} {vehicle.model}
      </Text>

      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }]}>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={[styles.label, { color: c.textMuted }]}>{label}</Text>
            <Text style={[styles.value, { color: c.text }]}>{value ?? '—'}</Text>
          </View>
        ))}
      </View>

      {/* Phase 9: the service records list goes here */}

      <View style={styles.actions}>
        <AppButton
          title="Add service record"
          onPress={() => navigation.navigate('RecordForm', { vehicleId })}
        />
        <AppButton
          title="Edit vehicle"
          variant="secondary"
          onPress={() => navigation.navigate('VehicleForm', { vehicleId })}
        />
        <AppButton title="Delete vehicle" variant="danger" onPress={confirmDelete} loading={deleting} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 16 },
  banner: { textAlign: 'center', fontSize: 14 },
  photo: { width: '100%', height: 200, borderRadius: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  title: { fontSize: 22, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, gap: 12 },
  label: { fontSize: 15 },
  value: { fontSize: 15, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  actions: { gap: 12 },
});
