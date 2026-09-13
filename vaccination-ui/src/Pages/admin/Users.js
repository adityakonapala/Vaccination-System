import React, { useEffect, useState } from "react";
import axios from "axios";

function Users() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET ALL USERS
  // ==========================================

  const fetchUsers = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:5000/api/admin/users"
      );

      if (response.data.success) {

        setUsers(response.data.data);

      } else {

        setError(response.data.message);

      }

    } catch (error) {

      console.error("Error fetching users:", error);

      setError(
        error.response?.data?.message ||
        "Unable to fetch users"
      );

    } finally {

      setLoading(false);

    }
  };

  // ==========================================
  // FETCH USERS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // ==========================================
  // UI
  // ==========================================

  return (

    <div>

      {/* Heading */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2 className="fw-bold">
          All Users
        </h2>

        <button
          className="btn btn-primary"
          onClick={fetchUsers}
        >
          Refresh
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


      {/* Users Table */}

      <div className="card shadow-sm">

        <div className="card-body">

          {loading ? (

            // Loading

            <div className="text-center py-4">

              <div
                className="spinner-border text-primary"
                role="status"
              >
              </div>

              <p className="mt-2">
                Loading users...
              </p>

            </div>

          ) : users.length === 0 ? (

            // No users

            <div className="alert alert-info mb-0">
              No users found.
            </div>

          ) : (

            // Table

            <div className="table-responsive">

              <table className="table table-bordered table-hover align-middle">

                <thead className="table-primary">

                  <tr>

                    <th>ID</th>

                    <th>Name</th>

                    <th>Email</th>

                    <th>Phone</th>

                    <th>Pin Code</th>

                    <th>Registered Date</th>

                  </tr>

                </thead>


                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td>
                        {user.id}
                      </td>

                      <td>
                        {user.name}
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.phone}
                      </td>

                      <td>
                        {user.pin_code}
                      </td>

                      <td>
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
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

export default Users;