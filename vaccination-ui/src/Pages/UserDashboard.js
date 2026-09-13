import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function UserDashboard() {
  // Get logged-in user from localStorage
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  // Active section
  const [activeSection, setActiveSection] = useState("centers");

  // Vaccination centers
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Booking
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Profile update
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // --------------------------------------------------
  // GET ALL VACCINATION CENTERS
  // --------------------------------------------------
  const fetchCenters = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/vaccinations/centers"
      );

      if (response.data.success) {
        setCenters(response.data.data);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to fetch vaccination centers"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch centers when dashboard loads
  useEffect(() => {
    fetchCenters();
  }, []);

  // --------------------------------------------------
  // SEARCH BY PIN CODE
  // --------------------------------------------------
  const handleSearch = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/vaccinations/centers",
        {
          params: {
            pinCode: values.pinCode,
          },
        }
      );

      if (response.data.success) {
        setCenters(response.data.data);

        if (response.data.data.length === 0) {
          setErrorMessage(
            "No vaccination centers found for this PIN code."
          );
        }
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to search vaccination centers"
      );
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // SHOW ALL CENTERS
  // --------------------------------------------------
  const handleShowAll = () => {
    fetchCenters();
  };

  // --------------------------------------------------
  // OPEN BOOKING MODAL
  // --------------------------------------------------
  const handleBookNow = (center) => {
    setSelectedCenter(center);
    setBookingMessage("");
    setBookingSuccess(false);
    setShowBookingModal(true);
  };

  // --------------------------------------------------
  // BOOK VACCINATION
  // --------------------------------------------------
  const handleBooking = async (values, { setSubmitting }) => {
    try {
      setBookingMessage("");
      setBookingSuccess(false);

      const response = await axios.post(
        "http://localhost:5000/api/vaccinations/book",
        {
          userId: user.id,
          vaccinationDate: values.vaccinationDate,
        }
      );

      if (response.data.success) {
        setBookingMessage(response.data.message);
        setBookingSuccess(true);

        // Refresh centers after booking
        fetchCenters();

        // Close modal after short delay
        setTimeout(() => {
          setShowBookingModal(false);
        }, 1500);
      } else {
        setBookingMessage(response.data.message);
      }
    } catch (error) {
      setBookingMessage(
        error.response?.data?.message ||
          "Failed to book vaccination"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // UPDATE USER PROFILE
  // --------------------------------------------------
  const handleProfileUpdate = async (
    values,
    { setSubmitting }
  ) => {
    try {
      setProfileMessage("");
      setProfileSuccess(false);

      const response = await axios.put(
        `http://localhost:5000/api/users/${user.id}`,
        {
          phone: values.phone,
          pinCode: values.pinCode,
        }
      );

      if (response.data.success) {
        const updatedUser = response.data.data;

        // Update React state
        setUser(updatedUser);

        // Update localStorage
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        setProfileMessage(response.data.message);
        setProfileSuccess(true);

        // Close modal
        setTimeout(() => {
          setShowEditProfile(false);
        }, 1000);
      } else {
        setProfileMessage(response.data.message);
      }
    } catch (error) {
      setProfileMessage(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  // --------------------------------------------------
  // PROFILE INITIAL
  // --------------------------------------------------
  const getInitial = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }

    return "U";
  };

  return (
    <div className="bg-light min-vh-100">

      {/* ==================================================
          NAVBAR
      ================================================== */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
        <div className="container">

          <span className="navbar-brand fw-bold">
            Vaccination Portal
          </span>

          <div className="d-flex align-items-center">

            <span className="text-white me-3">
              Welcome, {user?.name}
            </span>

            <button
              className="btn btn-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}
      <div className="container py-4">

        {/* Navigation buttons */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">

            <div className="d-flex gap-2 flex-wrap">

              <button
                className={`btn ${
                  activeSection === "centers"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("centers");
                  setProfileMessage("");
                }}
              >
                Vaccination Centers
              </button>

              <button
                className={`btn ${
                  activeSection === "profile"
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveSection("profile");
                  setProfileMessage("");
                }}
              >
                My Profile
              </button>

            </div>

          </div>
        </div>

        {/* ==================================================
            VACCINATION CENTERS SECTION
        ================================================== */}
        {activeSection === "centers" && (
          <div>

            <div className="card shadow-sm mb-4">
              <div className="card-body">

                <h4 className="fw-bold mb-3">
                  Find Vaccination Centers
                </h4>

                <Formik
                  initialValues={{
                    pinCode: "",
                  }}
                  validationSchema={Yup.object({
                    pinCode: Yup.string()
                      .matches(
                        /^[0-9]{6}$/,
                        "PIN code must be exactly 6 digits"
                      )
                      .required("PIN code is required"),
                  })}
                  onSubmit={handleSearch}
                >
                  {({ isSubmitting }) => (
                    <Form>

                      <div className="row align-items-start">

                        <div className="col-md-6 mb-3">

                          <label className="form-label fw-semibold">
                            Search by PIN Code
                          </label>

                          <Field
                            type="text"
                            name="pinCode"
                            className="form-control"
                            placeholder="Enter 6 digit PIN code"
                          />

                          <ErrorMessage
                            name="pinCode"
                            component="div"
                            className="text-danger small mt-1"
                          />

                        </div>

                        <div className="col-md-6 mt-md-4">

                          <button
                            type="submit"
                            className="btn btn-primary me-2"
                            disabled={isSubmitting}
                          >
                            {isSubmitting
                              ? "Searching..."
                              : "Search"}
                          </button>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleShowAll}
                          >
                            Show All
                          </button>

                        </div>

                      </div>

                    </Form>
                  )}
                </Formik>

              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="alert alert-warning">
                {errorMessage}
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-4">
                <div
                  className="spinner-border text-primary"
                  role="status"
                ></div>

                <p className="mt-2">
                  Loading vaccination centers...
                </p>
              </div>
            )}

            {/* Centers */}
            {!loading && centers.length > 0 && (
              <div className="row">

                {centers.map((center) => (
                  <div
                    className="col-md-6 col-lg-4 mb-4"
                    key={center.id}
                  >

                    <div className="card h-100 shadow-sm border-0">

                      <div className="card-body">

                        <div className="d-flex justify-content-between align-items-start mb-3">

                          <h5 className="card-title fw-bold">
                            {center.name}
                          </h5>

                          <span
                            className={`badge ${
                              center.status === "ACTIVE"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {center.status}
                          </span>

                        </div>

                        <p className="mb-2">
                          <strong>Address:</strong>{" "}
                          {center.address}
                        </p>

                        <p className="mb-2">
                          <strong>City:</strong>{" "}
                          {center.city}
                        </p>

                        <p className="mb-2">
                          <strong>State:</strong>{" "}
                          {center.state}
                        </p>

                        <p className="mb-2">
                          <strong>PIN Code:</strong>{" "}
                          {center.pin_code}
                        </p>

                        <p className="mb-2">
                          <strong>Vaccine:</strong>{" "}
                          {center.vaccine_name}
                        </p>

                        <p className="mb-2">
                          <strong>Available Slots:</strong>{" "}
                          {center.available_slots}
                        </p>

                        <p className="mb-3">
                          <strong>Contact:</strong>{" "}
                          {center.contact_number}
                        </p>

                        <button
                          className="btn btn-primary w-100"
                          disabled={
                            center.status !== "ACTIVE" ||
                            center.available_slots <= 0
                          }
                          onClick={() =>
                            handleBookNow(center)
                          }
                        >
                          {center.status !== "ACTIVE"
                            ? "Center Inactive"
                            : center.available_slots <= 0
                            ? "No Slots Available"
                            : "Book Vaccination"}
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

            {/* No centers */}
            {!loading && centers.length === 0 && !errorMessage && (
              <div className="card shadow-sm">
                <div className="card-body text-center py-5">

                  <h5>
                    No vaccination centers available
                  </h5>

                  <p className="text-muted mb-0">
                    Please try searching with another PIN code.
                  </p>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================================
            PROFILE SECTION
        ================================================== */}
        {activeSection === "profile" && (
          <div className="container">

            {/* Success message */}
            {profileMessage && (
              <div
                className={`alert ${
                  profileSuccess
                    ? "alert-success"
                    : "alert-danger"
                }`}
              >
                {profileMessage}
              </div>
            )}

            {/* Profile Header */}
            <div className="card shadow-sm border-0 mb-4 overflow-hidden">

              {/* Cover */}
              <div
                className="bg-primary"
                style={{ height: "140px" }}
              ></div>

              <div className="card-body position-relative pt-0">

                <div
                  className="rounded-circle bg-white shadow d-flex align-items-center justify-content-center"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginTop: "-50px",
                    fontSize: "40px",
                    fontWeight: "bold",
                    color: "#0d6efd",
                  }}
                >
                  {getInitial()}
                </div>

                <div className="mt-3">

                  <div className="d-flex justify-content-between align-items-center flex-wrap">

                    <div>
                      <h2 className="fw-bold mb-1">
                        {user?.name}
                      </h2>

                      <p className="text-muted mb-0">
                        {user?.email}
                      </p>
                    </div>

                    <span className="badge bg-success px-3 py-2 mt-2">
                      Active User
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Personal Information */}
            <div className="card shadow-sm border-0">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>
                    <h4 className="fw-bold mb-1">
                      Personal Information
                    </h4>

                    <p className="text-muted mb-0">
                      Your account information
                    </p>
                  </div>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setProfileMessage("");
                      setShowEditProfile(true);
                    }}
                  >
                    Edit Profile
                  </button>

                </div>

                <div className="row">

                  {/* User ID */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        User ID
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        {user?.id}
                      </h6>

                    </div>
                  </div>

                  {/* Name */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        Full Name
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        {user?.name}
                      </h6>

                    </div>
                  </div>

                  {/* Email */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        Email Address
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        {user?.email}
                      </h6>

                    </div>
                  </div>

                  {/* Phone */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        Phone Number
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        {user?.phone}
                      </h6>

                    </div>
                  </div>

                  {/* PIN */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        PIN Code
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        {user?.pinCode}
                      </h6>

                    </div>
                  </div>

                  {/* Account Type */}
                  <div className="col-md-6 mb-3">
                    <div className="bg-light rounded p-3">

                      <small className="text-muted">
                        Account Type
                      </small>

                      <h6 className="fw-bold mb-0 mt-1">
                        Vaccination Portal User
                      </h6>

                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* ==================================================
          BOOKING MODAL
      ================================================== */}
      {showBookingModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title fw-bold">
                  Book Vaccination
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowBookingModal(false)
                  }
                ></button>

              </div>

              <Formik
                initialValues={{
                  vaccinationDate: "",
                }}
                validationSchema={Yup.object({
                  vaccinationDate: Yup.date()
                    .required(
                      "Vaccination date is required"
                    )
                    .min(
                      new Date(),
                      "Vaccination date must be in the future"
                    ),
                })}
                onSubmit={handleBooking}
              >
                {({ isSubmitting }) => (
                  <Form>

                    <div className="modal-body">

                      {selectedCenter && (
                        <div className="alert alert-info">

                          <strong>
                            {selectedCenter.name}
                          </strong>

                          <br />

                          Vaccine:{" "}
                          {selectedCenter.vaccine_name}

                          <br />

                          Location:{" "}
                          {selectedCenter.city}

                        </div>
                      )}

                      {bookingMessage && (
                        <div
                          className={`alert ${
                            bookingSuccess
                              ? "alert-success"
                              : "alert-danger"
                          }`}
                        >
                          {bookingMessage}
                        </div>
                      )}

                      <div className="mb-3">

                        <label className="form-label fw-semibold">
                          Vaccination Date
                        </label>

                        <Field
                          type="date"
                          name="vaccinationDate"
                          className="form-control"
                        />

                        <ErrorMessage
                          name="vaccinationDate"
                          component="div"
                          className="text-danger small mt-1"
                        />

                      </div>

                    </div>

                    <div className="modal-footer">

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          setShowBookingModal(false)
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Booking..."
                          : "Confirm Booking"}
                      </button>

                    </div>

                  </Form>
                )}
              </Formik>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          EDIT PROFILE MODAL
      ================================================== */}
      {showEditProfile && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content">

              <div className="modal-header">

                <h5 className="modal-title fw-bold">
                  Edit Profile
                </h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setShowEditProfile(false)
                  }
                ></button>

              </div>

              <Formik
                initialValues={{
                  phone: user?.phone || "",
                  pinCode: user?.pinCode || "",
                }}
                enableReinitialize
                validationSchema={Yup.object({
                  phone: Yup.string()
                    .matches(
                      /^[0-9]{10}$/,
                      "Phone number must be exactly 10 digits"
                    )
                    .required(
                      "Phone number is required"
                    ),

                  pinCode: Yup.string()
                    .matches(
                      /^[0-9]{6}$/,
                      "PIN code must be exactly 6 digits"
                    )
                    .required(
                      "PIN code is required"
                    ),
                })}
                onSubmit={handleProfileUpdate}
              >
                {({ isSubmitting }) => (
                  <Form>

                    <div className="modal-body">

                      <div className="mb-3">

                        <label className="form-label fw-semibold">
                          Phone Number
                        </label>

                        <Field
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Enter phone number"
                        />

                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger small mt-1"
                        />

                      </div>

                      <div className="mb-3">

                        <label className="form-label fw-semibold">
                          PIN Code
                        </label>

                        <Field
                          type="text"
                          name="pinCode"
                          className="form-control"
                          placeholder="Enter PIN code"
                        />

                        <ErrorMessage
                          name="pinCode"
                          component="div"
                          className="text-danger small mt-1"
                        />

                      </div>

                    </div>

                    <div className="modal-footer">

                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() =>
                          setShowEditProfile(false)
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "Updating..."
                          : "Update Profile"}
                      </button>

                    </div>

                  </Form>
                )}
              </Formik>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default UserDashboard;