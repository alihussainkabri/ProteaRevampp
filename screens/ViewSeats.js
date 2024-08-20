import { View, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Loader from '../component/Loader';
import { Actionsheet, HStack, NativeBaseProvider, Text, VStack } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { getConvertDate } from '../helpers';
import { userContext } from '../context/UserContext';
import Toast from 'react-native-root-toast';

const ViewSeats = ({ navigation, route }) => {

    const [loader, setLoader] = useState(false)
    const [seatList, setSeatList] = useState([])
    const { user, defaultUrl } = useContext(userContext)
    const { particularBranch, Building, BuildingArea, date } = route?.params
    const [seatData,setSeatData] = useState([])

    async function fetchSeats() {
        setLoader(true)

        var raw = JSON.stringify({
            "CompanyId": user?.EmployeeDetails?.CompanyId,
            "SBUId": 2,
            "CCId": particularBranch?.CCID,
            "DepartmentId": 0,
            "DivisionId": 0,
            "BuildingId": Building?.BuildingID,
            "BuildingAreaId": BuildingArea == null ? 0 : BuildingArea?.BuildAreaID,
            "ShiftId": 0,
            "FromDate": date,
            "ToDate": date,
            "EmployeeId": user?.EmpId
        });

        const response = await fetch("https://" + defaultUrl + '/api/TimeAttendance/GetSeatSelection', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()
            setSeatData(data)

            const matchedSeats = data?.OfficeOccupancyPlanlistGroup?.map(group => {


                let seat_result = data?.OfficeOccupancyPlanlist?.filter(plan =>
                    plan?.BuildingId === group?.BuildingId &&
                    plan?.BuildingAreaId === group?.BuildingAreaId &&
                    plan?.Roomid === group?.Roomid
                )

                if (seat_result?.length > 0) {

                    return {
                        'building': seat_result[0]?.Building,
                        'floor': seat_result[0]?.BuildingArea,
                        'room': seat_result[0]?.Room,
                        'seat_results': data?.SeatSelectionSeatList?.filter(seat => seat?.Seat_Id >= seat_result[0]?.SeatFrom && seat?.Seat_Id <= seat_result[0]?.SeatTo)?.sort((a, b) => a?.Seat_Id - b?.Seat_Id)
                    }
                }
            })

            console.log('matched seats: ', matchedSeats)
            setSeatList(matchedSeats)
            setLoader(false)

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchSeats()
    }, [])

    function getColor(seat) {
        if (seat.IsActive == 0) {
            return "green" // disable
        }
        else if (seat.IsActive == 2){
            var iscontingency = true;
            for (let i=0;i<seatData?.SeatSelectionList2?.length;i++) {
                let emp = seatData?.SeatSelectionList2[i]
                if (seat.seatid == emp.SeatId) {
                    if (emp.RequestStatus == 'P') {
                        return "red" //pending
                    }
                    else {
                        if (emp.RequestStatus == 'A') {
                            if (emp.IsSubbmitQrCode == 2) {
                                return "yellow" //"Occupied"
                            }
                            else {
                                return "orange" //"booked"
                            }
                        }
                    }
                    iscontingency = false;
                }

            }

            if (iscontingency == true) {
                return "purple" //"contingency"
            }


        }
        else {
            var isbooked = false;
            for (let i=0;i<seatData?.SeatSelectionList2?.length;i++) {
                let emp = seatData?.SeatSelectionList2[i]
                if (seat.seatid == emp.SeatId) {
                    if (emp.RequestStatus == 'P') {
                        return "red" //"pending"
                    }
                    else {
                        if (emp.RequestStatus == 'A') {
                            if (emp.IsSubbmitQrCode == 2) {
                                return "yellow" //"Occupied"
                            }
                            else {
                                return "orange" //"Booked"
                            }
                        }
                    }
                    isbooked = true;
                }

                if (isbooked = false) {
                    return "brown" //"available"
                }


            }
        }
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

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Select Seat</Text>
                </HStack>

                <TouchableOpacity onPress={() => alert('Feature will coming soon')}>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8, marginTop: 6 }}>
                    <Text style={styles.seatType} fontWeight={600}>Total Seats: 362</Text>
                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: '#1d810f' }]}></View>
                        <Text style={styles.seatType}>Booked Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: '#c5c5c5' }]}></View>
                        <Text style={styles.seatType}>Disabled Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: '#5cb1f6' }]}></View>
                        <Text style={styles.seatType}>Available Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: '#f3bdbc' }]}></View>
                        <Text style={styles.seatType}>Pending Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center'>
                        <View style={[styles.seatClr, { backgroundColor: '#f86a76' }]}></View>
                        <Text style={styles.seatType}>Occupied Seats: 362</Text>
                    </HStack>

                    <HStack alignItems='center' mr={4}>
                        <View style={[styles.seatClr, { backgroundColor: '#8188fa' }]}></View>
                        <Text style={styles.seatType}>Contingency Seats: 362</Text>
                    </HStack>
                </ScrollView>

                <HStack mt={3} flexWrap='wrap'>
                    {seatList?.length > 0 && seatList?.map((item) => {
                        return <HStack pl={Dimensions.get('window').width / 100 * 2} mt={3} flexWrap='wrap' backgroundColor='#f6f6f6' py={1.5}>
                            <Text style={{ width: Dimensions.get('window').width, fontFamily: fonts.PopSB, fontSize: 16, marginBottom: 8 }}>{item?.building} --&gt; {item?.floor} --&gt; {item?.room}</Text>
                            {item?.seat_results?.length > 0 && item?.seat_results?.map((seat, index) => (
                                <Text key={index} 
                                style={[styles.particularseat, { backgroundColor: getColor(seat)}]}>
                                    {seat?.Seat_Id}</Text>
                            ))}
                        </HStack>
                    })}
                </HStack>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    seatClr: {
        height: 18,
        width: 18,
        borderRadius: 4,
        marginRight: 6
    },
    seatType: {
        fontFamily: fonts.PopM,
        marginRight: 20,
    },
    particularseat: {
        width: (Dimensions.get('window').width / 100 * 9),
        height: (Dimensions.get('window').width / 100 * 9),
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 32,
        borderRadius: 6,
        color: 'white',
        marginRight: (Dimensions.get('window').width / 100) * .70,
        marginBottom: 6
    }
})

export default ViewSeats