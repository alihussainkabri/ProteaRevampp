import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { getConvertDate, getConvertTime } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-root-toast';

const CreateOnDutyRequest = ({ navigation }) => {

  const { user, defaultUrl } = useContext(userContext)
  const [loader, setLoader] = useState(false)
  const [requestType, setRequestType] = useState('1st Half')
  const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [allShifts, setAllShifts] = useState('');
  const [showShifts, setShowShifts] = useState(false);
  const [shiftType, setShiftType] = useState('');
  const [startTimeShow, setStartTimeShow] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [EndTimeShow, setEndTimeShow] = useState(false);
  const [EndTime, setEndTime] = useState('');
  const [place, setPlace] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [allReasons, setAllReasons] = useState('');
  const [particularReason, setParticularReason] = useState('');
  const [purpose, setPurpose] = useState('');


  const handleFromDate = (date) => {
    console.warn("A date has been picked: ", date.toString());

    const convertedDate = getConvertDate(date.toString());
    setFromDate(convertedDate)
    setFromDateCalendarShow(false);
  };

  const handleStartTime = (time) => {
    // console.warn("A time has been picked: ", time.toString());

    const convertedTime = getConvertTime(time.toString());
    // console.log('concerted time:', convertedTime)
    setStartTime(convertedTime)
    setStartTimeShow(false);
  };

  const handleEndTime = (time) => {
    // console.warn("A time has been picked: ", time.toString());

    const convertedTime = getConvertTime(time.toString());
    // console.log('concerted time:', convertedTime)
    setEndTime(convertedTime)
    setEndTimeShow(false);
  };

  async function fetchShifts() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
    });

    const response = await fetch("https://" + defaultUrl + '/api/OnDutyRequest/GetShiftDetails', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: raw
    })

    if (response.ok == true) {
      const data = await response.json()

      // console.log('all shifts data: ', data)
      setAllShifts(data)
      setLoader(false)

    } else {
      Toast.show('Internal server error', {
        duration: 3000,
      })
      setLoader(false)
    }
  }

  async function fetchReasons() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "ModuleName": "Time Attendance",
      "FormName": "On Duty"
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

      // console.log('all reasons data: ', data)
      setAllReasons(data)
      setLoader(false)

    } else {
      Toast.show('Internal server error', {
        duration: 3000,
      })
      setLoader(false)
    }
  }

  useEffect(() => {
    fetchShifts();
    fetchReasons();
  }, [])

  async function submitReq() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "ShiftDate": fromDate,
      "ReqType": requestType,
      "RefShiftId": shiftType?.ShiftId,
      "RId": particularReason?.RId,
      "ReasonId": purpose,
      "Place": place,
      "WeekOff": false,
      "Holiday": false,
      "Attatchment": null,
      "ODDetailList": [
        {
          "TODId": 0,
          "FromTime": startTime,
          "ToTime": EndTime,
          "Place": place,
          "Purpose": purpose
        }
      ]
    });

    console.log('ODRequest consoled here', raw)

    const response = await fetch("https://" + defaultUrl + '/api/OnDutyRequest/AddOnDutyRequest', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: raw
    })

    if (response.ok == true) {
      const data = await response.json()
      // alert(data?.error_msg)
      Toast.show(data?.error_msg ? data?.error_msg : 'Request Has Been Submitted')
      setLoader(false)
      if(!data?.error_msg){
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

        <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply On Duty Request</Text>
      </HStack>

      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          <Text style={[styles.label, { marginTop: 4 }]}>Select Request Type</Text>
          <Radio.Group name="RequestType" defaultValue={requestType} onChange={e => setRequestType(e)} accessibilityLabel="pick duration">
            <HStack justifyContent='space-between' alignItems='center' flexWrap='wrap'>
              <Stack w='50%' my={.5}>
                <Radio value="F" colorScheme="blue" size="sm" my={1}>
                  <Text fontFamily={fonts.UrbanM}>1st Half</Text>
                </Radio>
              </Stack>
              <Stack w='50%' my={.5}>
                <Radio value="S" colorScheme="blue" size="sm" my={1}>
                  <Text fontFamily={fonts.UrbanM}>2nd Half</Text>
                </Radio>
              </Stack>
              <Stack w='50%' my={.5}>
                <Radio value="D" colorScheme="blue" size="sm" my={1}>
                  <Text fontFamily={fonts.UrbanM}>Full Day</Text>
                </Radio>
              </Stack>
            </HStack>
          </Radio.Group>

          <VStack flex={1}>
            <Text style={styles.label}>From Date</Text>
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

          <VStack>
            <Text style={styles.label}>Select Shift</Text>
            <TouchableOpacity onPress={() => setShowShifts(true)} style={styles.selectDate}>
              <Text style={styles.placeHolder}>{shiftType ? shiftType?.Shift : 'Select Shift'}</Text>
              <Entypo name="chevron-small-down" size={24} color="#737373" />
            </TouchableOpacity>

            <Actionsheet isOpen={showShifts} onClose={() => setShowShifts(false)}>
              <Actionsheet.Content>
                {allShifts?.length > 0 ? allShifts?.map((item, index) => (
                  <Actionsheet.Item key={index} onPress={() => {
                    setShiftType(item)
                    setShowShifts(false)
                  }}>
                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.Shift}</Text>
                  </Actionsheet.Item>

                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
              </Actionsheet.Content>
            </Actionsheet>
          </VStack>

          <Text style={[styles.label, { fontFamily: fonts.UrbanB, fontSize: 18, paddingTop: 12, paddingBottom: 6, borderBottomColor: '#a9a9a9', borderBottomWidth: 1 }]}>OD Details</Text>

          <VStack flex={1}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity onPress={() => setStartTimeShow(true)} style={styles.selectDate}>
              <Text style={styles.placeHolder}>{startTime ? startTime : 'Select Timing'}</Text>
              <AntDesign name="calendar" size={18} color="#737373" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={startTimeShow}
              mode="time"
              onConfirm={handleStartTime}
              onCancel={() => setStartTimeShow(false)}
            />
          </VStack>

          <VStack flex={1}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity onPress={() => setEndTimeShow(true)} style={styles.selectDate}>
              <Text style={styles.placeHolder}>{EndTime ? EndTime : 'Select Timing'}</Text>
              <AntDesign name="calendar" size={18} color="#737373" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={EndTimeShow}
              mode="time"
              onConfirm={handleEndTime}
              onCancel={() => setEndTimeShow(false)}
            />
          </VStack>

          <VStack>
            <Text style={styles.label}>Enter Place</Text>
            <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={place} onChangeText={setPlace} />
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
                  <Actionsheet.Item key={index} onPress={() => {
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
            <Text style={styles.label}>Enter Purpose</Text>
            <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={purpose} onChangeText={setPurpose} />
          </VStack>

          <HStack mt={4} space={2} mb={2}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.btn, { backgroundColor: '#f5e9e9' }]}>
              <Text style={{ color: '#cf0101' }} fontSize={17} textAlign='center' fontFamily={fonts.PopM}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={submitReq} style={[styles.btn, { backgroundColor: '#1875e2' }]}>
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

export default CreateOnDutyRequest;