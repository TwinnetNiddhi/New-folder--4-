import React, { useEffect, useRef, useState } from 'react';
import Header from '../../Headers/Header'
import Navbar from '../../Headers/Navbar'
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { Skeleton, Space, Switch, Table, Tooltip } from 'antd';
import socket from '../../socket.io/service';
import { Button, Input, Form } from 'antd';
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined, AndroidOutlined, AppleOutlined, DesktopOutlined, EyeInvisibleOutlined, CopyOutlined, CloseCircleFilled } from '@ant-design/icons';
import '../../../Component/Preferences/Project/Project.css'
// import '../../../Component/App_Details_theme/css/dashboard.css';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery'
import { Helmet } from 'react-helmet';

const { Paragraph } = Typography;

const { Option } = Select

const Project = () => {
    const [filterValue, setFilterValue] = useState('ios');
    const [createData, setCreateData] = useState({
        name: '',
        shortName: '',
        platForm: '',
        packageName: '',
    });
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState([]);
    const [getAllDataPass, setGetAllDataPass] = useState(false);
    const [idPass, setIdPass] = useState();
    const [searchDataAll, setSearchDataAll] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(10); // Items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of items
    const formRef = useRef();
    const [form] = Form.useForm()
    const [visibleRows, setVisibleRows] = useState({});
    const [projectIds, setProjectIds] = useState([]); // Store unique project IDs htmlFor filtering
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [selectedStatusData, setSelectedStatusData] = useState(0); // Call the function
    const [switchOn, setSwitchOn] = useState(
        localStorage.getItem('switchState') === 'true'
    );
    const [selectedPlatFormData, setSelectedPlatFormData] = useState('android'); // Call the function
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const toggleApiKeyVisibility = (rowId) => {
        setVisibleRows((prevVisibleRows) => ({
            ...prevVisibleRows,
            [rowId]: !prevVisibleRows[rowId],
        }));
    };

    const onFinish = async (values) => {
        try {
            const successCallback = (response) => {
                setLoadingSave(false);
                setLoadingUpdate(false);

                if (response?.success) {
                    CustomMessage('success', response?.message);
                    setGetAllDataPass(false);
                    form.resetFields();
                    setFilterValue('');
                    socket.emit('project|get|all', { page: currentPage, limit: pageSize, search: searchDataAll, status: selectedStatusData, platform: selectedPlatFormData });
                } else {
                    CustomMessage('error', response?.message);
                }
            };

            if (getAllDataPass) {
                setLoadingUpdate(true);
                socket.emit('project|put|update', {
                    projectId: idPass,
                    updatedFields: {
                        name: createData.name,
                        shortName: createData.shortName,
                        platForm: filterValue,
                        packageName: createData.packageName,
                    },
                });
                socket.once('project|put|update', successCallback);
            } else {
                setLoadingSave(true);
                socket.emit('project|post|create', {
                    CreateFields: {
                        name: createData.name,
                        shortName: createData.shortName,
                        platForm: filterValue,
                        packageName: createData.packageName,
                    },
                });
                socket.once('project|post|create', successCallback);
            }
        } catch (error) {
            console.log(error, 'error');
            CustomMessage('error', error?.message);
            setLoadingSave(false); // Set loadingSave to false in case of an error
            setLoadingUpdate(false); // Set loadingUpdate to false in case of an error
        } finally {
        }
    };

    const handleRefreshClick = () => {
        if (!isFetching) {
            ProjectGetAllDataShow()
        }
    };

    useEffect(() => {
        if (switchOn) {
            ProjectGetAllDataShow()
        }
    }, [pageSize, currentPage, searchDataAll, selectedStatusData, selectedPlatFormData, switchOn]);

    const ProjectGetAllDataShow = () => {
        try {
            if (searchLoading) {
                setSearchLoading(false)
                socket.emit('project|get|all', { page: currentPage, limit: pageSize, search: searchDataAll, status: selectedStatusData, platform: selectedPlatFormData });
                socket.on('project|get|all', (response) => {
                    if (response.success) {
                        setTableData(response?.data);
                        setTotalItems(response?.totalItems);
                    }
                    setLoading(false)
                });

            } else {
                setLoading(true)
                setSearchLoading(false)
                socket.emit('project|get|all', { page: currentPage, limit: pageSize, search: searchDataAll, status: selectedStatusData, platform: selectedPlatFormData });
                socket.on('project|get|all', (response) => {
                    if (response.success) {
                        setTableData(response?.data);
                        setTotalItems(response?.totalItems);
                    }
                    setLoading(false)
                });
            }

        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
            setLoading(false)
            setSearchLoading(false);
        } finally {

        }
    }

    const onInputChange = (e, fieldName) => {
        const { value } = e.target;
        setCreateData((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };

    const EditAllData = (row) => {
        formRef.current.resetFields(); // Reset the form fields
        formRef.current.setFieldsValue({
            shortName: row.shortName,
            name: row.name,
            packageName: row.packageName,
            platform: row.platForm, // Corrected 'platForm' to 'platform'
        });
        setIdPass(row?._id);
        setGetAllDataPass(true);
        setFilterValue(row?.platForm); // Corrected 'platForm' to 'platform'
    };

    const DeleteAllData = (row) => {
        let deleted = true;
        try {
            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    socket.emit('project|delete|delete', { projectId: row?._id });
                    socket.once('project|delete|delete', (response) => {
                        if (response?.success) {
                            CustomMessage('success', response?.message);
                            socket.emit('project|get|all', { page: currentPage, limit: pageSize, search: searchDataAll, status: selectedStatusData, platform: selectedPlatFormData });
                            if (response.deleted) {
                                deleted = true;
                            } else {
                                deleted = false;
                            }
                        } else {
                            CustomMessage('error', response?.message);
                            deleted = false;
                        }
                    });
                }
            });
        } catch (error) {
            console.log(error, 'error');
            CustomMessage('error', error?.message);
            deleted = false;
        }
    };

    const handleSearchData = (e) => {
        setCurrentPage(1);
        setSearchLoading(true);
        setSearchDataAll(e?.target?.value);
    };

    const handleSwitchChange = async (id, checked) => {
        try {
            const continueCall = checked ? 0 : 1;
            socket.emit('project|put|updateStatus', {
                projectId: id,
                status: continueCall,
            });

            socket.once('project|put|updateStatus', (response) => {
                if (response?.success) {
                    setTableData((prevData) =>
                        prevData.map((row) => (row._id === id ? { ...row, status: continueCall } : row))
                    );
                    CustomMessage('success', response?.message);
                } else {
                    CustomMessage('error', response?.message);
                }
            });
        } catch (error) {
            console.error('Socket error:', error);
            CustomMessage('error', error?.message);
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'No',
            dataIndex: 'No',
            key: 'no',
            width: '84px',
            sorter: (a, b) => a.No - b.No,
            render: (text, record, index) => {
                const reversedNo = totalItems - (currentPage - 1) * pageSize - index;
                return reversedNo;
            },
            className: 'no-className'
        },
        {
            title: (
                <div className='font-weight-all-filed'>
                    App Name
                </div>
            ),
            dataIndex: 'appName',
            key: 'appName',
            width: '250px',
            render: (text, record) => {
                return (
                    <div className="appname-project">
                        <div className='d-flex-project'>
                            <div className='img-project-redords'>
                                {record?.appDetails?.length > 0 ?
                                    record?.appDetails?.map((rowDataAll) => {
                                        return (
                                            <>
                                                {rowDataAll?.isLive === 0 ? rowDataAll?.logo ?
                                                    <img src={rowDataAll?.logo} alt='PDF' className='image-pdf-logo' />
                                                    : <img src={require('../../../Component/App_Details_theme/images/Not-Image_sysmbol.png')} alt='PDF' className='image-pdf-logo' /> : <img src={require('../../../Component/App_Details_theme/images/Not-Image_sysmbol.png')} alt='PDF' className='image-pdf-logo' />}
                                            </>
                                        )
                                    })
                                    : <img src={require('../../../Component/App_Details_theme/images/Not-Image_sysmbol.png')} alt='PDF' className='image-pdf-logo' />}

                            </div>
                            <div className='info'>
                                <h4 className='name-shortname'>{record?.shortName}. {record?.name}</h4>
                                <p className='project-id-redords'>
                                    <Paragraph
                                        copyable={{
                                            text: record?.packageName,
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
                                        className='svg_flex'
                                    >
                                        <div className='apikey_color'>{record?.packageName}</div>
                                    </Paragraph>
                                </p>
                            </div>
                        </div>

                    </div>
                );
            },
        },
        {
            title: 'Project ID',
            dataIndex: 'projectId',
            key: 'projectId',
            width: '150px',
            filterSearch: true,
            sorter: (a, b) => a.projectId.localeCompare(b.projectId),
            filters: projectIds.map((projectId) => ({
                text: projectId,
                value: projectId,
            })),
            onFilter: (value, record) => record.projectId === value,
            className: 'no-className'
        },
        {
            title: 'API Key',
            dataIndex: 'apiKey',
            key: 'apiKey',
            width: '250px',
            sorter: (a, b) => a.apiKey.localeCompare(b.apiKey),
            render: (apiKey, record) => {
                return (
                    <>
                        {visibleRows[record._id] ? (
                            <>
                                <Paragraph
                                    copyable={{
                                        text: apiKey,
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
                                    className='svg_flex'
                                >
                                    <div className='apikey_color'>{apiKey}</div>
                                </Paragraph>
                            </>
                        ) : (
                            <div className='toggle-icon'>
                                <EyeInvisibleOutlined
                                    className='toggle-button'
                                    onClick={() => toggleApiKeyVisibility(record._id)}
                                />
                            </div>
                        )}
                    </>
                );
            },
            filterSearch: true, // Enable filter search input
            filters: tableData.map((record) => ({
                text: record?.apiKey, // Use the apiKey as the filter option text
                value: record?.apiKey, // Use the apiKey as the filter option value
            })),
            onFilter: (value, record) => {
                return record.apiKey.toLowerCase().includes(value.toLowerCase());
            },
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
            // sorter: (a, b) => customSort(a.Platform, b.Platform),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: '112px',
            sorter: (a, b) => a.status - b.status, // Sort based on the switch state
            render: (status, record) => (
                <Space key={record._id} direction="vertical">
                    <Switch
                        checked={status === 0 ? true : false}
                        size="small"
                        className='switch_width'
                        onChange={(checked) => {
                            handleSwitchChange(record._id, checked);
                        }}
                    />
                </Space>
            ),
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            width: '120px',
            key: 'Action',
            render: (text, record) => {
                return (
                    <Space>
                        <Tooltip title="Edit">
                            <EditOutlined
                                onClick={() => EditAllData(record)}
                                className='edit-className toggle-button'
                            />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteOutlined
                                onClick={() => DeleteAllData(record)}
                                className='delete-className toggle-button'
                            />
                        </Tooltip>

                    </Space>
                );
            },
        },
        {
            title: 'Registration Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '250px',
            sorter: (a, b) => {
                const dateA = moment(a['createdAt']);
                const dateB = moment(b['createdAt']);
                return dateA - dateB;
            },
            render: (text, record) => moment(record['createdAt']).format('DD-MM-YYYY hh:mm A'), // Format the date using moment with AM/PM
        },
    ];

    useEffect(() => {
        if (tableData && tableData.length > 0) {
            const initialVisibleRows = {};
            tableData.forEach((item) => {
                initialVisibleRows[item._id] = false;
            });
            setVisibleRows(initialVisibleRows);
        }
    }, [tableData]);

    useEffect(() => {
        const uniqueProjectIds = [...new Set(tableData.map((record) => record.projectId))];
        setProjectIds(uniqueProjectIds);

    }, [tableData, visibleRows]);


    const handleChangesPlatFormAllData = (e) => {
        setSelectedPlatFormData(e)
    }
    const handleChangesStatusAllData = (e) => {
        setSelectedStatusData(e)
    }

    const handleSwitchChange1 = (newValue) => {
        updateSwitchState(newValue);
    };

    const updateSwitchState = (newValue) => {
        setSwitchOn(newValue);
        localStorage.setItem('switchState', newValue);
    };

    const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="8" className="skeleton-loader">

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
            row: loading ? SkeletonRow : undefined, // Use SkeletonRow component when loading is true
        },
    };


    useEffect(() => {
        var windowtop = $('#dashboard-page .top-header').outerHeight();
        var project = $('#dashboard-page .project').outerHeight();
        var projectmargin = $('#dashboard-page .project').css('margin-top');
        var projectrecordsmargin = $('#dashboard-page .project-records').css('margin-top');
        var bodyHeight = $('main').height();
        var mobilenav = $('.mobile-nav').height();

        let mobile = bodyHeight - mobilenav - 20;
        let total = bodyHeight - windowtop - project - parseFloat(projectmargin) - parseFloat(projectrecordsmargin);

        if ($(window).width() < 991) {
            $('#dashboard-page .main-dashboard').css('height', mobile);
        }
        if ($(window).width() > 991) {
            // Set the height and apply overflow property to make it scrollable
            $('#dashboard-page .project-records')
                .css('height', total)
                .css('overflow', 'auto'); // Add this line
        }
    }, []);

    return (
        <>
            <Helmet>
                <title>Project</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form
                        name="basic"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        form={form}
                        ref={formRef}
                    >
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{getAllDataPass ? 'Update Project' : 'Create Project'}</h2>
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

                        <div className="body">
                            <div className="d-lg-flex d-md-flex">
                                <div className="form-group sname">
                                    <label htmlFor="shortName">Short Name<span className="required">*</span></label>

                                    <Form.Item
                                        name="shortName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Short Name!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            value={createData?.shortName}
                                            onChange={(e) => onInputChange(e, 'shortName')}
                                            name="shortName"
                                            placeholder="Short Name"
                                            id="sname" className="form-control Short Name"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group name">
                                    <label htmlFor="name">Name<span className="required">*</span></label>
                                    <Form.Item
                                        name="name"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Name!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Name"
                                            value={createData?.name}
                                            onChange={(e) => onInputChange(e, 'name')}
                                            name="name"
                                            className="form-control"
                                        />
                                    </Form.Item>

                                </div>
                                <div className="form-group pname">
                                    <label htmlFor="pname">Package Name<span className="required">*</span></label>
                                    <Form.Item
                                        name="packageName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Package Name!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            id="pname"
                                            value={createData?.packageName}
                                            onChange={(e) => onInputChange(e, 'packageName')}
                                            name="packageName"
                                            placeholder="Package Name"
                                            className="form-control"
                                        />
                                    </Form.Item>

                                </div>

                                <div className="form-group platform">
                                    <label htmlFor="platform" >Platform<span className="required">*</span></label>
                                    <Form.Item name="platform"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your plat Form!',
                                            },
                                        ]}
                                        className='height-set-Description'
                                    >
                                        <Select
                                            id="platform"
                                            placeholder="Selected PlatForm"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            value={filterValue}
                                            onChange={(value) => setFilterValue(value)}
                                        >
                                            <Option value="ios"> <AppleOutlined />&nbsp; Ios</Option>
                                            <Option value="android"><AndroidOutlined className='platform-className' />&nbsp; Android</Option>
                                            <Option value="webdeveloper" className="custom-option">
                                                <DesktopOutlined className='desktop-icon-margin' /> Web Developer
                                            </Option>

                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group d-flex align-items-end button-color">
                                    <Button type="primary" htmlType="submit" loading={getAllDataPass ? loadingUpdate : loadingSave} className="btn ">
                                        {getAllDataPass ? 'Update' : 'Save'}
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </Form>
                </div>
                {/* <!-- Project Records --> */}
                <div className="project-records">
                    <div className="header">
                        <div className="row">
                            <div className="col-lg-6 col-md-4 left">
                                <h2>Project Records</h2>
                            </div>
                            <div className="col-lg-6 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                                <div className="form-group platform">
                                    <label htmlFor="platform" >Platform</label>
                                    <Form.Item className='height-set-Description'>
                                        <Select
                                            id="platform"
                                            placeholder="Selected Value"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                            }
                                            value={selectedPlatFormData}
                                            onChange={handleChangesPlatFormAllData}
                                        >
                                            <Option value="">All</Option>
                                            <Option value="ios">
                                                <AppleOutlined /> Ios
                                            </Option>
                                            <Option value="android">
                                                <AndroidOutlined className="platform-className" /> Android
                                            </Option>
                                            <Option value="webdeveloper" className="custom-option">
                                                <DesktopOutlined className="desktop-icon-margin" /> Web Developer
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group status">
                                    <label htmlFor="status">Status</label>
                                    <Form.Item className='height-set-Description'>
                                        <Select
                                            id="platform"
                                            placeholder="Selected Value"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                            }
                                            value={selectedStatusData} // Use the integer directly
                                            onChange={(value) => {
                                                setSelectedStatusData(value); // Use the selected value directly as an integer
                                                handleChangesStatusAllData(value); // Pass the selected value to your handler
                                            }}
                                        >
                                            <Option value=''>All</Option>
                                            <Option value={0} key="0">
                                                Active
                                            </Option>
                                            <Option value={1} key="1" className="custom-option">
                                                Disable
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="status" className="label-with-space">Search</label>
                                    <Search
                                        placeholder="Search"
                                        value={searchDataAll}
                                        onChange={handleSearchData}
                                        className='search-input-loader' loading={searchLoading} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="body">
                        <Table
                            columns={columns}
                            rowKey={(record) => record.id} // Use the appropriate property here
                            dataSource={tableData}
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
                                showSizeChanger: true,
                                showQuickJumper: true,
                                onChange: (page) => setCurrentPage(page),
                                onShowSizeChange: (current, size) => setPageSize(size),
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            components={customComponents}
                            className='body-row'
                            size="small"
                        />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Project