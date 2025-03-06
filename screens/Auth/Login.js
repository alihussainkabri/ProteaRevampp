import { View, StatusBar, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, PermissionsAndroid, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Input, NativeBaseProvider, Text, VStack } from 'native-base';
import { fonts } from '../../config/Fonts'
import { Feather } from 'react-native-vector-icons'
import Toast from 'react-native-root-toast';
import { url } from '../../helpers';
import Loader from '../../component/Loader'
import { useHeaderHeight } from '@react-navigation/elements'
import { userContext } from '../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PERMISSIONS, check, RESULTS, requestMultiple } from 'react-native-permissions';
import uuid from 'react-native-uuid';
import DeviceInfo from 'react-native-device-info';

const Login = ({ navigation }) => {

  const [serverURL, setServerURl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loader, setLoader] = useState(false)
  const [uniqueId, setUniqueId] = useState('')
  const { defaultUrl, setDefaultUrl } = useContext(userContext)

  useEffect(() => {
    async function fetchUniqueId() {
      const id = await DeviceInfo.getUniqueId()
      setUniqueId(id)
    }

    fetchUniqueId()
  }, [])

  async function login() {
    if (username && password) {
      setLoader(true)

      var raw = JSON.stringify({
        "UserName": username,
        "password": password,
        "imei": uniqueId
      });

      const response = await fetch("https://" + defaultUrl + '/api/LoginDetails/Post', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()

        if (data?.EmpId) {
          navigation.navigate('VerifyOTP', { data: JSON.stringify(data), user_input: raw, uniqueId })
          setLoader(false)
        } else {
          alert(data?.error_msg ? data?.error_msg : 'Error In Login')
          setLoader(false)
        }

      } else {
        alert('Internal server error')
        setLoader(false)
      }

    } else {
      alert('Please fill all data')
    }
  }

  const headerHight = useHeaderHeight()

  const requestPermissions = async () => {
    try {
      await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ],
        {
          title: 'Device Permissions Required',
          message: "ProteaESS needs access to the following permisions",
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermissionIOS = () => {
    let Permissions_arr = [
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    ]

    let requestable_permission = []

    for (let i = 0; i < Permissions_arr.length; i++) {
      check(Permissions_arr[i]).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            requestable_permission.push(Permissions_arr[i])
            break;
        }
      })
    }

    if (requestable_permission.length > 0) {
      requestMultiple(requestable_permission)
    }
  }

  useEffect(() => {

    if (Platform.OS == 'android') {
      requestPermissions();
    } else {
      requestPermissionIOS()
    }
  }, [])

  return (
    <NativeBaseProvider>
      <StatusBar translucent backgroundColor='transparent' />
      {loader && <Loader />}

      <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={headerHight + (Dimensions.get('window').height / 100) * 10} behavior={Platform.OS === 'ios' ? 'padding' : 'position' + 1}>
        <ScrollView keyboardShouldPersistTaps='always'>
          <VStack flex={1} justifyContent='space-between' height={Dimensions.get('window').height + 10}>
            <View>
              <ImageBackground source={require('../../assets/images/login-BG.png')} style={styles.titleBG} resizeMode='stretch'>
                <Text fontFamily={fonts.PopB} fontSize={46} color='white'>Login</Text>
                <Text mt={-1} fontFamily={fonts.UrbanM} fontSize={20} color='white'>Welcome to <Text fontFamily={fonts.UrbanEB} textDecorationLine='underline'>protea private limited</Text> Please Login to continue.</Text>
              </ImageBackground>

              <VStack px='20px' mt={16}>
                <VStack mb={9}>
                  <Input InputLeftElement={<Image style={styles.icon} source={require('../../assets/icons/URL.png')} />} placeholder="Server URL" variant='unstyled' style={styles.input} borderBottomColor='gray.400' borderBottomWidth={2} value={defaultUrl} onChangeText={async (text) => {
                    setDefaultUrl(text)
                    await AsyncStorage.setItem('protea_default_url', text)
                  }} />
                </VStack>

                <VStack mb={9}>
                  <Input InputLeftElement={<Image style={styles.icon} source={require('../../assets/icons/user.png')} />} placeholder="Username" variant='unstyled' style={styles.input} borderBottomColor='gray.400' borderBottomWidth={2} value={username} onChangeText={setUsername} />
                </VStack>

                <VStack mb={9}>
                  <Input InputLeftElement={<Image style={[styles.icon, { width: 20 }]} source={require('../../assets/icons/password.png')} />}
                    InputRightElement={<TouchableOpacity onPress={() => setShow(!show)}>
                      <Feather style={{ paddingRight: 8 }} name={show ? 'eye' : "eye-off"} size={18} color="gray" />
                    </TouchableOpacity>}
                    style={[styles.input, { paddingLeft: 16 }]}
                    type={show ? 'text' : 'password'}
                    placeholder="Password" variant='unstyled' borderBottomColor='gray.400' borderBottomWidth={2} value={password} onChangeText={setPassword} />
                </VStack>
              </VStack>
            </View>

            <VStack>
              <TouchableOpacity onPress={login} style={styles.btn}>
                <Text fontFamily={fonts.PopSB} fontSize={20} color='white' textAlign='center'>Login</Text>
              </TouchableOpacity>

              <Text style={styles.Rights}>Powered By Protea Infotech Private Limited</Text>
            </VStack>
          </VStack>
        </ScrollView>
      </KeyboardAvoidingView>
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
  icon: {
    width: 24,
    height: undefined,
    aspectRatio: 1,
    marginLeft: 8
  },
  input: {
    fontFamily: fonts.PopM,
    paddingLeft: 12,
    fontSize: 16,
    paddingBottom: 2,
  },
  btn: {
    backgroundColor: '#F39320',
    marginHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 4
  },
  Rights: {
    color: '#0F74B3',
    textDecorationLine: 'underline',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: fonts.PopM,
    marginBottom: 30,
    marginTop: 10
  }
})

export default Login;