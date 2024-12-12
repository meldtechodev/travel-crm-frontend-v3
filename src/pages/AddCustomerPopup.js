import React, { useContext, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { toast } from "react-toastify";
import axios from "axios";
import api from "../apiConfig/config";
import { UserContext } from "../contexts/userContext";
import { Link } from "react-router-dom";

const AddCustomerPopup = ({ isOpen, onClose }) => {

  const { user } = useContext(UserContext);
  const [ipAddress, setIpAddress] = React.useState("");
  const [errors, setErrors] = React.useState(null);
  const [currentCreatedUser, setCurrentCreatedUser] = React.useState(null);

  console.log(ipAddress);
  console.log(user);

  const formik = useFormik({
    initialValues: {
      emailId: "",
      contactNo: "",
      salutation: "",
      fName: "",
      lName: "",
      leadSource: "",
      createdby: user.name,
      modifiedby: user.name,
      ipaddress: ipAddress,
      status: 1,
      isdelete: 0,
      user_id: user.userId,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      emailId: Yup.string().email("Invalid email address").required("Required"),
      contactNo: Yup.string().required("Required"),
      salutation: Yup.string().required("Required"),
      fName: Yup.string().required("Required"),
      lName: Yup.string().required("Required"),
      leadSource: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      setCurrentCreatedUser(values);
      if (
        !values.salutation ||
        !values.fName ||
        !values.lName ||
        !values.emailId ||
        !values.contactNo ||
        !values.leadSource
      ) {
        toast.error("Please fill all the fields...", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      // Create new customer
      await axios.post(`${api.baseUrl}/customer/create`, values, {
        headers: {
          // 'Authorization': `Bearer ${token}`,
          
        }
      })
        .then(response => {
          console.log(response);
          toast.success("Customer saved successfully.", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          formik.resetForm();
          onClose();
        })
        .catch(error => {
          console.error(error);
          setErrors(error && error.response.data);
          toast.error(error && error.response.data, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        });
    },
  });

  console.log(errors)

  useEffect(() => {
    axios.get(`${api.baseUrl}/ipAddress`)
      .then((response) => {
        setIpAddress(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  console.log(errors);

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <p
              onClick={() => onClose()}
              className="absolute top-2 text-lg right-4 cursor-pointer text-black hover:text-black"
            >
              ✖
            </p>

            <h2 className="text-lg font-semibold mb-4">New Customer</h2>
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className='flex flex-col'>
                <label className="block text-sm font-medium">Email ID *</label>
                <input
                  type="email"
                  name="emailId"
                  placeholder="Email ID"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.emailId}
                />
                {formik.touched.emailId && formik.errors.emailId ? (
                  <div className="text-red-500 text-sm">{formik.errors.emailId}</div>
                ) : null}
              </div>

              {errors && errors.message && errors.customer && errors.customer.emailId === currentCreatedUser.emailId && (
              <p className="text-red-500 text-sm">
                  {errors.message}
                </p>
              )}

              <div className="flex space-x-2 w-full h-full flex-col">
                <PhoneInput
                  country={"in"}
                  enableSearch={true}
                  value={formik.values.contactNo}
                  onChange={(contactNo) => formik.setFieldValue("contactNo", contactNo)}
                  onBlur={formik.handleBlur("contactNo")}
                />
                {formik.touched.contactNo && formik.errors.contactNo ? (
                  <div className="text-red-500 text-sm">{formik.errors.contactNo}</div>
                ) : null}
              </div>

              {errors && errors.message && errors.customer && errors.customer.contactNo === currentCreatedUser.contactNo && (
              <p className="text-red-500 text-sm">
                {errors.message} <Link to={`/home/customer-profile-popup/${errors && errors.customer && errors.customer.id}`}>view here</Link>
              </p>
              )}

              <div className="flex space-x-2">
                <div className="flex flex-col">
                  <select
                    name="salutation"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.salutation}
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>

                  </select>
                  {formik.touched.salutation && formik.errors.salutation ? (
                    <div className="text-red-500 text-sm">{formik.errors.salutation}</div>
                  ) : null}
                </div>

                <div className="flex w-full flex-col">
                  <input
                    type="text"
                    name="fName"
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.fName}
                  />
                  {formik.touched.fName && formik.errors.fName ? (
                    <div className="text-red-500 text-sm">{formik.errors.fName}</div>
                  ) : null}
                </div>

              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input
                  type="text"
                  name="lName"
                  placeholder="Last Name"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lName}
                />
                {formik.touched.lName && formik.errors.lName ? (
                  <div className="text-red-500 text-sm">{formik.errors.lName}</div>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium">Lead Source</label>
                <select
                  name="leadSource"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.leadSource}
                >
                  <option value="Agency">Agency</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                </select>
                {formik.touched.leadSource && formik.errors.leadSource ? (
                  <div className="text-red-500 text-sm">{formik.errors.leadSource}</div>
                ) : null}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  className="bg-gray-200 text-black px-4 py-2 rounded"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCustomerPopup;
