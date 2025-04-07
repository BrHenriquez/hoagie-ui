import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { auth } from '../../services/api.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation} from '@react-navigation/native';
import { Screens } from '../../constants/screens.ts';
import { useUserContext } from '../../hooks/useUser';
const LoginScreen = ({ route }: { route: { params: { email: string, password: string } } }) => {
  const [email, setEmail] = useState(route.params?.email);
  const [password, setPassword] = useState(route.params?.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useUserContext();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const {data: {data}} = await auth.login(email, password);
      console.log('data login', data);
      setUser({
        name: data.name,
        email: data.email,
        id: data._id,
      });
      await AsyncStorage.setItem('token', data.access_token);
      await AsyncStorage.setItem('isLoggedIn', 'true');
    } catch (err) {
      console.log('error login', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hoagie Hub</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate(Screens.REGISTER)}
        style={styles.button}
      >
        Don't have an account? Register
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default LoginScreen;
