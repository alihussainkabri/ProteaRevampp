import 'react-native-gesture-handler';
import React, { useContext, useEffect, version } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserContext } from './context/UserContext'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
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