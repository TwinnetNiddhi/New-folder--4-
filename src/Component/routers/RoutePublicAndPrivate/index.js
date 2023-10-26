import React, { useEffect, useState } from "react";
import { Routes } from 'react-router-dom';
import RouteHandler from "../RouteHandler";
import { privateRoute, publicRoute } from "../index";
import { Route } from 'react-router-dom';
import PageNotFound from "../../PageNotFound/PageNotFound";
import { useSelector } from "react-redux";


const RoutePublicAndPrivate = () => {
    const PerMissionRoleType = useSelector((state) => state?.authReducer?.PATH);
    const PerMissionRoleType_login_Type = useSelector((state) => state?.authReducer?.type);
    const [rolePermissition, setRolePermissition] = useState([]);
    const [pathMatch,setPathMatch] = useState()

    useEffect(() => {
        let roleData = [];
        let RouterPathAll = []
        PerMissionRoleType?.map((element) => {
            RouterPathAll.push(element?.routerPath)
            element?.type?.map((rowData) => {
                roleData.push(rowData?.roleType);
            });
        });
        setRolePermissition(roleData);
        setPathMatch(RouterPathAll)
    }, [PerMissionRoleType]);

    let authProps = {
        authenticationPath: "/",
        publicType: false,
        outlet: <></>,
    };
    let publicAuthProps = {
        outlet: <></>,
        publicType: true,
        authenticationPath: "/dashboard",
    };

    const userRole1 = PerMissionRoleType_login_Type;

    return (
        <Routes>
            {RouteHandler({
                routes: publicRoute,
                authProps: publicAuthProps,
            })}
            {RouteHandler({
                routes: privateRoute(userRole1, PerMissionRoleType, rolePermissition,pathMatch),
                authProps: authProps,
                userRole: userRole1,
            })}
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default RoutePublicAndPrivate;