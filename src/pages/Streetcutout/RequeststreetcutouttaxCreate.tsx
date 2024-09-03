import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { useContext, useEffect, useMemo, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { IRequestStreetcutout, IAmphure, IBusiness, IHouse, IProvince, IRequestDetail, IRequestLicense, IRequestLicenseType, ITambon, IUserProfile } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"

export default function RequeststreetcutouttaxCreate() {

    const navigate = useNavigate()
    const alert = useAlertContext()


    const topContent = useMemo(() => {

        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/StreetcutoutRequest/create")}
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])


    let [createForm, setCreateForm] = useState({} as IRequestStreetcutout)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)
    const [invalid,setInvalid] = useState(true)

    console.log(invalid)


    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestStreetcutout

    }


    useEffect(() => {
        
    }, [])

    const [error, setError] = useState({
        result: null,
    })

    const save = async () => {
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
            request: createForm
        })
        console.log(response)


        navigate(`/StreetcutoutRequest/${response.message.name}/edit`)


    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>เพิ่มคำร้องขอใบอนุญาต
                </BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                เพิ่มคำร้องขอใบอนุญาต
            </div>
            <div className="flex flex-col mb-3 gap-3 sm:flex-row">
                <div className="flex flex-row lg:w-[50%] w-full">
                    test

                </div>
                <div className="flex flex-row lg:w-[50%] w-full">
                    test
                </div>
            </div>
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลเจ้าของป้าย
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.applicant_name}
                    name="applicant_name"
                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                    type="text" label="ชื่อเจ้าของป้าย" />
            </div>
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลป้าย
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.applicant_age as string}
                    name="applicant_age"
                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                    type="number" label="จำนวนป้าย" />
                <Select
                    label="ขนาดของป้าย"
                    className="" defaultSelectedKeys={["120x240เซนติเมตร"]}
                    onSelectionChange={(k) => updateForm('license_applicant_type', Array.from(k)[0])}
                >
                    <SelectItem key="ขนาดของป้าย" >120x240เซนติเมตร</SelectItem>
                </Select>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <Select
                    items={provinces}
                    label="จังหวัด"
                    selectedKeys={[createForm.applicant_province]}
                    onSelectionChange={(key) => {
                        updateForm('applicant_province', Array.from(key)[0])
                    }}
                >
                    {(province) => <SelectItem key={province.name}>{province.name_th}</SelectItem>}
                </Select>

                <Select
                    isLoading={amphureLoad}
                    isDisabled={amphureLoad}
                    items={amphures}
                    label="อำเภอ"
                    selectedKeys={[createForm.applicant_amphur]}
                    onSelectionChange={(key) => updateForm('applicant_amphur', Array.from(key)[0])}

                >
                    {(amphure) => <SelectItem key={amphure.name}>{amphure.name_th}</SelectItem>}
                </Select>
                <Select
                    isLoading={districtLoad}
                    isDisabled={districtLoad}
                    items={districts}
                    label="ตำบล"
                    selectedKeys={[createForm.applicant_distict]}
                    onSelectionChange={(key) => updateForm('applicant_distict', Array.from(key)[0])}

                >
                    {(district) => <SelectItem key={district.name}>{district.name_th}</SelectItem>}
                </Select>
            </div>

            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ที่อยู่สถานประกอบการ (หากไม่พบบ้านเลขที่กรุณาแจ้งผู้ดูแลระบบ)
            </div>
            <div className="grid gap-3 mb-3 grid-row sm:grid-cols-3">

                <Autocomplete
                    className="w-full"

                    isRequired
                    inputValue={list.filterText}
                    isLoading={list.isLoading}
                    items={list.items}
                    label="ที่อยู่กิจการ (บ้านเลขที่)"
                    placeholder="Type to search..."
                    onInputChange={list.setFilterText}
                    onSelectionChange={(key) => updateForm('house_no', key)}
                    selectedKey={createForm.house_no}
                    errorMessage={invalid ? "Please fill in this field." : ""}
                    isInvalid={invalid}
                >
                    {(item) => (
                        <AutocompleteItem key={item.name} className="capitalize">
                            {item.text_display}
                        </AutocompleteItem>
                    )}
                </Autocomplete>
            </div>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                <Button disabled={invalid} className={`mr-3`} color="primary" isDisabled={invalid} onClick={save}>บันทึกและต่อไป</Button>
                <Button className="mr-3" onClick={() => { navigate("/licenseRequest") }} color="default">ยกเลิก</Button>
            </div>
        </div>

    )
}