import { Alert, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer'
import { HStack, NativeBaseProvider, Text, Switch } from 'native-base'
import { AntDesign, Entypo, EvilIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { userContext } from '../context/UserContext'
import { node_url, url } from '../helpers'
import Toast from 'react-native-root-toast'
import Loader from './Loader'
import { fonts } from '../config/Fonts'

const CustomDrawer = (props) => {

    const { setUser, user } = useContext(userContext)
    const [img, setImg] = useState('')
    const [loader, setLoader] = useState(false)

    useEffect(() => {

        async function fetchImage() {
            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "CompanyId": user?.EmployeeDetails?.CompanyId,
            });

            const response = await fetch(url + 'Dashboard/GetImages', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                if (data?.UserImage) {
                    setImg(data)

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
        }

        fetchImage()
    }, [])

    async function LogoutAction() {
        await AsyncStorage.removeItem('app_user')
        setUser(null)
    }

    function Logout() {
        Alert.alert('Logout', 'Are You Sure You Want To Logout?', [
            {
                text: 'Cancel',
                onPress: () => { }
            },
            {
                text: 'Logout',
                onPress: () => LogoutAction()
            },
        ])
    }

    // async function handleChange() {
    //     setLoader(true)
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         quality: 1,
    //     });

    //     if (result.canceled == false) {
    //         let imgSet = {
    //             uri: result.assets[0].uri,
    //             name: "UserImage" + '.' + result.assets[0].uri.split(".").pop(),
    //             type: result.assets[0].type + "/" + result.assets[0].uri.split(".").pop()
    //         }

    //         const formData = new FormData()
    //         formData.append('name', user?.name)
    //         formData.append('mobile', user?.mobile)
    //         formData.append('shop_address', user?.shop_address)
    //         formData.append('business_type', user?.business_type)
    //         formData.append('profile_logo', imgSet, imgSet.name)

    //         const response = await fetch(url + `update-user/${user?.id}`, {
    //             method: 'POST',
    //             headers: {
    //                 "Authorization": `Bearer ${user?.token}`
    //             },
    //             body: formData
    //         });

    //         if (response.ok == true) {
    //             setLoader(false)
    //             const data = await response.json()
    //             if (data.status == 200) {
    //                 await AsyncStorage.setItem("app_user", JSON.stringify(data.user_data))
    //                 setUser(data.user_data)
    //                 setLoader(false)
    //             } else {
    //                 Toast.show(data?.message)
    //                 setLoader(false)
    //             }
    //         } else {
    //             Toast.show('Internal Server Error')
    //             setLoader(false)
    //         }
    //     }
    // }

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView {...props}>
                    <ImageBackground source={require('../assets/images/sidebar-BG.png')} style={{ paddingHorizontal: 20, paddingVertical: 32, marginTop: -4 }}>
                        <View style={styles.imgView}>
                            {img?.UserImage ? <Image source={{ uri: `data:image/png;base64,${img?.UserImage}` }} style={styles.img} /> :
                                <AntDesign name="user" size={24} color="grey" />
                            }
                            {/* <TouchableOpacity onPress={() => handleChange()} style={{ position: 'absolute', bottom: 0, right: 1, backgroundColor: 'white', borderRadius: 100, paddingVertical: 2 }}>
                                    <EvilIcons name="pencil" size={20} color="black" />
                                </TouchableOpacity> */}
                        </View>

                        <Text fontSize={18} fontFamily={fonts.PopB} color='#5E2A2A'>{user?.Name}</Text>
                    </ImageBackground>

                    <View style={{ paddingTop: 10 }}>
                        <DrawerItemList {...props} />
                    </View>
                </DrawerContentScrollView>

                <View style={{ paddingHorizontal: 20, marginBottom: 10, borderTopWidth: 1, borderTopColor: '#ccc' }}>
                    <TouchableOpacity onPress={() => Logout()} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 15 }}>
                        <Image source={require('../assets/icons/logout.png')} style={{ width: 28, height: undefined, aspectRatio: 1 }} />
                        <Text fontSize={17.5} ml={2.5} fontFamily={fonts.PopB}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    imgView: {
        backgroundColor: '#ccc',
        height: 80,
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        position: 'relative',
        marginBottom: 8,
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
        resizeMode: 'contain'
    }
})

export default CustomDrawer;