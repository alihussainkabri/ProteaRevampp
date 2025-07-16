import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet, Checkbox } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-root-toast';

const CreateEHCRequest = ({ navigation }) => {

    const { user, defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
    const [ToDateCalendarShow, setToDateCalendarShow] = useState(false);
    const [showReason, setShowReason] = useState(false);
    const [allReasons, setAllReasons] = useState('');
    const [particularReason, setParticularReason] = useState('');
    const [reason, setReason] = useState('');
    const [selectedAvailableEHCOT, setSelectedAvailableEHCOT] = useState([])
    const [availableEHCOT, setAvailableEHCOT] = useState([])



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

    async function fetchReasons() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "ModuleName": "Time Attendance",
            "FormName": "OT Request"
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

    async function fetchAvailableEHCOT() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "FromDate": fromDate,
            "ToDate": toDate
        });

        const response = await fetch("https://" + defaultUrl + '/api/OTRequest/GetAvailableOTList', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            console.log('available', data?.OTList)
            setAvailableEHCOT(data?.OTList)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchReasons();
    }, [])

    useEffect(() => {
        fetchAvailableEHCOT();
    }, [fromDate, toDate])


    async function submitReq() {
        // setLoader(true)

        if (fromDate && toDate && selectedAvailableEHCOT?.length > 0) {
            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "RequestFromDate": fromDate,
                "RequestToDate": toDate,
                "RId": particularReason?.RId,
                "Reason": reason,
                "OTRequestsInfo": selectedAvailableEHCOT
            });

            console.log(raw)

            const response = await fetch("https://" + defaultUrl + '/api/OTRequest/CreateOTRequest', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()
                Toast.show(data?.error_msg ? data?.error_msg : 'EHC/OT Request Has Been Submitted')
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
        }else{
            Toast.show('Please fill the data')
        }
    }

    const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

    const handleCheckboxChange = (item) => {
        setLoader(true)

        const isSelected = selectedAvailableEHCOT.some(item1 => isEqual(item1, item));

        if (isSelected) {
            setSelectedAvailableEHCOT(selectedAvailableEHCOT.filter(item1 => !isEqual(item1, item)));
            setLoader(false)

        } else {
            setSelectedAvailableEHCOT([...selectedAvailableEHCOT, item]);
            setLoader(false)
        }
    }

    const getIcon = (item) => {
        return selectedAvailableEHCOT.some(item1 => isEqual(item1, item)) ? 'green' : '#3b3b3b';
    };

    useEffect(() => console.log('selected ech OT: ', selectedAvailableEHCOT), [selectedAvailableEHCOT])

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                </TouchableOpacity>

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply EHC/OT</Text>
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

                    <VStack>
                        <Text style={styles.label}>Enter Reason</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={reason} onChangeText={setReason} />
                    </VStack>

                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#1875e2', marginTop: 16 }]}>
                        <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Select Available EHC / OT</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 10 }}>
                        {availableEHCOT?.length > 0 && availableEHCOT?.map((item, index) => (
                            <HStack key={index} flex={1} shadow={2} mb={2.5}>
                                <VStack backgroundColor='#f9f9f9' w='100%' px={3} py={3} style={{ borderRadius: 8 }}>
                                    <VStack flex={1}>
                                        <HStack alignItems='center' justifyContent='space-between'>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>Remarks</Text>
                                            {/* <Checkbox onChange={(e) => handleCheckboxChange(e,item)} my={2} size='md' aria-label='checkbox' colorScheme='green' /> */}
                                            <TouchableOpacity onPress={() => handleCheckboxChange(item)}>
                                                <Image source={require('../../../assets/icons/checked1.png')} style={{ width: 30, height: undefined, aspectRatio: 1, tintColor: getIcon(item) }} />
                                            </TouchableOpacity>
                                        </HStack>
                                        <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>{item?.Remark ? item?.Remark : 'NA'}</Text>
                                    </VStack>

                                    <HStack alignItems='center' mt={4} justifyContent='space-between' flexWrap='wrap'>
                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.DateOfGeneration).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Generate Date</Text>
                                        </VStack>

                                        <Text color='#bbbbbb' fontSize={22} mx={3}>•</Text>

                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.OTHours}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>ECH/OT Hours</Text>
                                        </VStack>

                                        <Text color='#bbbbbb' fontSize={22} mx={3}>•</Text>
                                        {/* <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 40, marginHorizontal: 20 }}></View> */}

                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>2024-04-23</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Actual ECH/OT</Text>
                                        </VStack>

                                    </HStack>
                                </VStack>
                            </HStack>
                        ))}
                        {/* {availableEHCOT?.length > 0 && availableEHCOT?.map((item, index) => (
                            <HStack flex={1} shadow={2} style={{ borderRadius: 8 }} mb={2.5}>
                                <VStack backgroundColor='#f0f0f0' px={2} pb={3} flexGrow={1} justifyContent='flex-end' style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                                    <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.DateOfGeneration).toLocaleDateString('en-GB')}</Text>
                                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Generate Date</Text>
                                </VStack>

                                <VStack backgroundColor='#f9f9f9' flexGrow={2} w='100%' px={3} py={3} style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                                    <VStack flex={1}>
                                        <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>Remarks</Text>
                                        <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date ada d ad ad ad ad a awd aw a adwwww</Text>
                                    </VStack>

                                    <HStack alignItems='center' mt={4}>
                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.OTHours}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>ECH/OT Hours</Text>
                                        </VStack>

                                        <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 40, marginHorizontal: 20 }}></View>

                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>2024-04-23</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Actual ECH/OT</Text>
                                        </VStack>

                                    </HStack>
                                </VStack>
                            </HStack>
                        ))} */}
                    </View>


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

export default CreateEHCRequest;