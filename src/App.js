import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import CenteredMessage from './components/CenteredMessage';
import { isFirebaseConfigured } from './config/firebase';
import { AuthProvider } from './contexts/AuthContext';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {isFirebaseConfigured ? (
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      ) : (
        <CenteredMessage
          title="Firebase is not configured"
          message="Copy .env.example to .env, fill in your Firebase web config, then restart Expo with: npx expo start -c"
        />
      )}
    </SafeAreaProvider>
  );
}
