// ProtectedRoutes.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoutes = ({ isAuth }) => {
  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoutes;
