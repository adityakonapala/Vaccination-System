import React, { useEffect, useState } from "react";
import axios from "axios";

function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // GET ALL BOOKINGS
  // ==========================================
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await axios.get(
        "http://localhost:5000/api/admin/vaccinations"
      );

      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to fetch bookings"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD BOOKINGS WHEN PAGE OPENS
  // ==========================================
  useEffect(() => {
    fetchBookings();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================
  const formatDateTime = (dateString) => {
    if (!dateString) {
      return "-";
    }

    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // UPDATE VACCINATION STATUS
  // ==========================================
  const handleComplete = async (bookingId) => {
    const confirmUpdate = window.confirm(
      "Are you sure you want to mark this vaccination as COMPLETED?"
    );

    if (!confirmUpdate) {
      return;
    }

    try {
      setActionLoading(bookingId);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await axios.put(
        `http://localhost:5000/api/vaccinations/${bookingId}/status`,
        {
          status: "COMPLETED",
        }
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            "Vaccination marked as completed"
        );

        // Refresh bookings
        await fetchBookings();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to update vaccination status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // CANCEL VACCINATION
  // ==========================================
  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this vaccination booking?"
    );

    if (!confirmCancel) {
      return;
    }

    try {
      setActionLoading(bookingId);
      setErrorMessage("");
      setSuccessMessage("");

      const response = await axios.delete(
        `http://localhost:5000/api/vaccinations/${bookingId}`
      );

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            "Vaccination cancelled successfully"
        );

        // Refresh bookings
        await fetchBookings();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to cancel vaccination"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div>

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

        <div>
          <h3 className="fw-bold mb-1">
            All Bookings
          </h3>

          <p className="text-muted mb-0">
            Manage all vaccination bookings
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={fetchBookings}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </div>

      {/* ==========================================
          SUCCESS MESSAGE
      ========================================== */}
      {successMessage && (
        <div className="alert alert-success alert-dismissible">
          {successMessage}

          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccessMessage("")}
          ></button>
        </div>
      )}

      {/* ==========================================
          ERROR MESSAGE
      ========================================== */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible">
          {errorMessage}

          <button
            type="button"
            className="btn-close"
            onClick={() => setErrorMessage("")}
          ></button>
        </div>
      )}

      {/* ==========================================
          LOADING
      ========================================== */}
      {loading && (
        <div className="text-center py-5">

          <div
            className="spinner-border text-primary"
            role="status"
          ></div>

          <p className="text-muted mt-2">
            Loading bookings...
          </p>

        </div>
      )}

      {/* ==========================================
          BOOKINGS TABLE
      ========================================== */}
      {!loading && bookings.length > 0 && (
        <div className="card shadow-sm border-0">

          <div className="card-body">

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-primary">

                  <tr>
                    <th>Booking ID</th>
                    <th>User</th>
                    <th>Email</th>
                    <th>Center</th>
                    <th>Vaccine</th>
                    <th>Vaccination Date</th>
                    <th>Status</th>
                    <th>Booked On</th>
                    <th>Actions</th>
                  </tr>

                </thead>

                <tbody>

                  {bookings.map((booking) => (

                    <tr key={booking.id}>

                      {/* Booking ID */}
                      <td>
                        <strong>
                          #{booking.id}
                        </strong>
                      </td>

                      {/* User */}
                      <td>
                        {booking.user_name}
                      </td>

                      {/* Email */}
                      <td>
                        {booking.email}
                      </td>

                      {/* Center */}
                      <td>
                        {booking.center_name}
                      </td>

                      {/* Vaccine */}
                      <td>
                        <span className="badge bg-info text-dark">
                          {booking.vaccine_name}
                        </span>
                      </td>

                      {/* Vaccination Date */}
                      <td>
                        {formatDate(
                          booking.vaccination_date
                        )}
                      </td>

                      {/* Status */}
                      <td>
                        <span
                          className={`badge ${
                            booking.status === "BOOKED"
                              ? "bg-success"
                              : booking.status === "COMPLETED"
                              ? "bg-primary"
                              : booking.status === "CANCELLED"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      {/* Created At */}
                      <td>
                        <small className="text-muted">
                          {formatDateTime(
                            booking.created_at
                          )}
                        </small>
                      </td>

                      {/* Actions */}
                      <td>

                        {booking.status === "BOOKED" ? (

                          <div className="d-flex gap-2">

                            {/* Complete */}
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() =>
                                handleComplete(
                                  booking.id
                                )
                              }
                              disabled={
                                actionLoading ===
                                booking.id
                              }
                            >
                              {actionLoading ===
                              booking.id
                                ? "Processing..."
                                : "Complete"}
                            </button>

                            {/* Cancel */}
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() =>
                                handleCancel(
                                  booking.id
                                )
                              }
                              disabled={
                                actionLoading ===
                                booking.id
                              }
                            >
                              Cancel
                            </button>

                          </div>

                        ) : (

                          <span className="text-muted small">
                            No actions
                          </span>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      )}

      {/* ==========================================
          NO BOOKINGS
      ========================================== */}
      {!loading &&
        bookings.length === 0 &&
        !errorMessage && (
          <div className="card shadow-sm border-0">

            <div className="card-body text-center py-5">

              <h5 className="fw-bold">
                No Bookings Found
              </h5>

              <p className="text-muted mb-0">
                No vaccination bookings are available.
              </p>

            </div>

          </div>
        )}

      {/* ==========================================
          TOTAL BOOKINGS
      ========================================== */}
      {!loading && bookings.length > 0 && (
        <div className="mt-3 text-muted">
          Total Bookings:{" "}
          <strong>{bookings.length}</strong>
        </div>
      )}

    </div>
  );
}

export default AllBookings;