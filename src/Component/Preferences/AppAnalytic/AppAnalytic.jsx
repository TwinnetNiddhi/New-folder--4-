import React, { useEffect, useRef, useState } from 'react';
import { Space, Spin, Switch, Tooltip } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import moment from 'moment';
import socket from '../../socket.io/service';
import dayjs from 'dayjs';
import '../../../Component/App_Details_theme/css/userdetails.css';
import '../../../Component/Preferences/AppAnalytic/AppAnalytic.css'
import { DatePicker, Select } from 'antd';
import { Typography } from 'antd';
import { Collapse } from 'antd';
import socketData from "../../socket/socket/service";
import $ from "jquery"; 
import CustomMessage from '../../CustomMessage/CustomMessage';

const { Panel } = Collapse;

const { RangePicker } = DatePicker;

const rangePresets = [
    {
        label: 'Today',
        value: [dayjs().add(-30, 'm'), dayjs()],
    },
    {
        label: 'Yesterday',
        value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')],
    },
    {
        label: 'Last 7 Days',
        value: [dayjs().add(-6, 'd'), dayjs()],
    },
    {
        label: 'This Month',
        value: [dayjs().startOf('month'), dayjs()],
    },
    {
        label: 'Pervious Month',
        value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
    },
    {
        label: 'Last 3 Months',
        value: [dayjs().subtract(3, 'month').startOf('month'), dayjs()],
    },
    {
        label: 'Last 6 Months',
        value: [dayjs().subtract(5, 'month').startOf('month'), dayjs()],
    },
    {
        label: 'This Year',
        value: [dayjs().startOf('year'), dayjs()],
    },
    {
        label: 'All Time',
        value: [dayjs().startOf('year'), dayjs()],
    },
];

function formatKey(key) {
    const formattedKey = key;
    return formattedKey;
}

