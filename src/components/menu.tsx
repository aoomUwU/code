import { Button, ButtonProps } from "@nextui-org/react";
import { FrappeConfig, FrappeContext } from "frappe-react-sdk";
import { PropsWithChildren, useContext, useEffect, useState } from "react";
import { FaBuilding, FaHome } from "react-icons/fa";
import { FaFileLines, FaUserPen } from "react-icons/fa6";
import { TbLicense } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";

function AppSidebarButton(props: PropsWithChildren<ButtonProps & { exact?: boolean }>) {
  const { size, className = "", children } = props;
  const location = useLocation();
  const navigate = useNavigate();

  const _className = `mb-1 justify-start w-full px-4 py-2 flex items-center space-x-2 ${className}`; 
  const _size = size ?? "md";
  const _startContent = props.startContent ?? null;
  const _href = props.href ?? null;
  const _exact = props.exact ?? true;
  const isActive = _exact ? _href === location.pathname : _href ? location.pathname.startsWith(_href) : false;

  const _variant = isActive ? "solid" : props.variant ?? "light";
  const _color: "primary" | "default" = isActive ? "primary" : "default";

  const _onClick = props.onClick ?? (() => {
    if (_href) {
      navigate(_href);
    }
  });

  return (
    <Button
      color={_color}
      variant={_variant}
      size={_size}
      className={`${_className} ${isActive ? 'bg-blue-500 text-white rounded-lg' : 'text-black'}`} 
      onClick={_onClick}
      startContent={<span className={`icon-class ${isActive ? 'text-white' : 'text-black'}`}>{_startContent}</span>}
    >
      <span className={`text-class text-sm ${isActive ? 'text-white' : 'text-black'}`}>{children}</span>
    </Button>
  );
}

export function SidebarMenu() {
  const [profile, setProfile] = useState(null);
  const { call } = useContext(FrappeContext) as FrappeConfig;

  async function checkProfile() {
    const getCheckProfile = await call.get("maechan.maechan.doctype.userprofile.userprofile.check_current_userprofile");
    setProfile(getCheckProfile.message);
  }

  useEffect(() => {
    checkProfile();
  }, [profile]);

  return (
    <ul>
      <li>
        <AppSidebarButton href="/" startContent={<FaHome />}>
          หน้าหลัก
        </AppSidebarButton>
      </li>
      {profile && (
        <>
          <li>
            <AppSidebarButton exact={false} href="/StreetcutoutRequest" startContent={<FaFileLines />}>
              คำร้องติดตั้งป้าย
            </AppSidebarButton>
          </li>
        </>
      )}
      <li>
        <AppSidebarButton href="/profile" startContent={<FaUserPen />}>
          ข้อมูลส่วนตัว
        </AppSidebarButton>
      </li>
    </ul>
  );
}
