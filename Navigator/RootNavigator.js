import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext, useEffect } from 'react'
import { userContext } from '../context/UserContext';
import Login from '../screens/Auth/Login';
import VerifyOTP from '../screens/Auth/VerifyOTP';
import DrawerNavigator from './DrawerNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {

    const { user, defaultUrl, setUser } = useContext(userContext)

    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
            contentStyle: {
                backgroundColor: 'white',
            },
        }}>
            {user ? <>
                <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            </> : <>
                <Stack.Screen name='Login' component={Login} />
                <Stack.Screen name='VerifyOTP' component={VerifyOTP} />
            </>}
        </Stack.Navigator>
    )
}

export default RootNavigator;