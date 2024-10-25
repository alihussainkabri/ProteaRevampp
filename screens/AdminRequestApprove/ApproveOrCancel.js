import { View, StatusBar, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { HStack, Text, NativeBaseProvider, VStack, Modal, FormControl, TextArea, Button } from 'native-base';
import Loader from '../../component/Loader';
import { Ionicons, Entypo, AntDesign } from 'react-native-vector-icons'
import { fonts } from '../../config/Fonts';
import { userContext } from '../../context/UserContext';
import Toast from 'react-native-root-toast';

const ApproveOrCancel = ({ navigation, route }) => {

    const [loader, setLoader] = useState(false)
    const { user, defaultUrl } = useContext(userContext)
    const [showModal, setShowModal] = useState(false);
    const [showApprove, setShowApprove] = useState(false);
    const [reason, setReason] = useState('');
    const { item, title } = route?.params

    async function approveReq() {
        setLoader(true)

        // let reqName = ''

        // if (title == 'On Duty') {
        //     reqName = '/api/OnDutyRequest/GetPendingOnDutyRequests';

        // } else if (title == 'Attendance Regularization') {
        //     reqName = '/api/RegularizationRequest/GetPendingRegularizationRequest';

        // }

        var raw = JSON.stringify({
            "Action": "A",
            "EmpId": item?.EmpId,
            "Remark": item?.Remark,
            "WFRAId": item?.WFRAId,
            "WFRId": item?.WFRId,
            "WFTId": item?.WFTId,
            "WFType": item?.WFType
        });

        console.log("raw is here:", raw)

        const response = await fetch("https://" + defaultUrl + '/api/Requests/RequestAcceptance', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: raw
        })

        if (response.ok == true) {
            const data = await response.json()

            if (data?.Message == 'Success') {
                console.log('approved')
                Toast.show('Request Approved Successfully')
                setLoader(false)
                navigation.goBack()
            } else {
                console.log('test cancel', data)
                Toast.show(data?.error_msg)
                setLoader(false)
            }


        } else {
            Toast.show('Internal server error', {
                duration: 3000,
            })
            setLoader(false)
        }
    }

    async function rejectLeave() {
        if (reason?.length > 0) {
            setLoader(true)

            var raw = JSON.stringify({
                "Action": "R",
                "EmpId": item?.EmpId,
                "Remark": item?.Remark,
                "WFRAId": item?.WFRAId,
                "WFRId": item?.WFRId,
                "WFTId": item?.WFTId,
                "WFType": item?.WFType
            });

            // console.log("raw is here:", raw)

            const response = await fetch("https://" + defaultUrl + '/api/Requests/RequestAcceptance', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json'
                },
                body: raw
            })

            if (response.ok == true) {
                const data = await response.json()

                if (data?.Message == 'Success') {
                    console.log('Rejected')
                    Toast.show('Request Rejected Successfully')
                    setLoader(false)
                    navigation.goBack()
                } else {
                    console.log('test cancel', data)
                    Toast.show(data?.error_msg)
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

    useEffect(() => { console.log(`here ${title} is: `, item) }, [])

    return (
        <NativeBaseProvider>
            {loader && <Loader />}
            <StatusBar translucent backgroundColor='transparent' />

            <HStack backgroundColor='#0F74B3' justifyContent='space-between' alignItems='center' px={4} pb={3} pt={12 + StatusBar.currentHeight}>
                <HStack alignItems='center'>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Ionicons name="md-menu-sharp" size={32} color="white" />
                    </TouchableOpacity>

                    <Text numberOfLines={1} ellipsizeMode='tail' width={Dimensions.get('window').width / 100 * 70} fontFamily={fonts.PopSB} fontSize={22} ml={6} color='white'>{title}</Text>
                </HStack>
            </HStack>

            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingTop: 10, marginTop: 10, paddingBottom: 200 }}>
                <VStack px={4} mb={5}>
                    {item?.EmpName && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Emp Name</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.EmpName}</Text>
                    </HStack>}

                    {item?.RequestedBy && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Emp Name</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.RequestedBy}</Text>
                    </HStack>}

                    {item?.ContactNo && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Mobile</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.ContactNo}</Text>
                    </HStack>}

                    {item?.ReqType && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Duration</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.ReqType}</Text>
                    </HStack>}

                    {item?.LeaveDuration && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Leave Duration</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.LeaveDuration}</Text>
                    </HStack>}

                    {item?.ShiftDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Shift Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.ShiftDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.LeaveFrom && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>From Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.LeaveFrom).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.RequestFromDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>From Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.RequestFromDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.RequestToDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>To Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.RequestToDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.LeaveTo && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>To Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.LeaveTo).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.ToDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>To Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.ToDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.FromTime && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Start Time</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.FromTime}</Text>
                    </HStack>}

                    {item?.RegularisationDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Regularisation Date</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.RegularisationDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.TotalHolidays && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Total Holidays</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.TotalHolidays}</Text>
                    </HStack>}

                    {item?.RequestDate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Requested On</Text>
                        </HStack>
                        <Text style={styles.value}>{new Date(item?.RequestDate).toLocaleDateString('en-GB')}</Text>
                    </HStack>}

                    {item?.Reason && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Reason</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.Reason}</Text>
                    </HStack>}

                    {item?.ReasonTemplate && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Reason Type</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.ReasonTemplate}</Text>
                    </HStack>}

                    {(item?.Remark || item?.RequestRemark) && <HStack style={styles.infoCard}>
                        <HStack alignItems='center'>
                            <Entypo name="v-card" size={20} color="black" />
                            <Text style={styles.title}>Purpose</Text>
                        </HStack>
                        <Text style={styles.value}>{item?.Remark ? item?.Remark : item?.RequestRemark ? item?.RequestRemark : 'NA'}</Text>
                    </HStack>}

                    <HStack space={2}>
                        <TouchableOpacity
                            onPress={() => setShowApprove(true)}
                            style={{ backgroundColor: 'green', flex: 1, paddingVertical: 10, marginVertical: 20, borderRadius: 4 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontFamily: fonts.PopM }}>Accept</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setShowModal(true)}
                            style={{ backgroundColor: 'red', flex: 1, paddingVertical: 10, marginVertical: 20, borderRadius: 4 }}>
                            <Text style={{ color: 'white', textAlign: 'center', fontFamily: fonts.PopM }}>Reject</Text>
                        </TouchableOpacity>
                    </HStack>

                    {/* {item?.ApprovalStatus == "Pending" && } */}
                </VStack>

                <Modal isOpen={showApprove} onClose={() => setShowApprove(false)}>
                    <Modal.Content maxWidth="400px">
                        <Modal.CloseButton />
                        <Modal.Header>Approve Req</Modal.Header>
                        <Modal.Body>
                            {/* <FormControl>
                                <FormControl.Label>Enter Remark</FormControl.Label>
                            </FormControl> */}
                            <Text fontFamily={fonts.PopSB} color='green.800' textAlign='center' fontSize={18}>{item?.EmpName ? item?.EmpName : item?.RequestedBy}</Text>
                            <Text fontFamily={fonts.PopR} color='black' fontSize={14} textAlign='center' mt={2}>Are you sure you want approve?</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button.Group space={2}>
                                <Button colorScheme='green' onPress={approveReq}>
                                    Approve
                                </Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

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
                                <Button colorScheme='danger' onPress={rejectLeave}>
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
        alignItems: 'flex-start',
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
        flex: 1,
        textAlign: 'right',
        marginLeft: 16
    }
})

export default ApproveOrCancel;