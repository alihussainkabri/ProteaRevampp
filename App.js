import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserContext } from './context/UserContext'
import { StyleSheet, Text, View } from 'react-native';
import RootNavigator from './Navigator/RootNavigator';

export default function App() {
  return (
    <UserContext>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserContext>
  );
}