import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { getConvertDate, url } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"

const CreateOnDutyRequest = ({ navigation }) => {

  const { user } = useContext(userContext)
  const [loader, setLoader] = useState(false)
  const [requestType, setRequestType] = useState('1st Half')
  const [fromDateCalendarShow, setFromDateCalendarShow] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [allShifts, setAllShifts] = useState('');
  const [showShifts, setShowShifts] = useState(false);
  const [shiftType, setShiftType] = useState('');


  const handleFromDate = (date) => {
    console.warn("A date has been picked: ", date.toString());

    const convertedDate = getConvertDate(date.toString());
    setFromDate(convertedDate)
    setFromDateCalendarShow(false);
  };

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
          <Text style={[styles.label, { marginTop: 4 }]}>Leave Duration</Text>
          <Radio.Group name="RequestType" defaultValue={requestType} onChange={e => setRequestType(e)} accessibilityLabel="pick duration">
            <HStack justifyContent='space-between' alignItems='center' flexWrap='wrap'>
              <Stack w='50%' my={.5}>
                <Radio value="1st Half" colorScheme="blue" size="sm" my={1}>
                  <Text fontFamily={fonts.UrbanM}>1st Half</Text>
                </Radio>
              </Stack>
              <Stack w='50%' my={.5}>
                <Radio value="2nd Half" colorScheme="blue" size="sm" my={1}>
                  <Text fontFamily={fonts.UrbanM}>2nd Half</Text>
                </Radio>
              </Stack>
              <Stack w='50%' my={.5}>
                <Radio value="Full Day" colorScheme="blue" size="sm" my={1}>
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
              <Text style={styles.placeHolder}>{shiftType ? shiftType?.RDescription : 'Select Shift'}</Text>
              <Entypo name="chevron-small-down" size={24} color="#737373" />
            </TouchableOpacity>

            <Actionsheet isOpen={showShifts} onClose={() => setShowShifts(false)}>
              <Actionsheet.Content>
                {allShifts?.length > 0 ? allShifts?.map((item, index) => (
                  <Actionsheet.Item onPress={() => {
                    setShiftType(item)
                    setShowShifts(false)
                  }}>
                    <Text fontSize={16} fontFamily={fonts.UrbanSB}>{item?.RDescription}</Text>
                  </Actionsheet.Item>

                )) : <Actionsheet.Item>No data found</Actionsheet.Item>}
              </Actionsheet.Content>
            </Actionsheet>
          </VStack>
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
})

export default CreateOnDutyRequest;