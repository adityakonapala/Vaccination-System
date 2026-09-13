import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required("Username is required"),

      password: Yup.string()
        .required("Password is required"),
    }),

    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Clear previous API error
        setStatus("");

        const response = await axios.post(
          "http://localhost:5000/api/admin/login",
          {
            username: values.username,
            password: values.password,
          }
        );

        if (response.data.success) {
          // Login successful
          navigate("/admin-dashboard");
        } else {
          // Login failed
          setStatus(response.data.message);
        }
      } catch (error) {
        console.error("Admin login error:", error);

        if (error.response) {
          setStatus(
            error.response.data.message || "Admin login failed"
          );
        } else {
          setStatus("Unable to connect to the server");
        }
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
                Admin Login
              </h2>

              {/* API Error Message */}
              {formik.status && (
                <div className="alert alert-danger" role="alert">
                  {formik.status}
                </div>
              )}

              <form onSubmit={formik.handleSubmit}>

                {/* Username */}
                <div className="mb-3">

                  <label className="form-label">
                    Username
                  </label>

                  <input
                    type="text"
                    name="username"
                    className={`form-control ${
                      formik.touched.username &&
                      formik.errors.username
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="Enter username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.username &&
                    formik.errors.username && (
                      <div className="invalid-feedback">
                        {formik.errors.username}
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
                    placeholder="Enter password"
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

              {/* Back to Home */}
              <div className="text-center mt-3">
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

export default AdminLogin;