import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem } from "@nextui-org/react"
import { useContext, useEffect, useMemo, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { IRequestStreetcutout } from "../../interfaces"
import { useAlertContext } from "../../providers/AlertProvider"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"

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
    const [invalid, setInvalid] = useState(true)
    const [isSaved, setIsSaved] = useState(false);

    console.log(invalid)


    const updateForm = (key: string, value: string | number) => {
        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestStreetcutout

        setCreateForm(createFormValue)
    };


    const save = async () => {
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
            request: createForm
        })
        console.log(response)


        navigate(`/StreetcutoutRequest/${response.message.name}/edit`)

    }

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
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลเจ้าของป้าย
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.user_name_requeststreetcutouttax}
                    name="user_name_requeststreetcutouttax"
                    onChange={(e) => updateForm(e.target.name, e.target.value)}
                    type="text" label="ชื่อเจ้าของป้าย" />
            </div>
            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                ข้อมูลป้าย
            </div>

            <div className="grid grid-cols-3 gap-3 mb-3">
                <Input
                    value={createForm.streetcutout_count_requeststreetcutouttax}
                    name="streetcutout_count_requeststreetcutouttax"
                    onChange={(e) => updateForm(e.target.name, Number(e.target.value))}
                    type="number"
                    min="1"
                    step="1"
                    label="จำนวนป้าย"
                />

                <Select
                    label="ขนาดของป้าย"
                    className="" defaultSelectedKeys={["120x240 เซนติเมตร"]}
                    onSelectionChange={(k) => updateForm('streetcutout_size', Array.from(k)[0])}
                >
                    <SelectItem key="120x240 เซนติเมตร">120x240 เซนติเมตร</SelectItem>
                </Select>
            </div>
            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                <Button className={`mr-3`} color="primary" onClick={save}>บันทึกและต่อไป</Button>
                <Button className="mr-3" onClick={() => { navigate("/StreetcutoutRequest") }} color="default">ยกเลิก</Button>
            </div>
        </div>

    )
}