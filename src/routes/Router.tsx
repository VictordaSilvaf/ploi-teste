import { FC } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/login/login";
import Registration from "../pages/registration/registration";
import ForgotPassword from "../pages/forgot-password/forgotPassword";
import Dashboard from "../pages/dashboard/dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Opportunity from "../pages/opportunity/Opportunity";
import Settings from "../pages/settings/settings";
import Contact from "../pages/contact/contact";
import ProfileUser from "../pages/profile/profile";
import Password from "../pages/password/password";
import Notes from "../pages/notes";
import Tasks from "../pages/tasks";
import { Toaster } from "react-hot-toast";
import NotesNew from "../pages/notesNew";

const AppRoutes: FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/sign-up" element={<Registration />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/opportunity"
          element={
            <ProtectedRoute>
              <Opportunity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/contact"
          element={
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          }
        />

        <Route path="/profile/profile-user" element={<ProfileUser />} />

        <Route
          path="/profile/password"
          element={
            <ProtectedRoute>
              <Password />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes"
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notes/:id"
          element={
            <ProtectedRoute>
              <NotesNew />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
