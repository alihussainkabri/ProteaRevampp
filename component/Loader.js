import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'

const Loader = () => {
  return (
    // <></>
    <View style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: '#00000030', zIndex: 2, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size='large' color='red' />
    </View>
  )
}

export default Loader;