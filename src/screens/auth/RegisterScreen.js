import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';
import FormScreen from '../../components/FormScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { emailRules, passwordRules } from '../../utils/validators';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const c = useThemeColors();

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  });

  // Firebase signs the new user in right away, so RootNavigator switches
  // to the app tabs on its own. No navigate() here.
  const onSubmit = async ({ email, password }) => {
    try {
      await register(email, password);
    } catch (e) {
      setError('root', { message: getAuthErrorMessage(e) });
    }
  };

  return (
    <FormScreen>
      <Controller
        control={control}
        name="email"
        rules={emailRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Email"
            placeholder="you@example.com"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.email?.message}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('password')}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        rules={passwordRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Password"
            placeholder="At least 6 characters, 1 digit"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="next"
            onSubmitEditing={() => setFocus('confirmPassword')}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        rules={{
          required: 'Please confirm your password',
          validate: (v) => v === getValues('password') || 'Passwords do not match',
        }}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Confirm password"
            placeholder="Repeat your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureTextEntry
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      {errors.root && (
        <Text style={[styles.submitError, { color: c.danger }]}>{errors.root.message}</Text>
      )}

      <AppButton title="Create account" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      <AppButton
        title="Have an account? Log in"
        variant="secondary"
        onPress={() => navigation.goBack()}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  submitError: { fontSize: 14, textAlign: 'center' },
});
