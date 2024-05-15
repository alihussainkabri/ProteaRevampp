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
    const [availableEHCOT, setAvailableEHCOT] = useState([
        {
            "Selected": false,
            "DateOfGeneration": "2019-10-18T00:00:00",
            "OTHours": "4:00:00",
            "ActulEHC": "4:00:00",
            "ApprovedEHC": "4:00:00",
            "ApproverRemark": null,
            "TABId": 4221,
            "InPunchTime": "2019-10-18T09:30:00",
            "OutPunchTime": "2019-10-18T19:00:00",
            "Remark": null,
            "TaskDetails": null
        },
        {
            "Selected": false,
            "DateOfGeneration": "2019-10-19T00:00:00",
            "OTHours": "4:00:00",
            "ActulEHC": "4:00:00",
            "ApprovedEHC": "4:00:00",
            "ApproverRemark": null,
            "TABId": 4222,
            "InPunchTime": "2019-10-19T09:30:00",
            "OutPunchTime": "2019-10-19T19:00:00",
            "Remark": null,
            "TaskDetails": null
        },
        {
            "Selected": false,
            "DateOfGeneration": "2019-10-20T00:00:00",
            "OTHours": "4:00:00",
            "ActulEHC": "4:00:00",
            "ApprovedEHC": "4:00:00",
            "ApproverRemark": null,
            "TABId": 4223,
            "InPunchTime": null,
            "OutPunchTime": null,
            "Remark": null,
            "TaskDetails": null
        },
        {
            "Selected": false,
            "DateOfGeneration": "2019-10-21T00:00:00",
            "OTHours": "4:00:00",
            "ActulEHC": "4:00:00",
            "ApprovedEHC": "4:00:00",
            "ApproverRemark": null,
            "TABId": 4224,
            "InPunchTime": "2019-10-21T09:30:00",
            "OutPunchTime": "2019-10-21T19:00:00",
            "Remark": null,
            "TaskDetails": null
        }
    ]);

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

    // useEffect(() => {
    //     fetchAvailableEHCOT();
    // }, [fromDate, toDate])


    async function submitLeave() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "LeaveDuration": leaveDuration,
            "FromDate": fromDate,
            "FromDateSection": fromEntire,
            "ContactNo": "7897897894",
            "UserOSId": 1017,
            "ToDate": null,
            "ToDateSection": "FirstHalf",
            "NoofDays": 0.5,
            "LocumId": 76,
            "RId": "6",
            "RequestNarration": "Test",
            "DB": false,
            "UserCId": 0,
            "Offset": "+05:30",
            "UserId": 1017,
            "CoffRequestInfos":
                [
                    {
                        "TABId": 152021,
                        "Availed": 0.00,
                        "COffBalance": 0,
                        "DateofGeneration": "2019-06-09"
                    },
                    {
                        "TABId": 176901,
                        "Availed": 0.00,
                        "COffBalance": 0,
                        "DateofGeneration": "2019-01-30"
                    }
                ]

        });

        // console.log('leave consoled', raw)

        const response = await fetch("https://" + defaultUrl + '/api/OTRequest/CreateOTRequest', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            // alert(data?.error_msg)
            console.warn(data)
            Toast.show(data?.error_msg ? data?.error_msg : 'Leave Request Has Been Submitted')
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

                    <VStack>
                        <Text style={styles.label}>Enter Reason</Text>
                        <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={reason} onChangeText={setReason} />
                    </VStack>

                    <TouchableOpacity style={[styles.btn, { backgroundColor: '#1875e2', marginTop: 16 }]}>
                        <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Select Available EHC / OT</Text>
                    </TouchableOpacity>

                    {/* {availableEHCOT?.length > 0 && availableEHCOT.map(() => (
                        
                    ))} */}

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
    btn: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4
    },
})

export default CreateEHCRequest;