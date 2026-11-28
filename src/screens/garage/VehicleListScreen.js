import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useLayoutEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

import CenteredMessage from '../../components/CenteredMessage';
import VehicleCard from '../../components/VehicleCard';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { listVehicles } from '../../services/vehicleService';

export default function VehicleListScreen({ navigation }) {
  const { user } = useAuth();
  const c = useThemeColors();

  const [vehicles, setVehicles] = useState(null); // null = not loaded yet, [] = loaded but empty
  const [loading, setLoading] = useState(true); // first load only → full-screen spinner
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh spinner
  const [error, setError] = useState(null);

  // No setLoading(true) in here: reloads (focus, pull-to-refresh) keep the list
  // on screen instead of swapping it for the full-screen spinner.
  // setError(null) only AFTER success: clearing it first would leave a render with
  // no error, no loading and vehicles === null → crash on vehicles.length.
  const load = useCallback(async () => {
    try {
      const data = await listVehicles(user.uid);
      setVehicles(data);
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid]);

  // The list stays mounted under the form, so useEffect wouldn't run again on goBack.
  // useFocusEffect does. The callback must not be async (it may only return a cleanup).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={() => navigation.navigate('VehicleForm')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Add vehicle"
        >
          <Ionicons name="add" size={26} color={c.primary} />
        </Pressable>
      ),
    });
  }, [navigation, c]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  // Nothing is on screen in the error state, so the full spinner is fine here.
  const retry = () => {
    setLoading(true);
    load();
  };

  if (loading) {
    return <CenteredMessage loading />;
  }

  if (error && !vehicles) {
    return (
      <CenteredMessage
        title="Couldn't load your garage"
        message="Check your internet connection and try again."
        actionLabel="Retry"
        onAction={retry}
      />
    );
  }

  return (
    <FlatList
      data={vehicles}
      keyExtractor={(v) => v.id}
      renderItem={({ item }) => (
        <VehicleCard
          vehicle={item}
          onPress={() => navigation.navigate('VehicleDetails', { vehicleId: item.id })}
        />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      style={{ backgroundColor: c.background }}
      // flexGrow lets the empty state fill the screen and still be pulled to refresh
      contentContainerStyle={[styles.content, vehicles.length === 0 && styles.emptyContent]}
      // A refresh failed but older data exists: keep the list and say so.
      ListHeaderComponent={
        error ? (
          <Text style={[styles.banner, { color: c.danger }]}>
            Couldn't refresh. Pull down to try again.
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <CenteredMessage
          title="No vehicles yet"
          message="Add your car to start tracking its service history."
          actionLabel="Add your first vehicle"
          onAction={() => navigation.navigate('VehicleForm')}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  emptyContent: { flexGrow: 1 },
  banner: { textAlign: 'center', fontSize: 14 },
});
