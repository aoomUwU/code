import { BreadcrumbItem, Breadcrumbs, Skeleton, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react"
import { FrappeConfig, FrappeContext, useFrappeGetCall, useFrappeGetDoc, useFrappePostCall, useSWR } from "frappe-react-sdk"
import { FaHome } from "react-icons/fa"
import { Link, useParams } from "react-router-dom"
import { ICheckList } from "../../interfaces"
import { useContext } from "react"

function RequestInspectView() {
    const params = useParams()

    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.get(url).then((res) => res);

    console.log(params)
    const { data, isLoading } = useSWR(`maechan.maechan_license.doctype.requestlicenseinspect.requestlicenseinspect.get_requestlicenseinspect?name=${params.inspectId}`, fetcher)
    console.log('dta',data)

    if (isLoading) {
        return (
            <div className="flex flex-col">
                <Breadcrumbs className="mb-3">
                    <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={'/licenseRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                    <BreadcrumbItem>
                        คำร้องขอใบอนุญาต : {params.id}
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        การตรวจสถานที่ : -
                    </BreadcrumbItem>
                </Breadcrumbs>

                <Skeleton className="w-full h-[300px] rounded-md" />
            </div>

        )
    } else if(data.message) {
        
        return (
            <div className="flex flex-col gap-3">
                <Breadcrumbs className="">
                    <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                    <BreadcrumbItem><Link to={'/licenseRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                    <BreadcrumbItem>
                        คำร้องขอใบอนุญาต : {params.id}
                    </BreadcrumbItem>
                    <BreadcrumbItem>
                        การตรวจสถานที่ : {isLoading ? '' : data.message.checklist_date}
                    </BreadcrumbItem>
                </Breadcrumbs>

                <div><span className="font-bold">ผลการตรวจ :</span> </div>
                <div>
                    {data.message.checklist_result == 'ผ่าน' ? (
                        <span className="text-green-700">{data.message.checklist_result}</span>
                    ) : (
                        <span className="text-red-700">{data.message.checklist_result}</span>
                    )}

                </div>
                <div><span className="font-bold">ข้อเเสนอแนะ :</span> </div>
                <div><span className="">{data.message.checklist_comment}</span></div>


                <Table isStriped shadow="none"
                    topContentPlacement="outside"
                    classNames={{
                        wrapper: 'p-0'
                    }}
                    aria-label="รายการคำร้องใบอนุญาต" topContent={
                        <div className="font-bold">
                            รายละเอียดแบบตรวจสอบ
                        </div>
                    }>
                    <TableHeader>
                        <TableColumn className="w-1/2">หัวข้อ</TableColumn>
                        <TableColumn>รายละเอียด</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {data.message.checklist_extra.map((e: ICheckList) => (
                            <TableRow key={e.name}>
                                <TableCell>{e.key}</TableCell>
                                <TableCell>{e.value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Table isStriped shadow="none"
                    topContentPlacement="outside"
                    classNames={{
                        wrapper: 'p-0'
                    }}
                    aria-label="เกณฑ์พิจารณา" topContent={
                        <div className="font-bold">
                            เกณฑ์พิจารณา
                        </div>
                    }>
                    <TableHeader>
                        <TableColumn className="w-1/3">หัวข้อ</TableColumn>
                        <TableColumn>รายละเอียด</TableColumn>
                        <TableColumn>ผลการตรวจ</TableColumn>
                        <TableColumn>หมายเหตุ</TableColumn>

                    </TableHeader>
                    <TableBody>
                        {data.message.checklist_list.map((e: ICheckList) => (
                            <TableRow key={e.name}>
                                <TableCell>{e.key}</TableCell>
                                <TableCell>{e.title_detail}</TableCell>
                                <TableCell>{e.value}</TableCell>
                                <TableCell>{e.comment}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <div className="font-bold">ผู้ตรวจ : <span>{data.message.owner.full_name}</span></div>
            </div>
        )
    }

}

export default RequestInspectView