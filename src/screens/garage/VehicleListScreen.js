import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function VehicleListScreen({ navigation }) {
  return (
    <PlaceholderScreen
      title="My Garage"
      actions={[
        {
          label: 'Open sample vehicle',
          onPress: () => navigation.navigate('VehicleDetails', { vehicleId: 'sample-vehicle' }),
        },
        { label: 'Add vehicle', onPress: () => navigation.navigate('VehicleForm') },
      ]}
    />
  );
}
