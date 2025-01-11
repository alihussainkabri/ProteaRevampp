import { StatusBar, View, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, NativeBaseProvider, Text, VStack } from 'native-base';
import Loader from '../component/Loader';
import { Ionicons, Feather } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { userContext } from '../context/UserContext';

const Policy = ({navigation}) => {

    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [details, setDetails] = useState(false)

    async function FetchData() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId,
        });

        console.log("raw is here:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetMobilePolicy', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            setDetails(data)
            console.log(data)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        FetchData();
    }, [])

    function formatDateTime(dateTimeString) {
        // Parse the date string
        const date = new Date(dateTimeString);

        // Get date parts
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const year = date.getFullYear();

        // Get time parts
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Determine AM/PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // Convert to 12-hour format

        // Format the time part
        const time = `${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

        // Return the formatted date and time
        return `${day}-${month}-${year}, ${time}`;
    }

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Mobile Policy</Text>
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView style={{ paddingTop: 12 }} showsVerticalScrollIndicator={false}>
                <VStack px={4} mb={5}>
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            {/* <Entypo name="v-card" size={20} color="black" /> */}
                            <Text style={styles.title}>Policy Name:</Text>
                        </HStack>
                        <Text style={styles.value}>{details?.PolicyName}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>RefCode:</Text>
                        </HStack>
                        <Text style={styles.value}>{details?.RefCode}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Description:</Text>
                        </HStack>
                        {details?.Description == '' ? <Ionicons name="close" size={24} color="red" /> : <Text style={styles.value}>{details?.Description}</Text>}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Monthly Summary:</Text>
                        </HStack>
                        {details?.MonthlySummary ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Announcements:</Text>
                        </HStack>
                        {details?.Announcements ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Today Birthday:</Text>
                        </HStack>
                        {details?.TodayBirthdays ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Work Anniversary:</Text>
                        </HStack>
                        {details?.TodayWorkAnniversary ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Employee of the Month:</Text>
                        </HStack>
                        {details?.EmployeeoftheMonth ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Event of the Month:</Text>
                        </HStack>
                        {details?.EventsoftheMonth ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>
                    
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Company Policy:</Text>
                        </HStack>
                        {details?.CompanyPolicies ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Calendar:</Text>
                        </HStack>
                        {details?.Calendar ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>My Approval:</Text>
                        </HStack>
                        {details?.MyApprovals ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>My Notification:</Text>
                        </HStack>
                        {details?.MyNotifications ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>My Profile:</Text>
                        </HStack>
                        {details?.MyProfile ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>My Request:</Text>
                        </HStack>
                        {details?.MyRequests ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>My Company Detail:</Text>
                        </HStack>
                        {details?.MyCompanyDetails ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Punch In:</Text>
                        </HStack>
                        {details?.PunchIn ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Punch Out:</Text>
                        </HStack>
                        {details?.PunchOut ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Punch Tracking:</Text>
                        </HStack>
                        {details?.PunchTracking ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Sunday:</Text>
                        </HStack>
                        {details?.AllowOnSunday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Monday:</Text>
                        </HStack>
                        {details?.AllowOnMonday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Tuesday:</Text>
                        </HStack>
                        {details?.AllowOnTuesday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Wednesday:</Text>
                        </HStack>
                        {details?.AllowOnWednesday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Thursday:</Text>
                        </HStack>
                        {details?.AllowOnThursday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Friday:</Text>
                        </HStack>
                        {details?.AllowOnFriday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Allow On Saturday:</Text>
                        </HStack>
                        {details?.AllowOnSaturday ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>From Time:</Text>
                        </HStack>
                        <Text style={styles.value}>{formatDateTime(details?.FromTime)}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>To Time:</Text>
                        </HStack>
                        <Text style={styles.value}>{formatDateTime(details?.ToTime)}</Text>
                    </HStack>

                    <HStack style={[styles.infoCard, { alignItems: 'flex-start' }]}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>ReqPermissions:</Text>
                        </HStack>
                        <VStack ml={10} flex={1}>
                            {details?.ReqPermission?.length > 0 && details?.ReqPermission?.map((item, index) => (
                                <Text key={index} style={styles.value}>{item?.RequestType}</Text>
                            ))}
                        </VStack>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Display Punch:</Text>
                        </HStack>
                        {details?.DisplayPunch ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Remark Mendatory In Punch:</Text>
                        </HStack>
                        {details?.RemarkMendatoryInPunches ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Approve Mobile Punches:</Text>
                        </HStack>
                        {details?.ApproveMobilePunches ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Text style={styles.title}>Capture Photo While Punching:</Text>
                        </HStack>
                        {details?.CapturePhotoWhilePunching ? <Feather name="check" size={24} color="green" /> : <Ionicons name="close" size={24} color="red" />}
                    </HStack>
                </VStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    infoCard: {
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#fbdfbc',
        paddingVertical: 14,
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: fonts.PopM,
        fontSize: 15,
        marginLeft: 12,
        textTransform: 'capitalize',
        letterSpacing: .1,
    },
    value: {
        fontFamily: fonts.UrbanR,
        fontSize: 15,
    }
})

export default Policy;