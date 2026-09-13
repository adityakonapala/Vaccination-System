import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import UserLogin from "./Pages/UserLogin";
import UserDashboard from "./Pages/UserDashboard";
import UserRegister from "./Pages/UserRegister";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

         <Route path="/admin-login" element={<AdminLogin />}/>
         
         <Route path="/admin-dashboard" element={<AdminDashboard />}/>

         <Route path="/user-login" element={<UserLogin />}/>
         <Route path="/user-dashboard" element={<UserDashboard />}/>
         <Route path="/register" element={<UserRegister />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;