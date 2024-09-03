import { List } from "postcss/lib/list";

export type Doctype = {
    docstatus: number;
    name: string;
}

export type IHouse = Doctype & {

    amphure_th: string;
    district_id: string;
    house_json: string;
    house_lat: number;
    house_lng: number;
    house_moo: string;
    house_no: string;
    house_road: string;
    house_soi: string;
    name: number;
    province_th: string;
    tambon_th: string;
    text_display: string;

}

export type IBusiness<T = unknown> = T & Doctype & {
    business_name: string;
    business_address: string;
    tel: string;
    manager: string;
}

export type IUserProfile = Doctype & {
    fullname: string;
    birthdate: string;
    nationality: string;
    tel: string;
    email: string;
    race: string;
    address_no: string;
    address_moo: string;
    address_soi: string;
    address_road: string;
    address_province: string;
    address_amphur: string;
    address_district: string;
    personal_id: string;
}

export type IProvince = Doctype & {
    name_th: string;
}

export type IAmphure = Doctype & {
    name_th: string;
}

export type ITambon = Doctype & {
    name_th: string;
}

export type IAttachment = Doctype & {
    key: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    value: string;
}

export type ICheckListDetail = Doctype & {
    datatype: "Data" | "Float" | "Date" | "Check" | "Select" | "Link";
    key: string;
    options: string;
    parent: string;
    parentfield: string;
    parenttype: string;
}

//---
export type ICheckList = Doctype & {
    comment: string;
    key: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    title_detail: string;
    value: "-" | "\u0e1c\u0e48\u0e32\u0e19" | "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19"

}

export type ILicenseApproveHistory = Doctype & {
    comment: string;
    datetime: Date
    parent: string;
    parentfield: string;
    parenttype: string;
    workflow_action: string;
    workflow_user: string;

}

export type IRequestDetail = Doctype & {
    key: string;
    options: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    value: string;
}

export type ICheckListTypeDetail = Doctype & {
    comment: string;
    key: string;
    parent: string;
    parentfield: string;
    parenttype: string;
    title_detail: string;
    value: "-" | "\u0e1c\u0e48\u0e32\u0e19" | "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19"

}
export type IRequestTypeDetail = Doctype & {
    datatype: "Data" | "Float" | "Date" | "Check" | "Select" | "Link";
    key: string;
    options: string;
    parent: string;
    parentfield: string;
    parenttype: string;
}
export type IRequestLicenseType = Doctype & {
    attachment: IAttachment[]
    checklist: ICheckList[]
    checklist_details: ICheckListTypeDetail[]
    details: IRequestTypeDetail[]
    request_type: string;

}
export type DashboardData = Doctype & {
    dashboard_img: string;
	dashboard_img_link: string;
  }

export type IRequestStreetcutout = Doctype & {
    approve_status_requeststreetcutouttax:string;
    amended_from: string;
    cost_requeststreetcutouttax: number;
    expiration_date_requeststreetcutouttax: Date;
    payment_requeststreetcutouttax: string;
    streetcutout_count_requeststreetcutouttax: number;
    streetcutout_location:Array<{ allowed_streetcutoutlocation: string }>;
    streetcutout_size: string;
    user_name_requeststreetcutouttax: string;
    streetcutout_img:string;
}

export type IRequestLicense = Doctype & {
    amended_from: string;
    applicant_age: string | number;
    applicant_amphur: string;
    applicant_amphur_th: string;
    applicant_distict: string;
    applicant_distict_th: string;
    applicant_ethnicity: string;
    applicant_fax: string;
    applicant_moo: string;
    applicant_name: string;
    applicant_nationality: string;
    applicant_no: string;
    applicant_province: string;
    applicant_province_th: string;
    applicant_road: string;
    applicant_soi: string;
    applicant_tel: string;
    applicant_title: string;
    approve_history: ILicenseApproveHistory[]
    attachment_extra: IAttachment[]
    checklist_comment: string;
    checklist_date: Date
    checklist_extra: ICheckListDetail[]
    checklist_list: ICheckList[]
    date: Date | string;
    house_no: string;
    house_tel: string;
    license_type: string;
    request_extra: IRequestDetail[]
    request_status: "รอชำระเงิน" | "\u0e2a\u0e23\u0e49\u0e32\u0e07" | "\u0e23\u0e2d\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a\u0e40\u0e2d\u0e01\u0e2a\u0e32\u0e23" | "\u0e40\u0e2d\u0e01\u0e2a\u0e32\u0e23\u0e44\u0e21\u0e48\u0e04\u0e23\u0e1a" | "\u0e41\u0e01\u0e49\u0e44\u0e02" | "\u0e23\u0e2d\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e16\u0e32\u0e19\u0e17\u0e35\u0e48" | "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19" | "\u0e23\u0e2d\u0e2d\u0e2d\u0e01\u0e43\u0e1a\u0e2d\u0e19\u0e38\u0e0d\u0e32\u0e15" | "\u0e04\u0e33\u0e23\u0e49\u0e2d\u0e07\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08" | "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01";
    request_type: string;
    workflow_state: string;
    business: string | IBusiness

    license_applicant: string
    license_applicant_type: "\u0e1a\u0e38\u0e04\u0e04\u0e25\u0e18\u0e23\u0e23\u0e21\u0e14\u0e32" | "\u0e19\u0e34\u0e15\u0e34\u0e1a\u0e38\u0e04\u0e04\u0e25"

    license_fee: number;
    payment_attachment: string;
    comment: string;


}

export type ILicenseType = Doctype & {
    license_type: "หนังสือรับรองการแจ้ง" | "ใบอนุญาต"
    title: string;
    rule_year: string;

}

export type IRequestLicenseInspect = Doctype & {
    checklist_comment: string;
    checklist_date: string | Date;
    checklist_extra: ICheckListDetail[]
    checklist_list: ICheckList[]
    checklist_result: "-" | "\u0e1c\u0e48\u0e32\u0e19" | "\u0e44\u0e21\u0e48\u0e1c\u0e48\u0e32\u0e19"
    request_license: string | IRequestLicense
}

export type IAppointment = IRequestLicenseInspect