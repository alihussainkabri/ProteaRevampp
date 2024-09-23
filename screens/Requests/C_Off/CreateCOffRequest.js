import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet, Modal, FormControl } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-root-toast';
import AutocompleteInput from 'react-native-autocomplete-input';

const CreateCOffRequest = ({ navigation }) => {

    const { user, defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [leaveDuration, setLeaveDuration] = useState('First Half')
    const [fromDate, setFromDate] = useState('');
    const [currentDate, setCurrentDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromEntire, setFromEntire] = useState('FullDay');
    const [toEntire, setToEntire] = useState('FullDay');
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [noOfDays, setNoOfDays] = useState('');
    const [particularLeaveType, setParticularLeaveType] = useState('');
    const [allLeaveType, setAllLeaveType] = useState('');
    const [showReason, setShowReason] = useState(false);
    const [allReasons, setAllReasons] = useState('');
    const [particularReason, setParticularReason] = useState('');
    const [writtenReason, setWrittenReason] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [showResponsible, setShowResponsible] = useState(false);
    const [allResponsibles, setAllResponsibles] = useState('');
    const [particularResponsible, setParticularResponsible] = useState('');
    const [balance, setBalance] = useState('');
    const [responsbleData, setResponsbleData] = useState([])
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        async function fetchReasons() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "ModuleName": "Time Attendance",
                "FormName": "Compensatory Off"
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
                console.log('reason: ', data)
                setAllReasons(data)
                setLoader(false)

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        }

        async function fetchResponsible() {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
            });

            const response = await fetch("https://" + defaultUrl + '/api/Requests/GeteReportingOfficer', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                console.log('responsibles', data)
                setAllResponsibles(data)
                setLoader(false)

            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        }

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
            const formattedDateTime = `${year}-${month}-${day}`;
            setCurrentDate(formattedDateTime)
        }

        getCurrentDateTime();
        fetchReasons();
        fetchResponsible();
    }, [])

    async function fetchBalance() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "FromDate": fromDate,
            "ToDate": toDate ? toDate : fromDate
        });

        const response = await fetch("https://" + defaultUrl + '/api/COffRequest/GetCoffBalances', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            console.log('balance :', data)

            setBalance(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchBalance();
    }, [fromDate, toDate])

    const handleFromDate = (date) => {
        const convertedDate = getConvertDate(date.toString());
        setFromDate(convertedDate)
        setFromDateCalendarShow(false);
    };

    const handleToDate = (date) => {
        const convertedDate = getConvertDate(date.toString());
        setToDate(convertedDate)
        setToDateCalendarShow(false);
    };

    async function fetchLeaveDays() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "FromDate": fromDate ? fromDate : currentDate,
            "ToDate": toDate ? toDate : fromDate ? fromDate : currentDate,
            "LeaveDuration": leaveDuration,
            "FromDateSection": fromEntire,
            "ToDateSection": toEntire
        });

        console.log("date calc RAW is here:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/COffRequest/GetCalculateDays', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            console.log('calculated days: ', data)
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
        setToDate('')
        setFromEntire('FullDay')
        setToEntire('FullDay')
    }, [leaveDuration])

    useEffect(() => {
        fetchLeaveDays()
    }, [leaveDuration, fromDate, toDate, fromEntire, toEntire])


    async function submitLeave() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "LeaveDuration": leaveDuration,
            "FromDate": fromDate,
            "FromDateSection": fromEntire,
            "ContactNo": contactNumber,
            "UserOSId": user?.EmpId,
            "ToDate": toDate ? toDate : fromDate,
            "ToDateSection": toEntire,
            "NoofDays": noOfDays,
            "LocumId": "",
            "RId": particularReason?.RId,
            "RequestNarration": writtenReason,
            "DB": false,
            "UserCId": 0,
            "Offset": "+05:30",
            "UserId": user?.EmpId,
            "CoffRequestInfos": balance
        });

        // console.log('leave consoled', raw)

        const response = await fetch("https://" + defaultUrl + '/api/COffRequest/SaveCoffRequest', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            // alert(data?.error_msg)
            console.warn('C-OFF req:', data)
            Toast.show(data?.error_msg ? data?.error_msg : 'C-Off Request Has Been Submitted')
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

    async function onChangeText(text) {
        setParticularResponsible(text)
        console.log(text)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "Empsearch": text
        });

        const response = await fetch("https://" + defaultUrl + '/api/Requests/WorkResponsibilitySharedWith', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            // Toast.show(data?.error_msg && data?.error_msg )
            console.log(data?.length > 0 ? data : 'blank')
            if (data?.length > 0) {
                setResponsbleData(data)
            } else {
                setResponsbleData([])
            }

            if (text == '') {
                setResponsbleData([])
            }

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
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

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply C-Off</Text>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <Text style={[styles.label, { marginTop: 4 }]}>C-Off Duration</Text>
                    <Radio.Group name="cOffDuration" defaultValue={leaveDuration} onChange={e => setLeaveDuration(e)} accessibilityLabel="pick duration">
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
                                <Radio value="FullDay" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>Full Day</Text>
                                </Radio>
                            </Stack>
                            <Stack w='50%' my={.5}>
                                <Radio value="MultiDay" colorScheme="blue" size="sm" my={1}>
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

                    {leaveDuration == 'MultiDay' && <>
                        <HStack backgroundColor='ghostwhite' mt={1.5} rounded={2}>
                            <TouchableOpacity onPress={() => setFromEntire('FullDay')} style={[styles.leaveFromToView, { backgroundColor: fromEntire == 'FullDay' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: fromEntire == 'FullDay' ? '#1875e2' : 'gray' }]}>Entire Day</Text>
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
                            <TouchableOpacity onPress={() => setToEntire('First Half')} style={[styles.leaveFromToView, { backgroundColor: toEntire == 'First Half' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: toEntire == 'First Half' ? '#1875e2' : 'gray' }]}>First Half</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setToEntire('FullDay')} style={[styles.leaveFromToView, { backgroundColor: toEntire == 'FullDay' ? '#dee8f4' : 'transparent' }]}>
                                <Text style={[styles.leaveFromToText, { color: toEntire == 'FullDay' ? '#1875e2' : 'gray' }]}>Entire Day</Text>
                            </TouchableOpacity>
                        </HStack>
                    </>}

                    {balance?.length > 0 && <>
                        <TouchableOpacity onPress={() => setShowModal(true)} style={[styles.btn, { backgroundColor: '#1875e2', marginTop: 20 }]}>
                            <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Check Balance</Text>
                        </TouchableOpacity>

                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} size='lg'>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Balance Requests</Modal.Header>
                                <Modal.Body>
                                    <FormControl>
                                        <VStack borderColor='gray.200' borderWidth={1}>
                                            <HStack backgroundColor='#e9eef5'>
                                                <Text style={styles.tableTitle}>Generation Date</Text>
                                                <Text style={styles.tableTitle}>Coff Balance</Text>
                                                <Text style={styles.tableTitle}>Available</Text>
                                            </HStack>
                                            {balance?.length > 0 ? balance?.map((item, index) => (
                                                <HStack key={index} borderBottomWidth={balance?.length == index + 1 ? 0 : 1} borderBottomColor='gray.200' py={1}>
                                                    <Text style={styles.tableValue}>{item?.DateofGeneration?.split('T')[0]}</Text>
                                                    <Text style={styles.tableValue}>{item?.COffBalance}</Text>
                                                    <Text style={styles.tableValue}>{item?.Availed}</Text>
                                                </HStack>
                                            )) : <Text fontFamily={fonts.UrbanSB} textAlign='center' color='#737373' my={2}>No Balnce Available!</Text>}
                                        </VStack>
                                    </FormControl>
                                </Modal.Body>
                            </Modal.Content>
                        </Modal>
                    </>}

                    <VStack>
                        <Text style={styles.label}>Number Of Days</Text>
                        <TouchableOpacity disabled style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{noOfDays ? noOfDays : 0}</Text>
                        </TouchableOpacity>
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

                    <VStack>
                        <Text style={styles.label}>Contact Number While On Leave</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} keyboardType='phone-pad' value={contactNumber} onChangeText={setContactNumber} />
                    </VStack>

                    <VStack>
                        <Text style={styles.label}>Work Responsibility Shared With</Text>
                        {/* <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={particularResponsible} onChangeText={onChangeText} /> */}
                        <AutocompleteInput
                            data={responsbleData}
                            value={particularResponsible}
                            onChangeText={onChangeText}
                            flatListProps={{
                                keyExtractor: (_, idx) => idx,
                                renderItem: ({ item }) => (
                                    <TouchableOpacity onPress={() => {
                                        setParticularResponsible(item?.EmployeeName)
                                        setResponsbleData([])
                                    }} style={{ backgroundColor: 'lightgray', paddingLeft: 16 }}>
                                        <Text style={{ fontFamily: fonts.PopM, textTransform: 'capitalize', paddingVertical: 6, }}>{item?.EmployeeName}</Text>
                                    </TouchableOpacity>
                                ),
                            }}
                            inputContainerStyle={{ borderWidth: 0, }}
                            listContainerStyle={{ marginTop: 8, marginHorizontal: -16, borderRadius: 4 }}
                            style={{ color: '#737373', borderWidth: 1, height: 40, borderRadius: 2, borderColor: '#1875e2', paddingLeft: 12 }}
                        />
                    </VStack>

                    {/* <VStack>
                        <Text style={styles.label}>Work Responsibility Shared With</Text>
                        <TouchableOpacity onPress={() => setShowResponsible(true)} style={styles.selectDate}>
                            <Text style={styles.placeHolder}>{particularResponsible ? particularResponsible?.RDescription : 'Select Reason'}</Text>
                            <Entypo name="chevron-small-down" size={24} color="#737373" />
                        </TouchableOpacity>

                        <Actionsheet isOpen={showResponsible} onClose={() => setShowResponsible(false)}>
                            <Actionsheet.Content>
                                {allResponsibles?.length > 0 ? allResponsibles?.map((item, index) => (
                                    <Actionsheet.Item key={index} onPress={() => {
                                        setParticularResponsible(item)
                                        setShowResponsible(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                                    </Actionsheet.Item>

                                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                            </Actionsheet.Content>
                        </Actionsheet>
                    </VStack> */}

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
})

export default CreateCOffRequest;