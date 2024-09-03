import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useAlertContext } from "../../providers/AlertProvider"
import { FrappeContext, FrappeConfig } from "frappe-react-sdk"
import { FaHome, FaPrint } from "react-icons/fa"
import { BreadcrumbItem, Breadcrumbs, Button } from "@nextui-org/react"

export default function LicenseView() {

    const params = useParams()

    const siteName = import.meta.env.VITE_FRAPPE_URL ?? window.origin
    const navigate = useNavigate()
    const alert = useAlertContext()
    const { call } = useContext(FrappeContext) as FrappeConfig
    const fetcher = (url: any) => call.post(url).then((res) => res);

    const iframeRef = useRef<HTMLIFrameElement>(null)

    const [data, setData] = useState(null as any)

    async function loadIframe() {
        let iframe = iframeRef

        let doc = await call.post("maechan.maechan_license.doctype.license.license.get_by_name", {
            name: params.id
        })
        let content = await call.post("maechan.api.license_preivew", {
            'type': "License",
            'name': params.id
        })

        console.log('test', doc, content)
        console.log(iframe)

        setData(content.message)
    }


    useEffect(() => {

        loadIframe()

    }, [params])


    return (<div className="flex flex-col gap-3">

        <Breadcrumbs className="">
            <BreadcrumbItem><Link to={"/"}><FaHome /></Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={'/pageLicense'}>ใบอนุญาต</Link></BreadcrumbItem>
            <BreadcrumbItem><Link to={`/pageLicense/${params.id}/view`}>ดูใบอนุญาต : {params.id}</Link></BreadcrumbItem>

        </Breadcrumbs>

        <div>
            <Button color="primary" onClick={() => { iframeRef.current?.contentWindow?.print() }}><FaPrint /></Button>
        </div>

        <iframe ref={iframeRef} srcDoc={data} id="frame" width="100%" height="0"
            className="border-3 border-gray p-3"
            style={{ "height": '11.7in', 'width': '8.3in' }}>
            {data ? data : null}
        </iframe>
    </div >)
}