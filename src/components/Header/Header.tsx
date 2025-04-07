import { useUserContext } from "../../hooks/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { theme } from "../../theme/theme";

const Header = () => {
    const { setUser } = useUserContext()

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        setUser(null);
    }
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Hoagie Hub</Text>
            <Button style={{ backgroundColor: theme.hoagieColors.button }} textColor="black" mode="contained" onPress={handleLogout}>Logout</Button>
        </View>
    )
}

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: theme.hoagieColors.header,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
})
