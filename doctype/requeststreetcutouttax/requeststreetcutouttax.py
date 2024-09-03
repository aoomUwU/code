# Copyright (c) 2024, SE and contributors
# For license information, please see license.txt

# import frappe
from typing import List
import frappe
import frappe.utils
from frappe.model.document import Document


class RequestStreetcutoutTax(Document):
    # begin: auto-generated types
    # This code is auto-generated. Do not modify anything in this block.

    from typing import TYPE_CHECKING

    if TYPE_CHECKING:
        from frappe.types import DF
        from maechan.maechan_streetcutout.doctype.streetcutoutlocation.streetcutoutlocation import StreetcutoutLocation

        amended_from: DF.Link | None
        approve_status_requeststreetcutouttax: DF.Literal["\u0e2a\u0e23\u0e49\u0e32\u0e07", "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e1e\u0e34\u0e08\u0e32\u0e23\u0e13\u0e32", "\u0e23\u0e2d\u0e0a\u0e33\u0e23\u0e30\u0e40\u0e07\u0e34\u0e19",
                                                          "\u0e23\u0e30\u0e2b\u0e27\u0e48\u0e32\u0e07\u0e01\u0e32\u0e23\u0e15\u0e23\u0e27\u0e08\u0e2a\u0e2d\u0e1a", "\u0e23\u0e2d\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e2d\u0e19\u0e38\u0e21\u0e31\u0e15\u0e34", "\u0e22\u0e01\u0e40\u0e25\u0e34\u0e01", "\u0e2b\u0e21\u0e14\u0e2d\u0e32\u0e22\u0e38"]
        cost_requeststreetcutouttax: DF.Data | None
        expiration_date_requeststreetcutouttax: DF.Date | None
        payment_requeststreetcutouttax: DF.AttachImage | None
        streetcutout_count_requeststreetcutouttax: DF.Data
        streetcutout_img: DF.AttachImage
        streetcutout_location: DF.TableMultiSelect[StreetcutoutLocation]
        streetcutout_size: DF.Literal["120x240 \u0e40\u0e0b\u0e19\u0e15\u0e34\u0e40\u0e21\u0e15\u0e23"]
        user_name_requeststreetcutouttax: DF.Data
    # end: auto-generated types

    pass


def get_active_workflow():

    workflows = frappe.db.get_all("Workflow",
                                  filters={
                                      'document_type': "RequestStreetcutoutTax",
                                      'is_active': True
                                  },
                                  fields='*',
                                  )

    workflow = workflows[0] if len(workflows) > 0 else None

    return workflow


def get_transitions(workflow, doc):

    transition = frappe.db.get_all("Workflow Transition",
                                   filters={
                                       'parent': workflow['workflow_name'],
                                       'allow_self_approval': True,
                                       'state': doc.workflow_state
                                   }, fields=['*'])

    return transition


@frappe.whitelist()
def load_request_streetcutouttax():
    request = frappe.form_dict
    assert 'name' in request

    name = request['name']
    requestStreetcutoutTaxDoc: RequestStreetcutoutTax = frappe.get_doc(
        "RequestStreetcutoutTax", name)  # type: ignore

    workflow = get_active_workflow()

    if (workflow):
        transition = get_transitions(workflow, requestStreetcutoutTaxDoc)
    else:
        transition = None

    frappe.response['workflow'] = workflow
    frappe.response['transition'] = transition
    return requestStreetcutoutTaxDoc


@frappe.whitelist()
def load_request_streetcutouttaxs():
    user = frappe.session.user

    result = frappe.db.get_all(
        "RequestStreetcutoutTax", filters={'owner': user})

    docs = [frappe.get_doc('RequestStreetcutoutTax', x.name)
            for x in result]  # type: ignore

    streetcutout = {
        x.name: frappe.db.get_all("RequestStreetcutoutTax", fields="*", filters={'name': x.name}) for x in docs
    }

    frappe.response['streetcutout'] = streetcutout

    return {'data': docs}


@frappe.whitelist()
def first_step_requeststreetcutouttax():
    req = frappe.form_dict
    assert 'request' in req

    requeststreetcutouttax = req['request']

    if 'doctype' not in requeststreetcutouttax:
        requeststreetcutouttax['doctype'] = 'RequestStreetcutoutTax'

    requeststreetcutouttaxObj: RequestStreetcutoutTax = frappe.get_doc(
        requeststreetcutouttax)  # type: ignore
    requeststreetcutouttaxObj.save()

    requeststreetcutouttaxObj.notify_update()

    frappe.response['message'] = requeststreetcutouttaxObj


@frappe.whitelist()
def load_streetcutouttax():
    query = """
        select 
            tabRequestStreetcutoutTax.*
        from tabRequestStreetcutoutTax
    """

    result = frappe.db.sql(query, as_dict=True)
    return {'data': result}
