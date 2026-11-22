import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function RegisterScreen({ navigation }) {
  return (
    <PlaceholderScreen
      title="Register"
      actions={[{ label: 'Back to Login', onPress: () => navigation.goBack() }]}
    />
  );
}
