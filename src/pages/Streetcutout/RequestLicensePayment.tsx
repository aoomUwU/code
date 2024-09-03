import { BreadcrumbItem, Breadcrumbs, Button, CardBody, Card, CardFooter } from "@nextui-org/react"
import { useContext, useEffect, useRef, useState } from "react"
import { FaHome } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ILicenseType, IRequestLicense } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab } from "@nextui-org/react";

export default function RequestLicensePayment() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()


    let [createForm, setCreateForm] = useState({} as IRequestLicense)
    let [licenseType, setLicenseType] = useState({} as ILicenseType)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const [workflowTransition, setWorkflowTransition] = useState([] as any[])


    const loadRequestLicense = async () => {
        let response = await call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.load_request_license", {
            name: params.id
        })
        let requestLicense: IRequestLicense = response.message

        let licensetype = await call.post("maechan.maechan_license.doctype.licensetype.licensetype.get", {
            'name': requestLicense.license_type
        })

        setLicenseType(licensetype.message)
        setCreateForm(requestLicense)
        setWorkflowTransition(response.transition)
        return requestLicense

    }



    useEffect(() => {
        setIsLoading(true)
        loadRequestLicense().then(() => {
            setIsLoading(false)

        })

    }, [])


    const workFlowActionButton = () => {
        let currentState = workflowTransition.find(w => w.state == createForm.workflow_state)
        console.log("XXX", createForm.workflow_state)
        if (currentState) {
            return (
                <Button onClick={() => submitDoc(currentState.action)} type="button" color="secondary">{currentState.action}</Button>
            )
        }
        else {
            return null
        }
    }

    const validate = () => {

        if (createForm.payment_attachment) {
            return true
        }

        alert.showError("กรุณาอัพโหลดหลักฐานการชำระเงิน")

        return false
    }


    const submitDoc = async (action: string) => {
        if (validate()) {
            call.post(`maechan.maechan_license.doctype.requestlicense.requestlicense.citizen_submit`, {
                name: createForm.name,
                state: createForm.workflow_state,
                action: action
            }).then(() => {
                navigate("/licenseRequest")
            }).catch(err => {
                alert.showError(JSON.stringify(err))
            })
        }

    }

    const UploadButton = ({ doc }: { doc: IRequestLicense }) => {

        const { file } = useContext(FrappeContext) as FrappeConfig

        const inputFile = useRef<HTMLInputElement>(null)

        const [isUploading, setIsUploading] = useState(false)
        const openInputFile = () => {
            inputFile?.current?.click();

        }

        const clearPayment = async () => {
            setIsUploading(true)
            call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.clear_payment", {
                'requestlicense': doc
            }).then(() => {
                loadRequestLicense().then(() => setIsLoading(false))
            })
        }

        const uploadFile = async (e: any) => {
            setIsUploading(true)
            let myFile = e.target.files[0]
            const fileArgs = {
                /** If the file access is private then set to TRUE (optional) */
                "isPrivate": false,
                /** Folder the file exists in (optional) */
                "folder": "home/RequestLicenseAttachment",
                // /** File URL (optional) */
                // /** Doctype associated with the file (optional) */
                // "doctype": "Attachment",
                // /** Docname associated with the file (mandatory if doctype is present) */
                // "docname": attachment.name,
                // /** Field to be linked in the Document **/
                // "fieldname" : "value"
            }

            file.uploadFile(
                myFile,
                fileArgs,
                /** Progress Indicator callback function **/
                (completedBytes, totalBytes) => console.log(Math.round((completedBytes / (totalBytes ?? completedBytes + 1)) * 100), " completed")
            )
                .then((response) => {
                    console.log("File Upload complete")
                    let fileResponse = response.data.message
                    console.log(response)
                    call.post("maechan.maechan_license.doctype.requestlicense.requestlicense.update_payment", {
                        'fileresponse': fileResponse,
                        'requestlicense': doc
                    }).then(() => {
                        loadRequestLicense().then(() => setIsLoading(false))
                    }).catch(e => alert.showError(JSON.stringify(e)))
                })
                .catch(e => console.error(e))


        }
        const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin


        if (doc.payment_attachment) {
            return (
                <div className="flex flex-row gap-3">
                    <Button isLoading={isUploading} onClick={() => { window.open(`${siteName}/${doc.payment_attachment}`) }} color="primary">
                        ดูหลักฐาน
                    </Button>
                    <Button isLoading={isUploading} onClick={clearPayment} color="danger">ลบ</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button isLoading={isUploading} color="primary" onClick={openInputFile}>อัพโหลดหลักฐานการชำระเงิน</Button>
                    <input type="file" id="file" onChange={uploadFile} ref={inputFile} style={{ display: "none" }} />

                </div>
            )
        }


    }

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/licenseRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>ชำระเงิน : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>คำร้องขอใบอนุญาต : {params.id}</div>
                <div>
                    {workFlowActionButton()}
                </div>
            </div>

            <Tabs aria-label="Tabs" isDisabled={isLoading}>
                <Tab key="payment" aria-label="ชำระเงิน" title="ชำระเงิน" className="flex flex-col">

                    <Card>
                        <CardBody>
                            <div className="font-bold">ค่าธรรมเนียมใบอนุญาต</div>
                            <div><span className="font-bold">ประเภท : </span> {licenseType.license_type}</div>
                            <div><span className="font-bold">ใบอนุญาต : </span>{licenseType?.title}</div>
                            <div><span className="font-bold">ค่าธรรมเนียม : </span>{createForm?.license_fee ?? '-'} บาท</div>
                        </CardBody>
                        <CardFooter>
                            <UploadButton doc={createForm} />
                        </CardFooter>
                    </Card>

                </Tab>
            </Tabs>
        </div >

    )
}