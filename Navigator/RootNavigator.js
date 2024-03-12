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

    useEffect(() => {
        async function ReLogin() {
            const inputs = await AsyncStorage.getItem("app_user_imputs")
            if (inputs) {
                const response = await fetch("https://" + defaultUrl + '/api/LoginDetails/Post', {
                    method: 'POST',
                    headers: {
                        "Content-Type": 'application/json'
                    },
                    body: inputs
                })

                if (response.ok == true) {
                    const data = await response.json()

                    if (data?.EmpId) {
                        //
                    } else {
                        await AsyncStorage.removeItem('app_user')
                        await AsyncStorage.removeItem('app_user_imputs')
                        setUser(null)
                    }

                }
            }
        }

        if (user && defaultUrl) {
            ReLogin()
        }
    }, [])

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