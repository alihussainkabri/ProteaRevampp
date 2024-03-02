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

const CreateAttRegRequest = ({ navigation }) => {

  const { user, defaultUrl } = useContext(userContext)
  const [loader, setLoader] = useState(false)
  const [requestType, setRequestType] = useState('1st Half')
  const [DateCalendarShow, setDateCalendarShow] = useState(false);
  const [punchTimeShow, setPunchTimeShow] = useState(false);
  const [punchTime, setPunchTime] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [allDetails, setAllDetails] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalType, setTerminalType] = useState('');
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
    setDateCalendarShow(false);
  };

  const handlePunchTime = (time) => {
    console.warn("A date has been picked: ", time.toString());

    const convertedTime = getConvertTime(time.toString());
    setPunchTime(convertedTime)
    setPunchTimeShow(false);
  };

  async function fetchDetails() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "ShiftDate": fromDate
    });

    const response = await fetch("https://" + defaultUrl + '/api/RegularizationRequest/GetPunches', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: raw
    })

    if (response.ok == true) {
      const data = await response.json()

      console.log('all ATT.REG data: ', data)
      setAllDetails(data)
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
      "FormName": "rbtAttdRegRequest"
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
    fetchDetails();
  }, [fromDate])

  useEffect(() => {
    fetchReasons();
  }, [])

  async function submitReq() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "ShiftDate": fromDate,
      "NewFirstHalfStatus": null,
      "NewSecondHalfStatus": null,
      "FHST": null,
      "RFirstHalfScheduleId": 0,
      "RSecondHalfSchedule": null,
      "RId": particularReason?.RId,
      "Reason": purpose,
      "Punhces_Old": null,
      "Punhces_Modified":
        [
          {
            "PDId": 0,
            "TerminalId": terminalType?.TerminalId,
            "PunchDate": fromDate,
            "Source": "R",
            "PunchTime": punchTime,
            "TerminalName": terminalType?.TerminalName
          }
        ]
    });


    console.warn('ATT.REG consoled here', raw)

    const response = await fetch("https://" + defaultUrl + '/api/RegularizationRequest/CreateRegularizationRequest', {
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

        <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply Att.Req Request</Text>
      </HStack>

      <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          <VStack flex={1}>
            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity onPress={() => setDateCalendarShow(true)} style={styles.selectDate}>
              <Text style={styles.placeHolder}>{fromDate ? fromDate.toString() : 'Select Date'}</Text>
              <AntDesign name="calendar" size={18} color="#737373" />
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={DateCalendarShow}
              mode="date"
              onConfirm={handleFromDate}
              onCancel={() => setDateCalendarShow(false)}
            />
          </VStack>

          <Text style={styles.secTitle}>Current Schedule</Text>
          <VStack>
            <Text style={styles.label}>1st Half Schedule</Text>
            <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={allDetails?.MusterStatuses?.length > 0 ? allDetails?.MusterStatuses[0]?.OldFirstHalfSchedule : ''} isReadOnly />
          </VStack>

          <VStack>
            <Text style={styles.label}>2nd Half Schedule</Text>
            <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={allDetails?.MusterStatuses?.length > 0 ? allDetails?.MusterStatuses[0]?.OldSecondHalfSchedule : ''} isReadOnly />
          </VStack>

          <Text style={styles.secTitle}>Current Status</Text>
          <VStack>
            <Text style={styles.label}>1st Half Status</Text>
            <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={allDetails?.MusterStatuses?.length > 0 ? allDetails?.MusterStatuses[0]?.OldFirstHalfStatus : ''} isReadOnly />
          </VStack>

          <VStack>
            <Text style={styles.label}>2nd Half Status</Text>
            <Input variant='outline' style={styles.inputView} borderColor='#1875e2' borderRadius={2} py={1.5} value={allDetails?.MusterStatuses?.length > 0 ? allDetails?.MusterStatuses[0]?.OldSecondHalfStatus : ''} isReadOnly />
          </VStack>

          <Text style={styles.secTitle}>Punch Details</Text>
          <Text style={styles.label}>Punch Time</Text>
          <TouchableOpacity onPress={() => setPunchTimeShow(true)} style={styles.selectDate}>
            <Text style={styles.placeHolder}>{punchTime ? punchTime : 'Select Time'}</Text>
            <AntDesign name="calendar" size={18} color="#737373" />
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={punchTimeShow}
            mode="time"
            onConfirm={handlePunchTime}
            onCancel={() => setPunchTimeShow(false)}
          />

          <VStack>
            <Text style={styles.label}>Select Terminal</Text>
            <TouchableOpacity onPress={() => setShowTerminal(true)} style={styles.selectDate}>
              <Text style={styles.placeHolder}>{terminalType ? terminalType?.TerminalName : 'Select Terminal'}</Text>
              <Entypo name="chevron-small-down" size={24} color="#737373" />
            </TouchableOpacity>

            <Actionsheet isOpen={showTerminal} onClose={() => setShowTerminal(false)}>
              <Actionsheet.Content>
                {allDetails?.Terminals?.length > 0 ? allDetails?.Terminals?.map((item, index) => (
                  <Actionsheet.Item key={index} onPress={() => {
                    setTerminalType(item)
                    setShowTerminal(false)
                  }}>
                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.TerminalName}</Text>
                  </Actionsheet.Item>

                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
              </Actionsheet.Content>
            </Actionsheet>
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
            <Text style={styles.label}>Enter Reason</Text>
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
    fontSize: 15,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 4
  },
  secTitle: {
    fontFamily: fonts.UrbanB,
    fontSize: 18,
    paddingTop: 12,
    paddingBottom: 6,
    borderBottomColor: '#a9a9a9',
    borderBottomWidth: 1,
    color: '#4f4f4f',
    marginTop: 20,
  }
})

export default CreateAttRegRequest;