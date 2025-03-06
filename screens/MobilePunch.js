import { Alert, Dimensions, Image, ImageBackground, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Input, NativeBaseProvider, Stack, Text, TextArea, VStack } from 'native-base';
import { Ionicons, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { userContext } from '../context/UserContext';
import { url } from '../helpers';
import { launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import Loader from '../component/Loader';
import { useHeaderHeight } from '@react-navigation/elements'
import { Image as CImage } from 'react-native-compressor'
// import geolib from 'geolib';
import * as geolib from 'geolib';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage'

const MobilePunch = ({ navigation }) => {

    const { user, defaultUrl, latitude, longitude,setUser } = useContext(userContext)
    const [img, setImg] = useState('')
    const [remark, setRemark] = useState('')
    const [loader, setLoader] = useState(false)
    const [address, setAddress] = useState('')
    const [isInsideBoundary, setIsInsideBoundary] = useState(false);
    const [uniqueId, setUniqueId] = useState('')

    useEffect(() => {
        async function fetchImage() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "CompanyId": user?.EmployeeDetails?.CompanyId,
            });

            const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetImages', {
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
        }

        fetchImage()

        function getAddress(lat, lng) {
            const apiKey = user?.GKey;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.status === "OK") {
                        setAddress(data.results[0].formatted_address);
                    } else {
                        console.log("No address found");
                    }
                })
                .catch(error => console.error("Error:", error));
        }

        if (user?.GKey){
            getAddress(latitude, longitude)
        }
        


        async function fetchUniqueId() {
            const id = await DeviceInfo.getUniqueId()
            setUniqueId(id)
        }

        fetchUniqueId()


    }, [])

    function getCurrentDateTime() {
        const currentDate = new Date();

        // Get date components
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');

        // Get time components
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        // Create the formatted date-time string
        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDateTime;
    }

    const capturePunchImage = async (operation) => {
        if (remark) {
            const options = {
                title: 'Add Image',
                mediaType: "photo",
                cameraType: 'front',
                quality: 0.1,
                conversionQuality: 0.1
            };

            setLoader(true);

            launchCamera(options).then(async response => {

                if (response.assets.length > 0) {
                    const currentDateTime = getCurrentDateTime();

                    const raw = {
                        "EmpId": user?.EmpId,
                        "Latitude": latitude?.toString() ?? '0',
                        "Longitutde": longitude?.toString() ?? '0',
                        "DateTime": currentDateTime,
                        "OffSet": "+05:30",
                        "CardNO": user?.EmployeeDetails?.CardNo,
                        "Address": address,
                        "remarks": remark,
                        "IMEINO": uniqueId,
                        "MobileNO": "",
                        "PunchType": "M",
                        "PunchCategory": "Mobile",
                        "OriginalPunchDirection": operation,
                        "PunchAddress": "",
                        "IsNewAddress": true,
                    };

                    const formData = new FormData()

                    for (const key in raw) {
                        formData.append(key, raw[key]);
                    }

                    let var_image = {
                        uri: response.assets[0].uri,
                        name: response.assets[0].fileName,
                        type: response.assets[0].type
                    }

                    formData.append("EmpImage", var_image, var_image.name)

                    try {
                        const response1 = await fetch(`https://${defaultUrl}/api/PunchInout/PunchIn_New`, {
                            method: 'POST',
                            body: formData
                        });

                        if (response1.ok) {
                            const data = await response1.json();
                            if (data?.Message === 'Success') {
                                setLoader(false)
                                Toast.show(operation === 1 ? 'Punch in successful' : 'Punch out successful', { duration: 3000 });

                                Alert.alert('Success', operation === 1 ? 'Punch in successful' : 'Punch out successful', [
                                    { text: 'Ok', onPress: () => null }
                                ]);

                                setRemark('');
                            } else if (data?.error_code == 210) {
                                setLoader(false)
                                Alert.alert('Error', "You have been logged in into other mobile", [{
                                    text: 'Ok', onPress: async () => {
                                        await AsyncStorage.removeItem('app_user')
                                        await AsyncStorage.removeItem('app_user_imputs')
                                        setUser(null)
                                    }
                                }]);
                            } else {
                                setLoader(false)
                                Toast.show(data?.error_msg, { duration: 3000 });
                                Alert.alert('Error', data?.error_msg, [{ text: 'Ok', onPress: () => null }]);
                            }
                        } else {
                            setLoader(false)
                            throw new Error('Internal server error');
                        }
                    } catch (error) {
                        setLoader(false)
                        Toast.show(error.message, { duration: 3000 });
                        Alert.alert('Error', error.message, [{ text: 'Ok', onPress: () => null }]);
                    }
                }
            })
        } else {
            Toast.show('Please write remarks', { duration: 3000 });
        }
    };


    const headerHight = useHeaderHeight()

    return (
        <NativeBaseProvider>
            {loader && <Loader />}

            <StatusBar translucent backgroundColor='transparent' />
            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={headerHight + (Dimensions.get('window').height / 100) * 10} behavior={Platform.OS === 'ios' ? 'padding' : 'position' + 1}>
                <ScrollView>
                    <ImageBackground source={require('../assets/images/punch-BG.png')} style={styles.titleBG} resizeMode='stretch'>
                        <HStack alignItems='center' justifyContent='space-between' mt={12 + StatusBar.currentHeight}>
                            <HStack alignItems='center'>
                                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                                </TouchableOpacity>

                                <Text fontFamily={fonts.PopSB} fontSize={26} ml={7} color='white'>Mobile Punch</Text>
                            </HStack>

                            <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
                                <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                            </TouchableOpacity>
                        </HStack>

                        <View style={styles.imgView}>
                            {img?.UserImage ? <Image source={{ uri: `data:image/png;base64,${img?.UserImage}` }} style={styles.img} /> :
                                <AntDesign name="user" size={60} color="white" />
                            }
                        </View>

                        <Text fontFamily={fonts.PopB} textAlign='center' fontSize={26} color='white' mb={7}>{user?.Name}</Text>
                    </ImageBackground>

                    <View style={{ backgroundColor: '#0F74B3' }}>
                        <VStack backgroundColor='white' borderTopLeftRadius='65px' px={5} pt={10}>
                            <Stack borderBottomColor='gray.400' borderBottomWidth={2} w='100%'>
                                <Input
                                    value={remark}
                                    onChangeText={setRemark}
                                    placeholder="Enter Your Remark"
                                    style={{ fontFamily: fonts.PopM, fontSize: 16, maxHeight: 100, paddingBottom: 6 }}
                                    multiline={true}
                                    variant='unstyled'
                                    InputLeftElement={<Image source={require('../assets/icons/input-icon.png')} style={{ width: 20, height: undefined, aspectRatio: 1, alignSelf: 'flex-start', marginTop: 12 }} />}
                                />
                            </Stack>

                            <HStack mt={12} justifyContent='space-between'>
                                <TouchableOpacity onPress={() => {
                                    if (latitude) {
                                        // if (myGeoLocation.length > 0) {

                                        //     const isInside = geolib.isPointInPolygon(
                                        //         userLocation,
                                        //         myGeoLocation
                                        //     );
                                        //     if (!isInside) {
                                        //         alert('You are not in your work area!')
                                        //     } else {
                                        //         capturePunchImage(1)
                                        //     }
                                        // } else {
                                        capturePunchImage(1)
                                        // }
                                    } else {
                                        alert('Please Enable Location And Restart Mobile Application To Perform This Action!')
                                    }
                                }}>
                                    <Image source={require('../assets/images/punch-in.png')} style={styles.puchBTN} />
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    if (latitude) {
                                        // if (myGeoLocation.length > 0) {

                                        //     const isInside = geolib.isPointInPolygon(
                                        //         userLocation,
                                        //         myGeoLocation
                                        //     );
                                        //     if (!isInside) {
                                        //         alert('You are not in your work area!')
                                        //     } else {
                                        //         capturePunchImage(2)
                                        //     }
                                        // } else {
                                        capturePunchImage(2)
                                        // }
                                    } else {
                                        alert('Please Enable Location And Restart Mobile Application To Perform This Action!')
                                    }
                                }}>
                                    <Image source={require('../assets/images/punch-out.png')} style={styles.puchBTN} />
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </NativeBaseProvider >
    )
}

const styles = StyleSheet.create({
    titleBG: {
        width: Dimensions.get('window').width,
        minHeight: 240,
        paddingHorizontal: 18,
    },
    imgView: {
        alignSelf: 'center',
        backgroundColor: '#ccc',
        width: 200,
        height: undefined,
        aspectRatio: 1,
        borderRadius: 20,
        marginTop: 36,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        resizeMode: 'contain'
    },
    puchBTN: {
        width: Dimensions.get('window').width / 100 * 41,
        height: undefined,
        aspectRatio: 1,
    }
})

export default MobilePunch;