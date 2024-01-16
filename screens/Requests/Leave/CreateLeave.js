import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"

const CreateLeave = ({ navigation }) => {

    const { user } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [leaveBalance, setLeaveBalance] = useState('')
    const [leaveDuration, setLeaveDuration] = useState('1st Half')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromEntire, setFromEntire] = useState(true);
    const [toEntire, setToEntire] = useState(true);
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [noOfDays, setNoOfDays] = useState('');
    const [showLeaveType, setShowLeaveType] = useState(false);
    const [particularLeaveType, setParticularLeaveType] = useState('');
    const [allLeaveType, setAllLeaveType] = useState('');
    const [showReason, setShowReason] = useState(false);
    const [allReasons, setAllReasons] = useState('');
    const [particularReason, setParticularReason] = useState('');

    useEffect(() => {
        async function fetchLeaveBalance() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId
            });

            const response = await fetch(url + 'LeaveRequests/GetLeaveBalance', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()
                console.log(data)

                setLeaveBalance(data)
                setLoader(false)

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        }

        async function fetchReasons() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "ModuleName": "Leave Management",
                "FormName": "W_LeaveRequest"
            });

            const response = await fetch(url + 'Requests/SearchReason', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()
                console.log('reasons', data)

                setAllReasons(data)
                setLoader(false)

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        }



        fetchLeaveBalance();
        fetchReasons();
    }, [])

    async function fetchLeaveType() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "FromDate": fromDate,
            "ToDate": toDate

        });

        const response = await fetch(url + 'LeaveRequests/GetApplicableLeaveTypeBasedOnDates', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            console.log('leave types', data)

            setAllLeaveType(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchLeaveType();
    }, [fromDate, toDate])

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

    useEffect(() => {
        
    }, [leaveDuration, fromDate, toDate, fromEntire, toEntire])

    // function calculateNoOfDays(FirstDayLeaveType, LastDayLeaveType) {
    //     const date1 = new Date(fromDate);
    //     const date2 = new Date(toDate);

    //     const differenceMs = Math.abs(date2 - date1);
    //     const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    //     if (FirstDayLeaveType == 'entireDay' && LastDayLeaveType == 'entireDay') {
    //         console.log('diff is here', differenceDays + 1)
    //         setNoOfDays(differenceDays + 1)
    //     }
    // }

    // useEffect(() => {
    //     if (leaveDuration == '1st Half') {
    //         setNoOfDays(.5)

    //     } else if (leaveDuration == '2nd Half') {
    //         setNoOfDays(.5)

    //     } else if (leaveDuration == 'Full Day') {
    //         setNoOfDays(1)

    //     } else if (leaveDuration == 'Multi Day') {
    //         if (fromEntire && toEntire) {
    //             calculateNoOfDays('entireDay', 'entireDay')
    //         }
    //     }
    // }, [leaveDuration, fromDate, toDate, fromEntire, toEntire])

    // useEffect(() => {console.log(show)}, [show])

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                </TouchableOpacity>

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply Leave</Text>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <Text color='#4f4f4f' fontFamily={fonts.PopM} fontSize={16} mt={1} mb={1}>Available Leave Balance</Text>
                    <VStack borderColor='gray.200' borderWidth={1}>
                        <HStack backgroundColor='#e9eef5'>
                            <Text style={styles.tableTitle}>Type</Text>
                            <Text style={styles.tableTitle}>Opening</Text>
                            <Text style={styles.tableTitle}>Availed</Text>
                            <Text style={styles.tableTitle}>Balance</Text>
                        </HStack>
                        {leaveBalance?.length > 0 ? leaveBalance.map((item, index) => (
                            <HStack key={index} borderBottomWidth={leaveBalance?.length == index + 1 ? 0 : 1} borderBottomColor='gray.200'>
                                <Text style={styles.tableValue}>{item?.ShortName}</Text>
                                <Text style={styles.tableValue}>{item?.OpeningBalance}</Text>
                                <Text style={styles.tableValue}>{item?.Availed}</Text>
                                <Text style={styles.tableValue}>{item?.CurrentBalance}</Text>
                            </HStack>
                        )) : <Text fontFamily={fonts.UrbanSB} textAlign='center' color='#737373' my={2}>No Data</Text>}
                    </VStack>

                    <Text style={styles.label}>Leave Duration</Text>
                    <Radio.Group name="leaveDuration" defaultValue={leaveDuration} onChange={e => setLeaveDuration(e)} accessibilityLabel="pick duration">
                        <HStack justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                            <Stack w='50%' my={.5}>
                                <Radio value="1st Half" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>1st Half</Text>
                                </Radio>
                            </Stack>
                            <Stack w='50%' my={.5}>
                                <Radio value="2nd Half" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>2nd Half</Text>
                                </Radio>
                            </Stack>
                            <Stack w='50%' my={.5}>
                                <Radio value="Full Day" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>Full Day</Text>
                                </Radio>
                            </Stack>
                            <Stack w='50%' my={.5}>
                                <Radio value="Multi Day" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>Multi Day</Text>
                                </Radio>
                            </Stack>
                        </HStack>
                    </Radio.Group>

                    <VStack flex={1}>
                        <Text style={styles.label}>From Date</Text>
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

                    {leaveDuration == 'Multi Day' && <>
                        <HStack backgroundColor='ghostwhite' mt={1.5} rounded={2}>
                            <TouchableOpacity onPress={() => setFromEntire(true)} style={[styles.leaveFromToView, { backgroundColor: fromEntire ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: fromEntire ? '#1875e2' : 'gray' }]}>Entire Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFromEntire(false)} style={[styles.leaveFromToView, { backgroundColor: !fromEntire ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: !fromEntire ? '#1875e2' : 'gray' }]}>Second Half</Text>
                            </TouchableOpacity>
                        </HStack>

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
                        <HStack backgroundColor='ghostwhite' mt={1.5} rounded={2}>
                            <TouchableOpacity onPress={() => setToEntire(true)} style={[styles.leaveFromToView, { backgroundColor: toEntire ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: toEntire ? '#1875e2' : 'gray' }]}>Entire Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToEntire(false)} style={[styles.leaveFromToView, { backgroundColor: !toEntire ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: !toEntire ? '#1875e2' : 'gray' }]}>First Half</Text>
                            </TouchableOpacity>
                        </HStack>
                    </>}

                    <VStack>
                        <Text style={styles.label}>Select Leave Type</Text>
                        <TouchableOpacity onPress={() => setShowLeaveType(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{particularLeaveType ? particularLeaveType?.RDescription : 'Select Leave Type'}</Text>
                            <Entypo name="chevron-small-down" size={24} color="#737373" />
                        </TouchableOpacity>

                        <Actionsheet isOpen={showLeaveType} onClose={() => setShowLeaveType(false)}>
                            <Actionsheet.Content>
                                {allLeaveType?.length > 0 ? allLeaveType?.map((item, index) => (
                                    <Actionsheet.Item onPress={() => {
                                        setParticularLeaveType(item)
                                        setShowLeaveType(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                    </Actionsheet.Item>

                                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                            </Actionsheet.Content>
                        </Actionsheet>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Number Of Days</Text>
                        <TouchableOpacity disabled style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{noOfDays}</Text>
                        </TouchableOpacity>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Contact Number While On Leave</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} keyboardType='phone-pad' />
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

                    <VStack>
                        <Text style={styles.label}>Enter Reason</Text>
                        <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline />
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
    tableTitle: {
        fontFamily: fonts.PopM,
        flex: 1,
        textAlign: 'center',
        color: '#737373',
        paddingVertical: 4
    },
    tableValue: {
        fontFamily: fonts.UrbanM,
        flex: 1,
        textAlign: 'center',
        color: '#737373',
        paddingVertical: 2
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
    leaveFromToView: {
        flex: 1,
        paddingVertical: 8,
    },
    leaveFromToText: {
        fontFamily: fonts.UrbanSB,
        textAlign: 'center',
        fontSize: 16,
    },
})

export default CreateLeave;