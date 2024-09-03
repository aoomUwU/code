import { BreadcrumbItem, Breadcrumbs, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react"
import { FrappeConfig, FrappeContext, useSWR } from "frappe-react-sdk"
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useContext, useEffect, useMemo, useState } from "react"
import { FaEdit, FaFileDownload, FaFileImage, FaHome, FaPlus, FaReceipt } from "react-icons/fa"
import { Link, useNavigate } from "react-router-dom"
import { Doctype, IRequestStreetcutout } from "../../interfaces"
import { FaFile, FaFileImport, FaMagnifyingGlass } from "react-icons/fa6"
import { useAlertContext } from "../../providers/AlertProvider"

function Requeststreetcutouttax() {

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin
    const navigate = useNavigate()
    const alert = useAlertContext()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res);


    const { data, error, isLoading } = useSWR(
        "maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_request_streetcutouttaxs",
        fetcher
    )
    const [requeststreetcutouttaxs, setRequeststreetcutouttaxs] = useState([] as (IRequestStreetcutout)[])


    useEffect(() => {

        if (data?.message?.data) {
            setRequeststreetcutouttaxs(data?.message.data);
        }
        console.log(data)
        console.log(data?.message.data)
        console.log(requeststreetcutouttaxs)
    }, [data]);


    const topContent = useMemo(() => {

        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/StreetcutoutRequest/create")}
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
            </Breadcrumbs>

            <div className="flex flex-row lg:w-[50%] text-xl mb-3">
                รายการคำร้องขอใบอนุญาต
            </div>

            <div className="flex flex-col">
                <Table isStriped shadow="none"
                    topContent={topContent}
                    topContentPlacement="outside"
                    classNames={{
                        wrapper: 'p-0'
                    }}
                    aria-label="รายการคำร้องใบอนุญาต"
                >
                    <TableHeader>
                        <TableColumn className="w-4/12">เลขที่คำร้อง</TableColumn>
                        <TableColumn>สถาณะ</TableColumn>
                        <TableColumn>จำนวน</TableColumn>
                        <TableColumn>ราคา</TableColumn>
                        <TableColumn className="text-center">การกระทำ</TableColumn>
                    </TableHeader>
                    {isLoading ? (
                        <TableBody emptyContent={"ไม่มีข้อมูล"}>{[]}</TableBody>)
                        : (
                            <TableBody>
                                {
                                    requeststreetcutouttaxs.map(x => (
                                        <TableRow key={x.name}>
                                            <TableCell>
                                                <div>
                                                    <div className="font-bold">{x.name}</div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{x.approve_status_requeststreetcutouttax}</TableCell>
                                            <TableCell>{x.streetcutout_count_requeststreetcutouttax}</TableCell>
                                            <TableCell>{x.cost_requeststreetcutouttax}</TableCell>

                                            <TableCell >
                                                <div className="flex flex-row gap-1 justify-center">
                                                    {
                                                        x.docstatus == 0 && ["รอชำระเงิน"].indexOf(x.approve_status_requeststreetcutouttax) >= 0 ?
                                                            (
                                                                <Tooltip placement="top" content="อัพโหลดหลักฐานการชำระเงิน" aria-label="อัพโหลดหลักฐานการชำระเงิน" >
                                                                    <span
                                                                        onClick={() => { navigate(`/StreetcutoutRequest/${x.name}/payment`) }}
                                                                        className="text-lg cursor-pointer active:opacity-50">
                                                                        <FaFileImport />
                                                                    </span>
                                                                </Tooltip>
                                                            ) : (null)
                                                    }
                                                    {
                                                        x.docstatus == 0 && ["สร้าง", "หมดอายุ", "ยกเลิก"].indexOf(x.approve_status_requeststreetcutouttax) >= 0 ?
                                                            (
                                                                <Tooltip placement="top" content="แก้ไข" aria-label="แก้ไข" >
                                                                    <span
                                                                        onClick={() => { navigate(`/StreetcutoutRequest/${x.name}/edit`) }}
                                                                        className="text-lg cursor-pointer active:opacity-50">
                                                                        <FaEdit />
                                                                    </span>
                                                                </Tooltip>
                                                            ) : (
                                                                <Tooltip placement="top" content="ดู" aria-label="ดู" >
                                                                    <span
                                                                        onClick={() => { navigate(`/StreetcutoutRequest/${x.name}/view`) }}
                                                                        className="text-lg cursor-pointer active:opacity-50">
                                                                        <FaMagnifyingGlass />
                                                                    </span>
                                                                </Tooltip>
                                                            )
                                                    }
                                                </div>

                                            </TableCell>
                                        </TableRow>
                                    ))
                                }

                            </TableBody>

                        )
                    }

                </Table>

            </div>
        </div>

    )
}

export default Requeststreetcutouttax