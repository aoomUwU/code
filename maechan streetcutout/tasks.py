import frappe  # type: ignore
from datetime import datetime
from frappe.model.workflow import apply_workflow

def update_expired():
    filters = {
        'expiration_date_requeststreetcutouttax': ['<', datetime.today()],
        'workflow_state': ['=', 'Approved']
    }
    
    expired_streetcutouttax = frappe.db.get_list('RequestStreetcutoutTax', fields=['name'], filters=filters)
    frappe.logger().info(f"จำนวนเอกสารภาษีที่หมดอายุ: {len(expired_streetcutouttax)}")

    for doc_info in expired_streetcutouttax:
            doc = frappe.get_doc("RequestStreetcutoutTax", doc_info.name)

            apply_workflow(doc, "Expired")
            frappe.logger().info(f"เอกสาร {doc.name} เปลี่ยนสถานะเป็น 'Expired'.")


