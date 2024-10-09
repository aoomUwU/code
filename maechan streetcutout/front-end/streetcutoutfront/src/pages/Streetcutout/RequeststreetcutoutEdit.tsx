import { BreadcrumbItem, Breadcrumbs, Input, Button, Select, SelectItem, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Autocomplete, AutocompleteItem, Skeleton, Tooltip } from "@nextui-org/react"
import { Key, PropsWithChildren, useContext, useEffect, useMemo, useRef, useState } from "react"
import { FaHome, FaPlus } from "react-icons/fa"
import { Link, useNavigate, useParams } from "react-router-dom"
import { IRequestStreetcutout, StreetcutoutLocation, AllowedStreet } from "../../interfaces"
import { FrappeConfig, FrappeContext } from "frappe-react-sdk"
import { useAlertContext } from "../../providers/AlertProvider"
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { FaDownload, FaMagnifyingGlass, FaTrash, FaUpload } from "react-icons/fa6"
import React from "react"


export default function RequeststreetcutouttaxEdit() {

    const navigate = useNavigate()
    const alert = useAlertContext()
    const params = useParams()


    let [createForm, setCreateForm] = useState({} as IRequestStreetcutout)
    const [options, setOptions] = useState<StreetcutoutLocation[]>([]);
    const [locations, setLocations] = useState<StreetcutoutLocation[]>([]);
    const [startselectedValues, setStartselectedValues] = useState<string[]>([]);
    const [selectedValues, setSelectedValues] = React.useState(new Set(startselectedValues));

    const [workflowTransition, setWorkflowTransition] = useState([] as any[])


    let { call } = useContext(FrappeContext) as FrappeConfig

    const [isLoading, setIsLoading] = useState(true)

    const updateForm = async (key: string, value: string | number) => {

        let createFormValue = {
            ...createForm,
            [key]: value
        } as IRequestStreetcutout

        setCreateForm(createFormValue)
    }

    const loadOptionStreet = async () => {
        let response = await call.get("maechan.maechan_streetcutout.doctype.allowedstreet.allowedstreet.load_allowedstreet", {
            name: params.id
        });

        let optionstreet: StreetcutoutLocation[] = response.message.data;

        setOptions(optionstreet);

        return optionstreet;
    }
    const loadStreetcutoutLocation = async () => {
        let response = await call.get("maechan.maechan_streetcutout.doctype.streetcutoutlocation.streetcutoutlocation.load_streetcutoutLocation", {
            parent: params.id
        });

        let locations: StreetcutoutLocation[] = response.message.data;
        setLocations(locations)

        return locations;
    }

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
        setIsLoading(true);

        loadOptionStreet().then((optionstreet: StreetcutoutLocation[]) => {
            console.log(optionstreet);

            loadRequestStreetcutoutTax().then((requeststreetcutouttax: IRequestStreetcutout) => {
                console.log(requeststreetcutouttax);
                const selectedStreets = requeststreetcutouttax.streetcutout_location.map(loc => loc.street_allowedstreet_name || '');
                setStartselectedValues(selectedStreets);
                setSelectedValues(selectedStreets);

                console.log('start Selected Streets:', selectedStreets);

                loadStreetcutoutLocation().then((locations: StreetcutoutLocation[]) => {
                    console.log(locations);
                    setIsLoading(false);
                });
            });
        });
    }, []);

    const save = async (e: { preventDefault: () => void; }) => {
        setIsLoading(true);
        console.log('selectedValues :', Array.from(selectedValues));
        e.preventDefault();

        console.log(createForm);
        try {
            let result = await call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.first_step_requeststreetcutouttax", {
                'request': createForm
            });

            setCreateForm(result.message);
            console.log(result.message);

            let updateResult = await call.post("maechan.maechan_streetcutout.doctype.streetcutoutlocation.streetcutoutlocation.update_streetcutoutLocation", {
                'parent': params.id,
                'request': Array.from(selectedValues)
            });

            console.log(updateResult.message);

        } catch (error) {
            console.error("Error occurred:", error);
        } finally {
            setIsLoading(false);
        }
    }



    const UploadButton = ({ doc }: { doc: IRequestStreetcutout }) => {

        const { file } = useContext(FrappeContext) as FrappeConfig

        const inputFile = useRef<HTMLInputElement>(null)

        const [isUploading, setIsUploading] = useState(false)
        const openInputFile = () => {
            inputFile?.current?.click();

        }

        const deleteAttachment = async () => {
            setIsUploading(true)
            call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.deleteAttachment", {
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
                "folder": "home/RequestStreetcutoutAttachment",
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
                    call.post("maechan.maechan_streetcutout.doctype.requeststreetcutouttax.requeststreetcutouttax.update_attachment", {
                        'fileresponse': fileResponse,
                        'requeststreetcutouttax': doc
                    }).then(() => {
                        loadRequestStreetcutoutTax().then(() => setIsLoading(false))
                    }).catch(e => alert.showError(JSON.stringify(e)))
                })
                .catch(e => console.error(e))


        }
        const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin


        if (doc.streetcutout_img) {
            return (
                <div className="flex flex-row gap-3">
                    <Button isLoading={isUploading} onClick={() => { window.open(`${siteName}/${doc.streetcutout_img}`) }} color="primary">
                        ดูรูปตัวอย่งป้าย
                    </Button>
                    <Button isLoading={isUploading} onClick={deleteAttachment} color="danger">ลบ</Button>
                </div>
            )
        } else {
            return (
                <div>
                    <Button isLoading={isUploading} color="primary" onClick={openInputFile}>อัพโหลดรูปตัวอย่งป้าย</Button>
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
                <BreadcrumbItem><Link to={'/StreetcutoutRequest'}>คำร้องขอใบอนุญาต</Link></BreadcrumbItem>
                <BreadcrumbItem>คำร้องขอใบอนุญาต : {params.id}
                </BreadcrumbItem>
            </Breadcrumbs>


            <div className="flex flex-row text-xl mb-3 justify-between">
                <div>คำร้องขอใบอนุญาต : {params.id}</div>
                <div>
                    {workFlowActionButton()}
                </div>
            </div>
            <form className="flex flex-col" onSubmit={save}>
                <Tabs aria-label="Tabs" isDisabled={isLoading}>
                    <Tab key="basic_information" aria-label="ข้อมูลพื้นฐาน" title="ข้อมูลพื้นฐาน" className="flex flex-col">
                        <Skeleton isLoaded={!isLoading}>
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
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <Select
                                    label="ขนาดของป้าย"
                                    className="" defaultSelectedKeys={["120x240 เซนติเมตร"]}
                                    onSelectionChange={(k) => updateForm('streetcutout_size', Array.from(k)[0])}
                                >
                                    <SelectItem key="120x240 เซนติเมตร">120x240 เซนติเมตร</SelectItem>
                                </Select>
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <UploadButton doc={createForm} />
                            </div>
                            <div className="flex flex-row lg:w-[50%] text-md mb-3">
                                สถานที่ตั้งป้าย
                            </div>
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <Select
                                    label="ถนน"
                                    placeholder="Select a street"
                                    selectionMode="multiple"
                                    selectedKeys={selectedValues}
                                    onSelectionChange={setSelectedValues}
                                    className="max-w-xs"
                                >
                                    {options.map((option: any) => (
                                        <SelectItem key={option.name} value={option.street_allowedstreet_streetcutout}>
                                            {option.street_allowedstreet_streetcutout}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="mt-3 flex flex-row">
                                <Button type="submit" color="primary" onClick={save}>บันทึก</Button>
                                <Button type="button" color="default" onClick={() => { navigate("/StreetcutoutRequest") }}>ยกเลิก</Button>
                            </div>
                        </Skeleton>
                    </Tab>
                </Tabs>
            </form>
        </div >

    )
}