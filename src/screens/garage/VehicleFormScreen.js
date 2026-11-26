import { Picker } from '@react-native-picker/picker';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';
import FormScreen from '../../components/FormScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { createVehicle } from '../../services/vehicleService';
import { FUEL_TYPES } from '../../utils/constants';
import {
  makeRules,
  mileageRules,
  modelRules,
  plateRules,
  yearRules,
} from '../../utils/validators';

// Add mode for now (no params). Phase 6 adds edit mode via route.params.vehicleId.
export default function VehicleFormScreen({ navigation }) {
  const { user } = useAuth();
  const c = useThemeColors();

  const {
    control,
    handleSubmit,
    setFocus,
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

  // Convert here, not in the form: Firestore must get numbers, or sorting and
  // comparisons break. `await` keeps isSubmitting true → spinner + no double tap.
  const onSubmit = async (values) => {
    try {
      await createVehicle(user.uid, {
        make: values.make.trim(),
        model: values.model.trim(),
        year: Number(values.year),
        plate: values.plate.trim().toUpperCase(),
        currentMileage: Number(values.currentMileage),
        fuelType: values.fuelType,
      });
      navigation.goBack(); // pop the form so Back can't return to it
    } catch (e) {
      // Stay on the form so the user's input isn't lost.
      Alert.alert('Could not save', e.message);
    }
  };

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

      <AppButton title="Save vehicle" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
    </FormScreen>
  );
}

// Same label and box look as FormField.
const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '600' },
  pickerBox: { borderWidth: 1, borderRadius: 8, overflow: 'hidden' },
});
