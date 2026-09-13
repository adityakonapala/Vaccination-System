import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VaccinationCenters from "./admin/VaccinationCenters";
import Users from "./admin/Users";
import AllBookings from "./admin/AllBookings"

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("centers");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-vh-100">

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary px-4">

        <span className="navbar-brand fw-bold">
          Admin Dashboard
        </span>

        <div className="d-flex align-items-center">

          <button
            className={`btn me-2 ${
              activeSection === "centers"
                ? "btn-light"
                : "btn-outline-light"
            }`}
            onClick={() => setActiveSection("centers")}
          >
            Vaccination Centers
          </button>

          <button
            className={`btn me-2 ${
              activeSection === "users"
                ? "btn-light"
                : "btn-outline-light"
            }`}
            onClick={() => setActiveSection("users")}
          >
            Users
          </button>

          <button
            className={`btn me-3 ${
              activeSection === "bookings"
                ? "btn-light"
                : "btn-outline-light"
            }`}
            onClick={() => setActiveSection("bookings")}
          >
            All Bookings
          </button>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* Page Content */}
      <div className="container-fluid mt-4 px-4">

        {activeSection === "centers" && (
          <VaccinationCenters />
        )}

        {activeSection === "users" && (
          <Users />
        )}

        {activeSection === "bookings" && (
          <AllBookings />
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;