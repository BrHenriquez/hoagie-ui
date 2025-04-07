import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Snackbar, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserContext } from '../../hooks/useUser';
import { Hoagie } from '../../assets/index.ts';
import { theme } from '../../theme/theme.ts';
import InputStyled from '../../components/Input/InputStyled.tsx';
const RegisterScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { setUser } = useUserContext();

    const handleRegister = async () => {
        try {
            setLoading(true);
            setError('');
            const { data: { data: { user, access_token } } } = await auth.register(name, email, password);
            setUser(user);
            await AsyncStorage.setItem('token', access_token);
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={Hoagie} style={styles.image} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Please enter your details to create an account</Text>
            <InputStyled
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize='sentences'
                textColor={theme.hoagieColors.text}
            />
            <InputStyled
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                textColor={theme.hoagieColors.text}
            />
            <InputStyled
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                secureTextEntry
            />
            {error ? <Snackbar style={styles.error} visible={true} onDismiss={() => setError('')} >{error}</Snackbar> : null}
            <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
                disabled={loading || !name || !email || !password}
            >
                Register
            </Button>
            <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
            >
                Already have an account? Login
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
    subtitle: {
        fontSize: 16,
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

export default RegisterScreen; 