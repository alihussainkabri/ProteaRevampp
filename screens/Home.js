import { View, TouchableOpacity, StatusBar, ImageBackground, StyleSheet, Dimensions, Image, ScrollView, Linking, Platform, Alert } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Entypo, Ionicons, AntDesign } from 'react-native-vector-icons'
import { HStack, NativeBaseProvider, Text, VStack } from 'native-base'
import { fonts } from '../config/Fonts'
import { userContext } from '../context/UserContext'
import Toast from 'react-native-root-toast'
import { url } from '../helpers'
import LinearGradient from 'react-native-linear-gradient'
import Loader from '../component/Loader'
import VersionInfo from 'react-native-version-info';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import DeviceInfo from 'react-native-device-info'

const Home = ({ navigation }) => {

  const [loader, setLoader] = useState(false)
  const [notification, setNotification] = useState('')
  const [monthlySummary, setMonthlySummary] = useState('')
  const [birthDays, setBirthdays] = useState([])
  const [anniversary, setAnniversary] = useState([])
  const [events, setEvents] = useState('')
  const { user, defaultUrl, setUser } = useContext(userContext)

  useEffect(() => {

    async function fetchMonthlySummary() {
      setLoader(true)

      var raw = JSON.stringify({
        "EmpId": user?.EmpId,
        "Year": new Date().getFullYear(),
        "Month": new Date().getMonth() + 1 > 12 ? (new Date().getMonth() + 1) - 12 : new Date().getMonth() + 1
      });

      const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetMonthlySummary', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()
        setMonthlySummary(data[0])
        setLoader(false)

      } else {
        Toast.show('Internal server error', {
          duration: 3000,
        })
        setLoader(false)
      }
    }

    async function fetchBirthdayAndWorkAnniversary() {
      setLoader(true)

      var raw = JSON.stringify({
        "EmpId": user?.EmpId
      });

      // const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetAnniversaryAndBirthdays', {
      const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetBirthdayList', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()
        setBirthdays(data?.filter(item => item?.Title == 'Birthday'))
        setAnniversary(data?.filter(item => item?.Title == 'Anniversary'))
        setLoader(false)

      } else {
        Toast.show('Internal server error', {
          duration: 3000,
        })
        setLoader(false)
      }
    }

    async function fetchEvents() {
      setLoader(true)

      var raw = JSON.stringify({
        "EmpId": user?.EmpId,
        "CompanyId": user?.EmployeeDetails?.CompanyId
      });

      const response = await fetch("https://" + defaultUrl + '/api/Dashboard/GetEmployeeMonthsAndEvents', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()
        setEvents(data?.objEventModel)
        setLoader(false)

      } else {
        Toast.show('Internal server error', {
          duration: 3000,
        })
        setLoader(false)
      }
    }

    async function checkCompatible() {
      const response = await fetch("https://" + defaultUrl + '/api/Login/GetVersion');

      if (response.ok == true) {
        const data = await response.json();
        const appVersion = VersionInfo.appVersion

        console.log('app version here: ', appVersion)
        console.log('app data version here: ', data[0]?.AndroidVersion)

        if (Platform.OS == 'ios' && appVersion < data[0]?.IOSVersion) {
          Alert.alert('New Update', 'A new update is available. Update now to use the application', [
            {
              text: 'Update',
              onPress: () => Linking.openURL('https://apps.apple.com/in/app/proteaess/id6446424855')
            }
          ])
        } else if (Platform.OS == 'android' && appVersion < data[0]?.AndroidVersion) {
          Alert.alert('New Update', 'A new update is available. Update now to use the application', [
            {
              text: 'Update',
              onPress: () => Linking.openURL('https://play.google.com/store/apps/details?id=com.proteaESS')
            }
          ])
        }
      }
    }

    checkCompatible();
    fetchMonthlySummary();
    fetchBirthdayAndWorkAnniversary();
    fetchEvents();
  }, [])

  async function fetchNotification() {
    setLoader(true)

    DeviceInfo.getUniqueId().then(async id => {
      var raw = JSON.stringify({
        "EmpId": user?.EmpId,
        "IMEINO": id
      });

      const response = await fetch("https://" + defaultUrl + '/api/Requests/PendingNotifications', {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json'
        },
        body: raw
      })

      if (response.ok == true) {
        const data = await response.json()
        if (data?.error_code == "210") {
          Alert.alert('Error', "You have been logged in into other mobile", [{
            text: 'Ok', onPress: async () => {
              await AsyncStorage.removeItem('app_user')
              await AsyncStorage.removeItem('app_user_imputs')
              setUser(null)
            }
          }]);
        } else {
          setNotification(data)
        }
        setLoader(false)

      } else {
        Toast.show('Internal server error', {
          duration: 3000,
        })
        setLoader(false)
      }
    })
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotification();
    });
    return unsubscribe;
  }, [navigation]);

  function openWhatsApp(Mobile, Name) {
    const message = `Wish you a very Happy Birthday ${Name} 🥳🥳🎂🎂`;
    const whatsappLink = `whatsapp://send?phone=${Mobile}&text=${encodeURIComponent(message)}`;

    Linking.openURL(whatsappLink)
  }

  const inset = useSafeAreaInsets()

  return (
    <NativeBaseProvider>
      {loader && < Loader />}

      <View style={{ paddingTop: inset.top }}>
        <StatusBar backgroundColor='#0F74B3' translucent />
      </View>
      {/* <StatusBar translucent backgroundColor='transparent' /> */}

      {/* plus button to redirect at punch screen */}
      <TouchableOpacity style={styles.addIcon} onPress={() => navigation.navigate('MobilePunch')}>
        <AntDesign name="pluscircle" size={65} color="#0F74B3" />
      </TouchableOpacity>

      <ImageBackground source={require('../assets/images/dashboard-top-bg.png')} style={styles.titleBG} resizeMode='cover'>
        <HStack alignItems='center' justifyContent='space-between' >
          <HStack alignItems='center'>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="md-menu-sharp" size={32} color="white" />
            </TouchableOpacity>

            <Text fontFamily={fonts.PopSB} fontSize={28} ml={7} color='white'>Dashboard</Text>
          </HStack>

          <TouchableOpacity onPress={() => navigation.navigate("QRScanner")}>
            <Image source={require('../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
          </TouchableOpacity>
        </HStack>
      </ImageBackground>

      <ImageBackground source={require('../assets/images/DB-notification-BG.png')} style={[styles.notificationBG]} resizeMode='stretch'>
        <HStack alignItems='center' justifyContent='space-between' mb={2}>
          <Text fontFamily={fonts.PopSB} fontSize={22} color='white'>Notification</Text>
          <Image source={require('../assets/icons/bell.png')} style={{ width: 32, height: undefined, aspectRatio: 1 }} />
        </HStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          {notification?.length > 0 ? notification.map((item, index) => (
            <TouchableOpacity onPress={() => navigation.navigate('ListOfRequests', {
              Detailitem: item
            })}>
              <HStack key={index} alignItems='center' justifyContent='space-between' mt={4} mb={notification?.length == index + 1 ? 4 : 0}>
                <Text style={styles.notificationTitle}>{item?.RequestType}</Text>
                <Text style={styles.notificationValueTxt}>{item?.NotificationCount}</Text>
              </HStack>
            </TouchableOpacity>
          )) : <Text mt={5} fontFamily={fonts.PopM} color='white' textAlign='center'>No Notification Available</Text>}
        </ScrollView>
      </ImageBackground>

      <ScrollView style={{ marginTop: -120 }}>
        <VStack px={Dimensions.get('window').width / 100 * 3}>

          {birthDays?.length > 0 && <>
            <Text color='#333' fontFamily={fonts.PopSB} fontSize={18} mt={2} mb={2}>Today's Birthday</Text>

            <HStack flexWrap='wrap' justifyContent='space-between' mb={2}>
              {birthDays?.map((item, index) => (
                <VStack key={index} backgroundColor='#EEE3E7' style={[styles.summaryBlock, { paddingHorizontal: 0, paddingBottom: 0 }]} alignItems='center'>
                  {item?.EmpImage ? <Image source={{ uri: `data:image/png;base64,${item?.EmpImage}` }} style={{ width: 70, height: 70, borderRadius: 100, }} /> :
                    <Image source={require('../assets/images/Bithday-icon.png')} style={{ width: 70, height: 70, borderRadius: 100, }} />}

                  {/* <Text style={styles.BdayName}>{item.Description.match(/(\w+\s+\w+)'s/)[1]}</Text> */}
                  <Text style={styles.BdayName}>{item.Name}</Text>

                  <TouchableOpacity onPress={() => openWhatsApp(item?.Mobile, item?.Name)} style={{ width: '100%' }}>
                    <LinearGradient colors={['#0F74B3', 'rgba(15, 116, 179, .5)']} style={styles.linearGradient}>
                      <Text color='white' fontSize={17} py={2} fontFamily={fonts.PopSB}>Wish</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </VStack>
              ))}
            </HStack>
          </>}

          <Text color='#333' fontFamily={fonts.PopSB} fontSize={18} mt={1} mb={2}>Monthly Summary</Text>

          <HStack flexWrap='wrap' justifyContent='space-between'>
            <VStack backgroundColor='#EEE3E7' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Absent</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.Absent}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/absent.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#EEC9D2' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Holiday</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.Holidays}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/holiday.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#B3CDE0' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Leave</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.Leave}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/leave.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#F9F4F4' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Present</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.Present}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/present.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#E7D3D3' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Days Remaining</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.RemainingMonthDay}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/days-remain.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#CACAEB' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Unprocessed</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.UnProcessed}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/unprocessed.png')} style={styles.summaryBlockImg} />
            </VStack>

            <VStack backgroundColor='#FAEBD7' style={styles.summaryBlock}>
              <Text style={styles.summaryTitle}>Week Off</Text>
              <Text style={styles.summaryValue}>{monthlySummary?.WeekOff}</Text>
              <Image source={require('../assets/icons/calendar-DB.png')} style={styles.summaryCalendarIcon} />
              <Image source={require('../assets/images/week-off.png')} style={styles.summaryBlockImg} />
            </VStack>
          </HStack>
        </VStack>

        <VStack mt={3} px={4}>
          <Text color='#333' fontFamily={fonts.PopSB} fontSize={18} mt={1}>Work Anniversary</Text>

          <LinearGradient colors={['#9ACCEB', 'rgba(15, 116, 179, .2)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearView}>
            {anniversary?.length > 0 ? anniversary?.map((item, index) => (
              <HStack key={index} alignItems='flex-start' mb={anniversary?.length == index + 1 ? 0 : 2} ml={3}>
                <Image source={require('../assets/images/party.png')} style={[styles.eventIcon, { width: 20 }]} />
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} ml={3.5} alignSelf='center'>{item.Name}</Text>
              </HStack>
            )) :
              <HStack justifyContent='space-between' px={3} alignItems='center'>
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5}>No Work Anniversary Today</Text>
                <Image source={require('../assets/images/work-anniversary.png')} style={styles.eventIcon} />
              </HStack>
            }
          </LinearGradient>


          <Text color='#333' fontFamily={fonts.PopSB} fontSize={18} mt={1}>Birthday</Text>
          <LinearGradient colors={['#9ACCEB', 'rgba(15, 116, 179, .2)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearView}>
            {birthDays?.length > 0 ? birthDays?.map((item, index) => {
              return (
                <HStack key={index} alignItems='flex-start' mb={birthDays?.length == index + 1 ? 0 : 2} ml={3}>
                  <Image source={require('../assets/images/cake.png')} style={[styles.eventIcon, { width: 20 }]} />
                  <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} ml={3.5} alignSelf='center'>{item.Name}</Text>
                </HStack>
              )
            }) :
              <HStack justifyContent='space-between' px={3} alignItems='flex-start'>
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} alignSelf='center'>No Birthday Today</Text>
                <Image source={require('../assets/images/Bithday-icon.png')} style={styles.eventIcon} />
              </HStack>}
          </LinearGradient>

          <Text color='#333' fontFamily={fonts.PopSB} fontSize={18} mt={1}>Events</Text>
          <LinearGradient colors={['#9ACCEB', 'rgba(15, 116, 179, .2)']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.linearView}>
            {events?.length > 0 ? events?.map((item, index) => (
              <HStack key={index} alignItems='flex-start' mb={events?.length == index + 1 ? 0 : 2} ml={3}>
                <Image source={require('../assets/images/red-carpet.png')} style={[styles.eventIcon, { width: 20 }]} />
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} ml={3.5} alignSelf='center'>{item?.EventName}</Text>
              </HStack>
            )) :
              <HStack justifyContent='space-between' px={3} alignItems='center'>
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} alignSelf='center'>No Event Today</Text>
                <Image source={require('../assets/images/event-icon.png')} style={styles.eventIcon} />
              </HStack>}

          </LinearGradient>

          {/* <ImageBackground source={require('../assets/images/event-BG.png')} style={styles.eventBG} resizeMode='stretch'>
            {events?.length > 0 ? events?.map((item, index) => (
              <HStack key={index} alignItems='flex-start' mb={events?.length > 4 ? 1.5 : 0}>
                <Image source={require('../assets/images/party.png')} style={[styles.eventIcon, { width: 18 }]} />
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5} ml={3} alignSelf='center'>{item?.EventName}</Text>
              </HStack>
            )) :
              <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize={18} fontFamily={fonts.UrbanM} mt={-1.5}>No Event Today</Text>
                <Image source={require('../assets/images/event-icon.png')} style={styles.eventIcon} />
              </HStack>}

          </ImageBackground> */}
        </VStack>
      </ScrollView>

    </NativeBaseProvider>
  )
}

