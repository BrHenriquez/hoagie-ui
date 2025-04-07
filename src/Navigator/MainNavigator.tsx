import { useMemo } from "react"
import { Screens } from "../constants/screens"
import CreateHoagieScreen from "../screens/Hoagie/CreateHoagie"
import HoagieDetailScreen from "../screens/Hoagie/HoagieDetail"
import HomeScreen from "../screens/Home/Home"
import LoginScreen from "../screens/Login/Login"
import OnboardingScreen from "../screens/Onboarding/Onboarding"
import RegisterScreen from "../screens/Register/Register"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useUserContext } from "../hooks/useUser"
import { theme } from "../theme/theme"

type RootStackParamList = {
    Onboarding: undefined
    Login: { email: string, password: string };
    Register: undefined;
    Home: undefined;
    CreateHoagie: undefined;
    HoagieDetail: { id: string };
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
                name={Screens.CREATE_HOAGIE}
                component={CreateHoagieScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Create Hoagie',
                    headerTitleStyle: {
                        color: 'black',
                    },
                    headerStyle: {
                        backgroundColor: theme.hoagieColors.header,
                    },
                }} />
            <Stack.Screen name={Screens.HOAGIE_DETAIL} component={HoagieDetailScreen} options={{ headerShown: true, headerTitle: 'Hoagie Detail', headerStyle: { backgroundColor: '#e3cb85' } }} />
        </Stack.Navigator>
    )
}

export default MainNavigator;
