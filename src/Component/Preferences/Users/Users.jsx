import React, { useEffect, useState } from 'react';
import { Select, Switch, Table, Skeleton } from 'antd';
import socket from '../../socket.io/service';
import { Form } from 'antd';
import { Tooltip } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'antd/lib/date-picker';
import dayjs from 'dayjs';
import moment from 'moment-timezone';
import 'moment-timezone/data/packed/latest';
import ReactCountryFlag from "react-country-flag"
import { AndroidOutlined, DesktopOutlined, AppleOutlined } from '@ant-design/icons';
import '../../../Component/Preferences/Users/Users.css'
import '../../../Component/Preferences/Users/analyticssUsers.css'
import '../../../Component/App_Details_theme/css/analytics.css';
import { Typography } from 'antd';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';
import { fetchUserData } from '../../../Component/Redux/auth/action'
import CustomMessage from '../../CustomMessage/CustomMessage';
import mainHoc from '../../hoc/mainHoc';
import { Helmet } from 'react-helmet';

const { Search } = Input;

const { Paragraph } = Typography;

const Users = () => {
    const [loading, setLoading] = useState(true); // Initialize it as true to show the loader initially
    const [tableData, setTableData] = useState([]);
    const [searchDataAll, setSearchDataAll] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(50); // Items per page
    const [totalItems, setTotalItems] = useState(0);  // Total number of items
    const navigation = useNavigate(false)
    const [selectedProjectId, setSelectedProjectId] = useState()
    const [projectIdDetails, setProjectIdDetails] = useState('')
    const monthFormat = 'YYYY/MM'
    const [countrySelected, setCountrySelected] = useState('')
    const [switchOn, setSwitchOn] = useState(
        localStorage.getItem('switchState') === 'true'
    );
    const [isFetching, setIsFetching] = useState(false);
    const [mainDashboardSize, setMainDashboardSize] = useState(0);
    const [mobileSize, setMobileSize] = useState(0);
    const [totalSize, setTotalSize] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState(dayjs().month() + 1); // Initialize with the current month
    const [selectedYear, setSelectedYear] = useState(dayjs().year()); // Initialize with the current year
    const [defaultDate, setDefaultDate] = useState(dayjs())
    const [uniqueCountryData, setUniqueCountryData] = useState([]);
    const [uniqueEmojiData, setUniqueEmojiData] = useState([]);
    const [searchLoading, setSearchLoading] = useState(true);
    const [counterFilterAllDataShow, setCounterFilterAllDataShow] = useState()

    useEffect(() => {
        setDefaultDate(dayjs());
    }, []);

    const handleDatePickerChange = (date) => {
        if (date) {
            setSelectedMonth(date.month() + 1); // Moment months are 0-based
            setSelectedYear(date.year());
        }
    };

    // useEffect(() => {
    //     const distinctDeviceIds = [...new Set(flattenedData.map(item => item.deviceId))];
    //     setTotalItems(distinctDeviceIds.length);
    // }, [flattenedData])    

    useEffect(() => {
        if (switchOn) {
            UserAllDataGet()
            CounteryWiseFlagAllData()
        }
    }, [switchOn, pageSize, currentPage, projectIdDetails, searchDataAll, countrySelected, selectedMonth, selectedYear])


    const CounteryWiseFlagAllData = () => {
        try {
            setLoading(true);
            socket.emit('user|get|countryCode', {
                year: selectedYear?.toString(), // Convert to string
                month: selectedMonth?.toString(),
                projectId: projectIdDetails,
            });
            setLoading(true);
            socket.on('user|get|countryCode', (response) => {
                setLoading(true);
                if (response.success) {
                    setCounterFilterAllDataShow(response?.data?.countryCodes)
                }
            });
            setLoading(false)
        } catch (error) {
            console.log("error", error);
        }
    }


    const dispatch = useDispatch();

    const UserAllDataGet = async () => {
        setLoading(true);

        try {
            await dispatch(fetchUserData(currentPage, pageSize, setTotalItems, setTableData, searchDataAll, setLoading, setSearchLoading, selectedYear, selectedMonth, projectIdDetails, countrySelected, searchLoading));

        } catch (error) {
            console.error(error);
            CustomMessage('error', error?.message);
        } finally {
            setLoading(false);
        }
    }

    const handleRefreshClick = () => {
        if (!isFetching) {
            UserAllDataGet()
            GetAllProjectData()
        }
    };

    const handleSwitchChange1 = (newValue) => {
        updateSwitchState(newValue);
    };

    const updateSwitchState = (newValue) => {
        setSwitchOn(newValue);
        localStorage.setItem('switchState', newValue);
    };

    useEffect(() => {
        GetAllProjectData()
    }, [])

    const GetAllProjectData = () => {
        try {
            socket.emit('project|get|all', { page: currentPage, limit: 10000000, search: '' });
            socket.on('project|get|all', (response) => {
                if (response?.success) {
                    setSelectedProjectId(response?.data)
                }
            });
        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
        } finally {
        }

    }

    const handleSearchData = (e) => {
        setSearchLoading(true);
        setSearchDataAll(e?.target?.value);
    };


    const currentDate = new Date();

    const handlePassId = (deviceId, projectId) => {
        navigation(`/app-analytic?projectId=${projectId}&deviceId=${deviceId}&startDate=2023-08-01&endDate=${moment(currentDate).format('YYYY-MM-DD')}`);
    };


    const properset = (createdAt) => {
        const istTime = convertUtcToIst(createdAt);

        const createdAtMoment = moment(istTime);
        const currentDateTime = moment();

        const diffInMinutes = currentDateTime.diff(createdAtMoment, 'minutes');
        const diffInHours = currentDateTime.diff(createdAtMoment, 'hours');
        const diffInDays = currentDateTime.diff(createdAtMoment, 'days');

        if (diffInMinutes <= 1) {
            return 'Just now';
        } else if (diffInMinutes <= 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        } else if (diffInHours <= 24) {
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        } else if (diffInDays <= 7) {
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        } else {
            return createdAtMoment.format('DD/MM/YYYY hh:mm:ss A');
        }
    };



    const propersetUpdatedAt = (updatedAt) => {
        const istTime = convertUtcToIst(updatedAt);

        const format = 'YYYY-MM-DD HH:mm:ss';

        const createdAtMoment = moment(istTime, format); // Parse with format
        const currentDateTime = moment();

        const diffInMinutes = currentDateTime.diff(createdAtMoment, 'minutes');
        const diffInHours = currentDateTime.diff(createdAtMoment, 'hours');
        const diffInDays = currentDateTime.diff(createdAtMoment, 'days');

        if (diffInMinutes <= 1) {
            return 'Just now';
        } else if (diffInMinutes <= 60) {
            return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
        } else if (diffInHours <= 24) {
            return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
        } else if (diffInDays <= 7) {
            return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
        } else {
            return createdAtMoment.format('DD/MM/YYYY hh:mm:ss A');
        }
    };

    const convertUtcToIst = (utcTime) => {
        const utcTimezone = 'UTC';
        const istTimezone = 'Asia/Kolkata';

        const utcMoment = moment(utcTime).tz(utcTimezone);

        const istMoment = utcMoment.clone().tz(istTimezone);

        const formattedIstTime = istMoment.format('YYYY-MM-DD HH:mm:ss');

        return formattedIstTime;
    };

    const handleChangesProjectId = (e) => {
        setProjectIdDetails(e)
    }
    useEffect(() => {
        const handleWindowSizeChange = () => {
            const windowWidth = window.innerWidth;
            const elements = document.querySelectorAll('#analytics-page .user-lookup .body .row .col-lg-2');

            if (windowWidth > 992 && windowWidth < 1400) {
                elements.forEach((element) => {
                    element.classList.add('col-lg-3');
                    element.classList.remove('col-lg-2');
                });
            }
        };

        window.addEventListener('resize', handleWindowSizeChange);

        handleWindowSizeChange();

        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        };
    }, []);

    const tableAllDataShpw = [];

    tableData?.forEach((row) => {
        const packNameAllData = row?.projectInfo
        const historyRows1 = row?.history;
        const historyRows = row?.history?.history;
        const propertiesData = historyRows?.properties || [];
        const brandData = propertiesData.map(element => element?.brand).filter(Boolean);
        const countryData = propertiesData.map(element => element?.country).filter(Boolean);
        const codeData = propertiesData.map(element => element?.code).filter(Boolean);
        tableAllDataShpw.push({
            projectId: historyRows1?.projectId || '-',
            packageName: packNameAllData?.packageName || '-',
            shortName: packNameAllData?.shortName || '-',
            name: packNameAllData?.name || '-',
            platForm: packNameAllData?.platForm || '-',
            appDetails: packNameAllData?.appDetails || '-',
            deviceId: historyRows?.deviceId || '-',
            code: codeData,
            country: countryData,
            brand: brandData || '-',
            emoji: historyRows?.emoji || '-',
            createdAt: historyRows?.createdAt || '-',
            updatedAt: historyRows?.updatedAt || '-',
        });
    });

    const customSort = (a, b) => {
        const dateA = moment(a).toDate();
        const dateB = moment(b).toDate();

        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        return 0;
    };

    const columns = [
        {
            title: (
                <div className='font-weight-all-filed'>
                    App Name
                </div>
            ),
            dataIndex: 'appName',
            key: 'appName',
            width: '350px',
            render: (text, record) => {
                return (
                    <div className='d-flex'>
                        <div className='img'>
                            {
                                record?.appDetails?.map((rowDataAll) => {
                                    return (
                                        <>
                                            {rowDataAll?.isLive === 0 ? rowDataAll?.logo ? <Link to={`https://play.google.com/store/apps/details?id=${record?.packageName}`} target='_blank'>
                                                <img src={rowDataAll?.logo} alt='PDF' className='image-pdf-logo' /></Link> : <img src={require('../../../Component/App_Details_theme/images/Not-Image_sysmbol.png')} alt='PDF' className='image-pdf-logo' /> : <img src={require('../../../Component/App_Details_theme/images/Not-Image_sysmbol.png')} alt='PDF' className='image-pdf-logo' />}
                                        </>
                                    )
                                })
                            }</div>
                        <div className='info'>
                            <h4>{record?.shortName}. {record?.name}</h4>
                            <p>{record?.projectId}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Country Name
                </div>
            ),
            dataIndex: 'Country Name',
            key: 'Country Name',
            width: '240px',
            sorter: (a, b) => {
                const countryA = (a.country || '').toString().toLowerCase();
                const countryB = (b.country || '').toString().toLowerCase();

                return countryA.localeCompare(countryB);
            },
            render: (text, recods) => {
                return (
                    <div className="d-flex justify-content-between">
                        <div className="d-flex full text-font">

                            <ReactCountryFlag
                                countryCode={recods?.code[0]}
                                svg
                                style={{
                                    width: '28px',
                                    height: '20px',
                                }}
                                title="US"
                            />
                            &nbsp;&nbsp;
                            {recods.country || '-'}
                        </div>
                        <div className="short">
                            {recods.code ? `(${(recods.code)})` : ''}
                        </div>
                    </div>
                );
            }
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Platform
                </div>
            ),
            dataIndex: 'Platform',
            key: 'Platform',
            width: '112px',
            render: (text, recodrs) => {
                let icon = null;

                if (recodrs?.platForm === "android") {
                    icon = <AndroidOutlined className='paltform-center-data' />;
                } else if (recodrs?.platForm === "webdeveloper") {
                    icon = <DesktopOutlined className='paltform-center-data' />;
                } else if (recodrs?.platForm === "ios") {
                    icon = <AppleOutlined className='paltform-center-data' />;
                }
                return (
                    <td class="platform">
                        {icon}
                    </td>

                );
            },
            sorter: (a, b) => customSort(a.Platform, b.Platform),
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Device ID
                </div>
            ),
            dataIndex: 'deviceId',
            key: 'deviceId',
            width: '200px',
            render: (text, record) => {
                return (
                    <>
                        <Paragraph
                            copyable={{
                                text: record?.deviceId,
                                icon: (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                                        <g clipPath="url(#clip0_1_5106)">
                                            <path d="M9.75 16.5H3.78125C2.40272 16.5 1.28125 15.3785 1.28125 14V5.53125C1.28125 4.15272 2.40272 3.03125 3.78125 3.03125H9.75C11.1285 3.03125 12.25 4.15272 12.25 5.53125V14C12.25 15.3785 11.1285 16.5 9.75 16.5ZM3.78125 4.28125C3.09203 4.28125 2.53125 4.84203 2.53125 5.53125V14C2.53125 14.6892 3.09203 15.25 3.78125 15.25H9.75C10.4392 15.25 11 14.6892 11 14V5.53125C11 4.84203 10.4392 4.28125 9.75 4.28125H3.78125ZM14.75 12.4375V3C14.75 1.62147 13.6285 0.5 12.25 0.5H5.3125C4.96728 0.5 4.6875 0.779781 4.6875 1.125C4.6875 1.47022 4.96728 1.75 5.3125 1.75H12.25C12.9392 1.75 13.5 2.31078 13.5 3V12.4375C13.5 12.7827 13.7798 13.0625 14.125 13.0625C14.4702 13.0625 14.75 12.7827 14.75 12.4375Z" fill="#999999" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1_5106">
                                                <rect width="16" height="16" fill="white" transform="translate(0 0.5)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                ),
                            }}
                            className='svg_flex pointer-cursor'
                            onClick={() => handlePassId(record.deviceId, record.projectId)}
                        >
                            <div className='pointer-cursor'>{record?.deviceId}</div>
                        </Paragraph>
                    </>
                )
            },
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Brand Name
                </div>
            ),
            dataIndex: 'Brand Name',
            key: 'Brand Name',
            width: '130px',

            render: (text, redords) => {
                return (
                    <td class="brandname paltform-center-data text-font">
                        <h4>{redords?.brand}</h4>
                    </td>
                );
            }
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Last Activity Date
                </div>
            ),
            dataIndex: 'Last Activity Date',
            key: 'Last Activity Date',
            width: '193px',
            render: (text, records) => {
                return (
                    <Tooltip title={moment(records?.updatedAt).format('DD/MM/YYYY hh:mm:ss A')}>
                        <td class="lastdate date">{propersetUpdatedAt(records?.updatedAt)}</td>
                    </Tooltip>
                );
            },
            sorter: (a, b) => customSort(a.updatedAt, b.updatedAt),
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    Register Date & Time
                </div>
            ),
            dataIndex: 'Register Date & Time',
            key: 'Register Date & Time',
            width: '193px',
            render: (text, records) => {
                return (
                    <Tooltip title={moment(records?.createdAt).format('DD/MM/YYYY hh:mm:ss A')}>
                        <td class="registerdate date">{properset(records?.createdAt)} {/* Pass the original 'createdAt' value */}</td>
                    </Tooltip>
                );
            },
            sorter: (a, b) => customSort(a.createdAt, b.createdAt),
        },
    ]


    useEffect(() => {
        const calculateTableSize = () => {
            const lookupHeight = document.querySelector('#analytics-page .user-lookup').offsetHeight;
            const maintableMargin = parseFloat(window.getComputedStyle(document.querySelector('#analytics-page .maintable')).marginTop);
            const maintablePadding = parseFloat(window.getComputedStyle(document.querySelector('#analytics-page .maintable')).paddingTop);
            const footerHeight = document.querySelector('#analytics-page .footer').offsetHeight;
            const footerMargin = parseFloat(window.getComputedStyle(document.querySelector('#analytics-page .footer')).marginTop);

            const newTableSize = mainDashboardSize - lookupHeight - maintableMargin - maintablePadding - 20 - footerMargin - footerHeight;
        };

        const handleResize = () => {
            if (window.innerWidth > 767) {
                calculateTableSize();
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [mainDashboardSize]);

    useEffect(() => {
        const mainDashboardHeight = document.querySelector('.main-dashboard').offsetHeight;
        setMainDashboardSize(mainDashboardHeight);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const bodyHeight = document.querySelector('main').offsetHeight;
            const windowTop = document.querySelector('.pages .top-header').offsetHeight;
            const mobileNav = document.querySelector('.mobile-nav').offsetHeight;
            const breadCumbHeight = document.querySelector('.breadcumb').offsetHeight;

            const mobile = bodyHeight - mobileNav - breadCumbHeight - 20;
            const total = bodyHeight;
            const mainDashboardSize = bodyHeight - windowTop - breadCumbHeight;

            setMobileSize(mobile);
            setTotalSize(total);
            setMainDashboardSize(mainDashboardSize);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call the handler initially

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (window.innerWidth > 991) {
            document.querySelector('.pages .detailed-menu').style.height = `${totalSize}px`;
            document.querySelector('.pages .main-content-body').style.height = `${mainDashboardSize}px`;
        } else {
            document.querySelector('.pages .main-content-body').style.height = `${mobileSize}px`;
        }
    }, [totalSize, mainDashboardSize, mobileSize]);

    const handleChangeCountry = (e) => {
        setCountrySelected(e);
    };

    useEffect(() => {
        const countryData = [];
        const emojiData = [];

        counterFilterAllDataShow?.forEach((row) => {
            const countries = row?.country?.map(element => element).filter(Boolean);
            const emojis = row?.code?.map(element => element).filter(Boolean);
            countryData.push(...countries);
            emojiData.push(...emojis);
        });

        const uniqueCountries = [...new Set(countryData)];
        const uniqueEmojis = [...new Set(emojiData)];
        setUniqueCountryData(uniqueCountries);
        setUniqueEmojiData(uniqueEmojis);
    }, [counterFilterAllDataShow]);


    const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="7" className="skeleton-loader">

                            <Skeleton loading={loading} round={true} active avatar paragraph={{
                                rows: 1,
                            }} className='loading-avatar'>

                            </Skeleton>
                        </td>
                    </tr>
                ))}
            </>
        );
    };

    const customComponents = {
        body: {
            row: loading ? SkeletonRow : undefined,
        },
    };

    return (
        <>
            <Helmet>
                <title>Users</title>
            </Helmet>
            <div id="analytics-page">
                <div class="breadcumb">
                    <div class="row gx-0">
                        <div class="col-lg-8 col-md-6 left d-flex align-items-center">
                            <p><a href="dashboard.html">Analytics</a> <span>/</span> User Look-UP</p>
                        </div>
                    </div>
                </div>

                <div className={`main-content-body overflow-scroll`}>
                    {/* <!-- user lookup --> */}
                    <div class="user-lookup">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>User look-UP</h2>
                                </div>
                                <div class="col-6 d-flex align-items-center justify-content-end">

                                    <Switch
                                        size='small'
                                        checked={switchOn} // Set the checked property based on the state variable
                                        onChange={handleSwitchChange1} // Handle switch state changes
                                    />
                                    &nbsp;
                                    <Link
                                        to="#"
                                        className={`refresh d-flex align-items-center ${isFetching ? 'disabled' : ''}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRefreshClick();
                                        }}
                                    >
                                        {isFetching ? (
                                            <i className="ri-loader-4-line animate-spin"></i>
                                        ) : (
                                            <i className="ri-refresh-line"></i>
                                        )}
                                        &nbsp;
                                        Refresh
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div class="body">
                            <div class="row gx-0 gx-lg-2 gx-md-2 d-lg-flex d-md-flex">
                                <div class="col-lg-2 col-md-3" >
                                    <div class="form-group date">
                                        <label htmlFor="pname">Date Range<span className="required">*</span></label>
                                        <DatePicker.MonthPicker
                                            defaultValue={defaultDate}
                                            format={monthFormat}
                                            className='date-format d-flex'
                                            onChange={handleDatePickerChange} />
                                    </div>
                                </div>

                                <div class="col-lg-2 col-md-3">
                                    <div class="form-group appname">
                                        <label for="sname" className='font-weight-all-filed '>App Name & Project ID</label>
                                        <Form.Item className='height-set-Description'>
                                            <Select
                                                showSearch
                                                style={{
                                                    width: "100%",
                                                }}
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                onChange={(e) => handleChangesProjectId(e)}
                                                value={projectIdDetails}
                                            >
                                                <option value=''>All</option>
                                                {
                                                    selectedProjectId?.map((rowData, i) => {
                                                        return (
                                                            <>
                                                                <option key={i} value={rowData?.projectId}>{rowData?.shortName}. {rowData?.name} ({rowData?.projectId})</option>
                                                            </>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-3">
                                    <div class="form-group country">
                                        <label for="name">Country</label>
                                        <Form.Item className='height-set-Description'>
                                            <Select
                                                showSearch
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Search to Select"
                                                optionFilterProp="children"
                                                filterSort={(optionA, optionB) =>
                                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                                }
                                                onChange={handleChangeCountry}
                                                value={countrySelected}
                                            >
                                                <option value="">All</option>
                                                {uniqueCountryData.map((country, index) => {
                                                    return (
                                                        <>
                                                            <option key={index} value={country}>
                                                                <ReactCountryFlag
                                                                    countryCode={uniqueEmojiData[index]}
                                                                    svg
                                                                    style={{
                                                                        width: '28px',
                                                                        height: '20px',
                                                                    }}
                                                                    title="US"
                                                                /> {country}
                                                            </option>
                                                        </>
                                                    )
                                                }

                                                )}
                                            </Select>
                                        </Form.Item>
                                    </div>
                                </div>

                                <div class="col-lg-2 col-md-3 form-space" ></div>
                                <div class="col-lg-1 col-md-3" ></div>
                                <div class="col-lg-3 col-md-3" >
                                    <div className="form-group" >
                                        <label htmlFor="pname" className='height-set'>Search</label>
                                        <br />
                                        <div>
                                            <Search
                                                placeholder="Search"
                                                value={searchDataAll}
                                                onChange={handleSearchData}
                                                className='search-input-loader' loading={searchLoading} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- main table --> */}
                    <div class="maintable">
                        {
                            <div className="body overflow-scroll" id="scrollableDiv">
                                <Table
                                    columns={columns}
                                    dataSource={tableAllDataShpw}
                                    pagination={{
                                        current: currentPage,
                                        pageSize: pageSize,
                                        total: totalItems,
                                        showSizeChanger: true,
                                        showQuickJumper: true, // Enable quick jumper input field
                                        onChange: (page) => setCurrentPage(page),
                                        onShowSizeChange: (current, size) => setPageSize(size),
                                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                    }}
                                    components={customComponents}
                                    className="table tablein main-table mb-0"
                                    size="small"
                                />
                            </div>
                        }
                        <div class="footer">
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Users
