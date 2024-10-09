import { BreadcrumbItem, Breadcrumbs, Button, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { FaEdit, FaFileDownload, FaFileImport, FaHome, FaPlus } from "react-icons/fa";
import { FaMagnifyingGlass, FaMagnifyingGlassArrowRight, FaRotate } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useAlertContext } from "../../providers/AlertProvider";
import { FrappeContext, FrappeConfig, useSWR } from "frappe-react-sdk";

export default function StreetcutoutIndex() {

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin
    const navigate = useNavigate()
    const alert = useAlertContext()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res);

    const { data, error, isLoading, mutate } = useSWR(
        "maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_streetcutouttax",
        fetcher
    )

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-row justify-between gap-3">
                <div></div>
                <Button className="" onClick={() => navigate("/licenseRequest/create")} //เเก้
                    color="primary" endContent={<FaPlus />}>เพิ่มคำร้องใบอนุญาต</Button>
            </div>
        )
    }, [])

    return (<div className="flex flex-col">
        <Breadcrumbs className="mb-3">
            <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={'/pageStreetcutout'}>ใบอนุญาต</Link></BreadcrumbItem>
        </Breadcrumbs>

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
                    <TableBody emptyContent={"ไม่มีข้อมูล"}>{[]}</TableBody>
                ) : (
                    <TableBody>
                        {
                            data?.message.data.map((x: any) => (
                                <TableRow key={x.name}>
                                    <TableCell>
                                        <div>
                                            <div className="font-bold">{x.name}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{x.approve_status_requeststreetcutouttax}</TableCell>
                                    <TableCell>{x.streetcutout_count_requeststreetcutouttax}</TableCell>
                                    <TableCell>{x.cost_requeststreetcutouttax}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-row gap-1 justify-center">
                                            TEST
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

    </div>)
}