import { Modal, Text, View, Pressable, ActivityIndicator, RefreshControl, FlatList, StyleSheet } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { User, Hoagie } from "../../types";
import { hoagies, user as userService } from "../../services/api";
import { hoagieColors } from "../../theme/theme";
import { Button } from "react-native-paper";
import { useUserContext } from "../../hooks/useUser";

type AddCollaboratorModalProps = {
    open: boolean;
    onDismiss: () => void;
    hoagie: Hoagie;
    fetchDetails: () => void;
}

const AddCollaboratorModal = ({ open, onDismiss, hoagie, fetchDetails }: AddCollaboratorModalProps) => {
    if (!open) return null;
    const { user } = useUserContext();
    const [selectedCollaborator, setSelectedCollaborator] = useState<User | null>(null);
    const [collaborators, setCollaborators] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [collaboratorLoading, setCollaboratorLoading] = useState<boolean>(false);

    const fetchCollaborators = useCallback(async (newPage: number = page) => {
        setLoading(true);
        const { data: { data: { data, total } } } = await userService.getAll(newPage);
        if (newPage === 1) {
            setCollaborators(data);
        } else {
            setCollaborators(prev => [...prev, ...data]);
        }
        setHasMore(data.length < total);
        setLoading(false);
    }, [setCollaborators]);

    useEffect(() => {
        fetchCollaborators();
    }, [fetchCollaborators]);

    const handleLoadMore = useCallback(async () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            await fetchCollaborators(nextPage);
        }
    }, [loading, hasMore, page, fetchCollaborators]);

    const handleAddCollaborator = useCallback(async () => {
        try {
            setCollaboratorLoading(true);
            if (selectedCollaborator) {
                await hoagies.addCollaborator(hoagie._id, selectedCollaborator._id);
                onDismiss();
                fetchDetails();
            }
            setCollaboratorLoading(false);
        } catch (error) {
            console.error(error);
            setCollaboratorLoading(false);
        } finally {
            setCollaboratorLoading(false);
        }
    }, [selectedCollaborator, onDismiss]);

    return (
        <Modal visible={open} onDismiss={onDismiss}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Add collaborator</Text>
                <Button mode="contained-tonal" onPress={onDismiss} textColor={hoagieColors.text}>Close</Button>
            </View>
            {selectedCollaborator ? (
                <View style={styles.selectedCollaboratorContainer}>
                    <Text style={styles.selectedCollaboratorText}>Collaborator selected: {selectedCollaborator?.name}</Text>
                </View>
            ) : null}
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>🪄 Here is a list of all the collaborators, select one to add</Text>
            </View>
            <FlatList
                style={styles.collaboratorsContainer}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={() => fetchCollaborators(1)} />}
                alwaysBounceVertical
                data={collaborators.filter((collaborator) => !hoagie?.collaborators?.some((c) => c._id === collaborator._id) || user?._id === collaborator._id)}
                renderItem={({ item }) => {
                    const isSelected = selectedCollaborator?._id === item._id;
                    return (
                        <Pressable key={item._id} onPress={() => setSelectedCollaborator(item === selectedCollaborator ? null : item)}>
                            <View style={[styles.collaboratorItem, isSelected && styles.selectedCollaborator]}>
                                <Text style={styles.collaboratorText}>{item.name}</Text>
                            </View>
                        </Pressable>
                    )
                }}
                keyExtractor={item => item._id}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    loading ? <ActivityIndicator style={styles.loader} /> : null
                }
                ListEmptyComponent={<Text>No collaborators found</Text>}
            />
            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    onPress={handleAddCollaborator}
                    loading={collaboratorLoading}
                    textColor={hoagieColors.text}
                    disabled={!selectedCollaborator}
                >Add collaborator</Button>
            </View>
        </Modal>
    )
}

export default AddCollaboratorModal;

const styles = StyleSheet.create({
    titleContainer: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: hoagieColors.header,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: hoagieColors.text,
    },
    selectedCollaboratorContainer: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: hoagieColors.primary,
    },
    descriptionContainer: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedCollaboratorText: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: hoagieColors.text,
    },
    loader: {
        margin: 10,
    },
    collaboratorItem: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedCollaborator: {
        backgroundColor: '#ccc',
    },
    collaboratorsContainer: {
        gap: 10
    },
    buttonContainer: {
        padding: 10,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    descriptionText: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    collaboratorText: {
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'capitalize',
        color: hoagieColors.text,
    },
});

