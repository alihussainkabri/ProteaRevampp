import { Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, NativeBaseProvider, Text } from 'native-base';
import { Ionicons, AntDesign, FontAwesome, Entypo, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../config/Fonts';
import { Agenda } from 'react-native-calendars';
import { url } from '../helpers';
import { userContext } from '../context/UserContext';
import Toast from 'react-native-root-toast';
import Loader from '../component/Loader';

const Calendar = ({ navigation }) => {

    const { user,defaultUrl } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [calendarData, setCalendarData] = useState('')

    async function fetchCalendarData() {
        setLoader(true)

        var raw = JSON.stringify({
            "EmpId": user?.EmpId
        });

        const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetCalendarData', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            if (data?.length > 0) {
                // console.log('i m data',data)
                const organizedData = {};
                data.forEach(entry => {
                    const startDate = new Date(entry.StartDate + 'Z').toISOString().slice(0, 10);

                    if (!organizedData[startDate]) {
                        organizedData[startDate] = [entry];
                    } else {
                        organizedData[startDate].push(entry);
                    }
                });

                console.log('hi organise', organizedData)
                setCalendarData(organizedData)
                setLoader(false)

            } else {
                Toast.show(data?.error_msg, {
                    duration: 3000,
                })
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
        fetchCalendarData();
    }, [])

    var min = new Date();
    min.setDate(min.getDate() - 45);
    var max = new Date();
    max.setDate(max.getDate() + 45);

    function renderEmptyDate() {
        return (
            <View style={[styles.items]}>
                <View style={styles.event}>
                    <Text>
                        <AntDesign style={{ paddingVerticle: 12 }} name="exclamationcircle" size={24} color="black" />
                    </Text>
                </View>
            </View>
        );
    }

    function renderItems(val) {
        console.log(val)
        // alert('hy')
        // console.log('ye hai',items)
        // return (
        //     <View style={[styles.items]}>
        //         {}
        //     </View>
        // );
        if (val.InTime) {
            return (
                <View style={[styles.items]}>
                    <Text style={styles.event}>
                        <FontAwesome
                            style={{ color: "#2ECC71", fontSize: 17 }}
                            name="sign-in"
                        />
                        {val.InTime}
                    </Text>
                </View>
            );
        }
        if (val.OutTime) {
            return (
                <View style={[styles.items]}>
                    <Text style={styles.event}>
                        <FontAwesome
                            style={{ color: "#EC7063", fontSize: 17 }}
                            name="sign-out"
                        />
                        {" "}
                        {val.OutTime}
                    </Text>
                </View>
            );
        }
        if (val.Title) {
            return (
                <View style={[styles.items]}>
                    <Text style={styles.event}>
                        <Entypo
                            style={{ color: "#7FB3D5", fontSize: 17 }}
                            name="calendar"
                        />
                        {" "}
                        {val.Title}
                    </Text>
                </View>
            );
        }
        if (val.Birthday) {
            return (
                <View style={[styles.items]}>
                    <Text style={styles.event}>
                        <MaterialIcons
                            style={{ color: "#F8C471", fontSize: 17 }}
                            name="cake"
                        />
                        {" "}
                        {val.Birthday}
                    </Text>
                </View>
            );
        }
        if (val?.Anniversary) {
            return (
                <View style={[styles.items]}>
                    <Text style={styles.event}>
                        <FontAwesome
                            style={{ color: "#BB8FCE", fontSize: 17 }}
                            name="gift"
                        />
                        {" "}
                        {val.Anniversary}
                    </Text>
                </View>
            );
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

                    <Text fontFamily={fonts.PopSB} fontSize={24} ml={6} color='white'>Calendar</Text>
                </HStack>

                <TouchableOpacity>
                    <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <View style={{ flex: 1, alignItems: 'center' }}>
                <Agenda
                    items={calendarData}
                    // //loadItemsForMonth={month => {this.loadItems.bind(this)}}
                    renderItem={renderItems}
                    renderEmptyData={renderEmptyDate}
                    // rowHasChanged={this.rowHasChanged.bind(this)}
                    // hideKnob={false}
                    // markedDates={this.state.markeditems}
                    // // selected={min}
                    minDate={min}
                    maxDate={max}
                    // // pastScrollRange={1}
                    // // futureScrollRange={1}
                    style={{
                        width: "100%",
                        // // height: 300
                    }}
                    theme={{
                        backgroundColor: "#7e7e7e",
                        calendarBackground: "#ffffff",
                        textSectionTitleColor: "#7e7e7e",
                        selectedDayBackgroundColor: "#FF8E18",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#4451b7",
                        dayTextColor: "black",
                        dotColor: "#4451b7",
                        textMonthFontWeight: "bold",
                        agendaDayTextColor: "red",
                        agendaDayNumColor: "red",
                        agendaTodayColor: "#FF8E18",
                        agendaKnobColor: "red"
                    }}
                />


            </View>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    items: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 2,
        padding: 5,
        marginBottom: 8,
    },
    event: {
        alignItems: "center",
        textAlignVertical: "top",
        justifyContent: "center",
        width: "90%",
        color: "#888",
        padding: 2,
        // fontSize:16
    }
})

export default Calendar;