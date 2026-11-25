import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text } from 'react-native';

import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';
import FormScreen from '../../components/FormScreen';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeColors } from '../../hooks/useThemeColors';
import { getAuthErrorMessage } from '../../utils/authErrors';
import { emailRules, loginPasswordRules } from '../../utils/validators';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const c = useThemeColors();

  const {
    control,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' }, mode: 'onTouched' });

  // No navigate() on success: onAuthStateChanged updates `user`, and
  // RootNavigator swaps the Auth stack for the app tabs.
  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
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
        rules={loginPasswordRules}
        render={({ field: { value, onChange, onBlur, ref } }) => (
          <FormField
            ref={ref}
            label="Password"
            placeholder="Your password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.password?.message}
            secureTextEntry
            autoComplete="current-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      {errors.root && (
        <Text style={[styles.submitError, { color: c.danger }]}>{errors.root.message}</Text>
      )}

      <AppButton title="Log in" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
      <AppButton
        title="No account? Register"
        variant="secondary"
        onPress={() => navigation.navigate('Register')}
      />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  submitError: { fontSize: 14, textAlign: 'center' },
});
