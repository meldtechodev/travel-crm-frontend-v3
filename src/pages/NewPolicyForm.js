import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../apiConfig/config";
import { UserContext } from "../contexts/userContext";
import useDecryptedToken from "../hooks/useDecryptedToken";

const NewPolicyForm = ({ isOpen, onClose, selectedPolicyData }) => {

  const { user, ipAddress } = useContext(UserContext);
  const token = useDecryptedToken();

  // Fetch IP address on component mount
  // useEffect(() => {
  //   axios.get(`${api.baseUrl}/ipAddress`)
  //     .then((r) => {
  //       setIp(r.data);
  //     });
  // }, []);


  const formik = useFormik({
    initialValues: {
      policyName: "",
      policyDescription: "",
      status: true,
    },
    validationSchema: Yup.object({
      policyName: Yup.string().required("Policy Name is required"),
      policyDescription: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values) => {
      console.log(values)
      try {
        if (selectedPolicyData) {
          await axios.post(`${api.baseUrl}/policy/updatedby/${selectedPolicyData && selectedPolicyData.id}`, {
            ...values,
            ipaddress: ipAddress,
            createdBy: selectedPolicyData.createdBy,
            modifiedby: user.name,
            isdelete: false,
          }, {
            headers: {
              // 'Authorization': `Bearer ${token}`,
              'Access-Control-Allow-Origin': '*'
            }
          });

          // Success toast notification
          toast.success("Policy created successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }

        else {
          await axios.post(`${api.baseUrl}/policy/create`, {
            ...values,
            ipaddress: ipAddress,
            createdBy: user.name,
            modifiedby: user.name,
            isdelete: false,
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Access-Control-Allow-Origin': '*'
            }
          });

          // Success toast notification
          toast.success("Policy created successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          // Reset form after successful submission  
          formik.resetForm();
        }
      } catch (error) {
        console.error("Error:", error);

        // Error toast notification
        toast.error("Failed to create policy.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleCKEditorChange = (event, editor) => {
    formik.setFieldValue("policyDescription", editor.getData());
  };

  const handleReset = () => {
    formik.resetForm();

    // Toast notification for reset action
    toast.info("Form reset successfully.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  useEffect(() => {
    if (selectedPolicyData) {
      formik.setValues({
        policyName: selectedPolicyData.policyName,
        policyDescription: selectedPolicyData.policyDescription,
        status: selectedPolicyData.status,
      });
    } else {
      formik.setValues({
        policyName: "",
        policyDescription: "",
        status: true,
      });
    }
  }, [selectedPolicyData]);

  return (
    <div
      className={`fixed top-0 right-0 h-full bg-gray-200 shadow-lg transform transition-transform duration-500 z-50 ${isOpen ? "translate-x-0" : "translate-x-[850px]"
        } mt-4 sm:mt-8 md:mt-12 w-full sm:w-[calc(100%-120px)] md:w-[800px]`}
    >
      {/* Close Button */}
      <button
        onClick={() => onClose(true)}
        className="absolute top-[12px] left-[-22px] font-semibold text-white text-sm bg-red-700 square px-3 py-1.5 border border-1 border-transparent hover:border-red-700 hover:bg-white hover:text-red-700"
      >
        X
      </button>

      {/* Header Section */}
      <div className="flex justify-between items-center p-4 pl-8 bg-white shadow-md">
        <h2 className="text-lg font-bold text-black">New Policy</h2>
      </div>
      <div className="border-b border-gray-300 shadow-sm"></div>

      {/* Form Section */}
      <form onSubmit={formik.handleSubmit} className="p-4">
        <div className="mb-4">
          <h3 className="bg-red-700 text-white p-2 rounded">Policy Details</h3>
        </div>

        {/* Policy Name Input */}
        <div className="mb-4 p-2">
          <label
            htmlFor="policyName"
            className="block text-sm font-medium text-gray-700"
          >
            Policy Name
          </label>
          <input
            type="text"
            id="policyName"
            className="mt-1 p-2 w-full border rounded"
            placeholder="Type Policy Name"
            name="policyName"
            value={formik.values.policyName}
            onChange={formik.handleChange}
          />
          {formik.errors.policyName && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.policyName}
            </p>
          )}
        </div>

        {/* Policy Description Editor */}
        <div className="mb-4 p-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={formik.values.policyDescription}
            config={{
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
              ],
            }}
            onChange={handleCKEditorChange}
            className="mt-1 w-full border rounded-md shadow-sm"
          />
          {formik.errors.policyDescription && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.policyDescription}
            </p>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="mb-4 p-2">
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 p-2 w-full border rounded"
            value={formik.values.status}
            onChange={formik.handleChange}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
      </form>

      {/* Buttons Section */}
      <div className="flex justify-between items-center p-3 bg-white shadow-lg rounded w-full fixed bottom-12">
        <div className="flex justify-start space-x-4">
          {/* Submit Button */}
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={formik.handleSubmit}
          >
            Submit
          </button>
          {/* Reset Button */}
          <button
            type="button"
            className="bg-red-700 text-white px-4 py-2 rounded shadow"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPolicyForm;
