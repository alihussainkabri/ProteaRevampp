import { View, StatusBar, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack } from 'native-base';
import Loader from '../../component/Loader';
import { Ionicons, Entypo, AntDesign, Feather } from 'react-native-vector-icons'
import { fonts } from '../../config/Fonts';
import { userContext } from '../../context/UserContext';
import Toast from 'react-native-root-toast';

const ListOfRequests = ({ navigation, route }) => {
    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [allReqs, setAllReqs] = useState([])
    const { Detailitem } = route.params


    async function fetchReqs() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
        });

        let reqName = ''

        if (Detailitem?.RequestType == 'On Duty') {
            reqName = '/api/OnDutyRequest/GetPendingOnDutyRequests';

        } else if (Detailitem?.RequestType == 'Attendance Regularization') {
            reqName = '/api/RegularizationRequest/GetPendingRegularizationRequest';

        } else if (Detailitem?.RequestType == 'Shift Change') {
            reqName = '/api/ShiftChangeRequest/GetPendingShiftChangeRequests';

        } else if (Detailitem?.RequestType == 'EHC / OT') {
            reqName = '/api/OTRequest/GetPendingOTRequest';

        } else if (Detailitem?.RequestType == 'C-off') {
            reqName = '/api/COffRequest/GetPendingCOffRequest'

        } else if (Detailitem?.RequestType == 'Late Coming / Early Going') {
            reqName = '/api/LCEGRequest/GetPendingLCEGRequest'

        } else if (Detailitem?.RequestType == 'Optional Holiday') {
            reqName = '/api/HolidayRequests/GetPendingOptionalHolidayRequest'

        } else if (Detailitem?.RequestType == 'Leave') {
            reqName = '/api/LeaveRequests/GetPendingLeaveRequest'

        } else if (Detailitem?.RequestType == 'Mobile Punch') {
            reqName = '/api/Requests/PendingApprovalRequest'
        }

        const response = await fetch("https://" + defaultUrl + reqName, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            // console.log('all reqs', data)
            if (Detailitem?.RequestType == 'Mobile Punch') {
                if (data?.length > 0) {
                    setAllReqs(data?.filter(item => item?.RequestType == 'MobilePunchRequest'))
                }
            } else {
                setAllReqs(data)
            }
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchReqs();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => console.log(Detailitem?.RequestType), [])

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text numberOfLines={1} ellipsizeMode='tail' width={Dimensions.get('window').width / 100 * 70} fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>{Detailitem?.RequestType}</Text>
                </HStack>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 10 }}>
                    {allReqs?.length > 0 ? allReqs?.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            navigation.navigate('ApproveOrCancel', {
                                item: item,
                                title: Detailitem?.RequestType
                            })
                        }} activeOpacity={.9}>
                            <HStack flex={1} mx={4} shadow={2} style={{ borderRadius: 8 }} mb={2.5}>
                                <VStack backgroundColor='#f9f9f9' flexGrow={2} px={3} py={3} style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                                    <HStack alignItems='center'>
                                        <Feather name="user" size={22} color="black" />
                                        <Text numberOfLines={1} ellipsizeMode='tail' width={Dimensions.get('window').width / 100 * 45} color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={16} ml={3}>{item?.EmpName ? item?.EmpName : item?.RequestedBy}</Text>
                                    </HStack>

                                    <HStack alignItems='center' mt={4}>
                                        {item?.ShiftDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ShiftDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Shift Date</Text>
                                        </VStack>}

                                        {item?.LeaveFrom && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.LeaveFrom).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                                        </VStack>}

                                        {item?.FromDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.FromDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                                        </VStack>}

                                        {item?.RequestFromDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.RequestFromDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                                        </VStack>}

                                        {item?.ShiftChangeFromDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ShiftChangeFromDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                                        </VStack>}

                                        {/* DIVIDER LINE */}
                                        <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 40, marginHorizontal: 20 }}></View>

                                        {item?.ToDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ToDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>To Date</Text>
                                        </VStack>}

                                        {item?.LeaveTo && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.LeaveTo).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>To Date</Text>
                                        </VStack>}

                                        {item?.RequestToDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.RequestToDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>To Date</Text>
                                        </VStack>}

                                        {item?.ShiftChangeToDate && <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ShiftChangeToDate).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>To Date</Text>
                                        </VStack>}

                                    </HStack>
                                </VStack>

                                <VStack backgroundColor='#f0f0f0' px={2} pb={3} flexGrow={1} justifyContent='flex-end' style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                                    
                                    
                                    {item?.RequestDate ? <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.RequestDate?.length > 12 ? new Date(item?.RequestDate).toLocaleDateString('en-GB') : item?.RequestDate}</Text>
                                        :
                                        item?.ShiftChangeRequestDate ? <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ShiftChangeRequestDate).toLocaleDateString('en-GB')}</Text>
                                            :
                                            <></>
                                    }

                                    {item?.CoffRequestDate && <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.CoffRequestDate)?.toLocaleDateString('en-GB')}</Text>}
                                    {item?.ODReqDate && <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.ODReqDate)?.toLocaleDateString('en-GB')}</Text>}
                                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Requested On</Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>


                    )) :
                        <VStack flex={1} justifyContent='center' alignItems='center' mb={20} marginTop={250}>
                            <AntDesign name="exclamationcircleo" size={72} color="gray" />
                            <Text fontFamily={fonts.PopR} mx={20} mt={4} textAlign='center' color='gray' fontSize={18}>No Any {Detailitem?.RequestType} Request Available.</Text>
                        </VStack>}
                </View>
            </ScrollView>

        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    T1: {
        fontFamily: fonts.PopM,
        fontSize: 14.5,
        color: '#333',
    },
    dots: {
        backgroundColor: '#0F74B3',
        height: 10,
        width: 10,
        borderRadius: 100,
    }
})

export default ListOfRequests;