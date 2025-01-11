import { Alert, Dimensions, Image, ImageBackground, KeyboardAvoidingView, PermissionsAndroid, Platform, ScrollView, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Input, NativeBaseProvider, Stack, Text, TextArea, VStack } from 'native-base';
import { Ionicons, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { userContext } from '../context/UserContext';
import { url } from '../helpers';
import { launchCamera } from 'react-native-image-picker';
import Toast from 'react-native-root-toast';
import Geolocation from '@react-native-community/geolocation'
import Loader from '../component/Loader';
import { useHeaderHeight } from '@react-navigation/elements'
// import geolib from 'geolib';
import * as geolib from 'geolib';

const MobilePunch = ({ navigation }) => {

    const { user, defaultUrl } = useContext(userContext)
    const [img, setImg] = useState('')
    const [remark, setRemark] = useState('')
    const [loader, setLoader] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [myGeoLocation, setMyGeoLocation] = useState([])
    const [userLocation, setUserLocation] = useState([]);
    const [isInsideBoundary, setIsInsideBoundary] = useState(false);

    useEffect(() => {
    // PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(result => {
    //     console.log(result)
    //     if (result == PermissionsAndroid.RESULTS.GRANTED) {
    //         Geolocation.getCurrentPosition(info => {
    //             console.log('geo info', info)
    //             setLatitude(info.coords.latitude)
    //             setLongitude(info.coords.longitude)
    //         })
    //     }
    // })

    Geolocation.getCurrentPosition(info => {
        console.log('geo info', info)
        console.log('geo info latitude', info.coords.latitude.toString())
        setLatitude(info.coords.latitude)
        setLongitude(info.coords.longitude)
        setUserLocation({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
        })
    })
    }, [])

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

        async function fetchGeoLocation() {
            setLoader(true)

            const response = await fetch("https://" + defaultUrl + '/api/PunchInout/GetGEOLocationDetails?EmpId=' + `${user?.EmpId}`)
            if (response.ok == true) {
                const data = await response.json()

                console.log('goeLoc: ', data)
                if (data?.length > 0) {

                    setMyGeoLocation([
                        {
                            latitude: data[0]?.Latitude,
                            longitude: data[0]?.Longitude
                        },
                        {
                            latitude: data[0]?.NorthEastLatitude,
                            longitude: data[0]?.NorthEastLongitude
                        },
                        {
                            latitude: data[0]?.SouthWestlatitude,
                            longitude: data[0]?.SouthWestLongitude
                        }
                    ])
                    setLoader(false)
                } else {
                    // Toast.show(data?.error_msg, {
                    //     duration: 3000,
                    // })
                    setLoader(false)
                }

            } else {
                // Toast.show('Internal server error', {
                //     duration: 3000,
                // })
                setLoader(false)
            }
        }

        fetchImage()
        fetchGeoLocation()
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

    const capturePunchImage = (operation) => {
        if (remark) {
            const options = {
                title: 'Add Image',
                storageOptions: {
                    skipBackup: true,
                    pathL: 'images'
                },
                cameraType: 'front',
                includeBase64: true,
                quality: 0.1
            }

            console.log('hy')

            launchCamera(options, async (response) => {
                if (response?.assets?.length > 0) {

                    console.log('key name', Object.keys(response.assets[0]))

                    setLoader(true)

                    // get current latitute & longitute
                    Geolocation.getCurrentPosition(info => {
                        console.log('geo info', info)
                        console.log('geo info latitude', info.coords.latitude.toString())
                        setLatitude(info.coords.latitude)
                        setLongitude(info.coords.longitude)
                        setUserLocation({
                            latitude: info.coords.latitude,
                            longitude: info.coords.longitude,
                        })
                    })

                    // calculate current date & time 
                    const currentDateTime = getCurrentDateTime();

                    var raw = JSON.stringify({
                        "EmpId": user?.EmpId,
                        "Latitude": latitude?.toString(),
                        "Longitutde": longitude?.toString(),
                        "DateTime": currentDateTime,
                        "OffSet": "+05:30",
                        "CardNO": user?.EmployeeDetails?.CardNo,
                        "Address": "Pune",
                        "remarks": remark,
                        "IMEINO": "335def16-824b-4ddd-a543-663b3cb7107a",
                        "MobileNO": "",
                        "PunchType": "M",
                        "PunchCategory": "Mobile",
                        "OriginalPunchDirection": operation,
                        "PunchAddress": "",
                        "IsNewAddress": true,
                        "EmpImage": response.assets[0].base64
                    });

                    console.log('raw: ', raw)

                    const response1 = await fetch("https://" + defaultUrl + '/api/PunchInout/PunchIn', {
                        method: 'POST',
                        headers: {
                            "Content-Type": 'application/json'
                        },
                        body: raw
                    })

                    if (response1.ok == true) {
                        const data = await response1.json()

                        console.log('punch data: ', JSON.stringify(data))

                        if (data?.Message == 'Success') {
                            Toast.show(operation == 1 ? 'Punch in successfull' : 'Punch out successfull', {
                                duration: 3000,
                            })

                            Alert.alert('Success', operation == 1 ? 'Punch in successfull' : 'Punch out successfull', [
                                {
                                    text: 'Ok',
                                    onPress: () => null
                                },
                            ])

                            // alert(operation == 1 ? 'Punch in successfull' : 'Punch out successfull')

                            setRemark('')
                            setLoader(false)
                        } else {
                            Toast.show(data?.error_msg, {
                                duration: 3000,
                            })

                            Alert.alert('Error', data?.error_msg, [
                                {
                                    text: 'Ok',
                                    onPress: () => null
                                },
                            ])
                            setLoader(false)
                        }

                    } else {
                        Toast.show('Internal server error', {
                            duration: 3000,
                        })
                        Alert.alert('Error', 'Internal Server Error', [
                            {
                                text: 'Ok',
                                onPress: () => null
                            },
                        ])
                        setLoader(false)
                    }

                    // console.log('all keys', Object.keys(response.assets[0]))
                }
            })
        } else {
            Toast.show('Please write remarks', {
                duration: 3000,
            })
        }
    }

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
                                    if (userLocation?.latitude) {
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
                                    if (userLocation?.latitude) {
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