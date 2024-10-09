import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem, Skeleton, Tooltip } from "@nextui-org/react"
import { Key, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IAmphure, IAttachment, IBusiness, IHouse, IProvince, IRequestDetail, IRequestStreetcutout, IRequestLicenseInspect, IRequestLicenseType, IRequestTypeDetail, ITambon, IUserProfile, IRequestLicense } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { FaDownload, FaMagnifyingGlass, FaTrash, FaUpload } from "react-icons/fa6"


export default function RequeststreetcutouttaxQR() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()

    let [createForm, setCreateForm] = useState({} as IRequestStreetcutout)

    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestStreetcutout

        setCreateForm(createFormValue)
    }

    const loadRequestStreetcutoutTax = async () => {
        let response = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_request_streetcutouttax", {
            name: params.id
        })

        let requeststreetcutouttax: IRequestStreetcutout = response.message

        setCreateForm(requeststreetcutouttax)

        return requeststreetcutouttax

    }

    useEffect(() => {
        setIsLoading(true)
        loadRequestStreetcutoutTax().then((requeststreetcutouttax: IRequestStreetcutout) => {
            console.log(requeststreetcutouttax)
            setIsLoading(false)
        })
    }, [])

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>คำร้องขอใบอนุญาต : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>คำร้องขอใบอนุญาต : {params.id}</div>
                <div>
                    {/* {workFlowActionButton()} */}
                </div>
            </div>

                    <Skeleton isLoaded={!isLoading}>
                        <div className="flex flex-row lg:w-[50%] text-md mb-3">
                            ข้อมูลQrcode
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-3">
                                <img
                                    src={createForm.qrpay}
                                    alt="Qrcode"
                                    className="w-full h-auto rounded"
                                />
                        </div>




                        <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                            <Button className="mr-3" onClick={() => { navigate("/StreetcutoutRequest") }} color="default">ย้อนกลับ</Button>
                        </div>
                    </Skeleton>
                
                {["ยกเลิก", "รอชำระเงิน", "ระหว่างการตรวจสอบ", "รออนุมัติ", "อนุมัติ", "หมดอายุ"].includes(createForm.approve_status_requeststreetcutouttax) ? (
                    <Tab key="extra_information" aria-label="การชำระเงิน" title="การชำระเงิน" className="flex flex-col">
                        <Skeleton isLoaded={!isLoading}>
                            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                                <Button className="mr-3" onClick={() => { navigate("/StreetcutoutRequest") }} color="default">ย้อนกลับ</Button>
                            </div>
                        </Skeleton>
                    </Tab>
                ) : null}
                

        </div >

    )
}