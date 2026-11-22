import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function VehicleDetailsScreen({ navigation, route }) {
  const { vehicleId } = route.params;

  return (
    <PlaceholderScreen
      title="Vehicle Details"
      params={route.params}
      actions={[
        {
          label: 'Open sample record',
          onPress: () =>
            navigation.navigate('RecordDetails', { vehicleId, recordId: 'sample-record' }),
        },
        { label: 'Add service record', onPress: () => navigation.navigate('RecordForm', { vehicleId }) },
        { label: 'Edit vehicle', onPress: () => navigation.navigate('VehicleForm', { vehicleId }) },
      ]}
    />
  );
}
