import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ProfileScreen from '../screens/main/ProfileScreen';
import UpcomingScreen from '../screens/main/UpcomingScreen';
import { colors } from '../theme/colors';
import GarageStack from './GarageStack';

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  GarageTab: 'car-sport',
  Upcoming: 'calendar',
  Profile: 'person-circle',
};

export default function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.primary,
        tabBarIcon: ({ color, size }) => <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />,
      })}
    >
      {/* The Garage tab has its own stack, so the tab header is hidden to avoid a double header. */}
      <Tab.Screen name="GarageTab" component={GarageStack} options={{ title: 'Garage', headerShown: false }} />
      <Tab.Screen name="Upcoming" component={UpcomingScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
