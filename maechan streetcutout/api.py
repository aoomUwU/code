import json
import base64
from io import BytesIO

import frappe
import frappe.utils
import frappe.utils.logger
from frappe.utils.password import update_password as _update_password
from frappe.utils.oauth import login_oauth_user, login_via_oauth2_id_token, get_info_via_oauth
from frappe.core.doctype.user.user import User

@frappe.whitelist(allow_guest=True)
def app_register():

    request = frappe.form_dict
    if 'register' in request:
        registerReq = request['register']

        registerReq['doctype'] = 'User'
        registerReq['new_password'] = registerReq['password']
        user = frappe.get_doc(
            registerReq
        )

        user.flags.ignore_permissions = True
        user.flags.ignore_password_policy = True
        user.insert()

        default_role = frappe.db.get_single_value(
            "Portal Settings", "default_role")
        if default_role:
            user.add_roles(default_role)  # type: ignore
        return "Please check your email for verification"


@frappe.whitelist(allow_guest=True)
def test_register():
    request = frappe.form_dict.get('register')  # เข้าถึงฟิลด์ register โดยตรง
    
    # ตรวจสอบว่าข้อมูลที่จำเป็นมีอยู่หรือไม่
    if not request or not all([request.get('email'), request.get('first_name'), request.get('last_name'), request.get('password')]):
        return {"status": "error", "message": "Missing required fields."}

    # ตรวจสอบว่า email มีอยู่ในระบบแล้วหรือไม่
    existing_user = frappe.db.get_value("User", {"email": request.get('email')})
    if existing_user:
        return {"status": "error", "message": "Email already exists."}

    try:
        # สร้างเอกสาร User ใหม่
        UserNew = frappe.get_doc({
            "doctype": "User",
            "email": request.get('email').strip(),
            "first_name": request.get('first_name').strip(),
            "last_name": request.get('last_name').strip(),
            "mobile_no": request.get('mobile_no').strip() if request.get('mobile_no') else None,
            "new_password": request.get('password').strip()
        })

        UserNew.flags.ignore_permissions = True
        UserNew.flags.ignore_password_policy = True

        default_role = frappe.db.get_single_value(
            "Portal Settings", "default_role")
        if default_role:
            UserNew.add_roles(default_role)  # type: ignore
        
        UserNew.insert()

        return "Please check your email for verification"

    except Exception as e:
        return {"status": "error", "message": str(e)}