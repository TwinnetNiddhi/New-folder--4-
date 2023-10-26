import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Tooltip, Skeleton } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import { fetchContinentData } from '../../Redux/auth/action';
import socketData from '../../socket/socket/service';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select


const Tiercontinent = () => {
    const [alldata, setAlldata] = useState([]);
    const [form] = Form.useForm();
    const [totalItems, setTotalItems] = useState(1); // Total items
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [createData, setCreateData] = useState({
        name: "",
        status: ""
    });
    const [searchAllData, setSearchAllData] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const handleRefreshClick = () => {
        if (!isFetching) {
            ContinentAllDataShow();
        }
    };

    const formRef = useRef();
    let dispatch = useDispatch()

    useEffect(() => {
        ContinentAllDataShow()
    }, [searchAllData, selectedFilter]);

    const ContinentAllDataShow = async () => {
        try {

            await dispatch(fetchContinentData(searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata));

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
        const { name } = values;
        const { status } = values;

        if (defultValue) {
            try {
                socketData.emit('continentupdate', { _id: idpass, name, status });
                socketData.once('continentupdate', (response) => {
                    if (response) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        ContinentAllDataShow();
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
                socketData.emit('tiercontinent|post', values);
                socketData.once('tiercontinent|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        ContinentAllDataShow();
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
        const trimmedname = values.name.trim();
        if (!trimmedname) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a Name');
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
                socketData.emit('continentdelete', { _id: _id });
                try {
                    socketData.once('continentdelete', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            ContinentAllDataShow();
                        } else {
                            console.error("Failed to delete Tier:", response.error);
                        }
                    });
                } catch (error) {
                    console.log(error, "error");
                }
            }
        });
    };

    const handleUpdate = (row) => {
        console.log(row, "row");
        formRef?.current?.resetFields();

        formRef?.current?.setFieldsValue({
            name: row.name,
            status: row.status,
        });

        setIdpass(row?._id);
        setDefultValue(true);
    };

    const handleToggleChange = (_id, newStatus) => {

        socketData.emit('continentupdate', { _id, status: newStatus });

        const updatedData = alldata.map((item) => {
            if (item._id === _id) {
                return {
                    ...item,
                    status: newStatus,
                };
            }
            return item;
        });
        CustomMessage('success', "Continent updated successfully");
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
            title: 'Continent Name',
            dataIndex: 'name',
            key: 'name',
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
            dataIndex: 'registerdate',
            render: (registerDate) => (
                <span>
                    {moment(registerDate).format('DD/MM/YYYY hh:mm:ss A')}
                </span>
            ),
        }
    ];

    const onInputChange = (e) => {
        setCreateData({
            ...createData,
            [e.target.tier]: e.target.value
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
                <title>Tier Continent</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Tier Continent` : `Create Tier Continent`}</h2>
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
                                    <label htmlFor="shortName">Tier<span className="required">*</span></label>

                                    <Form.Item name="name"
                                        htmlFor="sname" rules={[{ required: true, message: 'Please enter a Continent' }]}>
                                        <Input
                                            type="text" id="sname"
                                            placeholder="Continent Name"
                                            value={createData?.name}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'name')}
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
                                <h2>Continent Records</h2>
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
                                            }}
                                        >
                                            <Option value="">All</Option>
                                            <Option value="0">Active</Option>
                                            <Option value="1">Inactive</Option>
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
                            components={customComponents}
                        />
                    </div>
                </div>
            </main>
        </>
    )
}
export default Tiercontinent;