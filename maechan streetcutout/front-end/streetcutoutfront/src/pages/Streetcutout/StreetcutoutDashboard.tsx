import { BreadcrumbItem, Breadcrumbs } from "@nextui-org/react"
import { FaHome } from "react-icons/fa"

function LicenseDashboard() {
    return (
        <div className="flex flex-col">
            <Breadcrumbs className="mb-3">
                <BreadcrumbItem><FaHome /></BreadcrumbItem>
                <BreadcrumbItem>ใบอนุญาต</BreadcrumbItem>
                <BreadcrumbItem>รายการใบอนุญาต</BreadcrumbItem>

            </Breadcrumbs>
        </div>

    )
}

export default LicenseDashboard