import frappe  # type: ignore
import unittest
from datetime import datetime, timedelta
from maechan.maechan_streetcutout.tasks import update_expired
from frappe.model.workflow import apply_workflow


class TestUpdateExpired(unittest.TestCase):

    def setUp(self):
        # สร้างเอกสาร RequestStreetcutoutTax ใหม่ที่มีหมดอายุ
        self.expired_doc = frappe.get_doc({
            "doctype": "RequestStreetcutoutTax",
            # ตั้งค่าเป็นวันที่เมื่อวาน
            "expiration_date_requeststreetcutouttax": datetime.today() - timedelta(days=1),
            "approve_status_requeststreetcutouttax": "สร้าง",  # สถานะเริ่มต้นเป็น "สร้าง"
            "workflow_state": "Created"  # สถานะ workflow เริ่มต้นเป็น "Created"
        })
        self.expired_doc.insert()
        frappe.logger().info(f"เอกสารที่สร้างขึ้น: {self.expired_doc.name}")

        doc = frappe.get_doc("RequestStreetcutoutTax", self.expired_doc.name)

        # เปลี่ยนสถานะจาก "Created" -> "Wait for Pay" โดย action Approve
        apply_workflow(doc, "Approve")
        frappe.logger().info(
            f"สถานะ workflow เปลี่ยนเป็น: {self.expired_doc.workflow_state}")

        # เปลี่ยนสถานะจาก "Wait for Pay" -> "Approved" โดย action Approve
        apply_workflow(doc, "Approve")
        frappe.logger().info(
            f"สถานะ workflow เปลี่ยนเป็น: {self.expired_doc.workflow_state}")

    def tearDown(self):
        # ลบเอกสารหลังจากการทดสอบ
        frappe.delete_doc("RequestStreetcutoutTax", self.expired_doc.name)
        frappe.logger().info(f"ลบเอกสาร: {self.expired_doc.name}")

    def test_update_expired(self):
        # ตรวจสอบสถานะเริ่มต้นก่อนที่จะเรียก update_expired
        initial_doc = frappe.get_doc(
            "RequestStreetcutoutTax", self.expired_doc.name)
        print(f"สถานะ workflow เริ่มต้น: {initial_doc.workflow_state}")

        # เรียกใช้ฟังก์ชัน update_expired เพื่ออัปเดตสถานะหมดอายุ
        update_expired()
        print("เรียกใช้ update_expired()")

        # รีเฟรชเอกสารเพื่อดึงค่าที่อัปเดตล่าสุดจากฐานข้อมูล
        updated_doc = frappe.get_doc(
            "RequestStreetcutoutTax", self.expired_doc.name)

        # ตรวจสอบว่าสถานะ workflow ถูกเปลี่ยนเป็น "Expired"
        self.assertEqual(updated_doc.workflow_state, "Expired")
        print(f"สถานะ workflow ที่อัปเดต: {updated_doc.workflow_state}")

        # ตรวจสอบว่า approve_status_requeststreetcutouttax ถูกเปลี่ยนเป็น "หมดอายุ"


if __name__ == "__main__":
    unittest.main()
