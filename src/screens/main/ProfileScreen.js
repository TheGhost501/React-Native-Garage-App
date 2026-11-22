import { Alert } from 'react-native';

import PlaceholderScreen from '../../components/PlaceholderScreen';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      Alert.alert('Logout failed', error.message);
    }
  };

  return (
    <PlaceholderScreen
      title="Profile"
      params={{ email: user?.email }}
      actions={[{ label: 'Log out', onPress: handleLogout, danger: true }]}
    />
  );
}
