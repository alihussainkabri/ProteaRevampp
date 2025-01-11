import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { userContext } from '../context/UserContext';
import { getTimeZoneOffsetISOString } from '../helpers';
import Geolocation from '@react-native-community/geolocation'
import moment from 'moment';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../component/Loader';
import Toast from 'react-native-root-toast';

const QRScanner = ({navigation}) => {
    const { user, defaultUrl } = useContext(userContext)
    const [userGeoLocation,setUserGeoLocation] = useState({
        latitude : "",
        longitude : ""
    })
    const [uniqueId, setUniqueId] = useState('')
    const [load,setLoad] = useState(false)

    async function submitQR(qrdata) {

        if (userGeoLocation?.latitude && userGeoLocation?.longitude){
            setLoad(true)
            let payload = {
                "EmployeeId": user?.EmpId,
                "submitdatetime": moment(new Date()).format("YYYY-MM-DD"),
                "ImeiNo": uniqueId,
                "Latitude": userGeoLocation?.latitude,
                "Longitude": userGeoLocation?.longitude,
                "QrCodeData": qrdata,
                "Offset": getTimeZoneOffsetISOString(),
            }

            
    
            const response = await fetch("https://" + defaultUrl + "/api/TimeAttendanceAPI/CheckQRCodeAssignToEmp",{
                method : "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                body : JSON.stringify(payload)
            })

            console.log("https://" + defaultUrl + "/api/TimeAttendanceAPI/CheckQRCodeAssignToEmp")

            if (response.ok == true){
                const data = await response.json()

                console.log(data)

                if (data?.Result == 0){
                    Toast.show(data?.Message)
                    setLoad(false)
                }else{
                    setLoad(false)
                    Toast.show("QR code scanned successfully!")
                    navigation.goBack()
                }
            }else{
                setLoad(false)
                Toast.show("Internal server error")
            }
        }else{
            alert("Unable to get the location. Please enable location")
        }

        
    }

    useEffect(() => {
        const checkLocationPermission = async () => {
            try {
                const permission =
                    Platform.OS === 'android'
                        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE;

                const result = await check(permission);

                if (result === RESULTS.GRANTED) {
                    // Permission granted, get location
                    Geolocation.getCurrentPosition(
                        (info) => {
                            setUserGeoLocation({
                                latitude : info.coords.latitude,
                                longitude : info.coords.longitude
                            })
                        },
                        (error) => {
                            if (error.code == 1 || error.code == 2) {
                                alert('Your location is Off. Please Turn on location to access this feature')
                            }
                        }
                    );
                } else if (result === RESULTS.DENIED) {
                    // Request permission
                    const requestResult = await request(permission);
                    if (requestResult === RESULTS.GRANTED) {
                        // Permission granted, retry location fetch
                        Geolocation.getCurrentPosition((info) => {
                            setUserGeoLocation({
                                latitude : info.coords.latitude,
                                longitude : info.coords.longitude
                            })
                        });
                    } else {
                        Alert.alert(
                            'Permission Denied',
                            'Location permission is required to use this feature. Please enable it in Settings.',
                            [
                                { text: 'Cancel', style: 'cancel' },
                            ]
                        );
                    }
                } else if (result === RESULTS.BLOCKED) {
                    // Permission blocked, redirect to settings
                    Alert.alert(
                        'Permission Blocked',
                        'Location permission is blocked. Please enable it in Settings.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                        ]
                    );
                }
            } catch (error) {
                console.error('Permission check error:', error);
            }
        };

        checkLocationPermission();

        async function fetchUniqueId() {
            const uniqueValue = await AsyncStorage.getItem("app_user_uniqueId")
            if (uniqueValue) {
              setUniqueId(uniqueValue)
            } else {
              setUniqueId(uuid.v4())
            }
          }
      
          fetchUniqueId()
    }, []);

    return (
        <>
        {load && <Loader />}
        <View>
            <QRCodeScanner
                reactivate={true}
                reactivateTimeout={2000}
                onRead={(e) => submitQR(e.data)}
                showMarker={true}
                flashMode={RNCamera.Constants.FlashMode.auto}
                cameraStyle={{
                    height: Dimensions.get('window').height
                }}
                cameraContainerStyle={{
                    height: Dimensions.get('window').height
                }}
            />
        </View>
        </>
    )
}

export default QRScanner

const styles = StyleSheet.create({
    centerText: {
        flex: 1,
        fontSize: 18,
        padding: 32,
        color: '#777'
    },
    textBold: {
        fontWeight: '500',
        color: '#000'
    },
    buttonText: {
        fontSize: 21,
        color: 'rgb(0,122,255)'
    },
    buttonTouchable: {
        padding: 16
    }
});