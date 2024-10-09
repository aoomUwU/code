# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from typing import List

import frappe
import frappe.utils
from frappe.model.document import Document
from frappe.types import DF


class StreetcutoutLocation(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		allowed_streetcutoutlocation: DF.Link | None
		parent: DF.Data
		parentfield: DF.Data
		parenttype: DF.Data
	# end: auto-generated types

	pass

@frappe.whitelist()
def load_streetcutoutLocations():

    result = frappe.db.get_all(
        "StreetcutoutLocation")

    docs = [frappe.get_doc('StreetcutoutLocation', x.name)
            for x in result]  # type: ignore

    streetcutout = {
        x.name: frappe.db.get_all("StreetcutoutLocation", fields="*") for x in docs
    }

    frappe.response['streetcutout'] = streetcutout

    return {'data': docs}

@frappe.whitelist()
def load_streetcutoutLocation():
    req = frappe.form_dict
    assert 'parent' in req

    parent = req['parent']

    # ดึงข้อมูล StreetcutoutLocation ที่มี parent ตรงกับที่ระบุ
    streetcutout_docs = frappe.get_all(
        "StreetcutoutLocation",
        filters={"parent": parent},  # ใช้ filters เพื่อดึงข้อมูลตาม parent
        fields="*"
    )

    # สร้างการตอบกลับเป็น dictionary
    streetcutout = {doc['name']: doc for doc in streetcutout_docs}

    frappe.response['streetcutout'] = streetcutout

    return {'data': streetcutout_docs}

@frappe.whitelist()
def update_streetcutoutLocation():
    req = frappe.form_dict
    assert 'request' in req
    assert 'parent' in req

    request_allowed_streetcutoutlocation = req['request']
    parent = req['parent']

    # ตรวจสอบว่า request เป็นรายการ
    if isinstance(request_allowed_streetcutoutlocation, list):
        # ลบข้อมูลที่มี parent เป็น req['parent']
        frappe.db.delete("StreetcutoutLocation", {'parent': parent})

        for allowed_streetcutoutlocation in request_allowed_streetcutoutlocation:
            try:
                # ตรวจสอบว่าเอกสารมีอยู่หรือไม่
                if frappe.db.exists("StreetcutoutLocation", allowed_streetcutoutlocation):
                    # ถ้ามีอยู่แล้ว ดึงเอกสาร
                    streetcutout_location_obj = frappe.get_doc("StreetcutoutLocation", allowed_streetcutoutlocation)
                    streetcutout_location_obj.parent = parent  # อัปเดต parent ตามที่ระบุ
                    streetcutout_location_obj.parentfield = "streetcutout_location"  # กำหนด parentfield
                    streetcutout_location_obj.parenttype = "RequestStreetcutoutTax"  # กำหนด parenttype
                else:
                    # ถ้าไม่มี ให้สร้างเอกสารใหม่
                    streetcutout_location_obj = frappe.get_doc({
                        'doctype': 'StreetcutoutLocation',
                        'allowed_streetcutoutlocation': allowed_streetcutoutlocation,
                        'parent': parent,
                        'parentfield': 'streetcutout_location',  # กำหนด parentfield
                        'parenttype': 'RequestStreetcutoutTax',  # กำหนด parenttype
                    })

                # บันทึกการเปลี่ยนแปลง
                streetcutout_location_obj.save()
                streetcutout_location_obj.notify_update()

            except Exception as e:
                frappe.log_error(message=str(e), title="Error updating StreetcutoutLocation")
                frappe.response['message'] = f"Error updating {allowed_streetcutoutlocation}: {str(e)}"
                return

    frappe.response['message'] = "Successfully updated streetcutout locations"

