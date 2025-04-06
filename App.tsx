import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// screens
import LoginScreen from './src/screens/Login/Login';
import OnboardingScreen from './src/screens/Onboarding/Onboarding';
import { theme } from './src/theme/theme.ts';
import { Screens } from './src/constants/screen-types.ts';

type RootStackParamList = {
  Onboarding: undefined
  Login: undefined;
}

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Onboarding">
              <Stack.Screen
                name={Screens.ONBOARDING}
                component={OnboardingScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name={Screens.LOGIN}
                component={LoginScreen}
                options={{ headerShown: true, headerTitle: '',  }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
    </SafeAreaProvider> 
    </GestureHandlerRootView>
  );
}
