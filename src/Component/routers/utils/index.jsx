import React from 'react';
import Cookies from 'universal-cookie';
import { Navigate } from 'react-router-dom';

const cookies = new Cookies();


export const getAccessToken = () => cookies.get('token');
export const isAuthenticated = () => !!getAccessToken();

export default function CheckRoute({ authenticationPath, outlet, publicType }) {
    if (publicType ? !isAuthenticated() : isAuthenticated()) {
        return outlet;
    } else {
        return <Navigate to={{ pathname: authenticationPath }} />;
    }
}