const styles = StyleSheet.create({
  addIcon: {
    position: "absolute",
    right: 25,
    bottom: (Dimensions.get('window').height / 100) * 4,
    zIndex: 2
  },
  titleBG: {
    width: Dimensions.get('window').width,
    height: 220,
    paddingHorizontal: 18,
  },
  notificationBG: {
    width: Dimensions.get('window').width,
    height: 180,
    paddingHorizontal: 30,
    paddingTop: 24,
    paddingBottom: 12,
    top: -140,
  },
  notificationTitle: {
    fontFamily: fonts.UrbanM,
    fontSize: 17,
    color: 'white'
  },
  notificationValueTxt: {
    color: 'white',
    fontFamily: fonts.UrbanEB,
    marginRight: 8,
    fontSize: 16
  },
  BdayName: {
    fontFamily: fonts.UrbanM,
    color: '#333',
    fontSize: 17,
    marginTop: 8,
  },
  summaryBlock: {
    width: Dimensions.get('window').width / 100 * 45,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 150,
    marginBottom: 12,
    elevation: 5,
  },
  summaryTitle: {
    marginRight: 26,
    fontFamily: fonts.UrbanB,
    color: '#333',
    fontSize: 20,
  },
  summaryValue: {
    fontFamily: fonts.UrbanR,
    color: '#333',
    fontSize: 18
  },
  summaryCalendarIcon: {
    width: 22,
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
    right: 12,
    top: 10,
  },
  summaryBlockImg: {
    width: 70,
    height: undefined,
    aspectRatio: 1,
    position: 'absolute',
    right: 12,
    bottom: 4,
  },
  eventBG: {
    width: '100%' + 36,
    paddingTop: 14,
    paddingBottom: 18,
    marginBottom: 14,
    paddingLeft: 20,
    paddingRight: 16
  },
  eventIcon: {
    width: 44,
    height: undefined,
    aspectRatio: 1,
    // marginRight: 16
  },
  linearGradient: {
    // flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5,
    width: '100%',
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearView: {
    borderLeftWidth: 5,
    borderLeftColor: '#F39320',
    borderRadius: 10,
    paddingVertical: 12,
    marginBottom: 14,
    minHeight: 60,
    justifyContent: 'center',
  },
})

export default Home;