import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Entypo } from 'react-native-vector-icons'

const Home = ({ navigation }) => {
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Entypo name="menu" size={28} color="black" />
      </TouchableOpacity>
      <Text>Home</Text>
    </View>
  )
}

export default Home;