import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { isAuthenticated } from '@/auth';

import { Page } from '@/pages/enums';

export const ProtectedRoute: React.FC = () => {
    return isAuthenticated() ? <Outlet /> : <Navigate to={Page.Login} replace />;
};
