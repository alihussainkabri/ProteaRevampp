import { View, StatusBar, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { userContext } from '../../../context/UserContext';
import Toast from 'react-native-root-toast';
import { getTodayDate } from '../../../helpers'

const ListofOnDutyRequests = ({ navigation }) => {

    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [allReqs, setAllReqs] = useState([])

    async function fetchReqs() {
        setLoader(true)

        const todayDate = getTodayDate()

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
            "TODId": null
        });

        console.log("raw is here ok:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/OnDutyRequest/GetOnDutyRequests', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            setAllReqs(data?.ODReqList?.slice(0, 10))
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchReqs();
    }, [])

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>On Duty Requests</Text>
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('CreateOnDutyRequest')}>
                    <Entypo name="circle-with-plus" size={32} color="white" />
                </TouchableOpacity>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginBottom: 10 }}>
                    {allReqs?.length > 0 ? allReqs?.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            navigation.navigate('ParticularODRequestView', {
                                item: item
                            })
                        }}>
                            <HStack bg='white' shadow={1} mx={3} mt={4} py={3} px={3}>
                                <Image source={require('../../../assets/images/pending.png')} style={{ width: 36, height: 36, resizeMode: 'cover' }} />

                                <VStack ml={4} flex={1}>
                                    <HStack alignItems='center' justifyContent='space-between'>
                                        <Text style={styles.T1}>From Date</Text>
                                        <Text style={styles.T1}>To Date</Text>
                                    </HStack>

                                    <HStack bg='warmGray.400' alignItems='center' justifyContent='space-between'>
                                        <View style={styles.dots}></View>
                                        <View style={{ borderStyle: 'dashed', borderBottomWidth: 1, borderBottomColor: 'red' }}></View>
                                        <View style={styles.dots}></View>
                                    </HStack>

                                    <HStack alignItems='center'>
                                        <Text style={styles.T1}>07-02-2024</Text>
                                        <Text style={styles.T1}>07-02-2024</Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </TouchableOpacity>
                    )) :
                        <VStack flex={1} justifyContent='center' alignItems='center' mb={20}>
                            <AntDesign name="exclamationcircleo" size={72} color="gray" />
                            <Text fontFamily={fonts.PopR} mx={20} mt={4} textAlign='center' color='gray' fontSize={18}>No Any Leave Request Available.</Text>
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

export default ListofOnDutyRequests;
