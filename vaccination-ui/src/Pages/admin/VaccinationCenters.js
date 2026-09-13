import React, { useEffect, useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

function VaccinationCenters() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [editingCenter, setEditingCenter] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // GET ALL CENTERS
  // ==========================================

  const fetchCenters = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/admin/centers"
      );

      if (response.data.success) {
        setCenters(response.data.data);
      } else {
        setError(response.data.message);
      }

    } catch (error) {
      console.error("Error fetching centers:", error);

      setError(
        error.response?.data?.message ||
        "Unable to fetch vaccination centers"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch centers when component loads
  useEffect(() => {
    fetchCenters();
  }, []);

  // ==========================================
  // CREATE CENTER - FORMIK
  // ==========================================

  const createFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      pinCode: "",
      contactNumber: "",
      vaccineName: "",
      availableSlots: "",
      status: "ACTIVE",
    },

    validationSchema: Yup.object({
      name: Yup.string()
        .required("Center name is required"),

      address: Yup.string()
        .required("Address is required"),

      city: Yup.string()
        .required("City is required"),

      state: Yup.string()
        .required("State is required"),

      pinCode: Yup.string()
        .required("Pin code is required"),

      contactNumber: Yup.string()
        .required("Contact number is required"),

      vaccineName: Yup.string()
        .required("Vaccine name is required"),

      availableSlots: Yup.number()
        .required("Available slots are required")
        .min(0, "Slots cannot be negative"),

      status: Yup.string()
        .required("Status is required"),
    }),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        setError("");
        setMessage("");

        const response = await axios.post(
          "http://localhost:5000/api/admin/centers",
          {
            name: values.name,
            address: values.address,
            city: values.city,
            state: values.state,
            pinCode: values.pinCode,
            contactNumber: values.contactNumber,
            vaccineName: values.vaccineName,
            availableSlots: Number(values.availableSlots),
            status: values.status,
          }
        );

        if (response.data.success) {
          setMessage(response.data.message);

          resetForm();
          setShowCreateForm(false);

          // Refresh table
          fetchCenters();
        } else {
          setError(response.data.message);
        }

      } catch (error) {
        console.error("Create center error:", error);

        setError(
          error.response?.data?.message ||
          "Unable to create vaccination center"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // UPDATE CENTER - FORMIK
  // ==========================================

  const updateFormik = useFormik({
    enableReinitialize: true,

    initialValues: {
      availableSlots:
        editingCenter?.available_slots ?? "",

      status:
        editingCenter?.status ?? "ACTIVE",
    },

    validationSchema: Yup.object({
      availableSlots: Yup.number()
        .required("Available slots are required")
        .min(0, "Slots cannot be negative"),

      status: Yup.string()
        .required("Status is required"),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      try {
        setError("");
        setMessage("");

        const response = await axios.put(
          `http://localhost:5000/api/admin/centers/${editingCenter.id}`,
          {
            availableSlots: Number(values.availableSlots),
            status: values.status,
          }
        );

        if (response.data.success) {
          setMessage(response.data.message);

          setEditingCenter(null);

          // Refresh table
          fetchCenters();
        } else {
          setError(response.data.message);
        }

      } catch (error) {
        console.error("Update center error:", error);

        setError(
          error.response?.data?.message ||
          "Unable to update vaccination center"
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ==========================================
  // DELETE CENTER
  // ==========================================

  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this vaccination center?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await axios.delete(
        `http://localhost:5000/api/admin/centers/${id}`
      );

      if (response.data.success) {
        setMessage(response.data.message);

        // Refresh table
        fetchCenters();
      } else {
        setError(response.data.message);
      }

    } catch (error) {
      console.error("Delete center error:", error);

      setError(
        error.response?.data?.message ||
        "Unable to delete vaccination center"
      );
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div>

      {/* Heading */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">
          Vaccination Centers
        </h2>

        <button
          className="btn btn-success"
          onClick={() => {
            setShowCreateForm(!showCreateForm);
            setEditingCenter(null);
            setError("");
            setMessage("");
          }}
        >
          {showCreateForm
            ? "Close Form"
            : "+ Create New Center"}
        </button>

      </div>

      {/* Success Message */}
      {message && (
        <div className="alert alert-success">
          {message}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      {/* ======================================
          CREATE CENTER FORM
          ====================================== */}

      {showCreateForm && (

        <div className="card shadow-sm mb-4">

          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              Create New Vaccination Center
            </h5>
          </div>

          <div className="card-body">

            <form onSubmit={createFormik.handleSubmit}>

              <div className="row">

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Center Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    className={`form-control ${
                      createFormik.touched.name &&
                      createFormik.errors.name
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.name}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter center name"
                  />

                  {createFormik.touched.name &&
                    createFormik.errors.name && (
                      <div className="invalid-feedback">
                        {createFormik.errors.name}
                      </div>
                  )}
                </div>

                {/* Address */}
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    className={`form-control ${
                      createFormik.touched.address &&
                      createFormik.errors.address
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.address}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter address"
                  />

                  {createFormik.touched.address &&
                    createFormik.errors.address && (
                      <div className="invalid-feedback">
                        {createFormik.errors.address}
                      </div>
                  )}
                </div>

                {/* City */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    City
                  </label>

                  <input
                    type="text"
                    name="city"
                    className={`form-control ${
                      createFormik.touched.city &&
                      createFormik.errors.city
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.city}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter city"
                  />

                  {createFormik.touched.city &&
                    createFormik.errors.city && (
                      <div className="invalid-feedback">
                        {createFormik.errors.city}
                      </div>
                  )}
                </div>

                {/* State */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    State
                  </label>

                  <input
                    type="text"
                    name="state"
                    className={`form-control ${
                      createFormik.touched.state &&
                      createFormik.errors.state
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.state}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter state"
                  />

                  {createFormik.touched.state &&
                    createFormik.errors.state && (
                      <div className="invalid-feedback">
                        {createFormik.errors.state}
                      </div>
                  )}
                </div>

                {/* Pin Code */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Pin Code
                  </label>

                  <input
                    type="text"
                    name="pinCode"
                    className={`form-control ${
                      createFormik.touched.pinCode &&
                      createFormik.errors.pinCode
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.pinCode}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter pin code"
                  />

                  {createFormik.touched.pinCode &&
                    createFormik.errors.pinCode && (
                      <div className="invalid-feedback">
                        {createFormik.errors.pinCode}
                      </div>
                  )}
                </div>

                {/* Contact Number */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Contact Number
                  </label>

                  <input
                    type="text"
                    name="contactNumber"
                    className={`form-control ${
                      createFormik.touched.contactNumber &&
                      createFormik.errors.contactNumber
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.contactNumber}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter contact number"
                  />

                  {createFormik.touched.contactNumber &&
                    createFormik.errors.contactNumber && (
                      <div className="invalid-feedback">
                        {createFormik.errors.contactNumber}
                      </div>
                  )}
                </div>

                {/* Vaccine Name */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Vaccine Name
                  </label>

                  <input
                    type="text"
                    name="vaccineName"
                    className={`form-control ${
                      createFormik.touched.vaccineName &&
                      createFormik.errors.vaccineName
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.vaccineName}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="e.g. Covishield"
                  />

                  {createFormik.touched.vaccineName &&
                    createFormik.errors.vaccineName && (
                      <div className="invalid-feedback">
                        {createFormik.errors.vaccineName}
                      </div>
                  )}
                </div>

                {/* Available Slots */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Available Slots
                  </label>

                  <input
                    type="number"
                    name="availableSlots"
                    className={`form-control ${
                      createFormik.touched.availableSlots &&
                      createFormik.errors.availableSlots
                        ? "is-invalid"
                        : ""
                    }`}
                    value={createFormik.values.availableSlots}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                    placeholder="Enter slots"
                  />

                  {createFormik.touched.availableSlots &&
                    createFormik.errors.availableSlots && (
                      <div className="invalid-feedback">
                        {createFormik.errors.availableSlots}
                      </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={createFormik.values.status}
                    onChange={createFormik.handleChange}
                    onBlur={createFormik.handleBlur}
                  >
                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>
                </div>

              </div>

              <button
                type="submit"
                className="btn btn-success"
                disabled={createFormik.isSubmitting}
              >
                {createFormik.isSubmitting
                  ? "Creating..."
                  : "Create Center"}
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ======================================
          UPDATE FORM
          ====================================== */}

      {editingCenter && (

        <div className="card shadow-sm mb-4">

          <div className="card-header bg-warning">
            <h5 className="mb-0">
              Update Center: {editingCenter.name}
            </h5>
          </div>

          <div className="card-body">

            <form onSubmit={updateFormik.handleSubmit}>

              <div className="row">

                {/* Available Slots */}
                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Available Slots
                  </label>

                  <input
                    type="number"
                    name="availableSlots"
                    className={`form-control ${
                      updateFormik.touched.availableSlots &&
                      updateFormik.errors.availableSlots
                        ? "is-invalid"
                        : ""
                    }`}
                    value={updateFormik.values.availableSlots}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                  />

                  {updateFormik.touched.availableSlots &&
                    updateFormik.errors.availableSlots && (
                      <div className="invalid-feedback">
                        {updateFormik.errors.availableSlots}
                      </div>
                  )}

                </div>

                {/* Status */}
                <div className="col-md-4 mb-3">

                  <label className="form-label">
                    Status
                  </label>

                  <select
                    name="status"
                    className="form-select"
                    value={updateFormik.values.status}
                    onChange={updateFormik.handleChange}
                    onBlur={updateFormik.handleBlur}
                  >
                    <option value="ACTIVE">
                      ACTIVE
                    </option>

                    <option value="INACTIVE">
                      INACTIVE
                    </option>
                  </select>

                </div>

              </div>

              <button
                type="submit"
                className="btn btn-warning me-2"
                disabled={updateFormik.isSubmitting}
              >
                {updateFormik.isSubmitting
                  ? "Updating..."
                  : "Update Center"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setEditingCenter(null)}
              >
                Cancel
              </button>

            </form>

          </div>

        </div>
      )}

      {/* ======================================
          CENTERS TABLE
          ====================================== */}

      <div className="card shadow-sm">

        <div className="card-body">

          {loading ? (

            <div className="text-center py-4">
              <div
                className="spinner-border text-primary"
                role="status"
              >
              </div>

              <p className="mt-2">
                Loading vaccination centers...
              </p>
            </div>

          ) : centers.length === 0 ? (

            <div className="alert alert-info">
              No vaccination centers found.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-primary">

                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Pin Code</th>
                    <th>Contact</th>
                    <th>Vaccine</th>
                    <th>Slots</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {centers.map((center) => (

                    <tr key={center.id}>

                      <td>{center.id}</td>

                      <td>{center.name}</td>

                      <td>{center.address}</td>

                      <td>{center.city}</td>

                      <td>{center.state}</td>

                      <td>{center.pin_code}</td>

                      <td>{center.contact_number}</td>

                      <td>{center.vaccine_name}</td>

                      <td>{center.available_slots}</td>

                      <td>
                        <span
                          className={`badge ${
                            center.status === "ACTIVE"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {center.status}
                        </span>
                      </td>

                      <td>

                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            setEditingCenter(center);
                            setShowCreateForm(false);
                            setMessage("");
                            setError("");
                          }}
                        >
                          Update
                        </button>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDelete(center.id)
                          }
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default VaccinationCenters;