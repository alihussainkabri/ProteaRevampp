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

const CreateLeave = ({ navigation }) => {

    const { user, defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [leaveBalance, setLeaveBalance] = useState('')
    const [leaveDuration, setLeaveDuration] = useState('First Half')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromEntire, setFromEntire] = useState('');
    const [toEntire, setToEntire] = useState('');
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [noOfDays, setNoOfDays] = useState('');
    const [showLeaveType, setShowLeaveType] = useState(false);
    const [particularLeaveType, setParticularLeaveType] = useState('');
    const [allLeaveType, setAllLeaveType] = useState('');
    const [showReason, setShowReason] = useState(false);
    const [allReasons, setAllReasons] = useState('');
    const [particularReason, setParticularReason] = useState('');
    const [writtenReason, setWrittenReason] = useState('');
    const [contactNumber, setContactNumber] = useState('');

    useEffect(() => {
        async function fetchLeaveBalance() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId
            });

            const response = await fetch("https://" + defaultUrl + '/api/LeaveRequests/GetLeaveBalance', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()
                // console.log(data)

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

            const response = await fetch("https://" + defaultUrl + '/api/Requests/SearchReason', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()
                // console.log('reasons', data)

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
            "ToDate": toDate ? toDate : fromDate

        });

        console.log("empid: ", user.EmpId, 'fromdate : ', fromDate, 'toDate : ', toDate)

        const response = await fetch("https://" + defaultUrl + '/api/LeaveRequests/GetApplicableLeaveTypeBasedOnDates', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            // console.warn('leave types :', data)

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
        // console.warn("A date has been picked: ", date.toString());

        const convertedDate = getConvertDate(date.toString());
        setFromDate(convertedDate)
        setFromDateCalendarShow(false);
    };

    const handleToDate = (date) => {
        // console.warn("A date has been picked: ", date.toString());

        const convertedDate = getConvertDate(date.toString());
        setToDate(convertedDate)
        setToDateCalendarShow(false);
    };

    async function fetchLeaveDays() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "FromDate": fromDate,
            "ToDate": toDate ? toDate : fromDate,
            "LeaveDuration": leaveDuration,
            "FromDateSection": fromEntire,
            "ToDateSection": toEntire,
            "ELId": particularLeaveType?.ELId,
            "LeaveTypeId": particularLeaveType?.LeaveTypeId
        });

        console.log("raw is here:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/LeaveRequests/CalculateLeaves', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            setNoOfDays(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchLeaveDays()
    }, [leaveDuration, fromDate, toDate, fromEntire, toEntire, particularLeaveType])


    async function submitLeave() {
        setLoader(true)

        var raw = JSON.stringify({
            "Id": 0,
            "EmpId": user?.EmpId,
            "LeaveDuration": leaveDuration,
            "LeaveFrom": fromDate,
            "LeaveTo": toDate ? toDate : fromDate,
            "FromDateSection": fromEntire,
            "ToDateSection": toEntire,
            "NoOfDaysr": noOfDays?.noOfDays,
            "LocumId": user?.EmpId,
            "ELId": particularLeaveType?.ELId,
            "LeaveTypeId": particularLeaveType?.LeaveTypeId,
            "RId": particularReason?.RId,
            "Reason": writtenReason,
            "ContactNo": contactNumber,
            "DB": false,
            "UserId": user?.EmpId,
            "UserOSId": 0,
            "UserCId": 0,
            "Offset": "+05:30",
            "TraingDetails": null,
            "TraingSubject": null,
            "DateOfDeath": "null",
            "ExpectedDateofDelivery": "null",
            "ShortLeaveTime": null,
            "DateofTransfer": null,
            "ShortLeaveZone": null,
            "DoctorsCertificateFilePath": null,
            "ExtensionOfLeave": false,
            "ReductionOfLeave": false,
            "LeaveCancellationAllowed": false
        });

        console.log('leave consoled', raw)

        const response = await fetch("https://" + defaultUrl + '/api/LeaveRequests/AddLeaveRequest', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            alert(data?.error_msg)
            Toast.show(data?.error_msg ? data?.error_msg : 'Leave Request Has Been Submitted')
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }


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
                                <Radio value="First Half" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>1st Half</Text>
                                </Radio>
                            </Stack>
                            <Stack w='50%' my={.5}>
                                <Radio value="Second Half" colorScheme="blue" size="sm" my={1}>
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
                            <TouchableOpacity onPress={() => setFromEntire('Full Day')} style={[styles.leaveFromToView, { backgroundColor: fromEntire == 'Full Day' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: fromEntire == 'Full Day' ? '#1875e2' : 'gray' }]}>Entire Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setFromEntire('Second Half')} style={[styles.leaveFromToView, { backgroundColor: fromEntire == 'Second Half' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: fromEntire == 'Second Half' ? '#1875e2' : 'gray' }]}>Second Half</Text>
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
                            <TouchableOpacity onPress={() => setToEntire('Full Day')} style={[styles.leaveFromToView, { backgroundColor: toEntire == 'Full Day' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: toEntire == 'Full Day' ? '#1875e2' : 'gray' }]}>Entire Day</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToEntire('First Half')} style={[styles.leaveFromToView, { backgroundColor: toEntire == 'First Half' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: toEntire == 'First Half' ? '#1875e2' : 'gray' }]}>First Half</Text>
                            </TouchableOpacity>
                        </HStack>
                    </>}

                    <VStack>
                        <Text style={styles.label}>Select Leave Type</Text>
                        <TouchableOpacity onPress={() => setShowLeaveType(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{particularLeaveType ? particularLeaveType?.LeaveType : 'Select Leave Type'}</Text>
                            <Entypo name="chevron-small-down" size={24} color="#737373" />
                        </TouchableOpacity>

                        <Actionsheet isOpen={showLeaveType} onClose={() => setShowLeaveType(false)}>
                            <Actionsheet.Content>
                                {allLeaveType?.length > 0 ? allLeaveType?.map((item, index) => (
                                    <Actionsheet.Item key={index} onPress={() => {
                                        setParticularLeaveType(item)
                                        setShowLeaveType(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.LeaveType}</Text>
                                    </Actionsheet.Item>

                                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                            </Actionsheet.Content>
                        </Actionsheet>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Number Of Days</Text>
                        <TouchableOpacity disabled style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{noOfDays?.NoOfDays ? noOfDays?.NoOfDays : 1}</Text>
                        </TouchableOpacity>
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Contact Number While On Leave</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} keyboardType='phone-pad' value={contactNumber} onChangeText={setContactNumber} />
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
                                    <Actionsheet.Item key={index} onPress={() => {
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
                        <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={writtenReason} onChangeText={setWrittenReason} />
                    </VStack>

                    <HStack mt={4} space={2} mb={2}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, { backgroundColor: '#f5e9e9' }]}>
                            <Text style={{ color: '#cf0101' }} fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={submitLeave} style={[styles.btn, { backgroundColor: '#1875e2' }]}>
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
    btn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4
    },
})

export default CreateLeave;