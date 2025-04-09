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
import { hoagieColors } from '../../theme/theme';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user } = useUserContext();
    const [hoagiesList, setHoagiesList] = useState<Hoagie[]>([]);
    const [totalHoagies, setTotalHoagies] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [search, setSearch] = useState('');
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        loadHoagies(1, search);

        return () => {
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
        };
      }, []);

    const loadHoagies = useCallback(async (pageNum: number = 1, search: string) => {
        try {
            setLoading(true);
            const { data: { data: { data, total } } } = await hoagies.getAll(pageNum, search);
            
            if (pageNum === 1) {
                setHoagiesList(data);
            } else {
                setHoagiesList(prev => [...prev, ...data]);
            }
            setTotalHoagies(total);
            setHasMore(data.length < total);
        } catch (error) {
            setLoading(false);
            console.error('Error loading hoagies:', error);
        } finally {
            setLoading(false);
        };
    }, [setHoagiesList, setLoading, setHasMore]);

    const handleLoadMore = useCallback(async () => {
        if (!loading && hasMore && search === '') {
            const nextPage = page + 1;
            setPage(nextPage);
            await loadHoagies(nextPage, search);
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
                    await loadHoagies(page, text);
              }, 500);
        } catch (error) {
            console.error('Error searching hoagies:', error);
        } finally {
            setLoading(false);
        }
    }, [search, setHoagiesList, setLoading, page, loadHoagies]);   

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Header />
            <View style={styles.container}>
                <View style={styles.subHeaderContainer}>
                    <Text style={{ maxWidth: '60%' }} ellipsizeMode='tail' lineBreakMode='clip' numberOfLines={1}>Hi, {user?.name ?? ''} 👋</Text>
                    {hoagiesList?.length > 0 ? <Button mode="contained" onPress={() => navigation.navigate(Screens.HOAGIE_FORM)} textColor={hoagieColors.text}>Create Hoagie</Button> : null}
                </View>
                <Text style={{ color: 'black' }}>{hoagiesList.length === totalHoagies ? `Showing ${totalHoagies} hoagies` : `Showing ${hoagiesList.length} of ${totalHoagies} hoagies`}</Text>
                    <View>
                        <InputStyled mode='outlined' label="Search" value={search} onChangeText={handleSearch} autoCapitalize='none' />
                    </View>
                <FlatList
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={() => loadHoagies(1, search)} />}
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
    subHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});

export default HomeScreen; 