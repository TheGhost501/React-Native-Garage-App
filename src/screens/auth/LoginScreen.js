import PlaceholderScreen from '../../components/PlaceholderScreen';

export default function LoginScreen({ navigation }) {
  return (
    <PlaceholderScreen
      title="Login"
      actions={[{ label: 'Go to Register', onPress: () => navigation.navigate('Register') }]}
    />
  );
}
