import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"

const CreateEHCRequest = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [showReason, setShowReason] = useState(false);
    const [allReasons, setAllReasons] = useState('');
    const [particularReason, setParticularReason] = useState('');

    const handleFromDate = (date) => {
        console.warn("A date has been picked: ", date.toString());

        const convertedDate = getConvertDate(date.toString());
        setFromDate(convertedDate)
        setFromDateCalendarShow(false);
    };

    const handleToDate = (date) => {
        console.warn("A date has been picked: ", date.toString());

        const convertedDate = getConvertDate(date.toString());
        setToDate(convertedDate)
        setToDateCalendarShow(false);
    };

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                </TouchableOpacity>

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply ECH/OT</Text>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <VStack flex={1}>
                        <Text style={[styles.label, { marginTop: 4 }]}>From Date</Text>
                        <TouchableOpacity onPress={() => setFromDateCalendarShow(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{fromDate ? fromDate.toString() : 'Select Date'}</Text>
                            <AntDesign name="calendar" size={18} color="#737373" />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={fromDateCalendarShow}
                            mode="date"
                            onConfirm={handleFromDate}
                            onCancel={() => setFromDateCalendarShow(false)}
                        />
                    </VStack>

                    <VStack flex={1}>
                        <Text style={styles.label}>To Date</Text>
                        <TouchableOpacity onPress={() => setToDateCalendarShow(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{toDate ? toDate.toString() : 'Select Date'}</Text>
                            <AntDesign name="calendar" size={18} color="#737373" />
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={ToDateCalendarShow}
                            mode="date"
                            onConfirm={handleToDate}
                            onCancel={() => setToDateCalendarShow(false)}
                        />
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Select Reason</Text>
                        <TouchableOpacity onPress={() => setShowReason(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{particularReason ? particularReason?.RDescription : 'Select Reason'}</Text>
                            <Entypo name="chevron-small-down" size={24} color="#737373" />
                        </TouchableOpacity>

                        <Actionsheet isOpen={showReason} onClose={() => setShowReason(false)}>
                            <Actionsheet.Content>
                                {allReasons?.length > 0 ? allReasons?.map((item, index) => (
                                    <Actionsheet.Item onPress={() => {
                                        setParticularReason(item)
                                        setShowReason(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                    </Actionsheet.Item>

                                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                            </Actionsheet.Content>
                        </Actionsheet>
                    </VStack>
                </View>
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
    inputView: {
        width: '100%',
        borderColor: '#1875e2',
        paddingHorizontal: 10,
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 15
    },
    placeHolder: {
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 15
    },
})

export default CreateEHCRequest;