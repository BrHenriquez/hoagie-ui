import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { theme } from './src/theme/theme.ts';
import { UserProvider } from './src/context/UserContext.tsx';
import MainNavigator from './src/Navigator/MainNavigator';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
       <SafeAreaProvider>
        <NavigationContainer>
        <PaperProvider theme={theme}>
          <UserProvider>
            <MainNavigator />
          </UserProvider>
        </PaperProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
