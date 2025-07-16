import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign, FontAwesome, MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { getConvertDate, getConvertTime } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"
import Toast from 'react-native-root-toast';

const CreateLCEG = ({navigation}) => {

  const { user, defaultUrl } = useContext(userContext)
  const [loader, setLoader] = useState(false)
  const [requestType, setRequestType] = useState('Special Duty')
  const [dutyDateCalendarShow, setDutyDateCalendarShow] = useState(false);
  const [dutyDate, setDutyDate] = useState('');
  const [startTimeShow, setStartTimeShow] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [EndTimeShow, setEndTimeShow] = useState(false);
  const [EndTime, setEndTime] = useState('');
  const [dutyReason, setDutyReason] = useState('');
  const [LCEGCalendarShow, setLCEGCalendarShow] = useState('');
  const [LCEGDate, setLCEGDate] = useState('');
  const [specialDutyList, setSpecialDutyList] = useState([]);
  const [reportingType, setReportingType] = useState('L');
  const [reportingTime, setReportingTime] = useState('F');
  const [noOfMinutes, setNoOfMinutes] = useState('');
  const [showReason, setShowReason] = useState(false);
  const [particularReason, setParticularReason] = useState('');
  const [allReasons, setAllReasons] = useState('');
  const [LCEGReason, setLCEGReason] = useState('');
  const [editIndex, setEditIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  async function fetchReasons() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "ModuleName": "Time Attendance",
      "FormName": "Late Coming/Early Going"
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
      console.log('reason', data)
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
    fetchReasons();
  }, [])

  const handleFromDate = (date) => {
    console.warn("A date has been picked: ", date.toString());

    const convertedDate = getConvertDate(date.toString());
    setDutyDate(convertedDate)
    setDutyDateCalendarShow(false);
  };

  const handleLCEGDate = (date) => {
    console.warn("A date has been picked: ", date.toString());

    const convertedDate = getConvertDate(date.toString());
    setLCEGDate(convertedDate)
    setLCEGCalendarShow(false);
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

  function AddDuty() {
    if (dutyDate && startTime && EndTime) {
      let checkItem = specialDutyList.filter((item) => item?.dutyDate == dutyDate && item?.startTime == startTime && item?.EndTime == EndTime)

      if (editIndex > 0) {
        checkItem = specialDutyList.filter((item, index) => item?.dutyDate == dutyDate && item?.startTime == startTime && item?.EndTime == EndTime && index != editIndex - 1)
      }

      if (checkItem?.length > 0) {
        Toast.show('Entry already exist')
      } else {

        if (editIndex > 0) {
          setSpecialDutyList(specialDutyList.map((item, index) => {
            if (index == editIndex - 1) {
              return {
                dutyDate,
                startTime,
                EndTime,
                dutyReason
              }
            } else {
              return item;
            }
          }))
        } else {
          setSpecialDutyList([...specialDutyList, {
            dutyDate,
            startTime,
            EndTime,
            dutyReason
          }])
        }

        setEditIndex(0)
        // setDutyDate('')
        setStartTime('')
        setEndTime('')
        setDutyReason('')
        setIsEditing(false)
      }
    } else {
      Toast.show('Please Fill All Data')
    }
  }

  function DeleteDuty(currentIndex) {
    const checkItem = specialDutyList.filter((_, index) => index != currentIndex)
    setSpecialDutyList(checkItem)
  }

  async function submitReq() {
    setLoader(true)

    var raw = JSON.stringify({
      "EmpId": user?.EmpId,
      "RequestFromDate": requestType == 'Special Duty' ? dutyDate : LCEGDate,
      "RequestToDate": null,
      "Time": noOfMinutes ?? 0,
      "RequestType": reportingType ?? '',
      "DayHalfStatus": reportingTime,
      "RId": particularReason?.RId ?? null,
      "Reason": requestType == 'Special Duty' ? dutyReason : LCEGReason,
      "SpecialDutyShiftDate": requestType == 'Special Duty' ? dutyDate : LCEGDate ,
      "IsLCEGRequest": requestType == 'Special Duty' ? false : true,
      "IsSpecialDutyRequest": requestType == 'Special Duty' ? true : false,
      "FullDayLeave": 0,
      "DB": 0,
      "UserId": 1,
      "UserOSId": 0,
      "UserCId": 0,
      "Offset": "+05:30",
      "SpecialDutyDT": specialDutyList?.length > 0 ? specialDutyList?.map((item) => {
        return {
          "SpecialDutyStartTime": `${item?.dutyDate} ${item?.startTime}`,
          "SpecialDutyEndTime": `${item?.dutyDate} ${item?.EndTime}`,
          "SpecialDutyReason": item?.dutyReason
        }
      }) : []
    });

    const response = await fetch("https://" + defaultUrl + '/api/LCEGRequest/AddLCEGRequest', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json'
      },
      body: raw
    })

    if (response.ok == true) {
      const data = await response.json()
      Toast.show(data?.error_msg ? data?.error_msg : 'Request Has Been Submitted')
      setLoader(false)
      if (!data?.error_msg) {
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

        <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>LC/EG Request</Text>
      </HStack>

      <ScrollView style={{ paddingTop: 16 }}>
        <View style={{ flex: 1, marginBottom: 20 }}>
          <View style={{ paddingHorizontal: 16, }}>
            <Text style={[styles.label, { marginTop: 4 }]}>Select Request Type</Text>
            <Radio.Group name="RequestType" defaultValue={requestType} onChange={e => setRequestType(e)} accessibilityLabel="pick duration">
              <HStack justifyContent='space-between' alignItems='center' flexWrap='wrap'>
                <Stack w='50%' my={.5}>
                  <Radio value="Special Duty" colorScheme="blue" size="sm" my={1}>
                    <Text fontFamily={fonts.UrbanM}>Special Duty</Text>
                  </Radio>
                </Stack>
                <Stack w='50%' my={.5}>
                  <Radio value="LCEG" colorScheme="blue" size="sm" my={1}>
                    <Text fontFamily={fonts.UrbanM}>LCEG</Text>
                  </Radio>
                </Stack>
              </HStack>
            </Radio.Group>

            {requestType == 'Special Duty' && <>
              <Text style={styles.heading}>Special Duty Details</Text>
              <VStack flex={1}>
                <Text style={styles.label}>Date</Text>
                <TouchableOpacity onPress={() => setDutyDateCalendarShow(true)} style={styles.selectDate}>
                  <Text style={styles.placeHolder}>{dutyDate ? dutyDate.toString() : 'Select Date'}</Text>
                  <AntDesign name="calendar" size={18} color="#737373" />
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={dutyDateCalendarShow}
                  mode="date"
                  onConfirm={handleFromDate}
                  onCancel={() => setDutyDateCalendarShow(false)}
                />
              </VStack>

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
                <Text style={styles.label}>Enter Purpose</Text>
                <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={dutyReason} onChangeText={setDutyReason} />
              </VStack>

              <TouchableOpacity onPress={AddDuty} style={[styles.btn, { backgroundColor: '#1875e2', marginTop: 20 }]}>
                <Text color='white' fontSize={17} textAlign='center' fontFamily={fonts.PopM}>{isEditing ? 'Save' : 'Add'}</Text>
              </TouchableOpacity>
            </>}
          </View>

          {specialDutyList?.length > 0 && specialDutyList?.map((item, index) => (
            <HStack key={index} flex={1} mx={4} shadow={2} style={{ borderRadius: 8 }} my={2.5}>
              <VStack backgroundColor='#f9f9f9' flexGrow={1} px={3} py={3} style={{ borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                <HStack alignItems='center' justifyContent='space-between'>
                  <VStack>
                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>From Date</Text>
                    <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.dutyDate}</Text>
                  </VStack>

                  <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 20, marginHorizontal: 20 }}></View>

                  <VStack>
                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Start Time</Text>
                    <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.startTime}</Text>
                  </VStack>

                  <View style={{ backgroundColor: '#c6c6c6', height: 2, width: 20, marginHorizontal: 20 }}></View>

                  <VStack>
                    <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>End Time</Text>
                    <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.EndTime}</Text>
                  </VStack>
                </HStack>

                <VStack mt={3}>
                  <Text color='#bbbbbb' fontFamily={fonts.PopM} fontSize={12}>Purpose</Text>
                  <Text color='#3b3b3b' fontFamily={fonts.PopSB} fontSize={12}>{item?.dutyReason}</Text>
                </VStack>

                <HStack justifyContent='flex-end' mt={4}>
                  <TouchableOpacity onPress={() => DeleteDuty(index)} style={[styles.editDeleteBtn, { backgroundColor: '#f5e9e9' }]}>
                    <MaterialIcons name="delete" size={16} style={{ marginTop: -4, color: '#cf0101' }} />
                    <Text style={{ color: '#cf0101' }} fontSize={13} textAlign='center' fontFamily={fonts.PopM}>Delete</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => {
                    setEditIndex(index + 1)
                    setDutyDate(item?.dutyDate)
                    setStartTime(item?.startTime)
                    setEndTime(item?.EndTime)
                    setDutyReason(item?.dutyReason)
                    setIsEditing(true)
                  }} style={[styles.editDeleteBtn, { backgroundColor: '#1875e2', marginLeft: 8 }]}>
                    <FontAwesome name="pencil" size={16} color="white" />
                    <Text color='white' fontSize={13} textAlign='center' fontFamily={fonts.PopM}>Edit</Text>
                  </TouchableOpacity>
                </HStack>
              </VStack>
            </HStack>
          ))}

          {requestType == 'LCEG' && <View style={{ paddingHorizontal: 16, }}>
            <Text style={styles.heading}>LCEG Details</Text>
            <VStack flex={1}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity onPress={() => setLCEGCalendarShow(true)} style={styles.selectDate}>
                <Text style={styles.placeHolder}>{LCEGDate ? LCEGDate.toString() : 'Select Date'}</Text>
                <AntDesign name="calendar" size={18} color="#737373" />
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={LCEGCalendarShow}
                mode="date"
                onConfirm={handleLCEGDate}
                onCancel={() => setLCEGCalendarShow(false)}
              />
            </VStack>

            <HStack backgroundColor='ghostwhite' mt={1.5} rounded={2}>
              <TouchableOpacity onPress={() => setReportingType('L')} style={[styles.leaveFromToView, { backgroundColor: reportingType == 'L' ? '#dee8f4' : 'transparent' }]}>
                <Text style={[styles.leaveFromToText, { color: reportingType == 'L' ? '#1875e2' : 'gray' }]}>Late Comming</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setReportingType('E')} style={[styles.leaveFromToView, { backgroundColor: reportingType == 'E' ? '#dee8f4' : 'transparent' }]}>
                <Text style={[styles.leaveFromToText, { color: reportingType == 'E' ? '#1875e2' : 'gray' }]}>Early Going</Text>
              </TouchableOpacity>
            </HStack>

            <HStack backgroundColor='ghostwhite' mt={1.5} rounded={2}>
              <TouchableOpacity onPress={() => setReportingTime('F')} style={[styles.leaveFromToView, { backgroundColor: reportingTime == 'F' ? '#dee8f4' : 'transparent' }]}>
                <Text style={[styles.leaveFromToText, { color: reportingTime == 'F' ? '#1875e2' : 'gray' }]}>1st Half</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setReportingTime('S')} style={[styles.leaveFromToView, { backgroundColor: reportingTime == 'S' ? '#dee8f4' : 'transparent' }]}>
                <Text style={[styles.leaveFromToText, { color: reportingTime == 'S' ? '#1875e2' : 'gray' }]}>2nd Half</Text>
              </TouchableOpacity>
            </HStack>

            <VStack>
              <Text style={styles.label}>Enter Number Of Minutes</Text>
              <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={noOfMinutes} onChangeText={setNoOfMinutes} />
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
              <Input variant='outline' style={[styles.inputView, { maxHeight: 100 }]} borderColor='#1875e2' borderRadius={2} py={1.5} multiline value={LCEGReason} onChangeText={setLCEGReason} />
            </VStack>
          </View>}

          <HStack mt={4} space={2} mb={2} mx={4}>
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
  heading: {
    color: '#4f4f4f',
    marginTop: 20,
    fontFamily: fonts.UrbanB,
    fontSize: 18,
    paddingBottom: 6,
    borderBottomColor: '#a9a9a9',
    borderBottomWidth: 1
  },
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
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editDeleteBtn: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80
  },
  leaveFromToView: {
    flex: 1,
    paddingVertical: 8,
  },
  leaveFromToText: {
    fontFamily: fonts.UrbanSB,
    textAlign: 'center',
    fontSize: 16,
  },
})

export default CreateLCEG;