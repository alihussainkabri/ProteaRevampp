import { View, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { HStack, Text, NativeBaseProvider } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';

const ListOfEHCRequests = ({ navigation }) => {

    const [loader, setLoader] = useState(false)

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>EHC/OT Request</Text>
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('CreateEHCRequest')}>
                    <Entypo name="circle-with-plus" size={32} color="white" />
                </TouchableOpacity>
            </HStack>
        </NativeBaseProvider>
    )
}

export default ListOfEHCRequests;