import { View, StatusBar, ImageBackground, Dimensions, StyleSheet, Image, TouchableOpacity, ScrollView, KeyboardAvoidingView, PermissionsAndroid, Platform } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Input, NativeBaseProvider, Text, VStack } from 'native-base';
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
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

const SalarySlip = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [slips, setSlips] = useState([])

    async function fetchSalarySlips() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
        });

        console.log("raw is here ok:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/PayRoll/GetPayRollMonth', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            console.log('Shift change REQ', data)
            setSlips(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchSalarySlips();
        console.log('user here: ', user)
    }, [])

    async function downloadSlip(slip) {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "PMID": slip?.PMId
        });

        const response = await fetch("https://" + defaultUrl + '/api/Payroll/GeneratePaySlip', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            const localFile = `${RNFS.DocumentDirectoryPath}/${user?.EmployeeDetails?.EmployeeName?.split(' ')[0]} slip ${slip?.PayrollMonth}.pdf`;

            const options = {
                fromUrl: data?.FilePath,
                toFile: localFile,
            };
            RNFS.downloadFile(options)
                .promise.then(() => FileViewer.open(localFile))
                .then(() => {
                    Toast.show('Salry Slip Downloaded.')
                })
                .catch((error) => {
                    // error
                });

            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    return (
        <NativeBaseProvider>
            {loader && <Loader />}

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Salary Slip</Text>
                </HStack>

                <TouchableOpacity onPress={() => alert('Feature will coming soon')}>
                    <Image source={require('../../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView keyboardShouldPersistTaps='always' style={{ paddingHorizontal: 16, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
                {slips?.length > 0 ? slips.map((item, index) => (
                    <TouchableOpacity onPress={() => downloadSlip(item)} style={styles.slipBlock}>
                        <Text style={styles.text1}>Download Salary Slip For</Text>
                        <Text style={styles.text2}>{item?.PayrollMonth}</Text>
                    </TouchableOpacity>
                ))
                    :
                    <VStack flex={1} justifyContent='center' alignItems='center' mb={20} marginTop={250}>
                        <AntDesign name="exclamationcircleo" size={72} color="gray" />
                        <Text fontFamily={fonts.PopR} mx={20} mt={4} textAlign='center' color='gray' fontSize={18}>No Any Salary Slip Available.</Text>
                    </VStack>
                }
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    slipBlock: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F4F4',
        width: '100%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        minHeight: 100,
        marginBottom: 12,
        elevation: 5,
    },
    text1: {
        fontFamily: fonts.UrbanR,
        color: '#333',
        fontSize: 15
    },
    text2: {
        fontFamily: fonts.UrbanB,
        color: '#333',
        fontSize: 28,
        lineHeight: 32,
        marginTop: 4,
        letterSpacing: 1
    },
})

export default SalarySlip;