import { Screens } from '../../constants/screens';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Button } from 'react-native';

const EmptyHoagieList = () => {
    const navigation = useNavigation();
  return (
    <View style={{ gap: 10}}>
        <Text style={{ textAlign: 'center' }}>No hoagies found</Text>
        <Button onPress={() => navigation.navigate(Screens.CREATE_HOAGIE)} title="Create Hoagie"  />
    </View>
  );
};

export default EmptyHoagieList;


