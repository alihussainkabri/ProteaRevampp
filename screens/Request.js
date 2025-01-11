import { View, StatusBar, ImageBackground, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack } from 'native-base';
import Loader from '../component/Loader';
import { Ionicons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Request = ({ navigation }) => {

    const [loader, setLoader] = useState(false)

    const inset = useSafeAreaInsets()

    return (
        <NativeBaseProvider>
            {loader && < Loader />}
            <View style={{ paddingTop: inset.top }}>
                <StatusBar backgroundColor='#0F74B3' translucent />
            </View>
            {/* <StatusBar translucent backgroundColor='transparent' /> */}

            <ImageBackground source={require('../assets/images/request-BG.png')} style={styles.titleBG} resizeMode='stretch'>
                <HStack alignItems='center' justifyContent='space-between'>
                    <HStack alignItems='center'>
                        <TouchableOpacity onPress={() => navigation.openDrawer()}>
                            <Ionicons name="md-menu-sharp" size={32} color="white" />
                        </TouchableOpacity>

                        <Text fontFamily={fonts.PopSB} fontSize={26} ml={7} color='white'>Request</Text>
                    </HStack>

                    <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
                        <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                    </TouchableOpacity>
                </HStack>
            </ImageBackground>

            <ScrollView style={{ marginTop: -140 }}>
                <VStack px={Dimensions.get('window').width / 100 * 3}>
                    <HStack flexWrap='wrap' justifyContent='space-between'>
                        <TouchableOpacity onPress={() => navigation.navigate('ListOfLeave')} style={[styles.summaryBlock, { backgroundColor: 'rgba(238, 227, 231, .9)' }]}>
                            <Text style={styles.summaryTitle}>Leave</Text>
                            <Image source={require('../assets/images/leave-icon.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListofOnDutyRequests')} style={[styles.summaryBlock, { backgroundColor: 'rgba(238, 201, 210, .9)' }]}>
                            <Text style={styles.summaryTitle}>On Duty</Text>
                            <Image source={require('../assets/images/on-duty.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListOfAttReg')} style={[styles.summaryBlock, { backgroundColor: 'rgba(179, 205, 224, .7)' }]}>
                            <Text style={styles.summaryTitle}>Attendance Regularization</Text>
                            <Image source={require('../assets/images/attendance.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListOfShiftChangeRequests')} style={[styles.summaryBlock, { backgroundColor: 'rgba(249, 244, 244, 1)' }]}>
                            <Text style={styles.summaryTitle}>Shift Change</Text>
                            <Image source={require('../assets/images/shift-change.png')} style={[styles.summaryBlockImg, { opacity: .8 }]} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListOfEHCRequests')} style={[styles.summaryBlock, { backgroundColor: 'rgba(179, 205, 224, .9)' }]}>
                            <Text style={styles.summaryTitle}>EHC / OT</Text>
                            <Image source={require('../assets/images/EHC.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListOfCOffRequests')} style={[styles.summaryBlock, { backgroundColor: 'rgba(202, 202, 235, .9)' }]}>
                            <Text style={styles.summaryTitle}>C-OFF</Text>
                            <Image source={require('../assets/images/C-off.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListLCEG')} style={[styles.summaryBlock, { backgroundColor: 'rgba(250, 235, 215, .8)' }]}>
                            <Text style={styles.summaryTitle}>Late Coming / Early Going</Text>
                            <Image source={require('../assets/images/Late_Coming.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => navigation.navigate('ListOfOptionalHolidays')} style={[styles.summaryBlock, { backgroundColor: 'rgba(217, 217, 217, .7)' }]}>
                            <Text style={styles.summaryTitle}>Optional Holiday</Text>
                            <Image source={require('../assets/images/OPT-holiday.png')} style={styles.summaryBlockImg} />
                        </TouchableOpacity>
                    </HStack>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    titleBG: {
        width: Dimensions.get('window').width,
        minHeight: 230,
        paddingHorizontal: 18,
    },
    summaryBlock: {
        width: Dimensions.get('window').width / 100 * 45,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        minHeight: 150,
        marginBottom: 12,
    },
    summaryTitle: {
        fontFamily: fonts.PopSB,
        color: '#333',
        fontSize: 19,
    },
    summaryBlockImg: {
        width: 90,
        height: undefined,
        aspectRatio: 1,
        position: 'absolute',
        right: 12,
        bottom: 0,
    },
})

export default Request;