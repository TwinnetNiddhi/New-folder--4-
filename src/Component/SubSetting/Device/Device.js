import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Tooltip, Skeleton } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchDeviceData } from '../../Redux/auth/action';
import socketData from '../../socket/socket/service';
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select

const Device = () => {

    const [form] = Form.useForm();
    const [alldata, setAlldata] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(1);
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [status, setStatus] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [createData, setCreateData] = useState({
        deviceName: "",
        company: "",
        mode: "",
        ram: "",
        color: "",
        version: "",
        deviceId: "",
        iemeiNo: "",
    });
    const [searchAllData, setSearchAllData] = useState('')
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const handleRefreshClick = () => {
        if (!isFetching) {
            DeviceAllDataShow();
        }
    };

    const formRef = useRef();

    let dispatch = useDispatch()

    useEffect(() => {
        DeviceAllDataShow()
    }, [currentPage, pageSize, searchAllData, selectedFilter]);

    const DeviceAllDataShow = async () => {
        try {
            await dispatch(fetchDeviceData(currentPage, pageSize, searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, setTotalItems));

        } catch (error) {
            console.error(error);
            CustomMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    // search code 
    const handleSearchInputChange = (e) => {
        setSearchLoading(true);
        const { value } = e.target;
        setSearchAllData(value);
    };

    const handleInsertData = (values) => {

        if (!validate(values)) {
            return;
        }

        if (defultValue) {
            try {
                socketData.emit('device|update', { _id: idpass, status: status, ...values });
                socketData.once('device|update', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        DeviceAllDataShow();
                        setDefultValue(false);
                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        } else {
            try {
                socketData.emit('device|post', values);
                socketData.once('device|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        DeviceAllDataShow();
                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        }
    };

    const validate = (values) => {
        let isValid = true;

        const trimmedName = values.deviceName.trim(); // Trim leading and trailing spaces
        console.log(trimmedName);
        if (!trimmedName) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a deviceName');
        }

        const trimmedNameCompany = values.company.trim(); // Trim leading and trailing spaces
        console.log(trimmedNameCompany);
        if (!trimmedNameCompany) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a company');
        }

        const trimmedNameNo = values.iemeiNo.trim(); // Trim leading and trailing spaces
        console.log(trimmedNameNo);
        if (!trimmedNameNo) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a deviceName');
        }
        return isValid;
    };

    const handleDelete = (_id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                socketData.emit('device|delete', { _id: _id });
                try {
                    socketData.once('device|delete', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            DeviceAllDataShow();
                        } else {
                            console.error("Failed to delete project:", response.error);
                        }
                    });
                } catch (error) {
                    console.log(error, "error");
                }
            }
        });
    };

    const handleUpdate = (row) => {
        formRef?.current?.resetFields();

        formRef?.current?.setFieldsValue({
            deviceName: row.deviceName,
            company: row.company,
            mode: row.mode,
            ram: row.ram,
            color: row.color,
            version: row.version,
            deviceId: row.deviceId,
            iemeiNo: row.iemeiNo,
        });

        setIdpass(row?._id);
        setStatus(row?.status);
        setDefultValue(true);
    };

    const handleToggleChange = (_id, newStatus) => {

        socketData.emit('device|update', { _id, status: newStatus });

        const updatedData = alldata.map((item) => {
            if (item._id === _id) {
                return {
                    ...item,
                    status: newStatus,
                };
            }
            return item;
        });
        CustomMessage('success', "Device updated successfully");
        setAlldata(updatedData);
    };

    const skeletonItems = Array.from({ length: 3 }, (_, index) => index);
    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="7" className="skeleton-loader">
                            <Skeleton loading={loading} active
                                paragraph={{
                                    rows: 1,
                                    width: '163%'
                                }}
                                className='loading-avatar'>
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


    const columns = [
        {
            title: 'Device Name',
            dataIndex: 'deviceName',
            key: 'deviceName',
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
        },
        {
            title: 'Model',
            dataIndex: 'mode',
            key: 'mode',
            render: (mode) => (
                <span>
                    {mode || '-'}
                </span>
            ),
        },
        {
            title: 'RAM',
            dataIndex: 'ram',
            key: 'ram',
            render: (ram) => (
                <span>
                    {ram || '-'}
                </span>
            ),
        },
        {
            title: 'Color',
            dataIndex: 'color',
            key: 'color',
            render: (color) => (
                <span>
                    {color || '-'}
                </span>
            ),
        },
        {
            title: 'Version',
            dataIndex: 'version',
            key: 'version',
            render: (version) => (
                <span>
                    {version || '-'}
                </span>
            ),
        },
        {
            title: 'DeviceId',
            dataIndex: 'deviceId',
            key: 'deviceId',
            render: (deviceId) => (
                <span>
                    {deviceId || '-'}
                </span>
            ),
        },
        {
            title: 'IEMEI No',
            dataIndex: 'iemeiNo',
            key: 'iemeiNo',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status, record) => (
                <Switch
                    size='small'
                    checked={status === 0}
                    onChange={(checked) => handleToggleChange(record._id, checked ? 0 : 1)}
                />
            ),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, data) => (
                <>
                    <Tooltip title="Edit"><EditOutlined data-id={data._id} onClick={() => handleUpdate(data)} style={{ width: '2em', fontSize: '120%' }} /></Tooltip>
                    <Tooltip title="Delete"><DeleteOutlined data-id={data._id} onClick={() => handleDelete(data._id)} style={{ fontSize: '120%' }} theme="outlined" /></Tooltip>
                </>
            ),
        },
        {
            title: 'Register Date',
            dataIndex: 'registerDate',
            render: (registerDate) => (
                <span>
                    {moment(registerDate).format('DD/MM/YYYY hh:mm:ss A')}
                </span>
            ),
        },
    ];

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (current, size) => {
        setCurrentPage(currentPage);
        setPageSize(size);
    };

    const onInputChange = (e) => {
        setCreateData({
            ...createData,
            [e.target.name]: e.target.value
        });
    };

    const onSelect = (value) => {
        console.log('search:', value);
    };

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const filteredData = alldata.filter((item) => {

        if (selectedFilter === '0') {
            return item.status === 0;
        } else if (selectedFilter === '') {
            return true;
        } else if (selectedFilter === '1') {
            return item.status === 1;
        }
        return false;
    });

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
                <title>Device</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Device` : `Create Device`}</h2>
                                </div>
                                <div class="col-6 d-flex align-items-center justify-content-end">
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
                                    <label htmlFor="shortName">Device Name<span className="required">*</span></label>
                                    <Form.Item name="deviceName"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a Device Name' }]}>
                                        <Input
                                            type="text" id="sname"
                                            placeholder="Device Name"
                                            value={createData?.deviceName}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'deviceName')}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="sname">Company<span className="required">*</span></label>
                                    <Form.Item name="company"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a Company' }]}>
                                        <Input type="text" id="sname"
                                            placeholder="Company"
                                            value={createData?.company}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'company')}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="sname">Model</label>
                                    <Form.Item name="mode"
                                        htmlFor="sname">
                                        <Input type="text" id="sname"
                                            className="form-control Short Name"
                                            placeholder="Model"
                                            value={createData?.mode}
                                            onChange={(e) => onInputChange(e, 'mode')}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">RAM</label>
                                    <Form.Item name="ram"
                                        htmlFor="sname">
                                        <Input type="text" id="sname"
                                            className="form-control Short Name"
                                            placeholder="RAM"
                                            value={createData?.ram}
                                            onChange={(e) => onInputChange(e, 'ram')}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">Color</label>
                                    <Form.Item name="color"
                                        htmlFor="sname">
                                        <Input type="text" id="sname"
                                            className="form-control Short Name"
                                            placeholder="Color"
                                            value={createData?.color}
                                            onChange={(e) => onInputChange(e, 'color')}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">Version</label>
                                    <Form.Item name="version"
                                        htmlFor="sname">
                                        <Input type="text" id="sname"
                                            placeholder="Version"
                                            value={createData?.version}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'version')}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="sname">Device Id</label>
                                    <Form.Item name="deviceId"
                                        htmlFor="sname">
                                        <Input type="text" id="sname"
                                            placeholder="Device Id"
                                            value={createData?.deviceId}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'deviceId')}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">IEMEI No<span className="required">*</span></label>
                                    <Form.Item name="iemeiNo"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a IEMEI No' }]}>
                                        <Input type="text" id="sname"
                                            placeholder="IEMEI No"
                                            value={createData?.iemeiNo}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'iemeiNo')}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group d-flex align-items-end button-color">
                                    <Button type="primary" className="btn" htmlType="submit"> {defultValue ? `Update` : `Save`}</Button>
                                </div>
                            </div>
                        </div>
                    </Form>
                </div>

                <div className="project-records">
                    <div className="header">
                        <div className="row">
                            <div className="col-lg-8 col-md-4 left">
                                <h2>Device Records</h2>
                            </div>
                            <div className="col-lg-4 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                                <div className="form-group status">
                                    <label htmlFor="status">Status</label>
                                    <Form.Item className='height-set-Description'>
                                        <Select
                                            id="platform"
                                            placeholder="Selected Value"
                                            defaultValue="Active"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterOption={filterOption}

                                            onChange={(value) => {
                                                setSelectedFilter(value);
                                                DeviceAllDataShow(value);
                                            }}
                                        >
                                            <Option value="">All</Option>
                                            <Option value="0">
                                                Active
                                            </Option>
                                            <Option value="1">
                                                Inactive
                                            </Option>
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="status" className="label-with-space">Search</label>
                                    <Search
                                        placeholder="Search"
                                        value={searchAllData}
                                        onChange={handleSearchInputChange}
                                        className='search-input-loader' loading={searchLoading} />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="body">
                        <Table
                            dataSource={filteredData}
                            columns={columns}
                            size="small"
                            className='body-row'
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                                onChange: handlePageChange,
                                showSizeChanger: true,
                                onShowSizeChange: handlePageSizeChange,
                            }}
                            components={customComponents}

                        />
                    </div>
                </div>
            </main>
        </>
    );
}
export default Device;