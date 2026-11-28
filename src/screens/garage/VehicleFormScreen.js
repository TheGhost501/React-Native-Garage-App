import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import AppButton from '../../components/AppButton';
import CenteredMessage from '../../components/CenteredMessage';
import FormField from '../../components/FormField';
import FormScreen from '../../components/FormScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createVehicle, getVehicle, updateVehicle } from '../../services/vehicleService';
import { FUEL_TYPES } from '../../utils/constants';
import {
  makeRules,
  mileageRules,
  modelRules,
  plateRules,
  yearRules,
} from '../../utils/validators';

// No params → add mode. route.params.vehicleId → edit mode (pre-filled, saves with updateVehicle).
export default function VehicleFormScreen({ navigation, route }) {
  const { user } = useAuth();
  const c = useThemeColors();

  const vehicleId = route.params?.vehicleId;
  const isEdit = Boolean(vehicleId);

  // Starts true in edit mode, so the empty form never flashes before the data arrives.
  const [loadingVehicle, setLoadingVehicle] = useState(isEdit);
  const [loadFailed, setLoadFailed] = useState(null); // 'notFound' | 'error' | null

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    // Everything is a string while editing (TextInput gives strings).
    // fuelType starts on a real option so the Picker and the form agree.
    defaultValues: {
      make: '',
      model: '',
      year: '',
      plate: '',
      currentMileage: '',
      fuelType: FUEL_TYPES[0],
    },
    mode: 'onTouched',
  });

  // Edit mode: load once. useEffect, not useFocusEffect: a refocus must not
  // wipe what the user has typed. defaultValues are only read on the first
  // render (before the data arrives), so the loaded values go in with reset().
  useEffect(() => {
    if (!isEdit) return;
    let active = true; // ignore a late answer if the user already left the screen

    const loadVehicle = async () => {
      try {
        const v = await getVehicle(user.uid, vehicleId);
        if (!active) return;
        if (!v) {
          setLoadFailed('notFound');
          return;
        }
        // Inputs need strings. Guards: a document edited by hand in the console
        // may miss a field or hold a fuel type the Picker doesn't have.
        reset({
          make: v.make ?? '',
          model: v.model ?? '',
          year: String(v.year ?? ''),
          plate: v.plate ?? '',
          currentMileage: String(v.currentMileage ?? ''),
          fuelType: FUEL_TYPES.includes(v.fuelType) ? v.fuelType : FUEL_TYPES[0],
        });
      } catch (e) {
        if (active) setLoadFailed('error');
      } finally {
        if (active) setLoadingVehicle(false);
      }
    };

    loadVehicle();
    return () => {
      active = false;
    };
  }, [isEdit, vehicleId, user.uid, reset]);

  // Convert here, not in the form: Firestore must get numbers, or sorting and
  // comparisons break. `await` keeps isSubmitting true → spinner + no double tap.
  // Both modes send exactly these six fields, never the loaded object, so id,
  // createdAt, photoUrl and the nextService* fields are never written back.
  const onSubmit = async (values) => {
    const data = {
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      plate: values.plate.trim().toUpperCase(),
      currentMileage: Number(values.currentMileage),
      fuelType: values.fuelType,
    };

    try {
      if (isEdit) {
        await updateVehicle(user.uid, vehicleId, data);
      } else {
        await createVehicle(user.uid, data);
      }
      navigation.goBack(); // pop the form so Back can't return to it
    } catch (e) {
      // Stay on the form so the user's input isn't lost.
      Alert.alert('Could not save', e.message);
    }
  };

  if (loadingVehicle) {
    return <CenteredMessage loading />;
  }

  if (loadFailed) {
    return (
      <CenteredMessage
        title={loadFailed === 'notFound' ? 'Vehicle not found' : "Couldn't load this vehicle"}
        message={
          loadFailed === 'notFound'
            ? 'It may have been deleted.'
            : 'Check your internet connection and try again.'
        }
        actionLabel="Go back"
        onAction={() => navigation.goBack()}
      />
    );
  }

  return (
    <FormScreen>
      <Controller
        control={control}
        name="make"
        rules={makeRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Make"
            placeholder="e.g. Toyota"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.make?.message}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('model')}
          />
        )}
      />

      <Controller
        control={control}
        name="model"
        rules={modelRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Model"
            placeholder="e.g. Corolla"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.model?.message}
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('year')}
          />
        )}
      />

      <Controller
        control={control}
        name="year"
        rules={yearRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Year"
            placeholder="e.g. 2018"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.year?.message}
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('plate')}
          />
        )}
      />

      <Controller
        control={control}
        name="plate"
        rules={plateRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Licence plate"
            placeholder="e.g. CA 1234 AB"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.plate?.message}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => setFocus('currentMileage')}
          />
        )}
      />

      <Controller
        control={control}
        name="currentMileage"
        rules={mileageRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Current mileage (km)"
            placeholder="e.g. 120000"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.currentMileage?.message}
            keyboardType="number-pad"
            returnKeyType="done"
          />
        )}
      />

      {/* Non-text input #1. Picker has no label or border on Android, so wrap it to match FormField. */}
      <View style={styles.field}>
        <Text style={[styles.label, { color: c.text }]}>Fuel type</Text>
        <View style={[styles.pickerBox, { backgroundColor: c.surface, borderColor: c.border }]}>
          <Controller
            control={control}
            name="fuelType"
            render={({ field: { value, onChange } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={{ color: c.text }}
                dropdownIconColor={c.text}
                accessibilityLabel="Fuel type"
              >
                {FUEL_TYPES.map((f) => (
                  <Picker.Item key={f} label={f} value={f} />
                ))}
              </Picker>
            )}
          />
        </View>
      </View>

      <AppButton
        title={isEdit ? 'Save changes' : 'Save vehicle'}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
      />
    </FormScreen>
  );
}

// Same label and box look as FormField.
const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  pickerBox: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
});
