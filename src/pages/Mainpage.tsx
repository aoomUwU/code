import { Avatar, Button, Dropdown, DropdownTrigger, DropdownItem, DropdownMenu, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Skeleton, Link, ButtonProps } from "@nextui-org/react";
import { FrappeContext, useFrappeAuth, useFrappeGetCall } from "frappe-react-sdk";
import { PropsWithChildren, useEffect } from "react";
import { Outlet, useLocation, useNavigate, useRoutes } from "react-router-dom";
import { FaBuilding, FaHome } from "react-icons/fa";
import { FaFileLines, FaUserPen } from "react-icons/fa6";
import { SidebarMenu } from "../components/menu";

function AppNavbarBrand() {
    const { data, error, isLoading, isValidating, mutate } = useFrappeGetCall(
        "maechan.maechan.api.get_application_context", {}
    );

    console.log(import.meta.env);

    return (
        <NavbarBrand>
            <Skeleton isLoaded={!isLoading} className="rounded-lg">
                <Image
                    classNames={{ 'wrapper': 'mr-1' }}
                    height={40} width={40} 
                    src={`${import.meta.env.VITE_FRAPPE_URL ? import.meta.env.VITE_FRAPPE_URL  : window.location.origin}/${data?.message?.app_logo}`} 
                />
            </Skeleton>
            <Skeleton isLoaded={!isLoading} className="rounded-lg ">
                <p className="font-semibold text-inherit text-xl">{data?.message?.app_name ?? ''}</p>
            </Skeleton>
        </NavbarBrand>
    );
}

function AppNavbar() {
    const auth = useFrappeAuth();
    const navigate = useNavigate();

    const doLogout = async () => {
        try {
            await auth.logout();
        } catch (error) {
            console.log("doLogout error", error);
        }

        navigate("/login");
    };

    const backToDesk = () => {
        window.location.href = `http://maechandev.chaowdev.xyz:8000/`;
    };

    return (
        <Navbar isBordered maxWidth="xl" classNames={{ wrapper:"p-1 md:p-6" }}>
            <AppNavbarBrand />
            <Skeleton isLoaded={!auth.isLoading} className="rounded-full">
                {auth.currentUser ? (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                as="button"
                                name={auth.currentUser}
                                classNames={{
                                    name: 'font-bold select-none text-white',
                                    base: 'bg-success/30 text-green-800 cursor-default'
                                }}
                            />
                        </DropdownTrigger>
                        <DropdownMenu aria-label="Static Actions">
                            <DropdownItem onClick={doLogout} key="logout">Logout</DropdownItem>
                            <DropdownItem onClick={backToDesk} key="home">Back to Home</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                ) : null}
            </Skeleton>
        </Navbar>
    );
}

function MainPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            <AppNavbar />
            <div className="flex px-1 lg:px-0 lg:justify-center w-full">
                <div className="flex flex-col w-full lg:flex-row lg:w-[1280px] lg:px-6 mt-3">
                    <div className="mb-3 lg:mb-0 lg:w-[280px] w-full">
                        <SidebarMenu />
                    </div>
                    <div className="lg:pl-3 lg:ml-3 p-3 lg:w-full  lg:min-h-[600px] rounded-md bg-white shadow-md">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
