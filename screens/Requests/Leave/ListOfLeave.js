import { View, StatusBar, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { userContext } from '../../../context/UserContext';
import Toast from 'react-native-root-toast';

const ListOfLeave = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [leaves, setLeaves] = useState([])


    async function fetchLeaves() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "LRId": null
        });

        console.log("raw is here:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/LeaveRequests/GetLeaveRequest', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            console.log('all leaves', data?.LeaveReqList?.slice(0,4))
            setLeaves(data?.LeaveReqList)
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
            fetchLeaves();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Leave Requests</Text>
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('CreateLeave')}>
                    <Entypo name="circle-with-plus" size={32} color="white" />
                </TouchableOpacity>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginTop: 10 }}>
                    {leaves?.length > 0 ? leaves?.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            navigation.navigate('ParticularLeaveView', {
                                item: item
                            })
                        }} activeOpacity={.9}>
                            <HStack flex={1} mx={4} shadow={2} style={{ borderRadius: 8 }} mb={2.5}>
                                <VStack backgroundColor='#f9f9f9' flexGrow={2} px={3} py={3} style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                                    <HStack alignItems='center'>
                                        {item?.RequestStatus == 'Pending' && <Image source={require('../../../assets/images/pending.png')} style={{ width: 38, height: 38, resizeMode: 'cover' }} />}
                                        {item?.RequestStatus == 'Cancelled' && <Image source={require('../../../assets/images/cancelled.png')} style={{ width: 38, height: 38, resizeMode: 'cover' }} />}
                                        {item?.RequestStatus == 'Approved' && <Image source={require('../../../assets/images/Approve.png')} style={{ width: 38, height: 38, resizeMode: 'cover' }} />}
                                        {item?.RequestStatus == 'Rejected' && <Image source={require('../../../assets/images/reject.png')} style={{ width: 38, height: 38, resizeMode: 'cover' }} />}
                                        <Text numberOfLines={1} ellipsizeMode='tail' width='200px' color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={16} ml={3}>{item?.ReasonTemplate}</Text>
                                    </HStack>

                                    <HStack alignItems='center' mt={4}>
                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.LeaveFrom).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                                        </VStack>

                                        <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 40, marginHorizontal: 20 }}></View>

                                        <VStack>
                                            <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{new Date(item?.LeaveTo).toLocaleDateString('en-GB')}</Text>
                                            <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>To Date</Text>
                                        </VStack>

                                    </HStack>
                                </VStack>

                                <VStack backgroundColor='#f0f0f0' px={2} pb={3} flexGrow={1} justifyContent='flex-end' style={{ borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                                    <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.RequestDate}</Text>
                                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Requested On</Text>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>
                    )) :
                        <VStack flex={1} justifyContent='center' alignItems='center' mb={20} marginTop={250}>
                            <AntDesign name="exclamationcircleo" size={72} color="gray" />
                            <Text fontFamily={fonts.PopM} mx={20} mt={4} textAlign='center' color='gray' fontSize={18}>No Any Leave Request Available.</Text>
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

export default ListOfLeave;