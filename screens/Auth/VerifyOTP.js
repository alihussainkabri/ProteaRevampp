import { View, StatusBar, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { NativeBaseProvider, Text, VStack } from 'native-base';
import { fonts } from '../../config/Fonts'
import OTPTextInput from 'react-native-otp-textinput'
import { AntDesign } from 'react-native-vector-icons'
import Loader from '../../component/Loader'
import { url } from '../../helpers';
import Toast from 'react-native-root-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userContext } from '../../context/UserContext';

const VerifyOTP = ({ navigation, route }) => {

    const [otp, setOtp] = useState("999999")
    const [loader, setLoader] = useState(false)
    const { setUser,defaultUrl } = useContext(userContext)

    useEffect(() => {
        async function sendOTP() {
            
            var raw = JSON.stringify({
                "EmpId": JSON.parse(route?.params?.data)?.EmpId
            });

            const response = await fetch( "https://" + defaultUrl + '/api/Dashboard/SendOtp', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })
            
            if (response.ok == true) {
                const data = await response.json()
                Toast.show(data?.error_msg, {
                    duration: 3000,
                })

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
            }
        }

        sendOTP()
    }, [])

    async function submit() {
        if (otp) {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": JSON.parse(route?.params?.data)?.EmpId,
                "Otp": otp
            });

            const response = await fetch("https://" + defaultUrl + '/api/Dashboard/CheckOTP', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                if (data?.error_code == 202) {
                    await AsyncStorage.setItem("app_user", route?.params?.data)
                    await AsyncStorage.setItem("app_user_imputs", route?.params?.user_input)
                    await AsyncStorage.setItem("app_user_uniqueId", route?.params?.uniqueId)
                    setUser(JSON.parse(route?.params?.data))
                    setLoader(false)
                    console.log('done')
                } else {
                    Toast.show(data?.error_msg, {
                        duration: 3000,
                    })
                    setLoader(false)
                }

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }

        } else {
            Toast.show('Please fill otp', {
                duration: 3000,
            })
        }
    }

    return (
        <NativeBaseProvider>
            <StatusBar translucent backgroundColor='transparent' />
            {loader && <Loader />}

            <ScrollView keyboardShouldPersistTaps='always'>
                <VStack flex={1} justifyContent='space-between' height={Dimensions.get('window').height - 10}>
                    <View>
                        <ImageBackground source={require('../../assets/images/login-BG.png')} style={styles.titleBG} resizeMode='stretch'>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', top: 64, left: 28 }}>
                                <AntDesign name="arrowleft" size={32} color="white" />
                            </TouchableOpacity>

                            <Text fontFamily={fonts.PopB} fontSize={46} color='white'>Verification</Text>
                            <Text mt={-1} fontFamily={fonts.UrbanM} fontSize={20} color='white'>Enter the OTP sent to your email to reset your password.</Text>
                        </ImageBackground>

                        <Text textAlign='center' mt={10} mb={6} fontSize={26} fontFamily={fonts.PopSB}>Enter Your OTP</Text>

                        <OTPTextInput
                            defaultValue='999999'
                            inputCount={6}
                            tintColor='gray'
                            containerStyle={styles.OTPBoxes}
                            textInputStyle={styles.OTPBox}
                            handleTextChange={(value) => setOtp(value)}
                        />

                        <TouchableOpacity>
                            <Text color='#0066CC' fontFamily={fonts.PopB} textAlign='center' textDecorationLine='underline' mt={2}>Resend Code</Text>
                        </TouchableOpacity>
                    </View>

                    <VStack>
                        <TouchableOpacity onPress={submit} style={styles.btn}>
                            <Text fontFamily={fonts.PopSB} fontSize={20} color='white' textAlign='center'>Submit</Text>
                        </TouchableOpacity>
                    </VStack>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    titleBG: {
        aspectRatio: 1,
        width: Dimensions.get('window').width,
        height: undefined,
        paddingVertical: 120,
        paddingHorizontal: 28,
    },
    btn: {
        backgroundColor: '#F39320',
        marginHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 14,
    },
    OTPBoxes: {
        paddingHorizontal: 16,
    },

    OTPBox: {
        borderWidth: 2,
        borderRadius: 6,
        height: 55,
        color: 'black',
        borderBottomWidth: 2,
    }
})

export default VerifyOTP