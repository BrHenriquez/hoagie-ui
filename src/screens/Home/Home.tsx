import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { hoagies } from '../../services/api';
import { Hoagie } from '../../types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Screens } from '../../constants/screens';
import EmptyHoagieList from '../Hoagie/EmptyHoagieList';
import { useUserContext } from '../../hooks/useUser';
import HoagieCardSummary from '../../components/Card/HoagieCardSummary';
import Header from '../../components/Header/Header';
import InputStyled from '../../components/Input/InputStyled';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useUserContext();
    const [hoagiesList, setHoagiesList] = useState<Hoagie[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      }, []);

    const loadHoagies = useCallback(async (pageNum: number = 1) => {
        try {
            setLoading(true);
            const { data: { data: { data } } } = await hoagies.getAll(pageNum);
            
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
        if (!loading && hasMore && search === '') {
            const nextPage = page + 1;
            setPage(nextPage);
            await loadHoagies(nextPage);
        }
    }, [loading, hasMore, page, loadHoagies, search]);

    const handleSearch = useCallback(async (text: string) => {
        try {
            setLoading(true);
            setSearch(text);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
              }
              // Set new timer
              timerRef.current = setTimeout(async () => {
                    const { data: { data: { data } } }  = await hoagies.search(text);
                    setHoagiesList(data);
              }, 500);
        } catch (error) {
            console.error('Error searching hoagies:', error);
        } finally {
            setLoading(false);
        }
    }, [search, setHoagiesList, setLoading]);   

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ maxWidth: '60%' }} ellipsizeMode='tail' lineBreakMode='clip' numberOfLines={1}>Hi, {user?.name ?? ''} 👋</Text>
                    {hoagiesList?.length > 0 ? <Button mode="contained" onPress={() => navigation.navigate(Screens.CREATE_HOAGIE)} textColor="black">Create Hoagie</Button> : null}
                </View>
                <Text style={{ color: 'black' }}>Showing {hoagiesList.length ?? 0} hoagies</Text>
                    <View>
                        <InputStyled mode='outlined' label="Search" value={search} onChangeText={handleSearch} autoCapitalize='none' />
                    </View>
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadHoagies()} />}
                    alwaysBounceVertical
                    data={hoagiesList}
                    renderItem={({ item }) => <HoagieCardSummary item={item} navigation={navigation} />}
                    keyExtractor={item => item._id}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    showsVerticalScrollIndicator={false}
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
        paddingBottom: 0,
        backgroundColor: '#4da8d5',
        gap: 10
    },
    loader: {
        marginVertical: 20,
    },
});

export default HomeScreen; 