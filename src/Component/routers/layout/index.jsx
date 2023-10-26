import React, { Suspense, useState } from "react";
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { isAuthenticated } from "../utils";
import '../../../Component/routers/layout/LayOut.css'
import Navbar from "../../Headers/Navbar";

const { Header } = Layout;

const LayOut = ({ children }) => {
    const location = useLocation();

    return (
        <>
            {isAuthenticated() && <Navbar />}
            <Suspense fallback={''}>
                {children}
            </Suspense>
        </>
    )
}

export default LayOut;
