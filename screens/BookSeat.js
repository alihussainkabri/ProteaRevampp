import { View, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Loader from '../component/Loader';
import { Actionsheet, HStack, NativeBaseProvider, Text, VStack } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { getConvertDate } from '../helpers';

const BookSeat = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [date, setDate] = useState('')
    const [showBranch, setShowBranch] = useState(false)
    const [particularBranch, setParticularBranch] = useState('')
    const [allBranches, setAllBranches] = useState([])
    const [showBuilding, setShowBuilding] = useState(false)
    const [Building, setBuilding] = useState('')
    const [allBuildings, setAllBuildings] = useState([])
    const [showBuildingArea, setShowBuildingArea] = useState(false)
    const [BuildingArea, setBuildingArea] = useState('')
    const [allBuildingArea, setAllBuildingArea] = useState([])

    const handleFromDate = (date) => {

        const convertedDate = getConvertDate(date.toString());
        setDate(convertedDate)
        setShowCalendar(false);
    };

    return (
        <NativeBaseProvider>

            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Book Seat</Text>
                </HStack>

                <TouchableOpacity onPress={() => alert('Feature will coming soon')}>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, }} showsVerticalScrollIndicator={false}>

                {/* Branches */}
                <VStack>
                    <Text style={styles.label}>Select Branch</Text>
                    <TouchableOpacity onPress={() => setShowBranch(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{particularBranch ? particularBranch : 'Select Branch'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBranch} onClose={() => setShowBranch(false)}>
                        <Actionsheet.Content>
                            {allBranches?.length > 0 ? allBranches?.map((item, index) => (
                                <Actionsheet.Item key={index} onPress={() => {
                                    setParticularBranch(item)
                                    setShowBranch(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                </Actionsheet.Item>

                            )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* Building */}
                <VStack>
                    <Text style={styles.label}>Select Building</Text>
                    <TouchableOpacity onPress={() => setShowBuilding(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{Building ? Building : 'Select Building'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBuilding} onClose={() => setShowBuilding(false)}>
                        <Actionsheet.Content>
                            {allBuildings?.length > 0 ? allBuildings?.map((item, index) => (
                                <Actionsheet.Item key={index} onPress={() => {
                                    setBuilding(item)
                                    setShowBuilding(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                </Actionsheet.Item>

                            )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* Building Area */}
                <VStack>
                    <Text style={styles.label}>Select Building Area</Text>
                    <TouchableOpacity onPress={() => setShowBuildingArea(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{BuildingArea ? BuildingArea : 'Select Building Area'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBuildingArea} onClose={() => setShowBuildingArea(false)}>
                        <Actionsheet.Content>
                            {allBuildingArea?.length > 0 ? allBuildingArea?.map((item, index) => (
                                <Actionsheet.Item key={index} onPress={() => {
                                    setBuildingArea(item)
                                    setShowBuildingArea(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                </Actionsheet.Item>

                            )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* booking date */}
                <VStack flex={1}>
                    <Text style={styles.label}>Booking Date</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{date ? date.toString() : 'Booking Date'}</Text>
                        <AntDesign name="calendar" size={18} color="#737373" />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={showCalendar}
                        mode="date"
                        onConfirm={handleFromDate}
                        onCancel={() => setShowCalendar(false)}
                    />
                </VStack>

                <TouchableOpacity onPress={() => navigation.navigate('ViewSeats')} style={styles.btn}>
                    <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>View Seats</Text>
                </TouchableOpacity>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    label: {
        color: '#4f4f4f',
        fontFamily: fonts.PopM,
        fontSize: 16,
        marginTop: 20,
        marginBottom: 4,
    },
    selectDate: {
        borderWidth: 1,
        borderColor: '#1875e2',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    placeHolder: {
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 15
    },
    btn: {
        marginTop: 20,
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#1875e2'
    },
})

export default BookSeat;