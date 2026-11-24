// TEMPORARY Phase 1 keyboard test. Revert with:
//   git restore src/screens/auth/LoginScreen.js
import { useState } from 'react';

import AppButton from '../../components/AppButton';
import FormField from '../../components/FormField';
import FormScreen from '../../components/FormScreen';

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const fakeSubmit = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <FormScreen>
      <FormField label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
      <FormField label="Password" placeholder="••••••" secureTextEntry />
      <FormField label="Make" placeholder="Toyota" />
      <FormField label="Year" placeholder="2015" keyboardType="numeric" />
      <FormField label="Mileage" placeholder="120000" keyboardType="numeric" error="Example error text" />
      <FormField label="Notes" placeholder="Bottom field: focus me" multiline style={{ minHeight: 96 }} />
      <AppButton title="Fake submit (1.5 s loading)" onPress={fakeSubmit} loading={loading} />
      <AppButton title="Go to Register" variant="secondary" onPress={() => navigation.navigate('Register')} />
    </FormScreen>
  );
}
