import 'react-native-gesture-handler';
import React, { useContext, useEffect, version } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserContext } from './context/UserContext'
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import RootNavigator from './Navigator/RootNavigator';
import { checkVersion } from "react-native-check-version";

export default function App() {

  useEffect(() => {
    // checkVersion().then(version => {
    //   if (version?.needsUpdate){
    //     Alert.alert('Update Application','A new update of this mobile app is available please update the application',[
    //       {
    //         text : 'Update',
    //         onPress : () => {
    //           Linking.openURL(version?.url)
    //         }
    //       }
    //     ])
    //   }
    // })
  }, [])
  return (
    <UserContext>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserContext>
  );
}