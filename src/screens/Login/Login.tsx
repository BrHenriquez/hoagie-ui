import * as React from 'react';
import { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, Snackbar } from 'react-native-paper';
import { auth } from '../../services/api.ts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../constants/screens.ts';
import { useUserContext } from '../../hooks/useUser';
import { theme } from '../../theme/theme.ts';
import { Hoagie } from '../../assets/index.ts';
import InputStyled from '../../components/Input/InputStyled.tsx';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { setUser } = useUserContext();
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const { data: { data } } = await auth.login(email.toLowerCase().trim(), password.trim());
      setUser(data?.user);
      await AsyncStorage.setItem('token', data.access_token);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={Hoagie} style={styles.image} />
      <Text style={styles.title}>Hoagie Hub</Text>
      <InputStyled
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <InputStyled
        label="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        theme= {{ colors : { primary: theme.hoagieColors.text }}}
      />
      {error ? <Snackbar style={styles.error} visible={true} onDismiss={() => setError('')} >{error}</Snackbar> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        style={styles.button}
        textColor="black"
        disabled={loading || !email || !password}
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
    backgroundColor: theme.hoagieColors.text
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
  image: {
    width: '70%',
    height: '25%',
    alignSelf: 'center',
  },
});

export default LoginScreen;
