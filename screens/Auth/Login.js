import { View, StatusBar, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Input, NativeBaseProvider, Text, VStack } from 'native-base';
import { fonts } from '../../config/Fonts'
import { Feather } from 'react-native-vector-icons'
import Toast from 'react-native-root-toast';
import { url } from '../../helpers';
import Loader from '../../component/Loader'

const Login = ({ navigation }) => {

  const [serverURL, setServerURl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(true)
  const [loader, setLoader] = useState(false)

  async function login() {
    if (username && password) {
      setLoader(true)

      var raw = JSON.stringify({
        "UserName": username,
        "password": password,
        "imei": "f5252eba-c185-45a9-a4c5-1d094b8daf84"
      });

      const response = await fetch(url + 'LoginDetails/Post', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()

        if (data?.EmpId) {
          navigation.navigate('VerifyOTP', { data: JSON.stringify(data) })
          setLoader(false)
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
      Toast.show('Please fill all data', {
        duration: 3000,
      })
    }
  }

  return (
    <NativeBaseProvider>
      <StatusBar translucent backgroundColor='transparent' />
      {loader && <Loader />}

      <ScrollView keyboardShouldPersistTaps='always'>
        <VStack flex={1} justifyContent='space-between' height={Dimensions.get('window').height + 10}>
          <View>
            <ImageBackground source={require('../../assets/images/login-BG.png')} style={styles.titleBG} resizeMode='stretch'>
              <Text fontFamily={fonts.PopB} fontSize={46} color='white'>Login</Text>
              <Text mt={-1} fontFamily={fonts.UrbanM} fontSize={20} color='white'>Welcome to <Text fontFamily={fonts.UrbanEB} textDecorationLine='underline'>protea private limited</Text> Please Login to continue.</Text>
            </ImageBackground>

            <VStack px='20px' mt={16}>
              <VStack mb={9}>
                <Input InputLeftElement={<Image style={styles.icon} source={require('../../assets/icons/URL.png')} />} placeholder="Server URL" variant='unstyled' style={styles.input} borderBottomColor='gray.400' borderBottomWidth={2} value={serverURL} onChangeText={setServerURl} />
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
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fonts.PopM
  }
})

export default Login;