import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CenteredMessage from '../components/CenteredMessage';
import { useAuth } from '../contexts/AuthContext';
import AppTabs from './AppTabs';
import AuthStack from './AuthStack';

const Root = createNativeStackNavigator();

// Protected routes: only one branch is ever registered. Without a user the
// App screens do not exist in the navigator, so they cannot be navigated to.
export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <CenteredMessage loading message="Restoring your session..." />;
  }

  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Root.Screen name="App" component={AppTabs} />
        ) : (
          <Root.Screen name="Auth" component={AuthStack} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}
