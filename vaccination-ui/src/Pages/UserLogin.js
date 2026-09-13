import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserLogin() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: Yup.object({
      email: Yup.string()
        .email("Enter a valid email")
        .required("Email is required"),

      password: Yup.string()
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        setStatus("");

        const response = await axios.post(
          "http://localhost:5000/api/users/login",
          {
            email: values.email,
            password: values.password,
          }
        );

        if (response.data.success) {
          // Store logged-in user information
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.data)
          );

          // Go to User Dashboard
          navigate("/user-dashboard");
        } else {
          setStatus(response.data.message);
        }

      } catch (error) {
        console.error("User login error:", error);

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

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body p-4">

              <h2 className="text-center mb-4">
                User Login
              </h2>

              {/* API Error */}
              {formik.status && (
                <div className="alert alert-danger">
                  {formik.status}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>

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
                    placeholder="Enter your password"
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

                {/* Login Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting
                    ? "Logging in..."
                    : "Login"}
                </button>

              </form>

              {/* Register */}
              <div className="text-center mt-3">

                <span>
                  Don't have an account?{" "}
                </span>

                <Link to="/register">
                  Register
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

export default UserLogin;