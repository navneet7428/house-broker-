import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Houses from "./pages/Houses";
import HouseDetails from "./pages/HouseDetails";
import AddHouse from "./pages/AddHouse";
import MyHouses from "./pages/MyHouses";
import EditHouse from "./pages/EditHouse";
import AdminPendingHouses from "./pages/AdminPendingHouses";
import Wishlist from "./pages/Wishlist";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/houses"
          element={
            <ProtectedRoute>
              <Houses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/houses/:id"
          element={
            <ProtectedRoute>
              <HouseDetails />
            </ProtectedRoute>
          }
        />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route
          path="/add-house"
          element={
            <ProtectedRoute>
              <AddHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-houses"
          element={
            <ProtectedRoute>
              <MyHouses />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-house/:id"
          element={
            <ProtectedRoute>
              <EditHouse />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/pending"
          element={
            <AdminRoute>
              <AdminPendingHouses />
            </AdminRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;