import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, Card, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { hoagies } from '../../services/api';
import { Hoagie } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screens } from '../../constants/screens';
import EmptyHoagieList from '../Hoagie/EmptyHoagieList';
import { useUserContext } from '../../hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, setUser } = useUserContext();
    const [hoagiesList, setHoagiesList] = useState<Hoagie[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadHoagies = useCallback(async (pageNum: number = 1) => {
        try {
            setLoading(true);
            const response = await hoagies.getAll(pageNum);
            const data = response.data.data.data;
            console.log('data', data);
            if (pageNum === 1) {
                setHoagiesList(data);
            } else {
                setHoagiesList(prev => [...prev, ...data]);
            }
            setHasMore(data.length > 0);
        } catch (error) {
            setLoading(false);
            console.error('Error loading hoagies:', error);
        } finally {
            setLoading(false);
        };
    }, [setHoagiesList, setLoading, setHasMore]);

    useEffect(() => {
        loadHoagies();
    }, []);

    const handleLoadMore = useCallback(async () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            await loadHoagies(nextPage);
        }
    }, [loading, hasMore, page, loadHoagies]);

    const renderItem = ({ item }: { item: Hoagie }) => {
        return (
        <TouchableOpacity onPress={() => navigation.navigate(Screens.HOAGIE_DETAIL, { id: item._id })}>
            <Card style={styles.card}>
                <Card.Content>
                    <Text style={styles.title}>{item?.name}</Text>
                    <Text style={styles.creator}>By: {item?.creator?.name ?? 'Unknown'}</Text>
                    <Text style={styles.ingredients}>
                        Ingredients: {item?.ingredients?.join(', ') ?? 'No ingredients'}
                    </Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    )};

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('isLoggedIn');
        setUser(null);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hoagie Hub</Text>
                <Button mode="contained" onPress={handleLogout}>Logout</Button>
            </View>
            <View style={styles.container}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={{maxWidth: '60%' }} ellipsizeMode='tail' lineBreakMode='clip' numberOfLines={1}>Hi, {user?.name ?? ''} nice to see you again</Text>
                    {hoagiesList?.length > 0 ? <Button mode="contained" onPress={() => navigation.navigate(Screens.CREATE_HOAGIE)}>Create Hoagie</Button> : null}
                </View>
                <Text style={{color: 'black'}}>Showing {hoagiesList.length ?? 0} hoagies</Text>
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadHoagies()} />}
                    alwaysBounceVertical
                    data={hoagiesList}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading ? <ActivityIndicator style={styles.loader} /> : null
                    }
                    ListEmptyComponent={<EmptyHoagieList />}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#4da8d5',
        gap: 10
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#e3cb85'
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black'
    },
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
    loader: {
        marginVertical: 20,
    },
});

export default HomeScreen; 