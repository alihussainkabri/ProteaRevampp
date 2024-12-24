import { View, StatusBar, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Loader from '../component/Loader';
import { Actionsheet, HStack, NativeBaseProvider, Text, VStack, Input } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { getConvertDate } from '../helpers';
import { userContext } from '../context/UserContext';
import Toast from 'react-native-root-toast';

const BookSeat = ({ navigation }) => {

    const getCurrentFormattedDate = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        console.log(`${year}-${month}-${day}`)
        return `${year}-${month}-${day}`;
    };

    const [loader, setLoader] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)
    const [date, setDate] = useState(getCurrentFormattedDate())
    const [showBranch, setShowBranch] = useState(false)
    const [particularBranch, setParticularBranch] = useState('')
    const [allBranches, setAllBranches] = useState([])
    const [showBuilding, setShowBuilding] = useState(false)
    const [Building, setBuilding] = useState('')
    const [allBuildings, setAllBuildings] = useState([])
    const [showBuildingArea, setShowBuildingArea] = useState(false)
    const [BuildingArea, setBuildingArea] = useState('')
    const [allBuildingArea, setAllBuildingArea] = useState([])
    const { user, defaultUrl } = useContext(userContext)

    const handleFromDate = (date) => {
        const convertedDate = getConvertDate(date.toString());
        setDate(convertedDate)
        setShowCalendar(false);
    };

    async function fetchBranches() {
        setLoader(true)

        const response = await fetch("https://" + defaultUrl + `/api/CommonData/GetListOfBranch?EmpId=${user?.EmpId}&CompanyID=${user?.EmployeeDetails?.CompanyId}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
        })

        if (response.ok == true) {
            const data = await response.json()

            if (data?.length > 0) {
                console.log('branches: ', data)
                setAllBranches(data)
                setParticularBranch(data[0])
                fetchBuilding(data?.length > 0 ? data[0]?.CCID : '')
                setLoader(false)

            } else {
                Toast.show(data?.Message)
                setLoader(false)
            }

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        fetchBranches();
    }, [])

    async function fetchBuilding(CCID = "") {
        setLoader(true)

        let api_ccid = ''

        if (CCID?.length > 0) {
            api_ccid = CCID
        } else {
            api_ccid = particularBranch?.CCID
        }

        const response = await fetch("https://" + defaultUrl + `/api/CommonData/ListOfBuilding?EmpId=${user?.EmpId}&CCId=${api_ccid}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
        })

        if (response.ok == true) {
            const data = await response.json()

            if (data?.length > 0) {
                console.log('buidings: ', data)
                setAllBuildings(data)
                setBuilding(data[0])
                fetchBuildingArea(data?.length > 0 ? data[0]?.BuildingID : '')
                setLoader(false)

            } else {
                Toast.show(data?.Message)
                setLoader(false)
            }

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        setAllBuildings([])
        setBuilding('')
        fetchBuilding('');
    }, [particularBranch])

    async function fetchBuildingArea(BuildingID = '') {
        setLoader(true)

        let api_BuildingID = ''

        if (BuildingID) {
            api_BuildingID = BuildingID
        } else {
            api_BuildingID = Building?.BuildingID
        }

        console.log('api building check: ',api_BuildingID)

        const response = await fetch("https://" + defaultUrl + `/api/CommonData/ListOfBuildingArea?EmpId=${user?.EmpId}&BuildingID=${api_BuildingID}`, {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
        })

        if (response.ok == true) {
            const data = await response.json()

            if (data?.length > 0) {
                console.log('buiding area: ', data)
                setAllBuildingArea(data)
                setBuildingArea(data[0])
                setLoader(false)

            } else {
                Toast.show(data?.Message)
                setLoader(false)
            }

        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    useEffect(() => {
        setAllBuildingArea([])
        setBuildingArea('')
        fetchBuildingArea('');
    }, [Building])

    return (
        <NativeBaseProvider>

            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Book Seat</Text>
                </HStack>

                <TouchableOpacity onPress={() => alert('Feature will coming soon')}>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, }} showsVerticalScrollIndicator={false}>
                {/* Branches */}
                <VStack>
                    <Text style={styles.label}>Select Branch</Text>
                    <TouchableOpacity onPress={() => setShowBranch(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{particularBranch?.Location ? particularBranch?.Location : 'Select Branch'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBranch} onClose={() => setShowBranch(false)}>
                        <Actionsheet.Content>
                            {allBranches?.length > 0 ? allBranches?.map((item, index) => (
                                <Actionsheet.Item key={index} onPress={() => {
                                    setParticularBranch(item)
                                    setShowBranch(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.Location}</Text>
                                </Actionsheet.Item>

                            )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* Building */}
                <VStack>
                    <Text style={styles.label}>Select Building</Text>
                    <TouchableOpacity onPress={() => setShowBuilding(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{Building?.BuildingName ? Building?.BuildingName : 'Select Building'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBuilding} onClose={() => setShowBuilding(false)}>
                        <Actionsheet.Content>
                            {allBuildings?.length > 0 ? <>
                                <Actionsheet.Item onPress={() => {
                                    setBuilding({ "BuildingID": 0, "BuildingName": 'Select All' })
                                    setShowBuilding(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>Select All</Text>
                                </Actionsheet.Item>
                                {allBuildings?.map((item, index) => (
                                    <Actionsheet.Item key={index} onPress={() => {
                                        setBuilding(item)
                                        setShowBuilding(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.BuildingName}</Text>
                                    </Actionsheet.Item>

                                ))}
                            </>
                                : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* Building Area */}
                <VStack>
                    <Text style={styles.label}>Select Building Area</Text>
                    <TouchableOpacity onPress={() => setShowBuildingArea(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{BuildingArea?.AreaName ? BuildingArea?.AreaName : 'Select Building Area'}</Text>
                        <Entypo name="chevron-small-down" size={24} color="#737373" />
                    </TouchableOpacity>

                    <Actionsheet isOpen={showBuildingArea} onClose={() => setShowBuildingArea(false)}>
                        <Actionsheet.Content>
                            {allBuildingArea?.length > 0 ? <>
                                <Actionsheet.Item onPress={() => {
                                    setBuildingArea({ "BuildAreaID": 0, "AreaName": 'Select All' })
                                    setShowBuildingArea(false)
                                }}>
                                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>Select All</Text>
                                </Actionsheet.Item>

                                {allBuildingArea?.map((item, index) => (
                                    <Actionsheet.Item key={index} onPress={() => {
                                        setBuildingArea(item)
                                        setShowBuildingArea(false)
                                    }}>
                                        <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.AreaName}</Text>
                                    </Actionsheet.Item>

                                ))}
                            </> : <Actionsheet.Item>No data found</Actionsheet.Item>}
                        </Actionsheet.Content>
                    </Actionsheet>
                </VStack>

                {/* booking date */}
                <VStack flex={1}>
                    <Text style={styles.label}>Booking Date</Text>
                    <TouchableOpacity onPress={() => setShowCalendar(true)} style={styles.selectDate}>
                        <Text style={styles.placeHolder}>{date ? date.toString() : 'Booking Date'}</Text>
                        <AntDesign name="calendar" size={18} color="#737373" />
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={showCalendar}
                        mode="date"
                        onConfirm={handleFromDate}
                        onCancel={() => setShowCalendar(false)}
                    />
                </VStack>

                <TouchableOpacity onPress={() => navigation.navigate('ViewSeats', {
                    particularBranch,
                    Building,
                    BuildingArea,
                    date,
                })} style={styles.btn}>
                    <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>View Seats</Text>
                </TouchableOpacity>
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
    placeHolder: {
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 15
    },
    btn: {
        marginTop: 20,
        flex: 1,
        paddingVertical: 8,
        borderRadius: 4,
        backgroundColor: '#1875e2'
    },
    inputView: {
        width: '100%',
        borderColor: '#1875e2',
        paddingHorizontal: 10,
        fontFamily: fonts.UrbanM,
        color: '#737373',
        fontSize: 15
    },
})

export default BookSeat;