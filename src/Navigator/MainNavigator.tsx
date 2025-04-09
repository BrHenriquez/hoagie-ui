import { useMemo } from "react"
import { Screens } from "../constants/screens"
import HoagieForm from "../screens/Hoagie/HoagieForm"
import HoagieDetailScreen from "../screens/Hoagie/HoagieDetail"
import HomeScreen from "../screens/Home/Home"
import LoginScreen from "../screens/Login/Login"
import OnboardingScreen from "../screens/Onboarding/Onboarding"
import RegisterScreen from "../screens/Register/Register"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useUserContext } from "../hooks/useUser"
import { theme } from "../theme/theme"
import { Hoagie } from "../types"

export type RootStackParamList = {
    [Screens.ONBOARDING]: undefined
    [Screens.LOGIN]: { email: string, password: string };
    [Screens.REGISTER]: undefined;
    [Screens.HOME]: undefined;
    [Screens.HOAGIE_FORM]: { isEdit?: boolean, hoagie?: Hoagie };
    [Screens.HOAGIE_DETAIL]: { id: string };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const MainNavigator = () => {
    const { user } = useUserContext();

    const isLoggedIn = useMemo((): boolean => {
        const token = AsyncStorage.getItem('token');
        return token !== undefined && token !== null && user !== null;
    }, [user, AsyncStorage]);


    if (!isLoggedIn) {
        return <Stack.Navigator initialRouteName={Screens.ONBOARDING} screenOptions={{ headerShown: false, headerTitle: '' }}>
            <Stack.Screen name={Screens.ONBOARDING} component={OnboardingScreen} />
            <Stack.Screen
                name={Screens.LOGIN}
                component={LoginScreen}
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerBackTitleVisible: false,
                }} />
            <Stack.Screen name={Screens.REGISTER} component={RegisterScreen} options={{
                headerShown: true,
                headerTransparent: true,
                headerTitle: '',
                headerBackTitleVisible: false,
            }} />
        </Stack.Navigator>
    }

    return (
        <Stack.Navigator initialRouteName={Screens.HOME} screenOptions={{ headerShown: false, headerTitle: '' }}>
            <Stack.Screen name={Screens.HOME} component={HomeScreen} />
            <Stack.Screen
                name={Screens.HOAGIE_FORM}
                component={HoagieForm}
                options={{
                    headerShown: true,
                    headerTitle: 'Hoagie',
                    headerTitleStyle: {
                        color: 'black',
                    },
                    headerStyle: {
                        backgroundColor: theme.hoagieColors.header,
                    },
                }} />
            <Stack.Screen
                name={Screens.HOAGIE_DETAIL}
                component={HoagieDetailScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Hoagie Detail',
                    headerStyle: {
                        backgroundColor: '#e3cb85'
                    }
                }} />
        </Stack.Navigator>
    )
}

export default MainNavigator;
