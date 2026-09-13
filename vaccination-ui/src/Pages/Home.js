import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container-fluid p-0">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4">
        <Link className="navbar-brand fw-bold" to="/">
          Vaccination Portal
        </Link>

        <div className="ms-auto">
          <Link
            className="btn btn-light me-2"
            to="/user-login"
          >
            User Login
          </Link>

          <Link
            className="btn btn-light me-2"
            to="/register"
          >
            User Register
          </Link>

          <Link
            className="btn btn-warning"
            to="/admin-login"
          >
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Landing Page Content */}
      <div className="container text-center mt-5">

        <h1 className="display-4 fw-bold">
          Welcome to Vaccination Portal
        </h1>

        <p className="lead mt-3">
          Book your vaccination slot easily and securely.
        </p>

        <div className="mt-4">
          <Link
            to="/user-login"
            className="btn btn-primary btn-lg me-3"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="btn btn-outline-primary btn-lg"
          >
            Register
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Home;