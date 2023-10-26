import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import * as AntIcons from '@ant-design/icons';
import { Tooltip } from 'antd';
import { AccessAllData } from '../Redux/auth/action';
import CustomMessage from '../CustomMessage/CustomMessage';
import Header from './Header';

const MainSidebarMenu = () => {
    const [accessFiledAdd, setAccessFiledAdd] = useState([]);
    const [acessSidebarTable, setAcessSidebarTable] = useState([]);
    const data_Name_type = useSelector(state => state?.authReducer?.type)
    const [allMenuName, setAllMenuName] = useState()
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const dispatch = useDispatch()

    // const handleArrowClick = () => {
    //     setIsMenuClosed(!isMenuClosed);
    //     setIsArrowRight(!isArrowRight);
    //     setIsMainDashboardExpanded(!isMainDashboardExpanded);
    //   };

    useEffect(() => {
        AllModuleAccessGetEventCall()
    }, [])

    const AllModuleAccessGetEventCall = async () => {
        try {
            await dispatch(AccessAllData(setAccessFiledAdd, setAcessSidebarTable, data_Name_type));
        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
        }
    }

    const handleIconClick = (row) => {
        setSelectedMenuItem(row);
        setAllMenuName(row.menuName)
    };

    return (
        <>
            <div className="col-lg-1 nav-col header-custom-col d-none d-lg-block">
                {/* <!-- left nav panel --> */}
                <div className="left-nav">
                    {/* <div className="arrow"><i className="ri-arrow-left-s-line"></i></div> */}
                    <div className={`arrow`} >
                        <i className="ri-arrow-left-s-line"></i>
                    </div>
                    <div className="top">
                        <Link to="" className="brand">
                            <img src={require('../../Component/App_Details_theme/images/t-logo.png')} alt="Logo" className="t-logo" />
                        </Link>
                        <div className="line"></div>
                        <div className="menu">
                            <ul className="w-100 d-flex flex-column align-items-center">
                                {accessFiledAdd?.map((row, i) => {
                                    const IconComponent = AntIcons[row?.iconName];
                                    return (
                                        row?.type?.map((element, j) => {
                                            const shouldRenderButton = data_Name_type === element?.roleType;
                                            return shouldRenderButton ? (
                                                <li key={j}>
                                                    <NavLink
                                                        to={row?.routerPath ? row?.routerPath : '#'}
                                                        onClick={() => handleIconClick(row)}
                                                        className={`${allMenuName === row?.menuName ? 'active' : ''}`}
                                                    >
                                                        <span className='icon'>
                                                            <Tooltip title={row?.menuName} placement="right">
                                                                {IconComponent && <IconComponent />}
                                                            </Tooltip>
                                                        </span>
                                                    </NavLink>
                                                </li>
                                            ) : null;
                                        })
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="bottom">
                        <ul>
                            <li>
                                <a href="">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <g clipPath="url(#clip0_83_371)">
                                                <path d="M23.0564 15.0494L21.3019 13.5494C21.3849 13.0405 21.4278 12.5209 21.4278 12.0012C21.4278 11.4816 21.3849 10.9619 21.3019 10.453L23.0564 8.953C23.1887 8.83972 23.2834 8.68883 23.3279 8.52041C23.3724 8.35199 23.3646 8.17401 23.3055 8.01015L23.2814 7.9405C22.7984 6.59057 22.0751 5.33917 21.1465 4.24675L21.0983 4.1905C20.9857 4.05805 20.8356 3.96284 20.6677 3.91742C20.4999 3.87199 20.3222 3.87848 20.1582 3.93604L17.9805 4.71015C17.1769 4.05122 16.2796 3.53157 15.3099 3.16729L14.8894 0.890503C14.8577 0.719187 14.7746 0.561581 14.6511 0.438622C14.5277 0.315663 14.3698 0.233173 14.1983 0.20211L14.126 0.188717C12.7305 -0.0630685 11.2626 -0.0630685 9.86708 0.188717L9.79476 0.20211C9.62332 0.233173 9.46539 0.315663 9.34196 0.438622C9.21852 0.561581 9.13542 0.719187 9.10369 0.890503L8.68048 3.178C7.71857 3.54236 6.8228 4.06173 6.02869 4.7155L3.83494 3.93604C3.67092 3.87803 3.49313 3.8713 3.32519 3.91675C3.15726 3.9622 3.00713 4.05768 2.89476 4.1905L2.84655 4.24675C1.91908 5.33994 1.19595 6.59114 0.711724 7.9405L0.687617 8.01015C0.567081 8.34497 0.666188 8.71997 0.936724 8.953L2.71262 10.4691C2.62958 10.9726 2.5894 11.4869 2.5894 11.9985C2.5894 12.5128 2.62958 13.0271 2.71262 13.528L0.936724 15.0441C0.804391 15.1574 0.709679 15.3082 0.665181 15.4767C0.620684 15.6451 0.628509 15.8231 0.687617 15.9869L0.711724 16.0566C1.19655 17.4066 1.9144 18.6521 2.84655 19.7503L2.89476 19.8066C3.00741 19.939 3.15754 20.0342 3.32537 20.0797C3.49321 20.1251 3.67087 20.1186 3.83494 20.061L6.02869 19.2816C6.8269 19.9378 7.71887 20.4575 8.68048 20.8191L9.10369 23.1066C9.13542 23.2779 9.21852 23.4355 9.34196 23.5585C9.46539 23.6814 9.62332 23.7639 9.79476 23.795L9.86708 23.8084C11.2754 24.0615 12.7177 24.0615 14.126 23.8084L14.1983 23.795C14.3698 23.7639 14.5277 23.6814 14.6511 23.5585C14.7746 23.4355 14.8577 23.2779 14.8894 23.1066L15.3099 20.8298C16.2792 20.4665 17.1816 19.9451 17.9805 19.2869L20.1582 20.061C20.3222 20.1191 20.5 20.1258 20.6679 20.0803C20.8358 20.0349 20.986 19.9394 21.0983 19.8066L21.1465 19.7503C22.0787 18.6494 22.7965 17.4066 23.2814 16.0566L23.3055 15.9869C23.426 15.6575 23.3269 15.2825 23.0564 15.0494ZM19.4001 10.7691C19.4671 11.1735 19.5019 11.5887 19.5019 12.0039C19.5019 12.4191 19.4671 12.8343 19.4001 13.2387L19.2233 14.3128L21.2242 16.0244C20.9209 16.7232 20.538 17.3848 20.0832 17.9959L17.5974 17.1146L16.7564 17.8057C16.1162 18.3307 15.4037 18.7432 14.6323 19.0325L13.6117 19.4155L13.1323 22.0137C12.3758 22.0994 11.612 22.0994 10.8555 22.0137L10.376 19.4101L9.36351 19.0218C8.60012 18.7325 7.8903 18.32 7.25547 17.7976L6.4144 17.1039L3.91262 17.9932C3.45726 17.3798 3.0769 16.7182 2.77155 16.0218L4.79387 14.2941L4.61976 13.2226C4.55547 12.8235 4.52065 12.411 4.52065 12.0039C4.52065 11.5941 4.5528 11.1843 4.61976 10.7851L4.79387 9.71372L2.77155 7.98604C3.07422 7.28693 3.45726 6.628 3.91262 6.01461L6.4144 6.9039L7.25547 6.21015C7.8903 5.68782 8.60012 5.27532 9.36351 4.98604L10.3787 4.603L10.8582 1.99943C11.6108 1.91372 12.3796 1.91372 13.1349 1.99943L13.6144 4.59765L14.6349 4.98068C15.4037 5.26997 16.1189 5.68247 16.759 6.20747L17.6001 6.89854L20.0858 6.01729C20.5412 6.63068 20.9215 7.29229 21.2269 7.98872L19.226 9.70032L19.4001 10.7691ZM11.9992 7.02175C9.39565 7.02175 7.28494 9.13247 7.28494 11.736C7.28494 14.3396 9.39565 16.4503 11.9992 16.4503C14.6028 16.4503 16.7135 14.3396 16.7135 11.736C16.7135 9.13247 14.6028 7.02175 11.9992 7.02175ZM14.1207 13.8575C13.8424 14.1365 13.5117 14.3578 13.1477 14.5086C12.7836 14.6593 12.3933 14.7367 11.9992 14.736C11.1983 14.736 10.4457 14.4226 9.8778 13.8575C9.59875 13.5792 9.37748 13.2486 9.2267 12.8845C9.07592 12.5204 8.99861 12.1301 8.99922 11.736C8.99922 10.9351 9.31262 10.1825 9.8778 9.61461C10.4457 9.04675 11.1983 8.73604 11.9992 8.73604C12.8001 8.73604 13.5528 9.04675 14.1207 9.61461C14.3997 9.89285 14.621 10.2235 14.7718 10.5876C14.9225 10.9517 14.9998 11.342 14.9992 11.736C14.9992 12.5369 14.6858 13.2896 14.1207 13.8575Z" fill="#555555" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_83_371">
                                                    <rect width="24" height="24" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="">
                                    <span className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M14.945 1.25C13.578 1.25 12.475 1.25 11.608 1.367C10.708 1.487 9.94996 1.747 9.34796 2.348C8.82396 2.873 8.55796 3.518 8.41896 4.276C8.28396 5.013 8.25796 5.914 8.25196 6.996C8.2509 7.19491 8.3289 7.3861 8.46881 7.5275C8.60871 7.6689 8.79905 7.74894 8.99796 7.75C9.19688 7.75106 9.38806 7.67306 9.52947 7.53316C9.67087 7.39326 9.7509 7.20291 9.75196 7.004C9.75796 5.911 9.78596 5.136 9.89396 4.547C9.99896 3.981 10.166 3.652 10.409 3.409C10.686 3.132 11.075 2.952 11.809 2.853C12.564 2.752 13.565 2.75 15 2.75H16C17.436 2.75 18.437 2.752 19.192 2.853C19.926 2.952 20.314 3.133 20.592 3.409C20.87 3.685 21.048 4.074 21.147 4.809C21.249 5.563 21.25 6.565 21.25 8V16C21.25 17.435 21.249 18.437 21.147 19.192C21.048 19.926 20.868 20.314 20.591 20.591C20.314 20.868 19.926 21.048 19.192 21.147C18.437 21.248 17.436 21.25 16 21.25H15C13.565 21.25 12.564 21.248 11.808 21.147C11.075 21.048 10.686 20.867 10.409 20.591C10.166 20.348 9.99896 20.019 9.89396 19.453C9.78596 18.864 9.75796 18.089 9.75196 16.996C9.75144 16.8975 9.73152 16.8001 9.69334 16.7093C9.65517 16.6185 9.59948 16.5361 9.52947 16.4668C9.45945 16.3976 9.37648 16.3428 9.28528 16.3056C9.19409 16.2684 9.09646 16.2495 8.99796 16.25C8.89947 16.2505 8.80205 16.2704 8.71126 16.3086C8.62046 16.3468 8.53808 16.4025 8.46881 16.4725C8.39953 16.5425 8.34473 16.6255 8.30752 16.7167C8.27032 16.8079 8.25144 16.9055 8.25196 17.004C8.25796 18.086 8.28396 18.987 8.41896 19.724C8.55896 20.482 8.82396 21.127 9.34896 21.652C9.94996 22.254 10.709 22.512 11.609 22.634C12.475 22.75 13.578 22.75 14.945 22.75H16.055C17.423 22.75 18.525 22.75 19.392 22.633C20.292 22.513 21.05 22.253 21.652 21.652C22.254 21.05 22.512 20.292 22.634 19.392C22.75 18.525 22.75 17.422 22.75 16.055V7.945C22.75 6.578 22.75 5.475 22.634 4.608C22.513 3.708 22.254 2.95 21.652 2.348C21.05 1.746 20.292 1.488 19.392 1.367C18.525 1.25 17.422 1.25 16.055 1.25H14.945Z" fill="#555555" />
                                            <path d="M15.0006 11.25C15.1995 11.25 15.3902 11.329 15.5309 11.4697C15.6715 11.6103 15.7506 11.8011 15.7506 12C15.7506 12.1989 15.6715 12.3897 15.5309 12.5303C15.3902 12.671 15.1995 12.75 15.0006 12.75H4.02756L5.98856 14.43C6.13973 14.5594 6.2333 14.7436 6.24868 14.942C6.26405 15.1404 6.19998 15.3368 6.07056 15.488C5.94113 15.6392 5.75695 15.7327 5.55854 15.7481C5.36013 15.7635 5.16373 15.6994 5.01256 15.57L1.51256 12.57C1.43022 12.4996 1.36412 12.4122 1.31879 12.3138C1.27347 12.2154 1.25 12.1083 1.25 12C1.25 11.8917 1.27347 11.7846 1.31879 11.6862C1.36412 11.5878 1.43022 11.5004 1.51256 11.43L5.01256 8.43C5.08741 8.36591 5.17415 8.3172 5.26783 8.28664C5.36151 8.25607 5.4603 8.24426 5.55854 8.25188C5.65679 8.25949 5.75257 8.28638 5.84042 8.33101C5.92827 8.37565 6.00647 8.43714 6.07056 8.512C6.13464 8.58685 6.18336 8.67359 6.21392 8.76727C6.24448 8.86095 6.25629 8.95973 6.24868 9.05798C6.24106 9.15622 6.21417 9.25201 6.16954 9.33986C6.12491 9.42771 6.06341 9.50591 5.98856 9.57L4.02856 11.25H15.0006Z" fill="#555555" />
                                        </svg>
                                    </span>
                                </a>
                            </li>
                            <li>
                                <p>V-1.01</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <Header selectedMenuItem={selectedMenuItem} />
        </>
    )
}

export default MainSidebarMenu