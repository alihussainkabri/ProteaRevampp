import { View, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useState } from 'react'
import Loader from '../component/Loader';
import { Actionsheet, HStack, NativeBaseProvider, Text, VStack } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { getConvertDate } from '../helpers';

const ViewSeats = ({ navigation }) => {

    const [loader, setLoader] = useState(false)

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Select Seat</Text>
                </HStack>

                <TouchableOpacity onPress={() => alert('Feature will coming soon')}>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8, marginTop: 6 }}>
                    <Text style={styles.seatType} fontWeight={600}>Total Seats: 362</Text>
                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Booked Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Disabled Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Available Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Pending Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Occupied Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center' mr={4}>
                        <View style={[styles.seatClr, { backgroundColor: 'red' }]}></View>
                        <Text style={styles.seatType}>Contingency Seats: 362</Text>
                    </HStack>
                </ScrollView>

                <HStack pl={Dimensions.get('window').width / 100 * 2} mt={3} flexWrap='wrap'>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                    <Text style={styles.particularseat}>1</Text>
                </HStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    seatClr: {
        height: 18,
        width: 18,
        borderRadius: 4,
        marginRight: 6
    },
    seatType: {
        fontFamily: fonts.PopM,
        marginRight: 20,
    },
    particularseat: {
        backgroundColor: 'red',
        width: (Dimensions.get('window').width / 100 * 9),
        height: (Dimensions.get('window').width / 100 * 9),
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 32,
        borderRadius: 6,
        color: 'white',
        marginRight: (Dimensions.get('window').width / 100) * .70,
        marginBottom: 6
    }
})

export default ViewSeats