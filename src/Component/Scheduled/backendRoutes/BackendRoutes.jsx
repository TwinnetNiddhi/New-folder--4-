import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';
import Swal from 'sweetalert2';
import { Skeleton, Space, Switch, Table, Tooltip } from 'antd';
import socket from '../../socket.io/service';
import socketData from '../../../Component/socket/socket/service';
import { Button, Input, Form } from 'antd';
import { Select } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import '../../../Component/Preferences/Project/Project.css'
import '../../../Component/App_Details_theme/css/dashboard.css';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import '../../../Component/Scheduled/backendRoutes/BackendRoutes.css'
import CustomMessage from '../../CustomMessage/CustomMessage';
import mainHoc from '../../hoc/mainHoc';
import $ from 'jquery'
import { Helmet } from 'react-helmet';

const { Paragraph } = Typography;

const { Option } = Select
const { TextArea } = Input;

function BackendRoutes() {
    const [filterValue, setFilterValue] = useState();
    const [createData, setCreateData] = useState({
        name: '',
        event: '',
        description: '',
        type: '',
        alias: '',
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
    const [filterroteTypeAllData, setFilterroteTypeAllData] = useState()
    const [filterroteTypeAllDataAll, setFilterroteTypeAllDataAll] = useState()
    const [statusPass, setStatusPass] = useState()
    const [expandedRows, setExpandedRows] = useState([]);

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
                    socket.emit('backendRouter|getAll',
                        {
                            details: {
                                page: currentPage.toString(),
                                limit: pageSize.toString(),
                                search: searchDataAll,
                                status: selectedStatusData,
                                type: filterroteTypeAllDataAll,
                            }
                        });
                } else {
                    CustomMessage('error', response?.message);
                }
            };
            if (getAllDataPass) {
                setLoadingUpdate(true);
                socket.emit('backendRouter|update', {
                    _id: idPass,
                    name: createData.name,
                    event: createData.event,
                    description: createData.description,
                    alias: createData.alias,
                    type: filterValue.map((roleType) => ({ roleType, status: statusPass.toString(), })),
                });
                setGetAllDataPass(true);
                socket.once('backendRouter|update', successCallback);
            } else {
                setLoadingSave(true);
                socket.emit('backendRouter|post', {
                    name: createData.name,
                    event: createData.event,
                    type: filterValue.map(roleType => ({ roleType })),
                    description: createData.description,
                    alias: createData.alias,
                });

                socket.once('backendRouter|post', successCallback);
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
            BackendGetAllDataShow()
            TypeGetAllDataShow()
        }
    };

    useEffect(() => {
        if (switchOn) {
            BackendGetAllDataShow()
        }
    }, [pageSize, currentPage, searchDataAll, selectedStatusData, switchOn, filterroteTypeAllDataAll]);

    const BackendGetAllDataShow = () => {
        try {
            if (searchLoading) {
                setSearchLoading(false)
                socket.emit('backendRouter|getAll',
                    {
                        details: {
                            page: currentPage.toString(),
                            limit: pageSize.toString(),
                            search: searchDataAll,
                            status: selectedStatusData,
                            type: filterroteTypeAllDataAll || [],
                        }
                    });
                socket.on('backendRouter|getAll', (response) => {
                    if (response.success) {
                        const newItems = response?.data?.items
                        setTableData(response?.data?.items);
                        setTotalItems(response?.data?.totalItems);
                    }
                    setLoading(false)
                });
            } else {
                setLoading(true)
                setSearchLoading(false)
                socket.emit('backendRouter|getAll',
                    {
                        details: {
                            page: currentPage.toString(),
                            limit: pageSize.toString(),
                            search: searchDataAll,
                            status: selectedStatusData,
                            type: filterroteTypeAllDataAll || [],
                        }
                    });
                socket.on('backendRouter|getAll', (response) => {
                    if (response.success) {
                        const newItems = response?.data?.items
                        setTableData(response?.data?.items);
                        setTotalItems(response?.data?.totalItems);
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

    useEffect(() => {
        if (switchOn) {
            TypeGetAllDataShow()
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

    const onInputChange = (e, fieldName) => {
        const { value } = e.target;
        setCreateData((prevValues) => ({
            ...prevValues,
            [fieldName]: value,
        }));
    };

    const EditAllData = (row) => {
        const typeValue = row.type.map((item) => item.roleType);
        form.setFieldsValue({
            name: row.name,
            event: row.event,
            description: row.description,
            alias: row.alias,
            type: typeValue
        });
        setIdPass(row._id);
        setStatusPass(row?.status)
        setGetAllDataPass(true);
        setFilterValue(typeValue);
        setCreateData({  // Update the createData state
            name: row.name,
            event: row.event,
            description: row.description,
            alias: row.alias,
            type: row.type,
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
                    socket.emit('backendRouter|delete', { _id: row?._id });
                    socket.once('backendRouter|delete', (response) => {
                        if (response?.success) {
                            CustomMessage('success', response?.message);
                            socket.emit('backendRouter|getAll',
                                {
                                    details: {
                                        page: currentPage.toString(),
                                        limit: pageSize.toString(),
                                        search: searchDataAll,
                                        status: selectedStatusData,
                                        type: filterroteTypeAllDataAll,
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
            socket.emit('backendRouter|status', {
                _id: id,
                status: continueCall.toString(),
            });

            socket.once('backendRouter|status', (response) => {
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

    const handleToggleExpand = (record) => {
        if (expandedRows.includes(record.key)) {
            setExpandedRows(expandedRows.filter((rowKey) => rowKey !== record.key));
        } else {
            setExpandedRows([...expandedRows, record.key]);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Alias',
            dataIndex: 'alias',
            key: 'alias',
        },
        {
            title: 'Event Name',
            dataIndex: 'event',
            key: 'event',
            width: '250px',
        },
        {
            title: 'Role Type',
            dataIndex: 'Type',
            key: 'Type',
            width: '250px',
            render: (text, record) => {
                const roleTypeData = record?.roleType_data || [];
                const buttons = [];

                for (let i = 0; i < roleTypeData.length; i += 3) {
                    const rowItems = roleTypeData.slice(i, i + 3);
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
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: '200px',
            render: (text, record) => {
                const formattedDate = moment(record.updatedAt).format('DD/MM/YYYY hh:mm:ss A');
                return <span>{formattedDate}</span>;
            },
        },
        {
            title: 'Register date',
            dataIndex: 'registerdate',
            key: 'registerdate',
            width: '200px',
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
                        <td colSpan="8" className="skeleton-loader">
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
                <title>Backend Routes</title>
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
                                <h2>{getAllDataPass ? 'Update Backend Routes' : 'Create Backend Routes'}</h2>
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
                                        value={createData?.name}
                                        onChange={(e) => onInputChange(e, 'name')}
                                        name="name"
                                        placeholder="Name"
                                        id="sname" className="form-control Short Name"
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group sname">
                                <label htmlFor="alias">Alias<span className="required">*</span></label>

                                <Form.Item
                                    name="alias"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Alias!',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        value={createData?.alias}
                                        onChange={(e) => onInputChange(e, 'alias')}
                                        name="alias"
                                        placeholder="Alias"
                                        id="sname" className="form-control Short Name"
                                    />
                                </Form.Item>
                            </div>
                            <div className="form-group name">
                                <label htmlFor="event">Event Name<span className="required">*</span></label>
                                <Form.Item
                                    name="event"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please Enter Your Event Name!',
                                        },
                                    ]}
                                >
                                    <Input
                                        type="text"
                                        id="name"
                                        placeholder="Event Name"
                                        value={createData?.event}
                                        onChange={(e) => onInputChange(e, 'event')}
                                        name="event"
                                        className="form-control"
                                    />
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
                            <h2>Backend Routes Records</h2>
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

export default BackendRoutes


