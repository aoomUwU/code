import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@nextui-org/react";
import { useState, useContext, createContext, PropsWithChildren } from "react";

interface IAlertContext {
    showError(arg0: string): unknown;

}

const AlertContext = createContext({} as IAlertContext)

export function useAlertContext() {
    return useContext(AlertContext);
}


function AlertProvider({ children }: PropsWithChildren) {


    
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const [errorMessage,setErrorMessage] = useState("") 

    const showError = (message:string) => {
        setErrorMessage(message)
        onOpen()
    }

    let pvalues: IAlertContext = {
        showError: showError
    }

    return (
        <AlertContext.Provider value={pvalues}>
            {children}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-red-500">เกิดข้อผิดพลาด! กรุณาแจ้งผู้ดูแลระบบ</ModalHeader>
                            <ModalBody>
                                <div>{errorMessage}</div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                        
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </AlertContext.Provider>
    )
}

export default AlertProvider;