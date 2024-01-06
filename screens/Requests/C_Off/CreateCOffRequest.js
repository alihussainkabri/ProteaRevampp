import { View, StatusBar, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Stack, Radio, Input, Actionsheet } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { url, getConvertDate } from '../../../helpers';
import { userContext } from '../../../context/UserContext';
import DateTimePickerModal from "react-native-modal-datetime-picker"

const CreateCOffRequest = ({ navigation }) => {

    const { user } = useContext(userContext)
    const [loader, setLoader] = useState(false)
    const [cOffDuration, setCOffDuration] = useState('1st Half')

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Ionicons name="md-menu-sharp" size={32} color="white" />
                </TouchableOpacity>

                <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Apply Leave</Text>
            </HStack>

            <ScrollView style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <Text style={[styles.label, { marginTop: 4 }]}>Leave Duration</Text>
                    <Radio.Group name="cOffDuration" defaultValue={cOffDuration} onChange={e => setCOffDuration(e)} accessibilityLabel="pick duration">
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
                            <Stack w='50%' my={.5}>
                                <Radio value="Multi Day" colorScheme="blue" size="sm" my={1}>
                                    <Text fontFamily={fonts.UrbanM}>Multi Day</Text>
                                </Radio>
                            </Stack>
                        </HStack>
                    </Radio.Group>


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

export default CreateCOffRequest;