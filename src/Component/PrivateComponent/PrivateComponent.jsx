import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'universal-cookie';

const PrivateComponent = () => {
  const cookies = new Cookies();
  const auth = cookies.get('token');
  const location = useLocation();

  useEffect(() => {
    if (!auth) {
      cookies.remove('token', { path: '/' });
    }
  }, [auth, location.pathname]);

  if (!auth) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default PrivateComponent;
