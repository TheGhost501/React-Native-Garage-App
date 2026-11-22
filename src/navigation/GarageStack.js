import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RecordDetailsScreen from '../screens/garage/RecordDetailsScreen';
import RecordFormScreen from '../screens/garage/RecordFormScreen';
import VehicleDetailsScreen from '../screens/garage/VehicleDetailsScreen';
import VehicleFormScreen from '../screens/garage/VehicleFormScreen';
import VehicleListScreen from '../screens/garage/VehicleListScreen';

const Stack = createNativeStackNavigator();

// Nested inside the "Garage" tab: List -> Details -> Record details / forms.
export default function GarageStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="VehicleList" component={VehicleListScreen} options={{ title: 'My Garage' }} />
      <Stack.Screen name="VehicleDetails" component={VehicleDetailsScreen} options={{ title: 'Vehicle' }} />
      <Stack.Screen name="RecordDetails" component={RecordDetailsScreen} options={{ title: 'Service Record' }} />
      <Stack.Screen
        name="VehicleForm"
        component={VehicleFormScreen}
        options={({ route }) => ({ title: route.params?.vehicleId ? 'Edit Vehicle' : 'Add Vehicle' })}
      />
      <Stack.Screen
        name="RecordForm"
        component={RecordFormScreen}
        options={({ route }) => ({ title: route.params?.recordId ? 'Edit Record' : 'Add Record' })}
      />
    </Stack.Navigator>
  );
}
