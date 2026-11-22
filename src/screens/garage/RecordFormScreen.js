import PlaceholderScreen from '../../components/PlaceholderScreen';

// Add mode: { vehicleId }. Edit mode: { vehicleId, recordId }.
export default function RecordFormScreen({ route }) {
  const isEdit = Boolean(route.params?.recordId);

  return <PlaceholderScreen title={isEdit ? 'Edit Record' : 'Add Record'} params={route.params} />;
}