const AppAnalytic = () => {
    const [loading, setLoading] = useState(false);
    const [countData, setCountData] = useState([])
    const [dynamicKeyValuePairs, setDynamicKeyValuePairs] = useState([]);
    const [userPropertiesAllData, setUserPropertiesAllData] = useState()
    const [devicePropertiesAllData, setDevicePropertiesAllData] = useState()
    const navigate = useNavigate(); 
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const encryptedDeviceId = queryParams.get('deviceId');
    const encryptedProjectId = queryParams.get('projectId');
    const startDate1 = queryParams.get('startDate');
    const endDate1 = queryParams.get('endDate');
    const dateFormat = moment().format('YYYY-MM-DD');
    const initialStartDate = startDate1 ? dayjs(startDate1) : dayjs(dateFormat);
    const initialEndDate = endDate1 ? dayjs(endDate1) : dayjs(dateFormat);
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const [isFetching, setIsFetching] = useState(false);
    const [deviceIdAndprojectId, setDeviceIdAndprojectId] = useState()
    const maxCharacters = 14;
    const [showFullDeviceId, setShowFullDeviceId] = useState(false);
    const [deviceIdShow, setDeviceIdShow] = useState()
    const [installDateAll, setInstallDateAll] = useState()
    const [lastEventTimeDate, setLastEventTimeDate] = useState()
    const [appListAllData, setAppListAllData] = useState()
    const [showFullText, setShowFullText] = useState({});
    const [browerAllDataShow, setBrowerAllDataShow] = useState()
    const [browerAllDataShowApp, setBrowerAllDataShowApp] = useState()
    const [totalTimeDuration, setTotalTimeDuration] = useState()
    const [totalSocketHistoryEventsAllEventData, setTotalSocketHistoryEventsAllEventData] = useState()
    const [switchOn, setSwitchOn] = useState(
        localStorage.getItem('switchState') === 'true'
    );
    const breadCumbRef = useRef(null);
    const [activePanels, setActivePanels] = useState([0]);
    const [isFullText, setIsFullText] = useState(false);
    const [isFullTextBrower, setIsFullTextBrower] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [activeEvent, setActiveEvent] = useState(null);
    const [activeEvent1, setActiveEvent1] = useState(null);
    const [eventToggle, setEventToggle] = useState(true);
    const [getPackageIdLoading, setGetPackageIdLoading] = useState(false);

    const handleChildClick1 = (eventId) => {
        setActiveEvent1((prevActiveEvent) => (prevActiveEvent === eventId ? null : eventId));
    };

    const toggleCollapse = (eventId) => {
        if (activePanels.includes(eventId)) {
            setActivePanels((prevActivePanels) =>
                prevActivePanels.filter((panelId) => panelId !== eventId)
            );
        } else {
            setActivePanels((prevActivePanels) => [...prevActivePanels, eventId]);
        }
    };

    const handleDateChange = (dates, dateStrings) => {
        if (dates && dateStrings && dateStrings?.length === 2) {
            const [start, end] = dateStrings;
            setStartDate(dayjs(start));
            setEndDate(dayjs(end));

            queryParams.set('startDate', start);
            queryParams.set('endDate', end);

            const newSearch = queryParams.toString();
            navigate(`?${newSearch}`);
        } else {
            setStartDate(null);
            setEndDate(null);

            queryParams.delete('startDate');
            queryParams.delete('endDate');

            const newSearch = queryParams.toString();
            navigate(`?${newSearch}`);
        }
    };

    const handleEventNameClick = (eventId) => {
        setActiveEvent((prevActiveEvent) => (prevActiveEvent === eventId ? null : eventId));
    };


    const handleChildClick = (data, index, _id, parentIndex) => {
        const originalData = data.properties;
        const dynamicObject = {};
        const reversedObject = {};

        for (const key in originalData) {
            if (originalData.hasOwnProperty(key)) {
                const modifiedKey = key.replace("userArray.adsInfo.", "");

                const keySegments = modifiedKey.split(".");

                for (let i = 0; i < keySegments?.length; i += 2) {
                    const newKey = keySegments[i];
                    const newValue = keySegments[i + 1];

                    dynamicObject[newKey] = newValue;
                }

                for (const key in dynamicObject) {
                    if (dynamicObject.hasOwnProperty(key)) {
                        reversedObject[dynamicObject[key]] = key;
                    }
                }
            }
        }

        const dynamicKeyValuePairs = Object.entries(dynamicObject).map(([key, value]) => (
            <div key={key}>
                <div className="item">
                    <div className="row gx-0">
                        <div className="col-4">
                            <h6>{formatKey(key)}</h6>
                        </div>
                        <div className="col-1 justify-content-center">
                            <p>-</p>
                        </div>
                        <div className="col-6 d-flex justify-content-start">
                            {value ? <h4>{formatKey(value)}</h4> : <p>Data not found</p>}
                        </div>
                    </div>
                </div>
            </div>
        ));

        setDynamicKeyValuePairs(dynamicKeyValuePairs);
    };

    const updateSwitchState = (newValue) => {
        setSwitchOn(newValue);
        localStorage.setItem('switchState', newValue);
    };

    const handleSwitchChange1 = (newValue) => {
        updateSwitchState(newValue);
    };

    useEffect(() => {
        if (switchOn) {
            fetchData();
            DeviceIdAll();
            AppListApi()
        }
    }, [encryptedDeviceId, encryptedProjectId, startDate, endDate, switchOn]);

    const AppList = [];

    const fetchData = async () => {
        setIsFetching(true);
        try {
            const response = await new Promise((resolve, reject) => {
                socket.emit('session|get|deviceIdInfo', {
                    startDate: startDate1,
                    endDate: endDate1,
                    projectId: encryptedProjectId,
                    deviceId: encryptedDeviceId,
                });

                socket.once('session|get|deviceIdInfo', (response) => {
                    resolve(response);
                });
            });
            if (response?.success) {
                setCountData(response?.socketHistory);
                setUserPropertiesAllData(response?.userProperties);
                setDevicePropertiesAllData(response?.deviceProperties);
                setDeviceIdAndprojectId(response);
                setInstallDateAll(response?.firstTimeUserInstallDate);
                setLastEventTimeDate(response?.lastTimeEventActivity);
                setTotalTimeDuration(response?.totalTimeDuration)
                setTotalSocketHistoryEventsAllEventData(response?.totalSocketHistoryEvents)

                if (Array.isArray(response?.userProperties?.app_list)) {
                    response.userProperties.app_list.forEach((rowDataAll) => {
                        rowDataAll.forEach((element) => {
                            AppList.push(element);
                        });
                    });
                }

                setLoading(true)
                await AppListApi(AppList, response?.userProperties?.default_browser_package, response?.userProperties?.default_app_store_package);
            } else {
                CustomMessage('error', response?.message);
                setCountData({});
                setUserPropertiesAllData({});
                setDevicePropertiesAllData({});
                setDeviceIdAndprojectId({});
            }
            setIsFetching(false);
        } catch (error) {
            console.error('Error decrypting deviceId or projectId:', error);
            setIsFetching(false);
            setLoading(false)
        }
    }

    const AppListApi = async (AppList, brower_Data, brower_Data_App) => {
        try {
            setGetPackageIdLoading(true);
            const response = await new Promise((resolve, reject) => {
                if (AppList, brower_Data, brower_Data_App) {
                    socketData.emit('getPackageId', {
                        packageId: AppList,
                        packageId_1: brower_Data?.[0] || '',
                        packageId_2: brower_Data_App?.[0] || ''
                    });
                }

                socketData.once('getPackageId', (response) => {
                    resolve(response);
                });
            });

            setGetPackageIdLoading(false);

            if (response?.success) {
                setAppListAllData(response?.data);
                setBrowerAllDataShow(response?.data1);
                setBrowerAllDataShowApp(response?.data2);
            } else {
                CustomMessage('error', response?.message);
            }
        } catch (error) {
            console.error('Error decrypting deviceId or projectId:', error);
            setGetPackageIdLoading(false);
        }
    };

    const DeviceIdAll = async () => {
        try {
            setLoading(true)
            const response = await new Promise((resolve, reject) => {
                socket.emit('session|get|basicGraph', {
                    startDate: startDate1,
                    endDate: endDate1,
                    projectId: encryptedProjectId,
                    userProperties: {},
                    deviceProperties: {},
                });

                socket.once('session|get|basicGraph', (response) => {
                    resolve(response);
                });
            });
            if (response?.success) {
                setLoading(false)
                setDeviceIdShow(response?.deviceList?.filteredDeviceIds)
            } else {
                CustomMessage('error', response?.message);
            }
            setLoading(false)
            setIsFetching(false);
        } catch (error) {
            console.error('Error decrypting deviceId or projectId:', error);
            CustomMessage('error', error?.message);
            setIsFetching(false);
            setLoading(false)
        } finally {
        }
    }

    const secondsToMinutesAndHours = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const remainingSeconds = seconds % 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const remainingSecs = remainingSeconds % 60;

        if (hours > 0) {
            if (minutes > 0) {
                return `${hours} Hr ${minutes} Min`;
            } else {
                return `${hours} Hr`;
            }
        } else if (minutes > 0) {
            if (remainingSecs > 0) {
                return `${minutes} Min ${remainingSecs.toFixed(2)} Sec`;
            } else {
                return `${minutes} Min`;
            }
        } else if (remainingSecs > 0) {
            return `${remainingSecs.toFixed(2)} Sec`;
        } else {
            return '0 Sec';
        }
    };

    const handleRefreshClick = () => {
        if (!isFetching) {
            fetchData();
            DeviceIdAll();
            AppListApi();
        }
    };

    const toggleDeviceId = () => {
        setShowFullDeviceId(!showFullDeviceId);
    };

    const getDisplayTextDevice = (data) => {
        if (!data || !data.deviceId || data.deviceId?.length <= maxCharacters || showFullDeviceId) {
            return (
                <span className='device_id_bold'>{data?.deviceId || '-'}</span>
            );
        }
        return (
            <span className='device_id_bold'>{data.deviceId.substring(0, maxCharacters) + '...'}</span>
        );
    };

    const dateAgo = (date) => {
        const startDate = moment(date);
        const currentDate = moment();
        const duration = moment.duration(currentDate.diff(startDate));
        const years = duration.years();
        const months = duration.months();
        const days = duration.days();
        const hours = duration.hours();
        const minutes = duration.minutes();

        if (years > 0) {
            return years + (years === 1 ? " Year" : " Years");
        } else if (months > 0) {
            return months + (months === 1 ? " Month" : " Months");
        } else if (days > 0) {
            return days + (days === 1 ? " Day" : " Days");
        } else if (hours > 0) {
            return hours + (hours === 1 ? " Hour" : " Hours");
        } else {
            return minutes + (minutes === 1 ? " Minute" : " Minutes");
        }
    };

    const dateCounts = {};

    const data = userPropertiesAllData?.density;
    let textToRender = '-';

    const firstDataValue = Array.isArray(data) ? data[0] : data;

    if (firstDataValue >= 0.75 && firstDataValue < 1.0) {
        textToRender = 'LDPI';
    } else if (firstDataValue >= 1.0 && firstDataValue < 1.5) {
        textToRender = 'MDPI';
    } else if (firstDataValue >= 1.5 && firstDataValue < 2.0) {
        textToRender = 'HDPI';
    } else if (firstDataValue >= 2.0 && firstDataValue < 3.0) {
        textToRender = 'XHDPI';
    } else if (firstDataValue >= 3.0 && firstDataValue < 4.0) {
        textToRender = 'XXHDPI';
    } else if (firstDataValue >= 4.0) {
        textToRender = 'XXXHDPI';
    }


    const handleToggleText = (id) => {
        setShowFullText((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    const toggleTextDisplay = () => {
        setIsFullText(!isFullText);
    };

    const getDisplayTextApp = (row, maxCharacters) => {
        if (!row?.appName) {
            return '-';
        }
        if (isFullText || row?.appName?.length <= maxCharacters) {
            return row?.appName;
        }
        return row?.appName?.substring(0, maxCharacters) + '...';
    };


    const toggleTextDisplayBrower = () => {
        setIsFullTextBrower(!isFullTextBrower);
    };

    const getDisplayTextBrower = (row, maxCharacters) => {
        if (!row?.appName) {
            return '-';
        }
        if (isFullTextBrower || row?.appName?.length <= maxCharacters) {
            return row?.appName;
        }
        return row?.appName?.substring(0, maxCharacters) + '...';
    };

    const getDisplayText = (row) => {
        if (showFullText[row._id] || !row.appName || row?.appName?.length <= maxCharacters) {
            return row.appName || '-';
        }
        return row.appName.substring(0, maxCharacters) + '...';
    };

    useEffect(() => {
        var windowtop = $('#user-details-page .top-header').outerHeight();
        var projectmargin = $('#user-details-page .breadcumb').css('margin-top');
        var bodyHeight = $('main').height();
        var mobilenav = $('.mobile-nav').height();

        var projectmarginbtm = $('#user-details-page .breadcumb').css('margin-bottom');
        var breadcumb = $('#user-details-page .breadcumb').outerHeight();

        let total = bodyHeight - windowtop - parseFloat(projectmargin);
        let totalw = bodyHeight - parseFloat(mobilenav) - 20;
        let event = bodyHeight - windowtop - parseFloat(projectmargin) - parseFloat(projectmarginbtm) - breadcumb;
        if ($(window).width() > 991) {
            $('#user-details-page .bm').css('height', total);
            $('.detailed-menu').css('height', bodyHeight);
        }
        if ($(window).width() < 991) {
            $('#user-details-page .bm').css('height', totalw);
        }
    }, []);


    useEffect(() => {
        function handleKeyDown(event) {
            if (event.key === 'ArrowUp') {
                if (currentIndex > 0) {
                    setCurrentIndex(currentIndex - 1);
                }
            } else if (event.key === 'ArrowDown') {
                if (currentIndex < countData?.length - 1) {
                    setCurrentIndex(currentIndex + 1);
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, countData]);

    const handleSwitchChange = () => {
        setEventToggle(!eventToggle);
    };

    useEffect(() => {
        if (eventToggle) {
            $('.detailed-menu .normal-menu').slideUp();
            $('.detailed-menu .event-menu').slideDown();
        } else {
            $('.detailed-menu .normal-menu').slideDown();
            $('.detailed-menu .event-menu').slideUp();
        }
    }, [eventToggle]);

    return (
        <>
            <div id="user-details-page" class="pages" >
                <main className="h-100" id="user-details-main" >
                            <div className="bm" >
                                {/* <!-- breadcumb --> */}
                                <div className="breadcumb" ref={breadCumbRef}>
                                    <div className="row gx-0">
                                        <div className="col-lg-8 col-md-6 left d-flex align-items-center">
                                            <p><a href="dashboard.html">Dashboard</a> <span>/</span> <a href="">UserGraph</a> <span>/</span> User Details</p>
                                        </div>

                                        <div className="col-lg-4 col-md-6 right d-flex align-items-center justify-content-lg-end justify-content-md-end">
                                            <a href="#">
                                                <img
                                                    src={require('../../../Component/App_Details_theme/images/breadcumb-1.png')}
                                                    alt="breadcumb-icon"
                                                />
                                            </a>
                                            <a href=""><img src={require('../../../Component/App_Details_theme/images/breadcumb-2.png')} alt="breadcumb-icon" /></a>
                                            <a href=""><img src={require('../../../Component/App_Details_theme/images/breadcumb-3.png')} alt="breadcumb-icon" /></a>
                                            <a href=""><img src={require('../../../Component/App_Details_theme/images/breadcumb-4.png')} alt="breadcumb-icon" /></a>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- main content --> */}
                                <div className="main-content">
                                    <div className="row gx-0 main-row justify-content-between">
                                        <div className="col-lg-4">

                                            <div class="left-panel">
                                                <div className="date-panel w-100">
                                                    <div className="row gx-0 w-100">
                                                        <div className="col-4 d-flex left align-items-center">
                                                            
                                                            <div class="form-group">
                                                                <div class="form-check form-switch">
                                                                    <input
                                                                        class="form-check-input event-toggle"
                                                                        onChange={handleSwitchChange}
                                                                        type="checkbox"
                                                                        role="switch"
                                                                        id="flexSwitchCheckChecked"
                                                                        checked={eventToggle} // Set the checked property based on the eventToggle state
                                                                    />
                                                                </div>
                                                            </div>
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
                                                                defaultValue=""
                                                            >
                                                                <Select.Option value=''>All</Select.Option>
                                                            </Select>
                                                        </div>
                                                        <div className="col-8 d-flex align-items-center justify-content-end right">
                                                            <div className="input-group form-group input-daterange">

                                                                <Space direction="vertical" size={15}>
                                                                    <RangePicker
                                                                        presets={rangePresets}
                                                                        defaultValue={[startDate, endDate]}
                                                                        onChange={(dates, dateStrings) => handleDateChange(dates, dateStrings)}
                                                                    />
                                                                </Space>

                                                            </div>
                                                            <a href="" className="help-btn">
                                                                <img src={require('../../../Component/App_Details_theme/images/help-btn.png')} alt="Help-btn" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="date-install w-100">
                                                    <div class="row gx-0 w-100">
                                                        <div class="col-8">
                                                            <div class="row gx-0 d-flex justify-content-between">
                                                                <Tooltip title={moment(installDateAll).format('DD/MM/YYYY hh:mm:ss A')} >
                                                                    <div className="col-4 text-center">
                                                                        <h6>Install Date</h6>
                                                                        <h3 className='cursor_pointer_class'>{moment(installDateAll).format('DD/MM/YYYY') || '-'}</h3>
                                                                    </div>
                                                                </Tooltip>

                                                                <div class="col-4 text-center">
                                                                    <h6>Uninstall Date</h6>
                                                                    <h3>20/03/2023</h3>
                                                                </div>
                                                                <div class="col-4 text-center">
                                                                    <h6>Total time</h6>
                                                                    <h3>1 year </h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-4 d-flex align-items-center justify-content-end">
                                                            <Tooltip title={moment(lastEventTimeDate).format('DD/MM/YYYY hh:mm:ss A')} >
                                                                <p>{dateAgo(lastEventTimeDate) || '-'}</p>
                                                            </Tooltip>

                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="duration w-100">
                                                    <div class="row gx-0 w-100">
                                                        <div class="col-3 d-flex align-items-center">
                                                            <div class="arrow arrow-up">
                                                                <i class="ri-arrow-up-s-line"></i>
                                                            </div>
                                                            <div class="arrow arrow-down">
                                                                <i class="ri-arrow-down-s-line"></i>
                                                            </div>
                                                        </div>
                                                        <div class="col-9 d-flex align-items-center">
                                                            <div class="duration-row row w-100 justify-content-between gx-0">
                                                                <div class="col-3 text-center">
                                                                    <h6>Total Screen</h6>
                                                                    <h3>8</h3>
                                                                </div>
                                                                <div class="col-4 text-center">
                                                                    <h6>Total Duration</h6>
                                                                    <h3>{totalTimeDuration && secondsToMinutesAndHours(totalTimeDuration)}</h3>
                                                                </div>


                                                                <div class="col-5 text-center">
                                                                    <h6>Background Counter</h6>
                                                                    <h3>5</h3>
                                                                </div>
                                                            </div>

                                                            <div class="badge">
                                                                {Array.isArray(countData)
                                                                    ? countData.reduce((total, item) => total + item?.events?.length, 0)
                                                                    : 0} {/* Provide a default value or handle the case where countData is not an array */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="middle-border w-100"></div>

                                                {/* <!-- timeline --> */}

                                                <div className="timeline w-100" style={{ overflow: 'auto', maxHeight: '420px' }}>
                                                    {Array.isArray(countData) &&
                                                        countData
                                                            .slice()
                                                            .reverse() // Reverse the countData array
                                                            .map((item, index) => {
                                                                const itemDate = item?.events?.length
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        {item?.events?.map((row, i) => {
                                                                            const startDate = moment(row.startDate);
                                                                            const formattedDate = startDate.format(`DD MMMM YYYY`);

                                                                            // Initialize the count for this date
                                                                            if (!dateCounts[formattedDate]) {
                                                                                dateCounts[formattedDate] = 1;
                                                                            } else {
                                                                                dateCounts[formattedDate]++;
                                                                            }
                                                                            const reversedCount = itemDate - (dateCounts[formattedDate] - 1);
                                                                            const firstEventId = item?.history?.[item.history.length - 1]?._id;
                                                                            return (
                                                                                <div key={i} className="timeline w-100">
                                                                                    <div className={`main-item w-100`}>
                                                                                        <div className="information w-100">
                                                                                            <div className="row gx-0">
                                                                                                <div className="col-3 d-flex flex-column justify-content-center">
                                                                                                    {row.startDate && moment(row.startDate).isValid() && (
                                                                                                        <div>
                                                                                                            <h3>{moment(row.startDate).format(`DD MMMM YYYY`)}</h3>
                                                                                                        </div>
                                                                                                    )}

                                                                                                    <p>Splash time : <span>15 sec</span></p>
                                                                                                </div>

                                                                                                <div className="col-7 d-flex align-items-center">
                                                                                                    <div className="row d-flex justify-content-between gx-0 w-100">
                                                                                                        <div className="col-4 d-flex align-items-center justify-content-center">
                                                                                                            <i className="ri-smartphone-line"></i>
                                                                                                            <h5>4</h5>
                                                                                                        </div>
                                                                                                        <div className="col-4 d-flex align-items-center justify-content-center">
                                                                                                            <i className="ri-time-line"></i>
                                                                                                            <h5 className='font-width-fix'>{secondsToMinutesAndHours(row?.timeDuration || '-')}</h5>
                                                                                                        </div>
                                                                                                        <div className="col-4 d-flex align-items-center justify-content-center">
                                                                                                            <img src={require('../../../Component/App_Details_theme/images/counter-icon.png')} alt="counter-icon" />
                                                                                                            <h5>5</h5>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="col-2 d-flex align-items-center justify-content-end">
                                                                                                    <div className="badge">{reversedCount}</div>
                                                                                                    <div
                                                                                                        className="arrow timeline-collapse-btn"
                                                                                                        onClick={() => toggleCollapse(row?._id)}
                                                                                                    >
                                                                                                        {activePanels.includes(row?._id) ? (
                                                                                                            <i className="ri-arrow-down-s-line" />
                                                                                                        ) : (
                                                                                                            <i className="ri-arrow-up-s-line" />
                                                                                                        )}
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="body position-relative content_key">
                                                                                            <Collapse bordered={false} activeKey={activePanels.map(String)}>
                                                                                                <Panel header={null} key={row?._id}>
                                                                                                    {row?.history?.length > 0 ? (
                                                                                                        row?.history
                                                                                                            .slice()
                                                                                                            .reverse() // Reverse the order of events
                                                                                                            .map((dateALl, dateIndex) => {
                                                                                                                const reversedTime = moment(dateALl?.registerDate).format('hh:mm:ss A').split(':').join(':');
                                                                                                                return (
                                                                                                                    <div
                                                                                                                        className={`timeline-main ${activeEvent1 === dateALl._id ? 'active' : ''}`}
                                                                                                                        key={dateIndex}
                                                                                                                        onClick={() => handleChildClick1(dateALl._id)}
                                                                                                                    >
                                                                                                                        <div
                                                                                                                            className={`item ${activeEvent1 === dateALl._id ? 'active' : ''}`}
                                                                                                                            onClick={() => handleChildClick(dateALl, dateIndex, dateALl?._id, index)}
                                                                                                                        >
                                                                                                                            <div className={`row gx-0 cursor_pointer_class ${activeEvent1 === dateALl._id ? 'active' : ''}`} onClick={() => handleEventNameClick(dateALl._id)}>
                                                                                                                                <div className="col-2 column d-flex align-items-center date-width-fix">
                                                                                                                                    <h6>{reversedTime}</h6>
                                                                                                                                </div>
                                                                                                                                <div className={`col-9 column`} >
                                                                                                                                    <h5>{dateALl?.eventName}</h5>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </div>
                                                                                                                    </div>
                                                                                                                );
                                                                                                            })
                                                                                                    ) : (
                                                                                                        <div className="no-data-message-container">No data found</div>
                                                                                                    )}
                                                                                                </Panel>
                                                                                            </Collapse>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </React.Fragment>
                                                                )
                                                            })}
                                                    <div className="button">
                                                        <a href="" className="btn">
                                                            Load more events
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <!-- package --> */}
                                            <div className="left-panel-sec">
                                                <div className="package">
                                                    <div className="header">
                                                        <div className="row gx-0">
                                                            {<div className="col-6 d-flex align-items-center">

                                                                {browerAllDataShow?.isLive === 0 &&
                                                                    <Link to="" className="chrome" onClick={toggleTextDisplayBrower}>
                                                                        <img src={browerAllDataShow?.logo} alt="chrome" />
                                                                        {devicePropertiesAllData?.default_browser_package === 'not_found'
                                                                            ? '-'
                                                                            : getDisplayTextBrower(browerAllDataShow, 13)}
                                                                    </Link>}

                                                                {browerAllDataShowApp?.isLive === 0 &&
                                                                    <Link to="" className="playstore" onClick={toggleTextDisplay}>
                                                                        <img src={browerAllDataShowApp?.logo} alt="Playstore" />
                                                                        {devicePropertiesAllData?.default_app_store_package === 'not_found'
                                                                            ? '-'
                                                                            : getDisplayTextApp(browerAllDataShowApp, 13)}
                                                                    </Link>}
                                                            </div>}
                                                            <div className="col-6 d-flex align-items-center justify-content-end">
                                                                <div className="badge">9</div>
                                                                <div className="form-group search position-relative">
                                                                    <i className="ri-search-line"></i>
                                                                    <input type="search" className="form-control" placeholder="search text" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="title">
                                                        <h3>Package Name <img src={require('../../../Component/App_Details_theme/images/expand-arrow.png')} alt="expand-arrow" /></h3>
                                                    </div>
                                                    <div className="body">

                                                        <div className="row gx-lg-4 gx-0">
                                                            {getPackageIdLoading ? <Spin />
                                                                : appListAllData?.map((app, i) => {
                                                                    return (
                                                                        app?.isLive === 0 &&
                                                                        <div className="col-lg-6 col-md-6" key={i}>
                                                                            <div className="item w-100 d-flex">
                                                                                <div className="row gx-0 w-100">
                                                                                    <div className="col-10 d-flex">
                                                                                        <div className="img">
                                                                                            {app?.isLive === 0 ? (
                                                                                                app?.logo ? (
                                                                                                    <img src={app.logo} alt="" />
                                                                                                ) : (
                                                                                                    '-'
                                                                                                )
                                                                                            ) : (
                                                                                                '-'
                                                                                            )}
                                                                                        </div>
                                                                                        <div className="info">
                                                                                            {app?.isLive === 0 ? <h4 className='pointer-data' onClick={() => handleToggleText(app._id)}>{getDisplayText(app)}</h4> : '-'}
                                                                                            {app?.isLive === 0 ? <p>{app?.category || '-'}</p> : '-'}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-2 d-flex justify-content-end align-items-center">
                                                                                        <Typography.Paragraph
                                                                                            copyable={{
                                                                                                text: app?.packageName, // Text to copy
                                                                                            }}
                                                                                            className="d-flex align-items-center"
                                                                                        >
                                                                                        </Typography.Paragraph>
                                                                                        <a href={`https://play.google.com/store/apps/details?id=${app?.packageName}`} target='_blank'><img src={require('../../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="playstore" /></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-8">
                                            <div className="right-panel">
                                                <div class="right-header">
                                                    <div class="row gx-0">
                                                        <div class="col-6 d-flex align-items-start">
                                                            <h4>User Properties</h4>
                                                            <p>( PID : {deviceIdAndprojectId?.projectId} )
                                                                <Typography.Paragraph
                                                                    copyable={{
                                                                        text: deviceIdAndprojectId?.projectId,
                                                                    }}
                                                                    className="d-flex align-items-center"
                                                                >
                                                                </Typography.Paragraph></p>
                                                        </div>
                                                        <div class="col-6 d-flex align-items-center justify-content-end">

                                                            <Switch
                                                                size='small'
                                                                checked={switchOn} 
                                                                onChange={handleSwitchChange1} 
                                                            />
                                                            <div class="device-name d-flex align-items-center">
                                                                <i class="ri-smartphone-line"></i>
                                                                <span>Android Testing Device 3</span>
                                                            </div>
                                                            <a href="" class="star"><i class="ri-star-line"></i></a>
                                                            <h6>User No : <span>1250</span></h6>

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
                                                                Refresh
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="right-body">
                                                    <div className="info">
                                                        {
                                                            <div className="row gx-0">
                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>Country <span class="short">({(userPropertiesAllData?.code)})</span></h6>
                                                                    <h4 className='capital-text'>
                                                                        {userPropertiesAllData?.country ? (
                                                                            <>
                                                                                <span>{userPropertiesAllData?.emoji}</span>
                                                                                &nbsp;
                                                                                {userPropertiesAllData?.country}
                                                                            </>
                                                                        ) : (
                                                                            '-'
                                                                        )}
                                                                    </h4>

                                                                </div>
                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>State</h6>
                                                                    <h4 className='capital-text'>{userPropertiesAllData?.state || '-'}</h4>
                                                                </div>
                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>City</h6>
                                                                    <h4 className='capital-text'>{userPropertiesAllData?.city || '-'}</h4>
                                                                </div>
                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>Phone Language</h6>
                                                                    <h4 className='capital-text'>
                                                                        {userPropertiesAllData?.device_language === 'not_found' ? '-' : userPropertiesAllData?.device_language || '-'}
                                                                    </h4>
                                                                </div>

                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>App Language <span className="badge">9</span></h6>
                                                                    <h4 className='capital-text'>English</h4>
                                                                </div>
                                                                <div className="col-lg-2 col-4 col-md-4">
                                                                    <h6>App Version <span className="badge">9</span></h6>
                                                                    <h4 className='capital-text'>
                                                                        {devicePropertiesAllData?.app_version_name === 'not_found' ? '-' : devicePropertiesAllData?.app_version_name || '-'}
                                                                    </h4>
                                                                </div>
                                                            </div>
                                                        }
                                                        <div className="row gx-0">
                                                            <div className="col-lg-2 col-4 col-md-4">
                                                                <h6>Company Name</h6>
                                                                <h4 className='capital-text'>
                                                                    {userPropertiesAllData?.manufacturer === 'not_found' ? '-' : userPropertiesAllData?.manufacturer || '-'}
                                                                </h4>
                                                            </div>
                                                            <div className="col-lg-2 col-4 col-md-4">
                                                                <h6>Brand Name</h6>
                                                                <h4 className='capital-text'>
                                                                    {userPropertiesAllData?.brand === 'not_found' ? '-' : userPropertiesAllData?.brand || '-'}
                                                                </h4>
                                                            </div>
                                                            <div className="col-lg-2 col-4 col-md-4">
                                                                <h6>Model Name</h6>
                                                                <h4 className='capital-text'>
                                                                    {userPropertiesAllData?.model === 'not_found' ? '-' : userPropertiesAllData?.model || '-'}
                                                                </h4>
                                                            </div>
                                                            <div className="col-lg-2 col-4 col-md-4">
                                                                <h6>IP Address <span className="badge">9</span></h6>
                                                                <h4 >{userPropertiesAllData?.ipAddress || '-'}</h4>
                                                            </div>
                                                            <div className="col-lg-2 col-4 col-md-4 pointer-data" onClick={toggleDeviceId}>
                                                                <h6>Device ID</h6>
                                                                <Typography.Paragraph
                                                                    copyable={{
                                                                        text: encryptedDeviceId, // Text to copy (using the deviceId from queryParams)
                                                                    }}
                                                                >
                                                                    {getDisplayTextDevice({ deviceId: encryptedDeviceId })} {/* Pass the deviceId as an object */}
                                                                </Typography.Paragraph>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="tag d-flex align-items-center justify-content-between w-100">
                                                        <div className="item w-70">
                                                            <h3>2</h3>
                                                            <div className="bottom">BG Counter</div>
                                                        </div>
                                                        <div className="item w-70">
                                                            <h3>{totalSocketHistoryEventsAllEventData || '-'}</h3>
                                                            <div className="bottom">Total Event</div>
                                                        </div>
                                                        <div className="item w-55">
                                                            <h3>
                                                                {userPropertiesAllData?.ram === 'not_found' ? '-' : userPropertiesAllData?.ram ? `${userPropertiesAllData?.ram} GB` : '-'}
                                                            </h3>

                                                            <div className="bottom">RAM</div>
                                                        </div>
                                                        <div className="item w-55">
                                                            <h3>
                                                                {userPropertiesAllData?.android_os === 'not_found' ? '-' : userPropertiesAllData?.android_os || '-'}
                                                            </h3>
                                                            <div className="bottom">Android</div>
                                                        </div>

                                                        <div className="item w-70">
                                                            <h3>
                                                                {userPropertiesAllData?.device_screen_inch === 'not_found'
                                                                    ? '-'
                                                                    : (userPropertiesAllData?.device_screen_inch
                                                                        ? parseFloat(userPropertiesAllData.device_screen_inch).toFixed(2)
                                                                        : '-')}
                                                            </h3>
                                                            <div className="bottom">Screen Size</div>
                                                        </div>

                                                        <div className="item w-55">
                                                            <h3>
                                                                {userPropertiesAllData?.density === 'not_found' ? '-' : userPropertiesAllData?.density ? `${userPropertiesAllData?.density}X` : '-'}
                                                            </h3>

                                                            <div className="bottom">{textToRender}</div>
                                                        </div>

                                                        <div className="item w-100">
                                                            <Tooltip title={'Device Sim Name'}>
                                                                <h3>
                                                                    {devicePropertiesAllData?.device_sim_name === 'not_found'
                                                                        ? '-'
                                                                        : (devicePropertiesAllData?.device_sim_name ? devicePropertiesAllData.device_sim_name : '-')}
                                                                </h3>
                                                            </Tooltip>
                                                            <div className="bottom">Carrier</div>
                                                        </div>

                                                        <Tooltip title={'Device Screen Mode'}>
                                                            <div className="item icon w-50">
                                                                {devicePropertiesAllData?.device_screen_mode && devicePropertiesAllData?.device_screen_mode?.length > 0 ? (
                                                                    <>
                                                                        {devicePropertiesAllData.device_screen_mode[0] === 'light' ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/Sun.png')} alt="sun" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData.device_screen_mode[0] === 'dark' ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/moon.png')} alt="moon" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                            </>
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> {/* Remove the single quotes around 'Not Found' */}
                                                                    </>
                                                                )}
                                                            </div>
                                                        </Tooltip>

                                                        {devicePropertiesAllData?.is_wifi_on ? (
                                                            devicePropertiesAllData?.is_wifi_on[0] === "false" ? null : (
                                                                <Tooltip title={'Is Wifi On'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(devicePropertiesAllData?.is_wifi_on) &&
                                                                            devicePropertiesAllData?.is_wifi_on[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/wifi.png')} alt="Wifi" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData?.is_wifi_on === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}

                                                        {devicePropertiesAllData?.is_data_on ? (
                                                            devicePropertiesAllData?.is_data_on[0] === "false" ? null : (
                                                                <Tooltip title={'Is Data On'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(devicePropertiesAllData?.is_data_on) &&
                                                                            devicePropertiesAllData?.is_data_on[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/data-wifi.png')} alt="Wifi" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData?.is_data_on === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}

                                                        {devicePropertiesAllData?.is_proxy_on ? (
                                                            devicePropertiesAllData?.is_proxy_on[0] === "false" ? null : (
                                                                <Tooltip title={'Is Proxy On'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(devicePropertiesAllData?.is_proxy_on) &&
                                                                            devicePropertiesAllData?.is_proxy_on[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/go.png')} alt="Proxy" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData?.is_proxy_on === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}


                                                        {devicePropertiesAllData?.is_vpn_on ? (
                                                            devicePropertiesAllData?.is_vpn_on[0] === "false" ? null : (
                                                                <Tooltip title={'Is Vpn On'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(devicePropertiesAllData?.is_vpn_on) &&
                                                                            devicePropertiesAllData?.is_vpn_on[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/look.png')} alt="VPN" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData?.is_vpn_on === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}


                                                        {devicePropertiesAllData?.is_developer_option_on ? (
                                                            devicePropertiesAllData?.is_developer_option_on[0] === "false" ? null : (
                                                                <Tooltip title={'Is Developer Option On'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(devicePropertiesAllData?.is_developer_option_on) &&
                                                                            devicePropertiesAllData?.is_developer_option_on[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/%.png')} alt="Developer Options" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : devicePropertiesAllData?.is_developer_option_on === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}

                                                        {userPropertiesAllData?.is_emulator ? (
                                                            userPropertiesAllData?.is_emulator[0] === "false" ? null : (
                                                                <Tooltip title={'Is Emulator'}>
                                                                    <div className="item icon w-50">
                                                                        {Array.isArray(userPropertiesAllData?.is_emulator) &&
                                                                            userPropertiesAllData?.is_emulator[0] === "true" ? (
                                                                            <>
                                                                                <img src={require('../../../Component/App_Details_theme/images/mobile.png')} alt="mobile" />
                                                                                <div className="badge">9</div>
                                                                            </>
                                                                        ) : userPropertiesAllData?.is_emulator === 'not_found' ? (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" />
                                                                        ) : (
                                                                            <img src={require('../../../Component/App_Details_theme/images/null.png')} alt="null" /> // Handle other cases if needed
                                                                        )}
                                                                    </div>
                                                                </Tooltip>
                                                            )
                                                        ) : null}

                                                    </div>

                                                    <div className="source">
                                                        <div className="row gx-0">
                                                            {userPropertiesAllData?.referrer?.map((google, i) => {
                                                                return (
                                                                    <>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>utm_source</h5>
                                                                            <h3 className='capital-text'>{google[0]?.utm_source === 'not_found' ? '-' : google[0]?.utm_source || '-'}</h3>
                                                                        </div>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>utm_medium</h5>
                                                                            <h3 className='capital-text'>{google[0]?.utm_medium === 'not_found' ? '-' : google[0]?.utm_medium || '-'}</h3>
                                                                        </div>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>utm_term</h5>
                                                                            <h3 className='capital-text'>{google[0]?.utm_term === 'not_found' ? '-' : google[0]?.utm_term || '-'}</h3>
                                                                        </div>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>utm_content</h5>
                                                                            <h3 className='capital-text'>{google[0]?.utm_content === 'not_found' ? '-' : google[0]?.utm_content || '-'}</h3>
                                                                        </div>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>utm_campaign</h5>
                                                                            <h3 className='capital-text'>{google[0]?.utm_campaign === 'not_found' ? '-' : google[0]?.utm_campaign || '-'}</h3>
                                                                        </div>
                                                                        <div className="col-lg-2 col-4">
                                                                            <h5>anid</h5>
                                                                            <h3 className='capital-text'>{google[0]?.anid === 'not_found' ? '-' : google[0]?.anid || '-'}</h3>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })

                                                            }

                                                        </div>
                                                    </div>

                                                    <div className="properties">
                                                        <h2>Event Properties</h2>
                                                        <div className="row body gx-0">
                                                            <div className="col-12 col-lg-8 col-md-8">
                                                                {dynamicKeyValuePairs}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                </main >
            </div >
        </>
    )
}

export default AppAnalytic