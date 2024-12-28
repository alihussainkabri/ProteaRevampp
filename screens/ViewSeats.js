import { View, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Loader from '../component/Loader';
import { Actionsheet, Button, HStack, Modal, NativeBaseProvider, Text, VStack } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, EvilIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { getConvertDate } from '../helpers';
import { userContext } from '../context/UserContext';
import Toast from 'react-native-root-toast';
import DateTimePickerModal from "react-native-modal-datetime-picker"

const ViewSeats = ({ navigation, route }) => {

    const getCurrentFormattedDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`)
        return `${year}-${month}-${day}`;
    };

    const [loader, setLoader] = useState(false)
    const [seatList, setSeatList] = useState([])
    const { user, defaultUrl } = useContext(userContext)
    const { particularBranch, Building, BuildingArea, date } = route?.params
    const [seatData, setSeatData] = useState([])
    const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false)
    const [toDateCalendarShow, setToDateCalendarShow] = useState(false)
    const [fromDate, setFromDate] = useState(getCurrentFormattedDate())
    const [toDate, setToDate] = useState(getCurrentFormattedDate())
    const [showSeatBook, setShowSeatBook] = useState({
        show: false,
        detail: null
    })


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

        // console.log("https://" + defaultUrl + '/api/TimeAttendance/GetSeatSelection', raw)

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

            // console.log('matched seats: ', matchedSeats)
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
        if (seat?.Seat_Id == 1) {
            console.log('seat 1: ', seat)
        }
        if (seat.IsActive == 0) {
            return "#c5c5c5" // disable
        } else if (seat.IsActive == 2) {
            var iscontingency = true;

            for (let i = 0; i < seatData?.SeatSelectionList2?.length; i++) {
                let emp = seatData?.SeatSelectionList2[i]
                if (seat?.Seat_Id == emp.SeatId) {
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
        } else {
            let isbooked = false;

            for (let i = 0; i < seatData?.SeatSelectionList2?.length; i++) {
                let emp = seatData?.SeatSelectionList2[i]

                if (seat.Seat_Id == emp.SeatId) {
                    // console.log('new data',seat,emp)
                    if (emp.RequestStatus == 'P') {
                        return "red" //"pending"
                    } else {
                        if (emp.RequestStatus == 'A') {
                            if (emp.IsSubbmitQrCode == 2) {
                                // console.log("2", seat?.Seat_Id)
                                return "yellow" //"Occupied"
                            }
                            else {
                                // console.log("3", seat?.Seat_Id)
                                return "orange" //"Booked"
                            }
                        }
                    }
                    isbooked = true;
                }

                if (isbooked == false) {
                    return "#5cb1f6" //"available"
                }
            }
        }
    }

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

    async function bookSeatFunc() {
        let selected_seat = { ...showSeatBook?.detail, EmpId : user?.EmpId,SeatId: showSeatBook?.detail?.Seat_Id }

        delete selected_seat?.coordsx
        delete selected_seat?.coordsxfloor
        delete selected_seat?.coordsy
        delete selected_seat?.coordsyfloor
        delete selected_seat?.valueofdot
        delete selected_seat?.valueofdotfloor
        delete selected_seat?.Seat_Id

        console.log(JSON.stringify(seatData))


        let payload = {
            "CompanyId": user?.EmployeeDetails?.CompanyId,
            "SBUId": 0,
            "CCId": particularBranch?.CCID,
            "FromDate": fromDate,
            "ToDate": toDate,
            "BuildingId": selected_seat?.BuildingId,
            "BuildingAreaId": selected_seat?.BuildingAreaId,
            "SeatSelectionGridData": [
                {
                    "WTId": 2,
                    "EmpId": "",
                    "SeatId": 16,
                    "CompanyId": 0,
                    "SBUId": 0,
                    "CCId": 0,
                    "BuildingId": 0,
                    "BuildingAreaId": 0,
                    "RoomId": 0,
                    "DepartmentId": 0,
                    "DivisionId": 0,
                    "IsActive": 0
                }
            ]
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
                                <TouchableOpacity onPress={() => setShowSeatBook({ show: true, detail: seat })}>
                                    <Text key={index} style={[styles.particularseat, { backgroundColor: getColor(seat) }]}>{seat?.Seat_Id}</Text>
                                </TouchableOpacity>
                            ))}
                        </HStack>
                    })}
                </HStack>

                <Modal isOpen={showSeatBook.show} onClose={() => setShowSeatBook({ show: false, detail: null })}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Body style={{ marginTop: 26 }}>
                            <Text fontFamily={fonts.PopSB} color='green.800' fontSize={18}>Seat Number: {showSeatBook?.detail?.Seat_Id}</Text>

                            <HStack justifyContent='space-between' space={3} mt={3}>
                                <VStack flex={1}>
                                    <Text fontFamily={fonts.PopR} fontSize={14}>From Date</Text>
                                    <TouchableOpacity onPress={() => setFromDateCalendarShow(true)} style={styles.selectDate}>
                                        <Text style={styles.placeHolder}>{fromDate ? fromDate : 'select date'}</Text>
                                        <EvilIcons name="calendar" size={18} color="#737373" />
                                    </TouchableOpacity>
                                </VStack>

                                <VStack flex={1}>
                                    <Text fontFamily={fonts.PopR} fontSize={14}>To Date</Text>
                                    <TouchableOpacity onPress={() => setToDateCalendarShow(true)} style={styles.selectDate}>
                                        <Text style={styles.placeHolder}>{toDate ? toDate : 'select date'}</Text>
                                        <EvilIcons name="calendar" size={18} color="#737373" />
                                    </TouchableOpacity>
                                </VStack>
                            </HStack>

                            <DateTimePickerModal
                                isVisible={fromDateCalendarShow}
                                mode="date"
                                minimumDate={new Date()}
                                onConfirm={handleFromDate}
                                onCancel={() => setFromDateCalendarShow(false)}
                            />

                            <DateTimePickerModal
                                isVisible={toDateCalendarShow}
                                mode="date"
                                minimumDate={new Date()}
                                onConfirm={handleToDate}
                                onCancel={() => setToDateCalendarShow(false)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button onPress={bookSeatFunc} colorScheme='green'>
                                    Book Seat
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
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
    },
    selectDate: {
        borderWidth: 1,
        borderColor: 'gray',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    placeHolder: {
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 14
    },
})

export default ViewSeats