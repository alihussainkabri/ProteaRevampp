import React, { useState, useContext, useEffect } from "react";
import {
    Box,
    Button,
    FormControl,
    Input,
    Select,
    CheckIcon,
    VStack,
    ScrollView,
    Text,
    Image,
    HStack,
    Icon,
    Divider,
    NativeBaseProvider,
} from "native-base";
import DateTimePicker from "@react-native-community/datetimepicker";
import { launchImageLibrary } from "react-native-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import HeaderComp from "../../component/HeaderComp";
import { userContext } from "../../context/UserContext";
import Loader from '../../component/Loader';
import { Alert } from "react-native";

export default function CreateContractEmployee({ navigation }) {

    // ================= STATES =================
    const { user, defaultUrl } = useContext(userContext)
    const [load, setLoad] = useState(false)
    const [apiDetails1, setApiDetails1] = useState("")
    const [apiDetails2, setApiDetails2] = useState("")
    const [contractDetails, setContractDetails] = useState("")
    const [contractor, setContractor] = useState("")
    const [supervisor, setSupervisor] = useState("")
    const [template, setTemplate] = useState("")
    const [pancard,setPancard] = useState("")
    const [driving,setDriving] = useState("")
    const [company, setCompany] = useState("");
    const [branch, setBranch] = useState("");
    const [title, setTitle] = useState("");

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [empID, setEmpID] = useState("")

    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [mobile, setMobile] = useState("");

    const [joiningDate, setJoiningDate] = useState(new Date());
    
    const [employeeImage, setEmployeeImage] = useState(null);
    const [aadhaar, setAadhaar] = useState("");

    const [showBirthPicker, setShowBirthPicker] = useState(false);
    const [showJoinPicker, setShowJoinPicker] = useState(false);
    

    async function fetchPageDetails() {
        setLoad(true)
        const response = await fetch("https://" + defaultUrl + '/api/Employee/GetEnrollmentDetails', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                UserId: user?.EmpId
            })
        })

        if (response.ok == true) {
            const data = await response.json()

            setLoad(false)

            if (data) {
                setApiDetails1(data)
            }
        } else {
            setLoad(false)
        }
    }

    async function fetchContractDetails() {
        setLoad(true)
        const response = await fetch("https://" + defaultUrl + '/api/Employee/GetEnrollmentContractInfo', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                UserId: user?.EmpId
            })
        })

        if (response.ok == true) {
            const data = await response.json()

            setLoad(false)

            if (data) {
                setContractDetails(data)
            }
        } else {
            setLoad(false)
        }
    }

    useEffect(() => {
        fetchPageDetails()
        fetchContractDetails()
    }, [])

    async function fetchSecondAPI() {
        setLoad(true)
        const response = await fetch("https://" + defaultUrl + '/api/Employee/GetEnrollmentInfo', {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({
                UserId: user?.EmpId,
                CompanyId: company
            })
        })

        if (response.ok == true) {
            const data = await response.json()

            setLoad(false)

            if (data) {
                setApiDetails2(data)
            }
        } else {
            setLoad(false)
        }
    }

    useEffect(() => {
        if (company) {
            fetchSecondAPI()
        }
    }, [company])



    // ================= VALIDATION =================

    const validateEmail = (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    const validateAadhaar = (value) =>
        /^\d{12}$/.test(value);

    // ================= IMAGE PICKER =================

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: "photo", quality: 0.7 },
            (response) => {
                if (response.didCancel || response.errorCode) return;
                setEmployeeImage(response.assets[0].uri);
            }
        );
    };

    // const handleSubmit = () => {
    //     if (!validateEmail(email)) return alert("Invalid Email");
    //     if (!validateAadhaar(aadhaar)) return alert("Aadhaar must be 12 digits");
    //     alert("Employee Created Successfully");
    // };

    async function submit() {
        setLoad(true)
        let raw = {
            "UserId": user?.EmpId,
            "TypeID": "OnContract",
            "EmpID": empID,
            "ERPId": empID,
            "CompanyId": company,
            "SBUId": "0",
            "BranchId": branch,
            "Title": title,
            "FirstName": firstName,
            "MiddleName": middleName,
            "LastName": lastName,
            "DepartmentId": "",
            "SubDepartmentId": "",
            "DesignationId": "",
            "GradeId": "",
            "BandId": "",
            "Gender": gender,
            "BirthDate": birthDate,
            "MobileNo": mobile,
            "Email": "",
            "FunctionalHeadId": "0",
            "OperationalHeadId": "0",
            "SalaryStructureId": "0",
            "PayRollTypeId": "0",
            "CategoryId": "0",
            "AceessGroupId": "0",
            "JoiningDate": joiningDate,
            "SalaryDate": joiningDate,
            "EmployeeStatus": "0",
            "ProbationalType": "0",
            "ProbationPeriod": "",
            "ConfirmationDate": joiningDate,
            "AdharNumber": aadhaar,
            "TemporaryRegID": contractDetails?.TemporaryRegID,
            "ContractorId": contractor,
            "SupervisorName": supervisor,
            "TemplateNo": template
        }
        

        const response = await fetch("https://" + defaultUrl + "/api/Employee/SaveEnrollmentInfo", {
            method: 'POST',
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(raw)
        })

        if (response.ok == true) {
            const data = await response.json()

            setLoad(false)

            if (data?.Result == 1) {
                alert("Employee created successfully!")

                setTimeout(() => {
                    navigation.goBack()
                }, 400);
            } else {
                alert(data?.Message)
            }
        } else {
            setLoad(false)
            alert("Internal server error")
        }
    }

    return (
        <NativeBaseProvider>
            {load && <Loader />}
            <HeaderComp navigation={navigation} title="" />
            <ScrollView bg="#F4F6FA">
                <Box p="4">
                    <VStack space={4}>

                        <Text fontSize="xl" fontWeight="bold">
                            Create Employee
                        </Text>

                        <Divider my={2} />

                        {/* BASIC INFO */}
                        <Text fontSize="md" fontWeight="semibold">Basic Information</Text>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>EMP ID</FormControl.Label>
                                <Input value={empID} onChangeText={(value) => {
                                    setEmpID(value)
                                }} />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Title</FormControl.Label>
                                <Select selectedValue={title} onValueChange={setTitle}
                                    _selectedItem={{ bg: "primary.500", endIcon: <CheckIcon size="5" /> }}>
                                    {apiDetails1?.TitleList?.length > 0 && apiDetails1?.TitleList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Text} value={item?.Value} />
                                    ))}

                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>First Name</FormControl.Label>
                                <Input value={firstName} onChangeText={setFirstName} />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Middle Name</FormControl.Label>
                                <Input value={middleName} onChangeText={setMiddleName} />
                            </FormControl>
                        </HStack>
                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Last Name</FormControl.Label>
                                <Input value={lastName} onChangeText={setLastName} />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Mobile</FormControl.Label>
                                <Input value={mobile}
                                    onChangeText={(t) => setMobile(t.replace(/[^0-9]/g, ""))}
                                    keyboardType="numeric"
                                    maxLength={10}
                                />
                            </FormControl>

                        </HStack>
                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Gender</FormControl.Label>
                                <Select selectedValue={gender} onValueChange={setGender}>
                                    {apiDetails1?.GenderList?.length > 0 && apiDetails1?.GenderList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Text} value={item?.Value} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Birth Date</FormControl.Label>
                                <Button variant="outline" onPress={() => setShowBirthPicker(true)}>
                                    {birthDate.toLocaleDateString()}
                                </Button>
                            </FormControl>
                        </HStack>

                        {showBirthPicker && (
                            <DateTimePicker
                                value={birthDate}
                                mode="date"
                                maximumDate={new Date()}
                                onChange={(e, date) => {
                                    setShowBirthPicker(false);
                                    if (date) setBirthDate(date);
                                }}
                            />
                        )}

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Company</FormControl.Label>
                                <Select selectedValue={company} onValueChange={setCompany}>
                                    {apiDetails1?.CompanyList?.length > 0 && apiDetails1?.CompanyList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Branch</FormControl.Label>
                                <Select selectedValue={branch} onValueChange={setBranch}>
                                    {apiDetails2?.BranchList?.length > 0 && apiDetails2?.BranchList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Temporary Reg ID</FormControl.Label>
                                <Input defaultValue={contractDetails?.TemporaryRegID} isReadOnly={true} />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Contractor</FormControl.Label>
                                <Select selectedValue={contractor} onValueChange={setContractor}>
                                    {contractDetails?.ContractorList?.length > 0 && contractDetails?.ContractorList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>

                            <FormControl flex={1}>
                                <FormControl.Label>Supervisor</FormControl.Label>
                                <Select selectedValue={supervisor} onValueChange={setSupervisor}>
                                    {(contractDetails?.SupervisorList?.length > 0 && contractor) && contractDetails?.SupervisorList?.filter(item => item?.DId == contractor)?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Name} />
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl flex={1}>
                                <FormControl.Label>Template</FormControl.Label>
                                <Select selectedValue={template} onValueChange={setTemplate}>
                                    {contractDetails?.TemplateList?.length > 0 && contractDetails?.TemplateList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.DId} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>


                        {/* PERSONAL DETAILS */}
                        <Divider my={3} />
                        <Text fontSize="md" fontWeight="semibold">Personal Details</Text>



                        <HStack space={3}>
                            <FormControl flex={1} isInvalid={aadhaar && !validateAadhaar(aadhaar)}>
                                <FormControl.Label>Aadhaar</FormControl.Label>
                                <Input value={aadhaar}
                                    onChangeText={(t) => setAadhaar(t.replace(/[^0-9]/g, ""))}
                                    keyboardType="numeric"
                                    maxLength={12}
                                />
                                <FormControl.ErrorMessage>
                                    Must be 12 digits
                                </FormControl.ErrorMessage>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Work Start Date</FormControl.Label>
                                <Button variant="outline" onPress={() => setShowJoinPicker(true)}>
                                    {joiningDate.toLocaleDateString()}
                                </Button>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Pancard</FormControl.Label>
                                <Input value={pancard}
                                    onChangeText={setPancard}
                                />
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Driving License</FormControl.Label>
                                <Input value={driving}
                                    onChangeText={setDriving}
                                />
                            </FormControl>

                            
                        </HStack>


                        {showJoinPicker && (
                            <DateTimePicker
                                value={joiningDate}
                                mode="date"
                                onChange={(e, date) => {
                                    setShowJoinPicker(false);
                                    if (date) setJoiningDate(date);
                                }}
                            />
                        )}

                        {/* IMAGE */}
                        <Divider my={3} />
                        <FormControl>
                            <FormControl.Label>Employee Image</FormControl.Label>
                            <Button onPress={pickImage}>Upload Image</Button>
                            {employeeImage && (
                                <Image
                                    source={{ uri: employeeImage }}
                                    alt="Employee"
                                    size="xl"
                                    mt={3}
                                    borderRadius={15}
                                />
                            )}
                        </FormControl>

                        <Button mt={6} size="lg" colorScheme="primary" onPress={submit}>
                            Create Employee
                        </Button>

                    </VStack>
                </Box>
            </ScrollView>
        </NativeBaseProvider>
    );
}
