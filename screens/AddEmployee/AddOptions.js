import { View, Text, TouchableOpacity, StatusBar, Image, StyleSheet } from 'react-native'
import React from 'react'
import { HStack, NativeBaseProvider } from 'native-base'
import { Ionicons,MaterialIcons } from 'react-native-vector-icons'
import { fonts } from '../../config/Fonts'

const AddOptions = ({ navigation }) => {
    return (
        <NativeBaseProvider>

            <HStack backgroundColor='#0F74B3' alignItems='center' justifyContent='space-between' px={4} pb={2} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontSize={24} ml={6} color='white'>Add Employee</Text>
                </HStack>

                <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
                    <Image source={require('../../assets/icons/QR.png')} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
            </HStack>

            <View style={styles.container}>

                {/* Fixed Employee */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("AddFixedEmployee")}
                >
                    <MaterialIcons name="person" size={28} color="#3B82F6" />
                    <Text style={styles.cardText}>Create Fixed Employee</Text>
                </TouchableOpacity>

                {/* Contractual Employee */}
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate("CreateContractEmployee")}
                >
                    <MaterialIcons name="badge" size={28} color="#10B981" />
                    <Text style={styles.cardText}>Create Contractual Employee</Text>
                </TouchableOpacity>

            </View>

        </NativeBaseProvider>
    )
}

export default AddOptions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F6FA",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
  },
});