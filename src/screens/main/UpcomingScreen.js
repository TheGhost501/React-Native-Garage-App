import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function UpcomingScreen({ navigation }) {
  return (
    <PlaceholderScreen
      title="Upcoming Services"
      actions={[
        {
          // Jump into the Garage tab's nested stack.
          label: 'Open sample vehicle',
          onPress: () =>
            navigation.navigate('GarageTab', {
              screen: 'VehicleDetails',
              params: { vehicleId: 'sample-vehicle' },
              initial: false,
            }),
        },
      ]}
    />
  );
}
