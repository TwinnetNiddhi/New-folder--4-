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
import CopyToClipboard from 'react-copy-to-clipboard';
import { useDispatch, useSelector } from 'react-redux';
import { SubMenuData } from '../../Redux/auth/action';
import socket from '../../socket.io/service';
import socketData from '../../../Component/socket/socket/service';
import CustomMessage from '../../CustomMessage/CustomMessage';
import * as AntIcons from '@ant-design/icons';
import mainHoc from '../../hoc/mainHoc';
import $ from 'jquery';
import { Helmet } from 'react-helmet';

const { Paragraph } = Typography;

const { Option } = Select
const { TextArea } = Input;

function SubMenu() {
    const [filterValue, setFilterValue] = useState();
    const [filterValueBackend, setFilterValueBackend] = useState();
    const [createData, setCreateData] = useState({
        subMenu: '',
        mainMenuId: '',
        routesPath: '',
        description: '',
        type: '',
        backend: '',
        iconName: ''
    });
    const [loading, setLoading] = useState(true);
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
    const [mainMenuGetAllDataShow1, setMainMenuGetAllDataShow1] = useState()
    const [filtermainMenuGetAllDataShow, setFiltermainMenuGetAllDataShow] = useState()
    const [filterroteTypeAllData, setFilterroteTypeAllData] = useState()
    const [filterroteTypeAllDataAll, setFilterroteTypeAllDataAll] = useState('')
    const [submenuIDselectBox, setSubmenuIDselectBox] = useState()
    const [_IdPass, set_IdPass] = useState()
    const [expandedRows, setExpandedRows] = useState([]);
    const [copiedText, setCopiedText] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const dispatch = useDispatch()
    const [menuGroupFilter, setMenuGroupFilter] = useState()
    const data_Type = useSelector(state => state?.authReducer?.name)
    const data_Name_type = useSelector(state => state?.authReducer?.type)
    const [mainMenuAllData, setMainMenuAllData] = useState()
    const [iconName, setIconName] = useState(null);
    const [mainMenugroupIdWIse, setMainMenugroupIdWIse] = useState()
    const [menuGroupFilterAllData, setMenuGroupFilterAllData] = useState('')

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
                    setFiltermainMenuGetAllDataShow('');
                    socket.emit('subMenu|getAll',
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
                socket.emit('subMenu|update', {
                    _id: idPass,
                    subMenu: createData.subMenu,
                    mainMenuId: Array.isArray(filtermainMenuGetAllDataShow) ? filtermainMenuGetAllDataShow[0] : filtermainMenuGetAllDataShow,
                    routerPath: createData.routerPath,
                    type: filterValue.map((roleType) => ({ roleType, status: statusPass.toString(), })),
                    description: createData.description,
                    iconName: createData.iconName,
                    backend: backendArray,
                    status: statusPass.toString(),
                    mainGroupId: menuGroupFilter
                });

                socket.once('subMenu|update', successCallback);
            } else {
                setLoadingSave(true);
                const backendArray = filterValueBackend.map(backendRouterId => ({
                    BackendRouterId: backendRouterId
                }));
                socket.emit('subMenu|post', {
                    subMenu: createData.subMenu,
                    mainMenuId: filtermainMenuGetAllDataShow,
                    routerPath: createData.routerPath,
                    type: filterValue.map(roleType => ({ roleType })),
                    description: createData.description,
                    iconName: createData.iconName,
                    backend: backendArray,
                    mainGroupId: menuGroupFilter
                });

                socket.once('subMenu|post', successCallback);
            }
        } catch (error) {
            console.log(error, 'error');
            CustomMessage('error', error?.message);
            setLoadingSave(false);
            setLoadingUpdate(false);
        } finally {
        }
    };

    const handleRefreshClick = () => {
        if (!isFetching) {
            SubMenuGetAllDataShow()
            TypeGetAllDataShow()
            BackendGetAllDataShow()
            MainMenuGetAllDataShow()
            MainGroupGetAllDataShow()
        }
    };

    useEffect(() => {
        if (switchOn) {
            SubMenuGetAllDataShow()
        }
    }, [pageSize, currentPage, searchDataAll, selectedStatusData, selectedPlatFormData, switchOn, filterroteTypeAllDataAll, menuGroupFilterAllData]);

    const SubMenuGetAllDataShow = async () => {
        try {
            await dispatch(SubMenuData(currentPage, pageSize, setTotalItems,
                selectedStatusData, setTableData, filterroteTypeAllDataAll, searchDataAll,
                setLoading, setSearchLoading, searchLoading, menuGroupFilterAllData));

        } catch (error) {
            console.error(error);
            CustomMessage('error', error?.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!isFetching) {
            TypeGetAllDataShow()
            BackendGetAllDataShow()
            MainMenuGetAllDataShow()
            MainGroupGetAllDataShow()
        }
    }, [])

    const MainMenuGetAllDataShow = () => {
        try {
            socket.emit('mainMenu|getAll',
                {
                    details: {
                        page: 1,
                        limit: 1000000000,
                        search: '',
                        status: '',
                    }
                });
            socket.on('mainMenu|getAll', (response) => {
                if (response.success) {
                    setMainMenuGetAllDataShow1(response?.data?.items)
                }
                setLoading(false)
            });

        } catch (error) {
            console.log(error, "error");
            CustomMessage('error', error?.message);
        }
    }

    const TypeGetAllDataShow = () => {
        try {
            socket.emit('role|getRole',
                {
                    details: {
                        page: 1,
                        limit: 1000000000,
                        search: '',
                        status: '',
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
                        status: '',
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

    const MainGroupGetAllDataShow = () => {
        try {
            socket.emit('mainGroup|getAll',
                {
                    details: {
                        page: 1,
                        limit: 1000000000,
                        search: '',
                        status: '0',
                        type: []
                    }
                });
            socket.on('mainGroup|getAll', (response) => {
                if (response.success) {
                    setMainMenuAllData(response?.data?.items)
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
        const backendbackend_mainMenu_data = row.mainMenu_data.map((item) => item._id);
        const menuGroup_data_id = row.menuGroup_data.map((item) => item._id);
        form.setFieldsValue({
            subMenu: row.subMenu,
            mainMenuId: row.mainMenuId,
            routerPath: row.routerPath,
            description: row.description,
            type: typeValue,
            iconName: row.iconName,
            backend: backendbackend_id,
            mainMenuId: row?.mainMenuId,
            mainMenu_data: backendbackend_mainMenu_data,
            mainGroupId: menuGroup_data_id
        });
        setIdPass(row._id);
        setStatusPass(row?.status)
        setGetAllDataPass(true);
        setFiltermainMenuGetAllDataShow(row?.mainMenuId)
        setFilterValue(typeValue);
        setFilterValueBackend(backendbackend_id)
        setFiltermainMenuGetAllDataShow(backendbackend_mainMenu_data)
        setMenuGroupFilter(menuGroup_data_id)
        setCreateData({  // Update the createData state
            subMenu: row.subMenu,
            mainMenuId: row.mainMenuId,
            routerPath: row.routerPath,
            description: row.description,
            type: row.type,
            iconName: row.iconName,
            backend: row.backendRoutet_data,
            mainMenuId: row?.mainMenuId,
            mainMenu_data: row.mainMenu_data,
            mainGroupId: row?.menuGroup_data
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
                    socket.emit('subMenu|delete', { _id: row?._id });
                    socket.once('subMenu|delete', (response) => {
                        if (response?.success) {
                            CustomMessage('success', response?.message);
                            socket.emit('subMenu|getAll',
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
            socket.emit('subMenu|status', {
                _id: id,
                status: continueCall.toString(),
            });

            socket.once('subMenu|status', (response) => {
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
            title: 'Menu group',
            dataIndex: 'Menu group',
            key: 'Menu group',
            render: (text, record) => {
                return (
                    <div>
                        {record?.menuGroup_data?.map((element, index) => {
                            return (
                                <>
                                    <div key={index}>
                                        {element?.menuName}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                );
            },
        },
        {
            title: 'Main Menu',
            dataIndex: 'mainMenuId',
            key: 'mainMenuId',
            render: (text, record) => {
                return (
                    <>
                        {
                            record?.mainMenu_data?.map((element, i) => {
                                return (
                                    <>
                                        {element?.menuName}
                                    </>
                                )
                            })
                        }
                    </>
                )
            },
        },
        {
            title: 'Sub Menu',
            dataIndex: 'subMenu',
            key: 'subMenu',
            // width: '100px',
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
            // width: '260px',
            render: (text, record) => {
                const roleTypeData = record?.roleType_data || [];
                const buttons = [];

                for (let i = 0; i < roleTypeData.length; i += 1) {
                    const rowItems = roleTypeData.slice(i, i + 1);
                    const rowButtons = rowItems.map((element, index) => {
                        // Check the condition and render the button based on data_Name_type and element?.type
                        //   const shouldRenderButton = data_Name_type === element?.type;

                        // if (shouldRenderButton) {
                        return (
                            <Button
                                type="primary"
                                size="small"
                                value="default"
                                style={{ marginBottom: '4px', background: element?.colorCode }}
                                key={index}
                            >
                                {element?.name}
                            </Button>
                        );
                        // }

                        // return null; // Render nothing if the condition is not met
                    });

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


    const handleChangesPlatFormAllData = (e) => {
        setSelectedPlatFormData(e)
    }
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
        const MainID = [];
        const _id_All = [];

        mainMenuGetAllDataShow1?.forEach((row) => {

            const Main_All = row?.menuName
            const Main_All_id = row?._id
            MainID.push(Main_All);
            _id_All.push(Main_All_id);
        });


        const uniqueMain = (MainID);
        const uniqueMain_id = _id_All
        setSubmenuIDselectBox(uniqueMain);
        set_IdPass(uniqueMain_id);
    }, [mainMenuGetAllDataShow1]);


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


    const handleChangesMainMenu = (value) => {
        setMenuGroupFilter(value)

        try {
            socketData.emit('MG-Wise-MM', {
                mainGroupId: value,
            });

            socketData.once('MG-Wise-MM', (response) => {
                if (response?.success) {
                    setMainMenugroupIdWIse(response?.data)
                } else {
                    CustomMessage('error', response?.message);
                }
            });
        } catch (error) {
            console.error('socketData error:', error);
        }


    }

    return (
        <>
            <Helmet>
                <title>Sub Menu</title>
            </Helmet>
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
                                <h2>{getAllDataPass ? 'Sub Menu Routes' : 'Sub Menu Routes'}</h2>
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
                            <div className="form-group platform">
                                <label htmlFor="mainGroupId" >Menu Group<span className="required">*</span></label>
                                <Form.Item name="mainGroupId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Menu Group!',
                                        },
                                    ]}
                                    className='height-set-Description'
                                >
                                    <Select
                                        id="platform"
                                        placeholder="Menu Group"
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        optionFilterProp="children"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        value={menuGroupFilter} // Set the value to menuGroupFilter
                                        // onChange={(value) => setMenuGroupFilter(value)} // Update menuGroupFilter when the value changes
                                        onChange={(value) => handleChangesMainMenu(value)} // Update menuGroupFilter when the value changes
                                    >
                                        {
                                            mainMenuAllData?.map((rowData, i) => {
                                                return (
                                                    <>
                                                        <Option value={rowData?._id} key={rowData?._id}>{rowData?.menuName}</Option>
                                                    </>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-group pname">
                                <label htmlFor="mainMenuId">Main Menu<span className="required">*</span></label>
                                <Form.Item name="mainMenuId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Main Menu!',
                                        },
                                    ]}
                                    className='height-set-Description'
                                >
                                    <Select
                                        id="platform"
                                        placeholder=" Main Menu"
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}

                                        optionFilterProp="children"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        value={filtermainMenuGetAllDataShow} // Set the value to filterValue
                                        onChange={(value) => setFiltermainMenuGetAllDataShow(value)} // Update filterValue when the value changes
                                    >
                                        {
                                            mainMenugroupIdWIse?.map((rowData, i) => {
                                                return (
                                                    <>
                                                        <Option value={rowData?._id}>{rowData?.menuName}</Option>
                                                    </>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="form-group sname">
                                <label htmlFor="name">Sub Menu<span className="required">*</span></label>
                                <Form.Item
                                    name="subMenu"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Sub Menu!',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        value={createData?.subMenu}
                                        onChange={(e) => onInputChange(e, 'subMenu')}
                                        name="subMenu"
                                        placeholder="Sub Menu"
                                        id="sname" className="form-control Short Name"
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group sname">
                                <label htmlFor="name">Routes Path<span className="required">*</span></label>

                                <Form.Item
                                    name="routerPath"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Routes Path!',
                                        },
                                    ]}
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
                                <label htmlFor="backend">Backend Event Name<span className="required">*</span></label>
                                <Form.Item name="backend"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Backend Event Name!',
                                        },
                                    ]}
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
                                        value={filterValueBackend} // Set the value to filterValue
                                        onChange={(value) => setFilterValueBackend(value)} // Update filterValue when the value changes
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
                                <label htmlFor="type">Role Type<span className="required">*</span></label>
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
                                        value={filterValue} // Set the value to filterValue
                                        onChange={(value) => setFilterValue(value)} // Update filterValue when the value changes
                                    >
                                        {
                                            roteTypeAllData?.map((rowData, i) => {
                                                return (
                                                    <>
                                                        <Option value={rowData?.type}>{rowData?.name}</Option>
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
                                        //  className="form-control Short Name"
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
                                        rows={1} // You can adjust the number of rows based on your needs
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
            {/* <!-- Project Records --> */}
            <div className="project-records">
                <div className="header">
                    <div className="row">
                        <div className="col-lg-6 col-md-4 left">
                            <h2>Sub Menu Records</h2>
                        </div>
                        <div className="col-lg-6 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                            <div className="form-group status">
                                <label htmlFor="type" >Menu Group</label>
                                <Form.Item name="mainGroup"

                                    className='height-set-Description'
                                >
                                    <Select
                                        id="platform"
                                        placeholder="Menu Group"
                                        showSearch
                                        style={{
                                            width: "100%",
                                        }}
                                        optionFilterProp="children"
                                        filterSort={(optionA, optionB) =>
                                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                        }
                                        value={menuGroupFilterAllData} // Set the value to menuGroupFilter
                                        onChange={(value) => setMenuGroupFilterAllData(value)} // Update menuGroupFilter when the value changes
                                    >
                                        <Option value=''>All</Option>
                                        {
                                            mainMenuAllData?.map((rowData1, i) => {
                                                return (
                                                    <>
                                                        <Option value={rowData1?._id}>{rowData1?.menuName}</Option>
                                                    </>
                                                )
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-group status">
                                <label htmlFor="type">Role Type</label>
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
                                        <Option value="All">All</Option> {/* Use a string value for "All" */}
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
                    />
                </div>
            </div>
        </>
    )
}

export default SubMenu


