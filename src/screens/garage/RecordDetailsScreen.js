import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function RecordDetailsScreen({ navigation, route }) {
  const { vehicleId, recordId } = route.params;

  return (
    <PlaceholderScreen
      title="Record Details"
      params={route.params}
      actions={[
        {
          label: 'Edit record',
          onPress: () => navigation.navigate('RecordForm', { vehicleId, recordId }),
        },
      ]}
    />
  );
}
