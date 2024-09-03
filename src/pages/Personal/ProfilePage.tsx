import { Autocomplete, AutocompleteItem, BreadcrumbItem, Breadcrumbs, Button, Input, Select, SelectItem, Skeleton } from "@nextui-org/react";

import { FrappeConfig, FrappeContext } from "frappe-react-sdk";
import { useContext, useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { useAlertContext } from "../../providers/AlertProvider";
import { Key } from "@react-types/shared";
import { IAmphure, IProvince, ITambon, IUserProfile } from "../../interfaces";
import { Navigate, useNavigate } from "react-router-dom";

export default function ProfilePage() {

    let {call} = useContext(FrappeContext) as FrappeConfig
    
    let [createForm, setCreateForm] = useState({} as IUserProfile)
    let [provinces, setProvinces] = useState([] as IProvince[])
    let [amphures, setAmphures] = useState([] as IAmphure[])
    let [districts, setDistricts] = useState([] as ITambon[])
    const [amphureLoad, setAmphureLoad] = useState(false)
    const [districtLoad, setDistrictLoad] = useState(false)

    let alert = useAlertContext()

    const updateForm = async (key: string, value: Key) => {
        let createFormValue = {
            ...createForm,
            [key]: value
        }

        if (key == "address_province") {
            createFormValue.address_amphur = ""
            createFormValue.address_district = ""
        }
        else if (key == "address_amphur") {
            createFormValue.address_district = ""
        }
        reloadProvinceAmphurDistrict(createFormValue, key)
        setCreateForm(createFormValue)
    }



    const reloadProvinceAmphurDistrict = async (user_profile: { address_province?: any; address_amphur?: any; }, key = '') => {


        if (user_profile.address_province && key == "address_province") {
            setAmphureLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                filters: {
                    province_id: user_profile.address_province
                }
            }).then((r: { message: any; }) => {
                let result = r.message
                setAmphures(result)
            }).finally(() => {
                setAmphureLoad(false)
            })

        }

        if (user_profile.address_amphur && key == "address_amphur") {
            setDistrictLoad(true)
            call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                filters: {
                    province_id: user_profile.address_province,
                    amphure_id: user_profile.address_amphur
                }
            }).then((r: any) => {
                let result = r.message
                setDistricts(result)
            }).finally(() => {
                setDistrictLoad(false)
            })
        }
    }
    const [isLoading, setIsLoading] = useState(true)

    const loadUserProfile = async () => {
        setIsLoading(true)

        try {

            let res = await call.post("maechan.maechan.doctype.userprofile.userprofile.get_current_userprofile")
            console.log(res)

            let user_profile = res.message

            let pcall = call.post("maechan.maechan_core.doctype.province.province.get_all_province").then((r: { message: any; }) => {
                let provincesResult = r.message
                setProvinces(provincesResult)
            })
            let acall = null;
            let tcall = null;

            if (user_profile.address_province) {
                acall = call.post("maechan.maechan_core.doctype.province.province.get_all_amphure", {
                    filters: {
                        province_id: user_profile.address_province
                    }
                }).then((r: any) => {
                    let result = r.message
                    setAmphures(result)
                })
            }

            if (user_profile.address_amphur) {
                tcall = call.post("maechan.maechan_core.doctype.province.province.get_all_tambon", {
                    filters: {
                        province_id: user_profile.address_province,
                        amphure_id: user_profile.address_amphur
                    }
                }).then((r: any) => {
                    let result = r.message
                    setDistricts(result)
                })
            }

            await Promise.all([pcall, acall, tcall])

            setCreateForm(res.message)

        } catch (error) {
            alert.showError(JSON.stringify(error))
        }
        setIsLoading(false)


    }

    useEffect(
        () => {
            loadUserProfile()
        }, []
    )

    const save = async (e: { preventDefault: () => void; }) => {
        setIsLoading(true)
        e.preventDefault()
        console.log(createForm)
        let result = await call.post("maechan.maechan.doctype.userprofile.userprofile.update_or_create_userprofile", {
            profile: createForm
        })

        setCreateForm(result.message)
        console.log(result.message)
        setIsLoading(false)

    }

    const navigate = useNavigate()

    return (
        <div>
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><FaHome /></BreadcrumbItem>
                <BreadcrumbItem>ข้อมูลส่วนตัว</BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                ข้อมูลส่วนตัว
            </div>

            <form className="flex flex-col" onSubmit={save}>

                <div className="text-medium font-bold mb-3">
                    ข้อมูลพื้นฐาน
                </div>

                <Skeleton isLoaded={!isLoading} className="mb-3 rounded-lg">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 shadow-inner" >

                        <Input type="text" name="fullname" value={createForm.fullname} label="ชื่อ-สกุล" placeholder="ชื่อ-สกุล"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="date" name="birthdate" value={createForm.birthdate} label="วันเดือนปีเกิด (คศ.)" placeholder="วันเดือนปีเกิด (คศ.)"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="tel" value={createForm.tel} label="เบอร์โทรศัพท์" placeholder="เบอร์โทรศัพท์"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="nationality" value={createForm.nationality} label="สัญชาติ" placeholder="สัญชาติ"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="race" value={createForm.race} label="เชื้อชาติ" placeholder="เชื้อชาติ"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="e-mail" name="email" value={createForm.email} label="อีเมล์" placeholder="อีเมล์"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="personal_id" value={createForm.personal_id} label="เลขบัตรประชาชน" placeholder="เลขบัตรประชาชน"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                    </div>

                </Skeleton>
                <div className="text-medium font-bold mb-3">
                    ที่อยู่
                </div>
                <Skeleton isLoaded={!isLoading} className="mb-3 rounded-lg">

                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3 drop-shadow-sm">
                        <Input type="text" name="address_no" value={createForm.address_no} label="เลขที่" placeholder="เลขที่"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="address_moo" value={createForm.address_moo} label="หมู่" placeholder="หมู่"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="address_soi" value={createForm.address_soi} label="ตรอก/ซอย" placeholder="ตรอก/ซอย"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                        <Input type="text" name="address_road" value={createForm.address_road} label="ถนน" placeholder="ถนน"
                            onChange={(e) => {
                                updateForm(e.target.name, e.target.value)
                            }} />
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">

                        <Select
                            items={provinces}
                            label="จังหวัด"
                            selectedKeys={[createForm.address_province]}
                            onSelectionChange={(key) => {
                                updateForm('address_province', Array.from(key)[0])
                            }}
                        >
                            {(province) => <SelectItem key={province.name}>{province.name_th}</SelectItem>}
                        </Select>

                        <Select
                            isLoading={amphureLoad}
                            isDisabled={amphureLoad}
                            items={amphures}
                            label="อำเภอ"
                            selectedKeys={[createForm.address_amphur]}
                            onSelectionChange={(key) => updateForm('address_amphur', Array.from(key)[0])}

                        >
                            {(amphure) => <SelectItem key={amphure.name}>{amphure.name_th}</SelectItem>}
                        </Select>
                        <Select
                            isLoading={districtLoad}
                            isDisabled={districtLoad}
                            items={districts}
                            label="ตำบล"
                            selectedKeys={[createForm.address_district]}
                            onSelectionChange={(key) => updateForm('address_district', Array.from(key)[0])}

                        >
                            {(district) => <SelectItem key={district.name}>{district.name_th}</SelectItem>}
                        </Select>
                    </div>
                </Skeleton>



                <div className="mt-3 flex flex-row">
                    <Skeleton isLoaded={!isLoading} className="mb-3 rounded-lg mr-3">
                        <Button type="submit" color="primary" onClick={save}>บันทึก</Button>
                    </Skeleton>

                    <Skeleton isLoaded={!isLoading} className="mb-3 rounded-lg">

                        <Button type="button" color="default" onClick={()=>{navigate("/")}}>ยกเลิก</Button>
                    </Skeleton>

                </div>



            </form>
        </div>
    )
}