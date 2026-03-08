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

export default function CreateEmployee({ navigation }) {

    // ================= STATES =================
    const { user, defaultUrl } = useContext(userContext)
    const [load,setLoad] = useState(false)
    const [apiDetails1, setApiDetails1] = useState("")
    const [apiDetails2, setApiDetails2] = useState("")
    const [empId, setEmpId] = useState("");
    const [company, setCompany] = useState("");
    const [field, setField] = useState("");
    const [sbu, setSbu] = useState("");
    const [branch, setBranch] = useState("");
    const [title, setTitle] = useState("");

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [empID, setEmpID] = useState("")
    const [erpID, setERPID] = useState("")

    const [department, setDepartment] = useState("");
    const [subDepartment, setSubDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [grade, setGrade] = useState("");
    const [band, setBand] = useState("")
    const [salaryStructure, setSalaryStructure] = useState("")
    const [payrollType, setPayrollType] = useState("")
    const [category, setCategory] = useState("")
    const [probationType, setProbationType] = useState("")
    const [group, setGroup] = useState("")
    const [period, setPeriod] = useState(0)

    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState(new Date());
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");

    const [operationalHead, setOperationalHead] = useState("");
    const [functionalHead, setFunctionalHead] = useState("");
    const [employeeStatus, setEmployeeStatus] = useState("");

    const [joiningDate, setJoiningDate] = useState(new Date());
    const [salaryDate, setSalaryDate] = useState(new Date());
    const [confirmationDate, setConfirmationDate] = useState(new Date())
    const [employeeImage, setEmployeeImage] = useState(null);
    const [aadhaar, setAadhaar] = useState("");

    const [showBirthPicker, setShowBirthPicker] = useState(false);
    const [showJoinPicker, setShowJoinPicker] = useState(false);
    const [showSalaryPicker, setShowSalaryPicker] = useState(false);
    const [showConfirmationPicker, setShowConfirmationPicker] = useState(false);

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
        }else{
            setLoad(false)
        }
    }

    useEffect(() => {
        fetchPageDetails()
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
        }else{
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
            "TypeID": "OnPayroll",
            "EmpID": empID,
            "ERPId": erpID,
            "CompanyId": company,
            "SBUId": sbu,
            "BranchId": branch,
            "Title": title,
            "FirstName": firstName,
            "MiddleName": middleName,
            "LastName": lastName,
            "DepartmentId": department,
            "SubDepartmentId": subDepartment,
            "DesignationId": designation,
            "GradeId": grade,
            "BandId": band,
            "Gender": gender,
            "BirthDate": birthDate,
            "MobileNo": mobile,
            "Email": email,
            "FunctionalHeadId": functionalHead,
            "OperationalHeadId": operationalHead,
            "SalaryStructureId": salaryStructure,
            "PayRollTypeId": payrollType,
            "CategoryId": category,
            "AceessGroupId": group,
            "JoiningDate": joiningDate,
            "SalaryDate": salaryDate,
            "EmployeeStatus": employeeStatus,
            "ProbationalType": probationType,
            "ProbationPeriod": period,
            "ConfirmationDate": confirmationDate,
            "AdharNumber": aadhaar,
            "TemporaryRegID": "",
            "ContractorId": "",
            "SupervisorName": "",
            "TemplateNo": ""
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
            
            if (data?.Result == 1){
                alert("Employee created successfully!")

                setTimeout(() => {
                   navigation.goBack() 
                }, 400);
            }else{
                alert(data?.Message)
            }
        }else{
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
                                    setERPID(value)
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
                                <FormControl.Label>ERP ID</FormControl.Label>
                                <Input value={erpID} onChangeText={setERPID} />
                            </FormControl>

                        </HStack>





                        {/* COMPANY STRUCTURE */}
                        <Divider my={3} />
                        <Text fontSize="md" fontWeight="semibold">Company Structure</Text>

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
                                <FormControl.Label>SBU</FormControl.Label>
                                <Select selectedValue={sbu} onValueChange={setSbu}>
                                    {apiDetails2?.SBUList?.length > 0 && apiDetails2?.SBUList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                        </HStack>

                        <HStack space={3}>

                            <FormControl flex={1}>
                                <FormControl.Label>Branch</FormControl.Label>
                                <Select selectedValue={branch} onValueChange={setBranch}>
                                    {apiDetails2?.BranchList?.length > 0 && apiDetails2?.BranchList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        {/* JOB DETAILS */}
                        <Divider my={3} />
                        <Text fontSize="md" fontWeight="semibold">Job Details</Text>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Department</FormControl.Label>
                                <Select selectedValue={department} onValueChange={setDepartment}>
                                    {apiDetails2?.DepartmentList?.length > 0 && apiDetails2?.DepartmentList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Sub Department</FormControl.Label>
                                <Select selectedValue={subDepartment} onValueChange={setSubDepartment}>
                                    {(apiDetails2?.SubDepartmentList?.length > 0 && department) && apiDetails2?.SubDepartmentList?.filter(item => item?.DId == department)?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                    <Select.Item label="Recruitment" value="rec" />
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Designation</FormControl.Label>
                                <Select selectedValue={designation} onValueChange={setDesignation}>
                                    {apiDetails2?.DesignationList?.length > 0 && apiDetails2?.DesignationList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Grade</FormControl.Label>
                                <Select selectedValue={grade} onValueChange={setGrade}>
                                    {apiDetails1?.GradeList?.length > 0 && apiDetails1?.GradeList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Operational Head</FormControl.Label>
                                <Select selectedValue={operationalHead} onValueChange={setOperationalHead}>
                                    {apiDetails2?.OperationalList?.length > 0 && apiDetails2?.OperationalList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Functional Head</FormControl.Label>
                                <Select selectedValue={functionalHead} onValueChange={setFunctionalHead}>
                                    {apiDetails2?.FunctionalList?.length > 0 && apiDetails2?.FunctionalList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}

                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Band</FormControl.Label>
                                <Select selectedValue={band} onValueChange={setBand}>
                                    {apiDetails1?.BandList?.length > 0 && apiDetails1?.BandList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Employee Status</FormControl.Label>
                                <Select selectedValue={employeeStatus} onValueChange={(value) => {
                                    setEmployeeStatus(value)
                                }}>
                                    {apiDetails1?.EmployeeStatusList?.length > 0 && apiDetails1?.EmployeeStatusList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Text} value={item?.Value} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Salary Structure</FormControl.Label>
                                <Select selectedValue={salaryStructure} onValueChange={setSalaryStructure}>
                                    {apiDetails1?.SalaryStructureList?.length > 0 && apiDetails1?.SalaryStructureList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Payroll Type</FormControl.Label>
                                <Select selectedValue={payrollType} onValueChange={setPayrollType}>
                                    {apiDetails1?.PayRollTypeList?.length > 0 && apiDetails1?.PayRollTypeList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>

                        <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Category</FormControl.Label>
                                <Select selectedValue={category} onValueChange={setCategory}>
                                    {apiDetails1?.EmpCategoryList?.length > 0 && apiDetails1?.EmpCategoryList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Access Group</FormControl.Label>
                                <Select selectedValue={group} onValueChange={setGroup}>
                                    {apiDetails1?.AceessGroupList?.length > 0 && apiDetails1?.AceessGroupList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Name} value={item?.Id} />
                                    ))}
                                </Select>
                            </FormControl>
                        </HStack>



                        {/* PERSONAL DETAILS */}
                        <Divider my={3} />
                        <Text fontSize="md" fontWeight="semibold">Personal Details</Text>

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
                            <FormControl flex={1} isInvalid={email && !validateEmail(email)}>
                                <FormControl.Label>Email</FormControl.Label>
                                <Input value={email} onChangeText={setEmail} keyboardType="email-address" />
                                <FormControl.ErrorMessage>Invalid Email</FormControl.ErrorMessage>
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
                                <FormControl.Label>Joining Date</FormControl.Label>
                                <Button variant="outline" onPress={() => setShowJoinPicker(true)}>
                                    {joiningDate.toLocaleDateString()}
                                </Button>
                            </FormControl>
                        </HStack>


                        <HStack space={3}>
                            
                            <FormControl flex={1}>
                                <FormControl.Label>Salary Date</FormControl.Label>
                                <Button variant="outline" onPress={() => setShowSalaryPicker(true)}>
                                    {salaryDate.toLocaleDateString()}
                                </Button>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Confirmation Date</FormControl.Label>
                                <Button variant="outline" onPress={() => setShowConfirmationPicker(true)}>
                                    {confirmationDate.toLocaleDateString()}
                                </Button>
                            </FormControl>
                        </HStack>

                        {employeeStatus == "OnProbation" && <HStack space={3}>
                            <FormControl flex={1}>
                                <FormControl.Label>Probation Time</FormControl.Label>
                                <Select selectedValue={probationType} onValueChange={setProbationType}>
                                    {apiDetails1?.ProbationalTypeList?.length > 0 && apiDetails1?.ProbationalTypeList?.map((item, index) => (
                                        <Select.Item key={index} label={item?.Text} value={item?.Value} />
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl flex={1}>
                                <FormControl.Label>Period</FormControl.Label>
                                <Input value={period} onChangeText={setPeriod} />
                            </FormControl>
                        </HStack>}





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

                        {showSalaryPicker && (
                            <DateTimePicker
                                value={salaryDate}
                                mode="date"
                                onChange={(e, date) => {
                                    setShowSalaryPicker(false);
                                    if (date) setSalaryDate(date);
                                }}
                            />
                        )}

                        {showConfirmationPicker && (
                            <DateTimePicker
                                value={confirmationDate}
                                mode="date"
                                onChange={(e, date) => {
                                    setShowConfirmationPicker(false);
                                    if (date) setConfirmationDate(date);
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
