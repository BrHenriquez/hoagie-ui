import { Screens } from '../../constants/screens';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';

const EmptyHoagieList = () => {
    const navigation = useNavigation();
  return (
    <View style={{ gap: 10}}>
        <Text style={{ textAlign: 'center' }}>No hoagies found</Text>
        <Button onPress={() => navigation.navigate(Screens.CREATE_HOAGIE)} textColor="black" mode="contained" >Create Hoagie</Button>
    </View>
  );
};

export default EmptyHoagieList;


