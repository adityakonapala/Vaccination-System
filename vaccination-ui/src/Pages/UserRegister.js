import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserRegister() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      pinCode: "",
    },

    validationSchema: Yup.object({

      name: Yup.string()
        .required("Name is required"),

      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),

      phone: Yup.string()
        .matches(
          /^[0-9]{10}$/,
          "Phone number must contain 10 digits"
        )
        .required("Phone number is required"),

      pinCode: Yup.string()
        .matches(
          /^[0-9]{6}$/,
          "Pin code must contain 6 digits"
        )
        .required("Pin code is required"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {

      try {

        setStatus("");

        const response = await axios.post(
          "http://localhost:5000/api/users/register",
          {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
            pinCode: values.pinCode,
          }
        );

        if (response.data.success) {

          // Registration successful
          alert(
            response.data.message ||
            "Registration successful"
          );

          // Go to User Login
          navigate("/user-login");

        } else {

          // Backend error
          setStatus(response.data.message);

        }

      } catch (error) {

        console.error(
          "User registration error:",
          error
        );

        setStatus(
          error.response?.data?.message ||
          "Unable to connect to the server"
        );

      } finally {

        setSubmitting(false);

      }
    },
  });

  return (

    <div className="container mt-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                User Registration
              </h2>

              {/* API Error */}
              {formik.status && (
                <div className="alert alert-danger">
                  {formik.status}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>

                {/* Name */}
                <div className="mb-3">

                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      formik.touched.name &&
                      formik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter your name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.name &&
                    formik.errors.name && (
                      <div className="invalid-feedback">
                        {formik.errors.name}
                      </div>
                  )}

                </div>

                {/* Email */}
                <div className="mb-3">

                  <label className="form-label">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      formik.touched.email &&
                      formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter your email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.email &&
                    formik.errors.email && (
                      <div className="invalid-feedback">
                        {formik.errors.email}
                      </div>
                  )}

                </div>

                {/* Password */}
                <div className="mb-3">

                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    className={`form-control ${
                      formik.touched.password &&
                      formik.errors.password
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Create a password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.password &&
                    formik.errors.password && (
                      <div className="invalid-feedback">
                        {formik.errors.password}
                      </div>
                  )}

                </div>

                {/* Phone */}
                <div className="mb-3">

                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${
                      formik.touched.phone &&
                      formik.errors.phone
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter 10 digit phone number"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.phone &&
                    formik.errors.phone && (
                      <div className="invalid-feedback">
                        {formik.errors.phone}
                      </div>
                  )}

                </div>

                {/* Pin Code */}
                <div className="mb-3">

                  <label className="form-label">
                    Pin Code
                  </label>

                  <input
                    type="text"
                    name="pinCode"
                    className={`form-control ${
                      formik.touched.pinCode &&
                      formik.errors.pinCode
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter 6 digit pin code"
                    value={formik.values.pinCode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.pinCode &&
                    formik.errors.pinCode && (
                      <div className="invalid-feedback">
                        {formik.errors.pinCode}
                      </div>
                  )}

                </div>

                {/* Register */}
                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? "Registering..."
                    : "Register"}
                </button>

              </form>

              {/* Login */}
              <div className="text-center mt-3">

                <span>
                  Already have an account?{" "}
                </span>

                <Link to="/user-login">
                  Login
                </Link>

              </div>

              {/* Home */}
              <div className="text-center mt-2">

                <Link to="/">
                  Back to Home
                </Link>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default UserRegister;