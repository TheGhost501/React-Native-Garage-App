import PlaceholderScreen from '../../components/PlaceholderScreen';

// Add mode: no params. Edit mode: { vehicleId }.
export default function VehicleFormScreen({ route }) {
  const isEdit = Boolean(route.params?.vehicleId);

  return <PlaceholderScreen title={isEdit ? 'Edit Vehicle' : 'Add Vehicle'} params={route.params} />;
}
