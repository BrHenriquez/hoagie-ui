import { Screens } from "../../constants/screens"
import { Hoagie } from "../../types"
import { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { Pressable, StyleSheet } from "react-native"
import { Card, Text } from "react-native-paper"
import { useUserContext } from "../../hooks/useUser";
import { useMemo } from "react"

export const HoagieCardSummary = ({ item, navigation }: { item: Hoagie, navigation: NativeStackNavigationProp }) => {
    const { user } = useUserContext();
    const imOwner = useMemo(() => {
        return item?.creator?._id === user?._id;
    }, [item?.creator?._id, user?._id]);

    const createdByText = useMemo(() => {
        const hasCollaborators = item?.collaborators?.length > 0;
        const collaboratorsName = item?.collaborators?.map(collaborator => collaborator.name === user?.name ? 'you' : collaborator.name);
        let collaboratorsText = collaboratorsName.join(", ");
        if (collaboratorsName.length > 1) {
            collaboratorsText = collaboratorsText.split(", ").slice(0, collaboratorsName?.length - 1).join(", ") + " and " + item?.collaborators[item?.collaborators?.length - 1].name;
        }
        return imOwner && !hasCollaborators ? 'Created by you' : `Created by ${item?.creator?.name === user?.name ? 'you' : item?.creator?.name ?? 'Unknown'} ${hasCollaborators ? `${collaboratorsText}` : ''}`;
    }, [imOwner, item?.creator?.name, item?.collaborators]);

    return (
        <Pressable onPress={() => navigation.navigate(Screens.HOAGIE_DETAIL, { id: item._id })}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={styles.creator}>{createdByText}</Text>
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
