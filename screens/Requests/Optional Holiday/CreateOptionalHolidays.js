import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-root-toast';

const CreateOptionalHolidays = ({ navigation }) => {

    const { user, defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [showReason, setShowReason] = useState(false);
    const [particularReason, setParticularReason] = useState('');
    const [allReasons, setAllReasons] = useState('');
    const [showYears, setShowYears] = useState(false);
    const [ particularYear, setParticularYear] = useState('');
    const [allYears, setAllYears] = useState('');
    const [holidayCount, setHolidayCount] = useState(0);
    const [reason, setReason] = useState('');

    async function fetchYears() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
        });

        const response = await fetch("https://" + defaultUrl + '/api/HolidayRequests/GetCalendarYear', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            console.log('all years data: ', data?.Table)
            setAllYears(data?.Table)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    async function fetchHolidayCount() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "year" : particularYear?.Year
        });

        const response = await fetch("https://" + defaultUrl + '/api/HolidayRequests/GetMappedOptionalHoliday', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            console.log('all holiday data: ', data)
            setHolidayCount(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchYears();
    }, [])

    useEffect(() => {
        fetchHolidayCount();
    }, [particularYear])

    async function submitReq() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "ShiftChangeFromDate": fromDate,
            "ShiftChangeToDate": toDate,
            "ReqType": "ShiftChangeRequest",
            "RId": particularReason?.RId,
            "Reason": reason,
            "NewScheduleId": 1,
            "NewScheduleType": "S"
        });

        console.warn('shift Req consoled here', raw)

        const response = await fetch("https://" + defaultUrl + '/api/ShiftChangeRequest/CreateOptionalHolidays', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            // alert(data?.error_msg)
            Toast.show(data?.error_msg ? data?.error_msg : 'Request Has Been Submitted')
            setLoader(false)
            if (!data?.error_msg) {
                navigation.goBack()
            }

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
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                </TouchableOpacity>

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply Opt Holiday</Text>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <VStack>
                        <Text style={styles.label}>Select Financial Year</Text>
                        <TouchableOpacity onPress={() => setShowYears(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{particularYear ? particularYear?.Year : 'Select Year'}</Text>
                            <Entypo name="chevron-small-down" size={24} color="#737373" />
                        </TouchableOpacity>

                        <Actionsheet isOpen={showYears} onClose={() => setShowYears(false)}>
                            <Actionsheet.Content>
                                {allYears?.length > 0 ? allYears?.map((item, index) => (
                                    <Actionsheet.Item onPress={() => {
                                        setParticularYear(item)
                                        setShowYears(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.Year}</Text>
                                    </Actionsheet.Item>

                                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                            </Actionsheet.Content>
                        </Actionsheet>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Enter Remark</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={reason} onChangeText={setReason} />
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Max Holiday Applicable</Text>
                        <TouchableOpacity disabled style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{holidayCount?.MaxHolidaysAllows ? holidayCount?.MaxHolidaysAllows : 0}</Text>
                        </TouchableOpacity>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Total Holiday Availed</Text>
                        <TouchableOpacity disabled style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{holidayCount?.HolidayAvail ? holidayCount?.HolidayAvail : 0}</Text>
                        </TouchableOpacity>
                    </VStack>

                    <HStack mt={4} space={2} mb={2}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, { backgroundColor: '#f5e9e9' }]}>
                            <Text style={{ color: '#cf0101' }} fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={submitReq} style={[styles.btn, { backgroundColor: '#1875e2' }]}>
                            <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Submit</Text>
                        </TouchableOpacity>
                    </HStack>
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
    btn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4
    },
})

export default CreateOptionalHolidays;