import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../apiConfig/config';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify"
import { UserContext } from '../contexts/userContext';


function Login() {
  const [errors, setErrors] = useState('');
  const navigate = useNavigate()
  const { setIsAuthenticated, setUser } = useContext(UserContext);

  async function generateKey() {
    return await crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );
  }



  async function encryptToken(token, key) {
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      enc.encode(token)
    );

    return {
      iv: iv,
      encryptedToken: new Uint8Array(encrypted)
    };
  }

  async function saveEncryptedToken(token) {
    const key = await generateKey();
    const { iv, encryptedToken } = await encryptToken(token, key);

    // Convert to base64 for storage
    const ivBase64 = btoa(String.fromCharCode(...iv));
    const encryptedTokenBase64 = btoa(String.fromCharCode(...encryptedToken));

    // Save the key, iv, and encrypted token in localStorage
    sessionStorage.setItem('encryptionKey', JSON.stringify(await crypto.subtle.exportKey('jwk', key)));
    sessionStorage.setItem('iv', ivBase64);
    sessionStorage.setItem('encryptedToken', encryptedTokenBase64);

    localStorage.setItem('encryptionKey', JSON.stringify(await crypto.subtle.exportKey('jwk', key)));
    localStorage.setItem('iv', ivBase64);
    localStorage.setItem('encryptedToken', encryptedTokenBase64);
  }

  // console.log(ApiData)

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required('Email is required'),
    password: Yup.string().required('Password is required')
  });



  const handleLogin = async (values, { setSubmitting }) => {
    setErrors('');

    if (!values.email || !values.password) {
      setErrors('Please fill in all the fields');
      toast.error('Please fill in all the fields', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${api.baseUrl}/login`, {
        email: values.email,
        password: values.password,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
      );

      const token = response.data;
      await saveEncryptedToken(token);

      const { data } = await axios.get(`${api.baseUrl}/username`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json,"
        },
      });

      setUser(data);
      setIsAuthenticated(true);

      toast.success('Logged In', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate('/home');
    } catch (error) {
      setErrors(error.response?.data?.error?.message || 'Something went wrong');
      toast.error('Invalid email or password.', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmitting(false);
    }
  };

  useEffect(() => {
    axios.get(`${api.baseUrl}/usergetall`)
      .then(response => {
        if (response.data.length === 0) {
          navigate('/signup')
        }
      })
      .catch(error => console.error(error));

    localStorage.clear();
    sessionStorage.clear();
    // navigate('/login')
  }, []);

  return (
    <div className="min-h-screen flex overflow-hidden max-w-full">
      <div className="flex-1 hidden lg:flex relative flex items-center justify-center bg-cover bg-center" style={{
        backgroundImage: `url('/assets/images/login/travel.png')`, backgroundRepeat: 'no-repeat',
        backgroundSize: '100%',
        backgroundPosition: 'top right'
      }}>

        {/* Login form box (visible on large screens) */}
        <div className="relative z-10 flex max-sm:w-full">
          {/* Red background half cover (hidden on small screens) */}
          <div className="bg-red-600 w-1/2 h-full hidden lg:flex items-center justify-center"></div>

          {/* White login box with loginb1.png background and curved corners */}
          <div
            className="bg-white mr-24 p-8 rounded-lg shadow-lg border-8 border-black relative"
            style={{
              width: '1200px',
              height: '500px',
              backgroundImage: `url('/assets/images/login/login-image.png')`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              borderRadius: '20px', // Adjusted the border-radius to make the corners curved
              overflow: 'hidden', // This ensures the background image fits nicely within the curved corners
            }}
          >
            <div className="flex justify-center w-60 mb-6">
              <img src="/assets/images/login/logo2.jpg" alt="Motherson" className="h-12" />
            </div>
            <Formik
              initialValues={{ email: '', password: '' }}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-6">
                    <label className="block text-gray-700">Email</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter Your Email"
                      className="border border-gray-300 p-2 w-60 rounded"
                    // value={values.username}
                    // onChange={handleChange}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-gray-700">Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter Your Password"
                      className="border border-gray-300 p-2 w-60 rounded"
                    // value={values.password}
                    // onChange={handleChange}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
                  </div>
                  <button type="submit" className="bg-red-600 text-white p-2 w-60 rounded" disabled={isSubmitting}>Log In</button>
                </Form>
              )}
            </Formik>
          </div>
          {/* Three red lines from the top */}
          <div className="absolute -top-80 w-full flex justify-center">
            <div className="h-80 w-3 bg-red-600"></div>
            <div className="h-80 w-3 bg-red-600 mx-2"></div>
            <div className="h-80 w-3 bg-red-600"></div>
          </div>
        </div>


        {/* Red background on the right end (hidden on small screens) */}
        <div className="absolute right-0 top-0 h-full w-80 hidden lg:block bg-red-600"></div>
      </div>

      {/* Responsive login form on small and medium screens */}
      <div className="flex-1 lg:hidden flex items-center justify-center" style={{
        backgroundImage: `url('/assets/images/login/travel.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh', // Make the height fill the viewport
        overflow: 'hidden' // Prevent scrolling
      }}>
        <div
          className="bg-white p-6 rounded-lg shadow-lg border-8 border-black relative"
          style={{
            width: '90%', // Adjust width for small screens
            maxHeight: '500px', // Set a maximum height for the form
            borderRadius: '20px',
            overflow: 'hidden' // Prevent content overflow
          }}
        >
          <div className="flex justify-center w-60 mb-6">
            <img src="/assets/images/login/logo2.jpg" alt="Motherson" className="h-12" />
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validate={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, values, handleChange, errors }) => (<Form>
              <div className="mb-6">
                <label className="block text-gray-700">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter Your Email"
                  className="border border-gray-300 p-2 w-full rounded"
                />
                <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700">Password</label>
                <Field
                  type="password"
                  placeholder="Enter Your Password"
                  className="border border-gray-300 p-2 w-full rounded"
                  name="password"
                />
                <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
              </div>
              <button type="submit" className="bg-red-600 text-white p-2 w-full rounded">Log In</button>
            </Form>)}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;