import { Button, Card, CardBody, Divider, Input } from "@nextui-org/react";
import { FrappeConfig, FrappeContext } from "frappe-react-sdk";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export interface RegisterFormData {
    email: string;
    password: string;
    verify_password: string;
    mobile_no: string;
    first_name: string;
    last_name: string;
}

export interface RegisterFormError extends RegisterFormData {}

const RegisterForm = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(false);
    const [credential, setCredential] = useState({} as RegisterFormData);
    const [error, setError] = useState({} as RegisterFormError);
    const navigate = useNavigate();
    const { call } = useContext(FrappeContext) as FrappeConfig;

    const validate = () => {
        let err = {} as RegisterFormError;
        let hasError = false;

        if (!credential.email) {
            err.email = "กรุณากรอกข้อมูล";
            hasError = true;
        }
        if (!credential.first_name) {
            err.first_name = "กรุณากรอกข้อมูล";
            hasError = true;
        }
        if (!credential.last_name) {
            err.last_name = "กรุณากรอกข้อมูล";
            hasError = true;
        }
        if (!credential.mobile_no) {
            err.mobile_no = "กรุณากรอกข้อมูล";
            hasError = true;
        }
        if (!credential.password) {
            err.password = "กรุณากรอกข้อมูล";
            hasError = true;
        }
        if (!credential.verify_password) {
            err.verify_password = "กรุณากรอกข้อมูล";
            hasError = true;
        } else if (credential.verify_password !== credential.password) {
            err.verify_password = "รหัสผ่านไม่ตรงกัน";
            hasError = true;
        }

        setError(err);
        return !hasError;
    };

    const doRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (validate()) {
            setIsLoading(true);
            try {
                let result = await call.post("maechan.api.app_register", {
                    'register': credential
                });
                // handle success
            } catch (error) {
                // handle error
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCredential = (key: string, value: string) => {
        setCredential({
            ...credential,
            [key]: value
        });
    };

    return (
        <form onSubmit={doRegister}>
            <Card className="min-w-[600px] max-w-[700px]">
                <CardBody className="flex flex-col gap-3 justify-center items-center">
                    <div>สมัครสมาชิก</div>
                    <div className="w-full">
                        <Input
                            isRequired
                            isInvalid={!!error.email}
                            errorMessage={error.email}
                            type="email"
                            label="อีเมล์"
                            value={credential.email}
                            placeholder="กรุณากรอกข้อมูล"
                            name="email"
                            onValueChange={(value) => handleCredential('email', value)}
                        />
                    </div>
                    <Input
                        isRequired
                        isInvalid={!!error.first_name}
                        errorMessage={error.first_name}
                        type="text"
                        label="ชื่อ"
                        value={credential.first_name}
                        placeholder="ชื่อ"
                        name="first_name"
                        onValueChange={(value) => handleCredential('first_name', value)}
                    />
                    <Input
                        isRequired
                        isInvalid={!!error.last_name}
                        errorMessage={error.last_name}
                        type="text"
                        label="นามสกุล"
                        value={credential.last_name}
                        placeholder="นามสกุล"
                        name="last_name"
                        onValueChange={(value) => handleCredential('last_name', value)}
                    />
                    <Input
                        isRequired
                        isInvalid={!!error.mobile_no}
                        errorMessage={error.mobile_no}
                        type="text"
                        label="เบอร์โทรศัพท์"
                        value={credential.mobile_no}
                        placeholder="เบอร์โทรศัพท์"
                        name="mobile_no"
                        onValueChange={(value) => handleCredential('mobile_no', value)}
                    />
                    <Input
                        isRequired
                        isInvalid={!!error.password}
                        errorMessage={error.password}
                        type="password"
                        label="รหัสผ่าน"
                        value={credential.password}
                        placeholder="กรุณากรอกรหัสผ่าน"
                        name="password"
                        onValueChange={(value) => handleCredential('password', value)}
                    />
                    <Input
                        isRequired
                        isInvalid={!!error.verify_password}
                        errorMessage={error.verify_password}
                        type="password"
                        label="ยืนยันรหัสผ่าน"
                        value={credential.verify_password}
                        placeholder="ยืนยันรหัสผ่าน"
                        name="verify_password"
                        onValueChange={(value) => handleCredential('verify_password', value)}
                    />
                    <Button type="submit" className="w-full" color="primary" isLoading={isLoading}>
                        ลงทะเบียน
                    </Button>
                    <Divider></Divider>
                    <Button type="button" className="w-full" color="default" isLoading={isLoading} onClick={() => navigate("/login")}>
                        ย้อนกลับ
                    </Button>
                </CardBody>
            </Card>
        </form>
    );
};

function Register() {
    return (
        <div className="min-h-svh min-w-full flex items-center justify-center">
            <RegisterForm />
        </div>
    );
}

export default Register;
