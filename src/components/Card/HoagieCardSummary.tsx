import { Screens } from "../../constants/screens"
import { Hoagie } from "../../types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Pressable, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { useUserContext } from "../../hooks/useUser";   

export const HoagieCardSummary = ({item, navigation}: {item: Hoagie, navigation: NativeStackNavigationProp} ) => {
    const { user } = useUserContext();
    const imOwner = item?.creator?._id === user?._id;
    return (
        <Pressable onPress={() => navigation.navigate(Screens.HOAGIE_DETAIL, { id: item._id })}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={styles.creator}>By: {imOwner ? 'You' : item?.creator?.name ?? 'Unknown'}</Text>
                    <Text style={styles.ingredients}>
                        Ingredients: {item?.ingredients?.join(', ') ?? 'No ingredients'}
                    </Text>
                </Card.Content>
            </Card>
        </Pressable>
    )
}

export default HoagieCardSummary;

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    creator: {
        color: '#666',
        marginTop: 5,
    },
    ingredients: {
        marginTop: 5,
    },
});
