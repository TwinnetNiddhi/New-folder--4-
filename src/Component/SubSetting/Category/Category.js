import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Cascader, Tooltip, Skeleton } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment/moment";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCategoryData } from "../../Redux/auth/action";
import socketData from "../../socket/socket/service";
import Header from "../../Headers/Header";
import Navbar from '../../Headers/Navbar';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select

const Category = () => {

    const [alldata, setAlldata] = useState([]);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(1); // Total items
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [status, setStatus] = useState();
    const [id, setId] = useState('');
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [statusAll, setStatusAll] = useState();

    const [createData, setCreateData] = useState({
        name: "",
        description: "",
    });
    const [searchAllData, setSearchAllData] = useState('')
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    let dispatch = useDispatch()

    const handleRefreshClick = () => {
        if (!isFetching) {
            CategoryGetAllDataShow();
        }
    };

    const formRef = useRef();
    useEffect(() => {
        mcatedata();
    }, []);

    const mcatedata = () => {
        socketData.emit('mainCategory|getAll', { details: { page: 1, limit: 1000, search: '', status: '0' } });
        socketData.on('mainCategory|getAll', (response) => {
            if (response?.success) {
                const options = response.data.items.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setMainCategoryOptions(options);
            }
        });
    };
    const handleSelectChange = (selectedValue) => {
        // setId(selectedValue);
    };
    const handleSelectChanges = (selectedValue) => {
        setId(selectedValue);
        setSelectedMainCategory(selectedValue);
    };

    useEffect(() => {
        CategoryGetAllDataShow()
    }, [currentPage, pageSize, searchAllData, statusAll, id]);

    const CategoryGetAllDataShow = async () => {
        try {
            await dispatch(fetchCategoryData(currentPage, pageSize, searchAllData, statusAll, id, searchLoading, setSearchLoading, setAlldata, setTotalItems, setLoading));

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleSearchInputChange = (e) => {
        setSearchLoading(true);
        const { value } = e.target;
        setSearchAllData(value); // Update the input field value
    };

    const handleInsertData = (values) => {
        if (!validate(values)) {
            return;
        }
        if (defultValue) {
            try {
                socketData.emit('category|update', { _id: idpass, status: status, mainCategory_id: selectedMainCategory, ...values });
                socketData.once('category|update', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        CategoryGetAllDataShow(selectedFilter);
                        setDefultValue(false);
                        setSelectedMainCategory('');
                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        } else {
            try {
                socketData.emit('category|post', { mainCategory_id: id, ...values });
                socketData.once('category|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields(); // Clear form fields after successful submission
                        CategoryGetAllDataShow(selectedMainCategory);
                        // setSelectedMainCategory('');
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
                socketData.emit('category|delete', { _id: _id });
                try {
                    socketData.once('category|delete', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            CategoryGetAllDataShow();
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
            mainCategory_id: row.mainCategory_id,
            name: row.name,
            description: row.description,
        });

        setIdpass(row?._id);
        setStatus(row?.status);
        setDefultValue(true);
    };

    const handleToggleChange = (_id, newStatus) => {
        // Send the update to the server
        socketData.emit('category|update', { _id, status: newStatus });
        const updatedData = alldata.map((item) => {
            if (item._id === _id) {
                return {
                    ...item,
                    status: newStatus,
                };
            }
            return item;
        });
        CustomMessage('success', "Category updated successfully");
        CategoryGetAllDataShow();
        setAlldata(updatedData);
    };

    const skeletonItems = Array.from({ length: 3 }, (_, index) => index);
    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="2" className="skeleton-loader">
                            <Skeleton active
                                size="small"
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
            row: loading ? SkeletonRow : undefined,
        },
    };

    const columns = [
        {
            title: 'Main Category Name',
            dataIndex: 'mainCategory_id',
            render: (mainCategory_id) => {
                const mainCategory = mainCategoryOptions.find(option => option.value === mainCategory_id);
                return mainCategory ? mainCategory.label : '-';
            },
        },
        {
            title: 'Category Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (description) => (
                <span>
                    {description || '-'}
                </span>
            ),
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
    })

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
                <title>Category</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Category` : `Create Category`}</h2>
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
                                <div className="form-group platform">
                                    <label htmlFor="sname">Main Category<span className="required">*</span></label>
                                    <Form.Item
                                        htmlFor="sname"
                                        name="mainCategory_id"
                                        className='height-set-Description'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter a Main Category'
                                            },
                                        ]}>
                                        <Select
                                            placeholder="Main Category"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            options={mainCategoryOptions}
                                            onChange={handleSelectChange}
                                            value={selectedMainCategory}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">Category<span className="required">*</span></label>
                                    <Form.Item name="name"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a Category' }]}>
                                        <Input
                                            type="text" id="sname"
                                            placeholder="Category"
                                            value={createData?.name}
                                            className="form-control Short Name"
                                            onChange={(e) => onInputChange(e, 'name')}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group name">
                                    <label htmlFor="name">Description</label>
                                    <Form.Item htmlFor="sname" name="description">
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Description"
                                            name="description"
                                            value={createData?.description}
                                            onChange={(e) => onInputChange(e, 'description')}
                                            className="form-control"
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
                            <div className="col-lg-6 col-md-4 left">
                                <h2>Category Records</h2>
                            </div>
                            <div className="col-lg-6 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                                <div className="form-group platform">
                                    <label htmlFor="platform">Main Category</label>
                                    <Form.Item className='height-set-Description' name="mainCategory">
                                        <Select
                                            id="platform"
                                            placeholder="Main Category"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            // filterSort={(optionA, optionB) =>
                                            //     (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            // }
                                            filterOption={filterOption}
                                            options={[
                                                { value: '', label: 'All' },
                                                ...mainCategoryOptions,
                                            ]}
                                            onChange={handleSelectChanges}
                                            value={selectedMainCategory}
                                        />
                                    </Form.Item>
                                </div>
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
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())
                                            }
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
    )
}

export default Category;