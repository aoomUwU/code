import { BreadcrumbItem, Breadcrumbs, Button, CardBody, Card, CardFooter } from "@nextui-org/react"
import { useContext, useEffect, useRef, useState } from "react"
import { FaHome } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IRequestStreetcutout } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab } from "@nextui-org/react";
import gogo from "../../assets/gogo.jpg"
export default function RequestLicensePayment() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()


    let [createForm, setCreateForm] = useState({} as IRequestStreetcutout)
    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const [workflowTransition, setWorkflowTransition] = useState([] as any[])

    const loadRequestStreetcutoutTax = async () => {
        let response = await call.get("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.load_request_streetcutouttax", {
            name: params.id
        })

        let requeststreetcutouttax: IRequestStreetcutout = response.message

        setCreateForm(requeststreetcutouttax)
        setWorkflowTransition(response.transition)
        return requeststreetcutouttax

    }



    useEffect(() => {
        setIsLoading(true)
        loadRequestStreetcutoutTax().then((requeststreetcutouttax: IRequestStreetcutout) => {
            console.log(requeststreetcutouttax)
            setIsLoading(false)

        })

    }, [])

    const UploadButton = ({ doc }: { doc: IRequestStreetcutout }) => {
        console.log(doc)

        const { file } = useContext(FrappeContext) as FrappeConfig

        const inputFile = useRef<HTMLInputElement>(null)

        const [isUploading, setIsUploading] = useState(false)
        const openInputFile = () => {
            inputFile?.current?.click();

        }

        const clearPayment = async () => {
            setIsUploading(true)
            call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.clear_payment", {
                'requeststreetcutouttax': doc
            }).then(() => {
                loadRequestStreetcutoutTax().then(() => setIsLoading(false))
            })
        }

        const uploadFile = async (e: any) => {
            setIsUploading(true)
            let myFile = e.target.files[0]
            const fileArgs = {
                /** If the file access is private then set to TRUE (optional) */
                "isPrivate": false,
                /** Folder the file exists in (optional) */
                "folder": "home/PaymentAttachment",
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
                    call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.update_payment", {
                        'fileresponse': fileResponse,   
                        'requeststreetcutouttax': doc
                    }).then(() => {
                        loadRequestStreetcutoutTax().then(() => setIsLoading(false))
                    }).catch(e => alert.showError(JSON.stringify(e)))
                })
                .catch(e => console.error(e))


        }
        const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin


        if (doc.payment_requeststreetcutouttax) {
            return (
                <div className="flex flex-row gap-3">
                    <Button isLoading={isUploading} onClick={() => { window.open(`${siteName}/${doc.payment_requeststreetcutouttax}`) }} color="primary">
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

    const workFlowActionButton = () => {
    
        return (
            <div>
                {workflowTransition.map((transition, index) => (
                    transition.allowed === "All" ? (
                        <Button
                            key={index}
                            onClick={() => submitDoc(transition.action)}
                            type="button"
                            color="secondary"
                            aria-label={`ส่งการกระทำ: ${transition.action}`}
                        >
                            {transition.action}
                        </Button>
                    ) : null
                ))}
            </div>
        );
    };    

    const submitDoc = async (action: string) => {
        try {
            const response = await call.post(`maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.citizen_submit`, {
                name: createForm.name,
                state: createForm.workflow_state,
                action: action
            });
            console.log("Response from server:", response); // เพิ่มการล็อกเพื่อดูข้อมูลที่ตอบกลับมา
            navigate("/StreetcutoutRequest");
        } catch (err) {
            console.error("Error details:", err); // ล็อกข้อมูลข้อผิดพลาด
            alert.showError(`เกิดข้อผิดพลาดในการส่งเอกสาร: ${JSON.stringify(err)}`);
        }
    };    

    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอติดตั้งป้าย</Link></BreadcrumbItem>
                <BreadcrumbItem>ชำระเงิน : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>คำร้องขอติดตั้งป้าย : {params.id}</div>
                <div>
                    {workFlowActionButton()}
                </div>
            </div>

            <Tabs aria-label="Tabs" isDisabled={isLoading}>
                <Tab key="payment" aria-label="ชำระเงิน" title="ชำระเงิน" className="flex flex-col">

                    <Card>
                        <CardBody>
                            <div className="font-bold">ค่าธรรมเนียม</div>
                            <div><span className="font-bold">ค่าธรรมเนียม : </span>{createForm?.cost_requeststreetcutouttax ?? '-'} บาท</div>
                            <div className="mb-5 font-bold">สแกนจ่ายตรงนี้</div> 
                            <div className="mb-6  h-40 w-40">
                                <img 
                                src={gogo} alt="payment"/>
                             </div>
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