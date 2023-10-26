import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Tooltip, Skeleton, ColorPicker, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import socketData from '../../socket/socket/service';
import { fetchRoleData } from '../../Redux/auth/action';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select

const Role = () => {

    const [alldata, setAlldata] = useState([]);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(1); // Total items
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [status, setStatus] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [selectedColorBgcolor, setSelectedColorBgcolor] = useState('')
    const [createData, setCreateData] = useState({
        name: "",
        type: "",
        colorCode: selectedColorBgcolor,
    });
    const [searchAllData, setSearchAllData] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(true);
    let dispatch = useDispatch()

    const [isFetching, setIsFetching] = useState(false);

    const handleRefreshClick = () => {
        if (!isFetching) {
            RoleAllDataShow();
        }
    };

    // Create a ref for the form
    const formRef = useRef();

    useEffect(() => {
        RoleAllDataShow()
    }, [currentPage, pageSize, searchAllData, selectedFilter, createData]);

    const RoleAllDataShow = async () => {
        try {
            await dispatch(fetchRoleData(currentPage, pageSize, searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, setTotalItems));

        } catch (error) {
            console.error(error);
            CustomMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

    //search code 
    const handleSearchInputChange = (e) => {
        setSearchLoading(true);
        const { value } = e.target;
        setSearchAllData(value);
    };

    const handleInsertData = (values) => {

        if (!validate(values)) {
            return;
        }
        const postData = {
            ...values, // Spread the properties from values
            colorCode: selectedColorBgcolor, // Add the colorCode property
        };

        if (defultValue) {
            try {
                socketData.emit('role|update', { _id: idpass, status: status, ...postData });
                socketData.once('role|update', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        RoleAllDataShow(selectedFilter);
                        setDefultValue(false);
                        setSelectedColorBgcolor('')
                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        } else {
            try {

                socketData.emit('role|post', postData);
                socketData.once('role|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        RoleAllDataShow(selectedFilter);
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
        const trimmedName = values.name.trim();
        if (!trimmedName) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a Role');
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
                socketData.emit('role|delete', { _id: _id });
                try {
                    socketData.once('role|delete', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            RoleAllDataShow();
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

    const handleColorbottomButtonBgColor = (color) => {
        const { r, g, b, a } = color.metaColor;
        const hexColorCode = rgbaToHex(r, g, b);
        console.log(hexColorCode, "hexColorCodehexColorCodehexColorCode");
        setSelectedColorBgcolor(hexColorCode);
    };
    const rgbaToHex = (r, g, b, a) => {
        // Convert each color channel to its hexadecimal representation
        const red = Math.floor(r).toString(16).padStart(2, '0');
        const green = Math.floor(g).toString(16).padStart(2, '0');
        const blue = Math.floor(b).toString(16).padStart(2, '0');
        // Combine the channels and the alpha value (if present) to get the HEX color code
        const hex = `#${red}${green}${blue}`;
        return hex;
    };

    const handleUpdate = (row) => {
        console.log(row, "rowrowrowrowrowrow");
        formRef?.current?.resetFields();

        formRef?.current?.setFieldsValue({
            name: row.name,
            type: row.type,
            colorCode: row.colorCode,
        });

        setIdpass(row?._id);
        setStatus(row?.status);
        setDefultValue(true);
        setSelectedColorBgcolor(row.colorCode);
    };

    const handleToggleChange = async (id, checked) => {
        try {
            const continueCall = checked ? 0 : 1;
            socketData.emit('role|status', {
                _id: id,
                status: continueCall.toString(),
            });
            socketData.once('role|status', (response) => {
                if (response?.success) {
                    setAlldata((prevData) =>
                        prevData.map((row) => (row._id === id ? { ...row, status: continueCall } : row))
                    );
                    CustomMessage('success', response?.message);
                    RoleAllDataShow();
                } else {
                    CustomMessage('error', response?.message);
                }
            });
        } catch (error) {
            console.error('Socket error:', error);
            CustomMessage({
                message: 'An error occurred while updating status value.',
            });
        }
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
                                    width: '100%'
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
            title: 'Role',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'ColorCode',
            dataIndex: 'colorCode',
            key: 'colorCode',
            render: (colorCode) => {
                return (
                    <>
                        {<ColorPicker value={colorCode} showText disabled></ColorPicker>}
                    </>
                )
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status, record) => (
                <Space key={record._id} direction="vertical">
                    <Switch
                        checked={status === 0 ? true : false}
                        size="small"
                        className='switch_width'
                        onChange={(checked) => {
                            handleToggleChange(record._id, checked);
                        }}
                    />
                </Space>
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

    const filteredData = Array.isArray(alldata)
        ? alldata.filter((item) => {
            if (selectedFilter === '0') {
                return item.status === 0; // Show only active (unchecked) items
            } else if (selectedFilter === '') {
                return true; // Show all items
            } else if (selectedFilter === '1') {
                return item.status === 1; // Show only inactive (checked) items
            }
        })
        : [];

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
                <title>Role</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Role` : `Create Role`}</h2>
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
                                    <label htmlFor="shortName">Role<span className="required">*</span></label>

                                    <Form.Item name="name"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a Role' }]}>
                                        <Input
                                            type="text" id="sname"
                                            placeholder="Role"
                                            value={createData?.name}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'name')}
                                        />
                                    </Form.Item>

                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="name">Type<span className="required">*</span></label>
                                    <Form.Item htmlFor="sname" name="type"
                                        rules={[{ required: true, message: 'Enter a Type' }]}>
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Type"
                                            value={createData?.type}
                                            onChange={(e) => onInputChange(e, 'type')}
                                            className="form-control"
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="sname">Colorcode</label>
                                    <Form.Item name="colorCode" className='height-set-Description' htmlFor="sname">
                                        <Space>
                                            <Space direction="vertical">
                                                {defultValue ? <ColorPicker showText name="colorCode" value={selectedColorBgcolor} onChange={handleColorbottomButtonBgColor} />
                                                    : <ColorPicker showText name="colorCode" onChange={handleColorbottomButtonBgColor} />}
                                            </Space>
                                        </Space>
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
                                <h2>Role Records</h2>
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
                                                setSelectedFilter(value); // Update the selected filter state
                                                RoleAllDataShow(value); // Call fetchData with the selected value
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
                                // total: totalItems,
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
export default Role;