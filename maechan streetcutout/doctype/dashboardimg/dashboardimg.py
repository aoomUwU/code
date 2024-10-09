# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
import frappe
import frappe.utils
from frappe.model.document import Document


class DashboardIMG(Document):
	# begin: auto-generated types
	# This code is auto-generated. Do not modify anything in this block.

	from typing import TYPE_CHECKING

	if TYPE_CHECKING:
		from frappe.types import DF

		dashboard_img: DF.AttachImage | None
		dashboard_img_link: DF.Data | None
	# end: auto-generated types

	pass

@frappe.whitelist()
def load_dashboard_imgs():
    try:
        query = """
        select 
            tabDashboardIMG.*
        from tabDashboardIMG
    """
        result = frappe.db.sql(query, as_dict=True)
        return {'data': result}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Error loading dashboard images")
        return {'data': []}
