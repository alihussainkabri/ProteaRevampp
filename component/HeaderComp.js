import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React from 'react'
import { HStack } from 'native-base'
import { fonts } from '../config/Fonts'
import { Ionicons } from 'react-native-vector-icons'

const HeaderComp = ({title,navigation}) => {
    return (
        <HStack backgroundColor='#0F74B3' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="md-menu-sharp" size={32} color="white" />
            </TouchableOpacity>

            <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>{title}</Text>
        </HStack>
    )
}

export default HeaderComp