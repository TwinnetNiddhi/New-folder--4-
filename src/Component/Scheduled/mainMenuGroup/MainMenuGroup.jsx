import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { Skeleton, Space, Switch, Table, Tooltip } from 'antd';
import { Button, Input, Form } from 'antd';
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../../../Component/Preferences/Project/Project.css'
import '../../../Component/App_Details_theme/css/dashboard.css';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import '../../../Component/Scheduled/backendRoutes/BackendRoutes.css'
import '../../../Component/Scheduled/mainMenuGroup/MainMenuGroup.css'
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { MainMenuGroupData } from '../../Redux/auth/action';
import socketData from '../../../Component/socket/socket/service';
import CustomMessage from '../../CustomMessage/CustomMessage';
import * as AntIcons from '@ant-design/icons';
import mainHoc from '../../hoc/mainHoc';
import socket from "../../../Component/socket.io/service";
import $ from 'jquery';
import { Helmet } from 'react-helmet';

const { Paragraph } = Typography;

const { Option } = Select
const { TextArea } = Input;

function MainMenuGroup() {
    const [filterValue, setFilterValue] = useState();
    const [filterValueBackend, setFilterValueBackend] = useState();
    const [createData, setCreateData] = useState({
        menuName: '',
        routerPath: '',
        description: '',
        type: '',
        backend: '',
        iconName: '',
    });
    const [loading, setLoading] = useState(true);
    const data_Main_Menu = useSelector(state => state?.authReducer?.payload1)
    const [tableData, setTableData] = useState([]);
    const [getAllDataPass, setGetAllDataPass] = useState(false);
    const [idPass, setIdPass] = useState();
    const [searchDataAll, setSearchDataAll] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const [pageSize, setPageSize] = useState(20); // Items per page
    const [totalItems, setTotalItems] = useState(0); // Total number of items
    const formRef = useRef();
    const [form] = Form.useForm()
    const [visibleRows, setVisibleRows] = useState({});
    const [projectIds, setProjectIds] = useState([]); // Store unique project IDs htmlFor filtering
    const [loadingSave, setLoadingSave] = useState(false);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [selectedPlatFormData, setSelectedPlatFormData] = useState('android'); // Call the function
    const [selectedStatusData, setSelectedStatusData] = useState(0); // Call the function
    const [switchOn, setSwitchOn] = useState(
        localStorage.getItem('switchState') === 'true'
    );
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [roteTypeAllData, setRoteTypeAllData] = useState()
    const [backendAllData, setBackendAllData] = useState()
    const [statusPass, setStatusPass] = useState()
    const [filterroteTypeAllData, setFilterroteTypeAllData] = useState()
    const [filterroteTypeAllDataAll, setFilterroteTypeAllDataAll] = useState('')
    const [expandedRows, setExpandedRows] = useState([]);
    const [copiedText, setCopiedText] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    let dispatch = useDispatch()
    const [iconName, setIconName] = useState(null);

    useEffect(() => {
        const IconComponent = AntIcons[createData.iconName];
        setIconName(IconComponent ? <IconComponent /> : '');
    }, [createData]);

    const handleCopy = (text) => {
        setCopiedText(text);
        setIsCopied(true);
        CustomMessage('success', 'Text copied to clipboard');
    };

    const handleToggleExpand = (record) => {
        if (expandedRows.includes(record.key)) {
            setExpandedRows(expandedRows.filter((rowKey) => rowKey !== record.key));
        } else {
            setExpandedRows([...expandedRows, record.key]);
        }
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
                    setFilterValueBackend('');
                    socket.emit('mainGroup|getAll',
                        {
                            details: {
                                page: currentPage.toString(),
                                limit: pageSize.toString(),
                                search: searchDataAll,
                                status: selectedStatusData,
                                type: filterroteTypeAllDataAll
                            }
                        });
                } else {
                    CustomMessage('error', response?.message);
                }
            };

            if (getAllDataPass) {
                setLoadingUpdate(true);
                const backendArray = filterValueBackend.map(backendRouterId => ({
                    BackendRouterId: backendRouterId,
                    status: statusPass.toString(),
                }));
                socket.emit('mainGroup|update', {
                    _id: idPass,
                    menuName: createData.menuName,
                    routerPath: createData.routerPath,
                    type: filterValue.map((roleType) => ({ roleType, status: statusPass.toString(), })),
                    description: createData.description,
                    iconName: createData.iconName,
                    backend: backendArray,
                    status: statusPass.toString()
                });

                socket.once('mainGroup|update', successCallback);
            } else {
                setLoadingSave(true);
                const backendArray = filterValueBackend.map(backendRouterId => ({
                    BackendRouterId: backendRouterId
                }));
                socket.emit('mainGroup|post', {
                    menuName: createData.menuName,
                    routerPath: createData.routerPath,
                    type: filterValue.map(roleType => ({ roleType })),
                    description: createData.description,
                    iconName: createData.iconName,
                    backend: backendArray
                });

                socket.once('mainGroup|post', successCallback);
            }
        } catch (error) {
            console.log(error, 'error');
            CustomMessage('error', error?.message);
            setLoadingSave(false); // Set loadingSave to false in case of an error
            setLoadingUpdate(false); // Set loadingUpdate to false in case of an error
        } finally {
            // You can add any cleanup code here if needed
        }
    };

    const handleRefreshClick = () => {
        if (!isFetching) {
            MenuGroupGetAllDataShow()
            TypeGetAllDataShow()
            BackendGetAllDataShow()
        }
    };

    useEffect(() => {
        if (switchOn) {
            MenuGroupGetAllDataShow()
        }
    }, [pageSize, currentPage, searchDataAll, selectedStatusData, selectedPlatFormData, switchOn, filterroteTypeAllDataAll]);

    const MenuGroupGetAllDataShow = async () => {
        try {
            // Dispatch the loginHandler action, which emits the OTP verification event
            await dispatch(MainMenuGroupData(currentPage, pageSize, setTotalItems,
                selectedStatusData, setTableData, filterroteTypeAllDataAll, searchDataAll,
                setLoading, setSearchLoading, searchLoading));

        } catch (error) {
            console.error(error);
            CustomMessage('error', error?.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (switchOn) {
            TypeGetAllDataShow()
            BackendGetAllDataShow()
        }
    }, [])

    const TypeGetAllDataShow = () => {
        try {
            socket.emit('role|getRole',
                {
                    details: {
                        page: 1,
                        limit: 1000000000,
                        search: '',
                        status: '0',
                        type: ''
                    }
                });
            socket.on('role|getRole', (response) => {
                if (response.success) {
                    setRoteTypeAllData(response?.data?.items)
                    setFilterroteTypeAllData(response?.data?.items)
                }
                setLoading(false)
            });

        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
        }
    }

    const BackendGetAllDataShow = () => {
        try {
            socket.emit('backendRouter|getAll',
                {
                    details: {
                        page: 1,
                        limit: 1000000000,
                        search: '',
                        status: '0',
                    }
                });
            socket.on('backendRouter|getAll', (response) => {
                if (response.success) {
                    setBackendAllData(response?.data?.items)
                }
                setLoading(false)
            });

        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
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
        const typeValue = row.type.map((item) => item.roleType);
        const backendbackend_id = row.backendRoutet_data.map((item) => item._id);
        form.setFieldsValue({
            menuName: row.menuName,
            routerPath: row.routerPath,
            description: row.description,
            iconName: row.iconName,
            type: typeValue,
            backend: backendbackend_id,
        });
        setIdPass(row._id);
        setStatusPass(row?.status)
        setGetAllDataPass(true);
        setFilterValue(typeValue);
        setFilterValueBackend(backendbackend_id)
        setCreateData({  // Update the createData state
            menuName: row.menuName,
            routerPath: row.routerPath,
            description: row.description,
            type: row.type,
            iconName: row.iconName,
            backend: row.backendRoutet_data
        });
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
                    socket.emit('mainGroup|delete', { _id: row?._id });
                    socket.once('mainGroup|delete', (response) => {
                        if (response?.success) {
                            CustomMessage('success', response?.message);
                            socket.emit('mainGroup|getAll',
                                {
                                    details: {
                                        page: currentPage.toString(),
                                        limit: pageSize.toString(),
                                        search: searchDataAll,
                                        status: selectedStatusData,
                                        type: filterroteTypeAllDataAll
                                    }
                                });
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
            setLoading(false);
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
            socket.emit('mainGroup|status', {
                _id: id,
                status: continueCall.toString(),
            });

            socket.once('mainGroup|status', (response) => {
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
            console.error('socket error:', error);
            CustomMessage('error', 'An error occurred while updating status value.');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: 'Menu Name',
            dataIndex: 'menuName',
            key: 'menuName',
        },
        {
            title: 'Router Path',
            dataIndex: 'routerPath',
            key: 'routerPath',
        },
        {
            title: 'Backend Event Name',
            dataIndex: 'Backend',
            key: 'Backend',
            // width: '250px',
            render: (text, record) => {
                const roleTypeData = record?.backendRoutet_data || [];
                const buttons = [];

                for (let i = 0; i < roleTypeData.length; i += 1) {
                    const rowItems = roleTypeData.slice(i, i + 1);
                    const rowButtons = rowItems.map((element, index) => (
                        <CopyToClipboard text={element?.event} onCopy={() => handleCopy(element?.event)}>
                            <Button
                                type="primary"
                                size="small"
                                shape="round"
                                value="default"
                                style={{ marginBottom: '4px', background: element?.colorCode, cursor: 'pointer' }}
                                key={index}
                            >
                                {element?.event}
                            </Button>
                        </CopyToClipboard>
                    ));
                    buttons.push(
                        <div style={{ display: 'flex', gap: '4px' }} key={i}>
                            {rowButtons}
                        </div>
                    );
                }
                return <>{buttons}</>;
            },
        },
        {
            title: 'Role Type',
            dataIndex: 'Type',
            key: 'Type',
            // width: '250px',
            render: (text, record) => {
                const roleTypeData = record?.roleType_data || [];
                const buttons = [];

                for (let i = 0; i < roleTypeData.length; i += 1) {
                    const rowItems = roleTypeData.slice(i, i + 1);
                    const rowButtons = rowItems.map((element, index) => (
                        <Button
                            type="primary"
                            size="small"
                            value="default"
                            style={{ marginBottom: '4px', background: element?.colorCode }}
                            key={index}
                        >
                            {element?.name}
                        </Button>
                    ));
                    buttons.push(
                        <div style={{ display: 'flex', gap: '4px' }} key={i}>
                            {rowButtons}
                        </div>
                    );
                }
                return <>{buttons}</>;
            },
        },
        {
            title: 'Icon Name',
            dataIndex: 'iconName',
            key: 'iconName',
            render: (text, record) => {
                const IconComponent = AntIcons[record.iconName];

                return IconComponent ? <IconComponent className="icon-16px" /> : null;
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text, record) => {
                const isExpanded = expandedRows.includes(record.key);
                const shouldShowEllipsis = text.length > 13;

                return (
                    <div onClick={() => handleToggleExpand(record)} style={{ cursor: 'pointer' }}>
                        {isExpanded ? text : shouldShowEllipsis ? `${text.slice(0, 12)}...` : text || '-'}
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            // width: '112px',
            sorter: (a, b) => a.status - b.status,
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
            // width: '120px',
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
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            // width: '200px',
            render: (text, record) => {
                const formattedDate = moment(record.updatedAt).format('DD/MM/YYYY hh:mm:ss A');
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Register date',
            dataIndex: 'registerdate',
            key: 'registerdate',
            // width: '200px',
            render: (text, record) => {
                const formattedDate = moment(record.registerdate).format('DD/MM/YYYY hh:mm:ss A');
                return <span>{formattedDate}</span>;
            },
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

    const handleChangesStatusAllData = (e) => {
        setCurrentPage(1)
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
                        <td colSpan="10" className="skeleton-loader">

                            <Skeleton loading={loading} round={true} active paragraph={{
                                rows: 1,
                            }} className='skeleton-line'>

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
                <title>Main Menu Group</title>
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
                                    <h2>{getAllDataPass ? 'Menu Group Routes' : 'Menu Group Routes'}</h2>
                                </div>
                                <div class="col-6 d-flex align-items-center justify-content-end">

                                    <Switch
                                        size='small'
                                        checked={switchOn}
                                        onChange={handleSwitchChange1}
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
                                    <label htmlFor="name">Menu Name<span className="required">*</span></label>
                                    <Form.Item
                                        name="menuName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Menu Name!',
                                            },
                                        ]}
                                    >
                                        <Input
                                            type="text"
                                            value={createData?.menuName}
                                            onChange={(e) => onInputChange(e, 'menuName')}
                                            name="menuName"
                                            placeholder="Menu Name"
                                            id="sname" className="form-control Short Name"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="name">Routes Path</label>

                                    <Form.Item
                                        name="routerPath"
                                    >
                                        <Input
                                            type="text"
                                            value={createData?.routerPath}
                                            onChange={(e) => onInputChange(e, 'routerPath')}
                                            name="routerPath"
                                            placeholder="Routes Path"
                                            id="sname" className="form-control Short Name"
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group platform">
                                    <label htmlFor="backend">Backend Event Name</label>
                                    <Form.Item name="backend"
                                        className='height-set-Description'
                                    >
                                        <Select
                                            id="platform"
                                            placeholder="Backend Event Name"
                                            showSearch
                                            mode='multiple'
                                            style={{
                                                width: "100%",
                                            }}

                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            value={filterValueBackend}
                                            onChange={(value) => setFilterValueBackend(value)}
                                        >
                                            {
                                                backendAllData?.map((rowData, i) => {
                                                    return (
                                                        <>
                                                            <Option value={rowData?._id}>{rowData?.event}</Option>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group platform">
                                    <label htmlFor="type" >Role Type<span className="required">*</span></label>
                                    <Form.Item name="type"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Role Type!',
                                            },
                                        ]}
                                        className='height-set-Description'
                                    >
                                        <Select
                                            id="platform"
                                            placeholder="Role Type"
                                            showSearch
                                            mode='multiple'
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
                                            {
                                                roteTypeAllData?.map((rowData, i) => {
                                                    return (
                                                        <>
                                                            <Option value={rowData?.type} style={{ color: rowData?.colorCode }}>
                                                                {rowData?.name}</Option>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="name">Icon Name</label>
                                    <Form.Item
                                        name="iconName"
                                        className='height-set-Description'
                                    >
                                        <Input
                                            type="text"
                                            value={createData?.iconName}
                                            onChange={(e) => onInputChange(e, 'iconName')}
                                            name="iconName"
                                            placeholder="Icon Name"
                                            id="sname"
                                            addonAfter={iconName}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group pname">
                                    <label htmlFor="description">Description</label>
                                    <Form.Item
                                        name="description"
                                        className='height-set-Description'
                                    >
                                        <TextArea
                                            value={createData?.description}
                                            onChange={(e) => onInputChange(e, 'description')}
                                            placeholder="Description"
                                            rows={1}
                                        />
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

                <div className="project-records">
                    <div className="header">
                        <div className="row">
                            <div className="col-lg-6 col-md-4 left">
                                <h2>Menu Group Records</h2>
                            </div>

                            <div className="col-lg-6 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                                <div className="form-group status">
                                    <label htmlFor="type" >Role Type</label>
                                    <Form.Item
                                        name="type"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please Enter Your Role Type!',
                                            },
                                        ]}
                                        className="height-set-Description"
                                    >
                                        <Select
                                            id="platform"
                                            placeholder="Role Type"
                                            showSearch
                                            mode="multiple"
                                            style={{
                                                width: '100%',
                                            }}
                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            value={filterroteTypeAllDataAll}
                                            onChange={(value) => {
                                                if (value.includes('All')) {
                                                    setFilterroteTypeAllDataAll([]);
                                                } else {
                                                    setFilterroteTypeAllDataAll(value);
                                                }
                                            }}
                                            name="type"
                                        >
                                            <Option value="All">All</Option>
                                            {filterroteTypeAllData?.map((rowData, i) => (
                                                <Option value={rowData.type} key={rowData.type}>
                                                    {rowData.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group status">
                                    <label htmlFor="status" >Status</label>
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
                                            value={selectedStatusData}
                                            onChange={(value) => {
                                                setSelectedStatusData(value);
                                                handleChangesStatusAllData(value);
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
                            rowKey={(record) => record.id}
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

export default MainMenuGroup

