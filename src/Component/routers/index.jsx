import { lazy } from "react";
import Project from '../../Component/Preferences/Project/Project'
import Dashboard from '../../Component/Dashboard/Dashboard'
import Users from '../../Component/Preferences/Users/Users'
import AppAnalytic from '../../Component/Preferences/AppAnalytic/AppAnalytic'
import CustomStoreListing from '../../Component/Preferences/CustomStoreListing/CustomStoreListing'
import BasicGraph from '../../Component/Preferences/BasicGraph/BasicGraph'
import ForgetPassword from '../../Component/Auth/ForgetPassword/ForgetPassword'
import ChangesPassword from '../../Component/Auth/ChangesPassword/ChangesPassword'
import BackendRoutes from '../../Component/Scheduled/backendRoutes/BackendRoutes'
import MainMenu from '../../Component/Scheduled/mainMenu/MainMenu'
import SubMenu from '../../Component/Scheduled/subMenu/SubMenu'
import MainMenuGroup from '../../Component/Scheduled/mainMenuGroup/MainMenuGroup'

import Maincategory from "../SubSetting/MainCategory/Maincategory";
import Category from "../SubSetting/Category/Category";
import Subcategory from "../SubSetting/SubCategory/Subcategory";
import Role from "../SubSetting/Role/Role";
import Device from "../SubSetting/Device/Device";
import Tier from "../SubSetting/Tier/Tier";
import Tiercontinent from "../SubSetting/TierContienent/Tiercontinent";
import Tiercontry from "../SubSetting/TierCountry/Tiercontry";

// login 
const LoginForm = lazy(() => import("../../Component/Auth/Login/LoginForm"));
const SignUpForm = lazy(() => import("../../Component/Auth/SignUpForm/SignUpForm"));

export const publicRoute = [
    { path: '/', component: LoginForm, title: 'LoginForm' },
    { path: '/signup', component: SignUpForm, title: 'SignUpForm' },
    { path: '/forget-password', component: ForgetPassword, title: 'ForgetPassword' },
];

export const privateRoute = (userRole1, PerMissionRoleType, rolePermissition,pathMatch) => {
    const filteredRoutes = rolePermissition
        .filter((role) => role === userRole1) // Filter routes based on user role
        .map((role) => {
            const MatchPath = [
                { path: '/project', component: Project, title: 'Project', roleType: role },
                { path: '/dashboard', component: Dashboard, title: 'Dashboard', roleType: role },
                { path: '/users', component: Users, title: 'Users', roleType: role },
                { path: '/basic-graph', component: BasicGraph, title: 'basic graph', roleType: role },
                { path: '/app-analytic', component: AppAnalytic, title: 'AppAnalytic', roleType: role },
                { path: '/custom-store-listing', component: CustomStoreListing, title: 'custom-store-listing', roleType: role },
                { path: '/changes-password', component: ChangesPassword, title: 'changes-password', roleType: role },
                { path: '/backend-routes', component: BackendRoutes, title: 'backend-routes', roleType: role },
                { path: '/main-Menu', component: MainMenu, title: 'main-Menu', roleType: role },
                { path: '/sub-Menu', component: SubMenu, title: 'sub-Menu', roleType: role },
                { path: '/main-menu-group', component: MainMenuGroup, title: 'Main-Menu-Group', roleType: role },
                { path: '/maincategory', component: Maincategory, title: 'maincategory',roleType: role },
                { path: '/category', component: Category, title: 'category',roleType: role },
                { path: '/sub-category', component: Subcategory, title: 'sub-category',roleType: role },
                { path: '/role', component: Role, title: 'role',roleType: role },
                { path: '/device', component: Device, title: 'device',roleType: role },
                { path: '/tier', component: Tier, title: 'tier',roleType: role },
                { path: '/continent', component: Tiercontinent, title: 'continent',roleType: role },
                { path: '/country', component: Tiercontry, title: 'country',roleType: role },
            ];
            const allData = MatchPath?.filter(element => {
                return pathMatch.includes(element?.path)
            });
            return allData
        }
        )
        .flat();

    return filteredRoutes;
};

