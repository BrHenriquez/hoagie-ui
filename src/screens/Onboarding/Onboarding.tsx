import * as React from 'react';
import { View, StyleSheet, ImageBackground, SafeAreaView } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Sanwich } from '../../assets/index';
import { useNavigation } from '@react-navigation/native';
import { Screens } from '../../constants/screens.ts';

const OnboardingScreen = () => {
    const navigation = useNavigation();


  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground source={Sanwich} style={styles.container}>
            <View style={styles.subContainer}>
            <View>
                <Text style={styles.title}>Hoagie Hub</Text>
                <Text style={styles.subtitle}>The best way to manage your hoagies</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={() => navigation.navigate(Screens.LOGIN)}
                    style={styles.button}
                >
                    Login
                </Button>
                <Button
                    mode="contained-tonal"
                    onPress={() => navigation.navigate(Screens.REGISTER)}
                    style={styles.button}
                >
                    Register
                </Button>
            </View>
        </View>     
        </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  subContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
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
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
  },
  button: {
    flex: 1,
    marginTop: 10,
  },
});

export default OnboardingScreen;
