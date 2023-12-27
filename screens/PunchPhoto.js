import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useRef } from 'react'
import { NativeBaseProvider } from 'native-base';

const PunchPhoto = () => {
    
    return (
        <NativeBaseProvider>
            <View style={{ flex: 1, width: '100%' }}>
                
                <Text>PunchPhoto</Text>
            </View>
        </NativeBaseProvider>
    )
}

export default PunchPhoto