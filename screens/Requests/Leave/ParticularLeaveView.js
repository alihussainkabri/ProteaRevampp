import { View, StatusBar, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Modal, FormControl, TextArea, Button } from 'native-base';
import Loader from '../../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../../config/Fonts';
import { userContext } from '../../../context/UserContext';
import Toast from 'react-native-root-toast';

const ParticularLeaveView = ({ navigation, route }) => {

    const [loader, setLoader] = useState(false)
    const { defaultUrl } = useContext(userContext)
    const [showModal, setShowModal] = useState(false);
    const [reason, setReason] = useState('');
    const { item } = route?.params


    async function cancelLeave() {
        if (reason?.length > 0) {
            setLoader(true)

            var raw = JSON.stringify({
                "EmpId": user?.EmpId,
                "requestId": item?.LRId,
                "RequestType": "LeaveRequest",
                "Remark": reason
            });

            console.log("raw is here:", raw)

            const response = await fetch("https://" + defaultUrl + '/api/Requests/RequestCancel', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                if (data?.Message == 'Success') {

                    Toast.show('Leave Cancelled Successfully')
                    setLoader(false)
                    navigation.goBack()
                } else {
                    console.log('test cancel', data)
                    Toast.show(data?.Message)
                    setLoader(false)
                }


            } else {
                Toast.show('Internal server error', {
                    duration: 3000,
                })
                setLoader(false)
            }
        } else {
            Toast.show('Please enter reason')
        }
    }

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>Leave Detail</Text>
                </HStack>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, marginTop: 10, paddingBottom: 200 }}>
                <VStack px={4} mb={5}>
                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Leave Type</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.LeaveType}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Duration</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.LeaveDuration}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>From Date</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.LeaveFrom}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>To Date</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.LeaveTo}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Request Date</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.RequestDate}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Total Days</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.NoOfDaysr}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Reason</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.Reason}</Text>
                    </HStack>

                    <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Status</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.RequestStatus}</Text>
                    </HStack>

                    {item?.RequestStatus == 'Pending' && <TouchableOpacity
                        onPress={() => setShowModal(true)}
                        style={{ backgroundColor: 'red', width: '100%', paddingVertical: 10, marginVertical: 20 }}>
                        <Text style={{ color: 'white', textAlign: 'center' }}>Request For Cancellation</Text>
                    </TouchableOpacity>}
                </VStack>

                <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Cancel Leave</Modal.Header>
                        <Modal.Body>
                            <FormControl>
                                <FormControl.Label>Enter Remark</FormControl.Label>
                                <TextArea h={20} placeholder="Text Area Placeholder" maxW="300" value={reason} onChangeText={setReason} />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                    setShowModal(false);
                                }}>
                                    Close
                                </Button>
                                <Button colorScheme='danger' onPress={cancelLeave}>
                                    Submit
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </ScrollView>
        </NativeBaseProvider>
    )
}

const styles = StyleSheet.create({
    infoCard: {
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#fbdfbc',
        paddingVertical: 14,
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: fonts.PopM,
        fontSize: 15,
        marginLeft: 12,
        textTransform: 'capitalize',
        letterSpacing: .1,
    },
    value: {
        fontFamily: fonts.UrbanR,
        fontSize: 15,
    }
})

export default ParticularLeaveView;