import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Cascader, Tooltip, Skeleton, Space } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment/moment";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import { fetchSubCateData } from '../../Redux/auth/action';
import socketData from '../../socket/socket/service';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select

const Subcategory = () => {

    const [alldata, setAlldata] = useState([]);
    const [form] = Form.useForm();

    // Pagination state variables
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(10); // Total items
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [status, setStatus] = useState();
    const [statusAll, setStatusAll] = useState();
    const [id, setId] = useState('');
    const [cateid, setCateId] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [createData, setCreateData] = useState({
        name: "",
        description: "",
    });
    const [searchAllData, setSearchAllData] = useState('')
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [maincategoryAllIdPass, setMaincategoryAllIdPass] = useState()
    const [maincategoryAlldataIdPass, setMaincategoryAlldataIdPass] = useState()

    let dispatch = useDispatch()

    const handleRefreshClick = () => {
        if (!isFetching) {
            SubCateGetAllDataShow();
        }
    };
    const formRef = useRef();

    useEffect(() => {
        mcatedata();
        catedata();
    }, [])

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

        socketData.emit('category|getAll', { details: { page: 1, limit: 1000, search: '', status: '0', mainCategory: selectedValue } });
        socketData.on('category|getAll', (response) => {
            if (response?.success) {
                const options = response.data.items.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setMaincategoryAllIdPass(options);
            }
        });

    };

    const handleCateChange = (selectedValue) => {
        // setCateId(selectedValue);
    };

    const catedata = () => {
        socketData.emit('category|getAll', { details: { page: 1, limit: 1000, search: '', status: '0' } });
        socketData.on('category|getAll', (response) => {
            if (response?.success) {
                const options = response.data.items.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setCategoryOptions(options);
            }
        });
    };
    const handleChangeCatedata = (selectedValue) => {
        setCateId(selectedValue);
        setSelectedCategory(selectedValue);
    };

    const handleSelectChanges = (Value) => {
        setId(Value);

        socketData.emit('category|getAll', { details: { page: 1, limit: 1000, search: '', status: '0', mainCategory: Value } });
        socketData.on('category|getAll', (response) => {
            if (response?.success) {
                const options = response.data.items.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setMaincategoryAlldataIdPass(options);
            }
        });
        setSelectedMainCategory(Value);

    };

    useEffect(() => {
        SubCateGetAllDataShow(statusAll)
    }, [currentPage, pageSize, searchAllData, statusAll, id, cateid]);

    const SubCateGetAllDataShow = async () => {
        try {

            await dispatch(fetchSubCateData(currentPage, pageSize, searchAllData, statusAll, id, cateid, setAlldata,
                setTotalItems, searchLoading, setSearchLoading, setLoading));

        } catch (error) {
            console.error(error);
            CustomMessage(error.message);
        } finally {
            setLoading(false);
        }
    }

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
                socketData.emit('subCategory|update', { _id: idpass, status: status, mainCategory_id: selectedMainCategory, category_id: selectedCategory, ...values });
                socketData.once('subCategory|update', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        SubCateGetAllDataShow();
                        setDefultValue(false);
                        setSelectedMainCategory('');
                        setSelectedCategory('');
                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        } else {
            try {
                socketData.emit('subCategory|post', { mainCategory_id: id, category_id: cateid, ...values });
                socketData.once('subCategory|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields(); // Clear form fields after successful submission
                        SubCateGetAllDataShow(selectedMainCategory);
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
        const trimmedName = values.name.trim(); // Trim leading and trailing spaces
        if (!trimmedName) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a Sub Category Name');
        }
        return isValid;
    };

    const handleDelete = (_id) => {
        console.log(_id, "drihgkdfdggkdfkj");
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
                socketData.emit('subCategory|delete', { _id: _id });
                try {
                    socketData.once('subCategory|delete', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            SubCateGetAllDataShow();
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

        const category_data_All = row?.category_data.map(element => element);
        const category_id_all = row?.category_id
        const main_id_All = row?.mainCategory_id

        socketData.emit('category|getAll', { details: { page: 1, limit: 1000, search: '', status: '0', mainCategory: row.mainCategory_id } });
        socketData.on('category|getAll', (response) => {
            if (response?.success) {
                const options = response.data.items.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setMaincategoryAllIdPass(options);
            }
        });

        formRef?.current?.resetFields();

        formRef?.current?.setFieldsValue({
            'mainCategory_id': row.mainCategory_id, // Set the value for MainCategory Name
            'category_id': category_id_all, // Set the value for Category Name
            'name': row.name,
            'description': row.description,
        });
        setMaincategoryAllIdPass(category_data_All);
        setIdpass(row?._id);
        setStatus(row?.status);
        setDefultValue(true);
    };

    const handleToggleChange = (_id, newStatus) => {
        socketData.emit('subCategory|update', { _id, status: newStatus });
        const updatedData = alldata.map((item) => {
            if (item._id === _id) {
                return {
                    ...item,
                    status: newStatus,
                };
            }
            return item;
        });
        setAlldata(updatedData);
        SubCateGetAllDataShow();
        CustomMessage('success', "Subcategory updated successfully");
    };

    const skeletonItems = Array.from({ length: 10 }, (_, index) => index);
    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="7" className="skeleton-loader">
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

    let flatTableAllData = [];
    if (alldata) {
        flatTableAllData = alldata.map(rowData => {
            let category_data_name = rowData?.category_data?.map(element => element?.name).filter(Boolean);
            let tier_data_All = rowData?.tier_data?.map(element => element?.tier).filter(Boolean);

            return {
                category_id: rowData?.category_id,
                mainCategory_id: rowData?.mainCategory_id,
                _id: rowData?._id,
                description: rowData?.description,
                status: rowData?.status,
                registerDate: rowData?.registerDate,
                category_data: category_data_name,
                tier_data: tier_data_All,
                name: rowData?.name,
                maincatename: rowData?.mainCategory_data?.map(element => element?.name).filter(Boolean)
            };
        });
    }
    const filteredData = flatTableAllData.filter((item) => {
        if (selectedFilter === '0') {
            return item.status === 0; // Show only active (unchecked) items
        } else if (selectedFilter === '') {
            return true; // Show all items
        } else if (selectedFilter === '1') {
            return item.status === 1; // Show only inactive (checked) items
        }
        return false;
    })

    const columns = [
        {
            title: 'Main Category Name',
            dataIndex: 'mainCategory_id',
            key: 'mainCategory_id',
            render: (text, record) => (
                <span>
                    {record?.maincatename}
                </span>
            ),
        },
        {
            title: 'Category Name',
            dataIndex: 'category_id',
            key: 'category_id',
            render: (text, record) => (
                <span>
                    {record?.category_data}
                </span>
            ),
        },
        {
            title: 'Sub Category',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <span>
                    {record?.name}
                </span>
            ),
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
            render: (_, row) => (
                <>
                    <Tooltip title="Edit">
                        <EditOutlined onClick={() => handleUpdate(row)} style={{ width: '2em', fontSize: '120%' }} />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <DeleteOutlined onClick={() => handleDelete(row?._id)} style={{ fontSize: '120%' }} theme="outlined" />
                    </Tooltip>
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
        setCurrentPage(currentPage); // Calculate the new current page
        setPageSize(size);
    };

    const onInputChange = (e) => {
        setCreateData({
            ...createData,
            [e.target.name]: e.target.value
        });
    };

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
                <title>Sub Category</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Sub Category` : `Create Sub Category`}</h2>
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

                                <div className="form-group platform">
                                    <label htmlFor="sname">Category<span className="required">*</span></label>
                                    <Form.Item
                                        htmlFor="sname"
                                        className="height-set-Description"
                                        name="category_id"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter a Category',
                                            },
                                        ]}
                                    >
                                        <Select
                                            id="platform"
                                            placeholder="Category"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterSort={(optionA, optionB) =>
                                                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                            }
                                            value={selectedCategory}
                                            onChange={handleCateChange}
                                        >
                                            {
                                                maincategoryAllIdPass?.map((row, i) => {
                                                    return (
                                                        <>
                                                            <Option value={row.value}>{row?.label}</Option>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">Sub Category<span className="required">*</span></label>
                                    <Form.Item name="name"
                                        htmlFor="sname" rules={[{ required: true, message: 'Enter a Sub Category' }]}>
                                        <Input
                                            type="text" id="sname"
                                            placeholder="Sub Category"
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
                            <div className="col-lg-5 col-md-4 left">
                                <h2>Sub Category Records</h2>
                            </div>
                            <div className="col-lg-7 col-md-8 right d-lg-flex d-md-flex justify-content-end">
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

                                <div className="form-group platform">
                                    <label htmlFor="platform">Category</label>
                                    <Form.Item className='height-set-Description' name="category">
                                        <Select
                                            id="platform"
                                            placeholder="Category"
                                            showSearch
                                            style={{
                                                width: "100%",
                                            }}
                                            optionFilterProp="children"
                                            filterOption={filterOption}

                                            value={mainCategoryOptions} // Set the value to filterValue
                                            onChange={handleChangeCatedata} // Update filterValue when the value changes
                                        >
                                            <Option value="">All</Option>
                                            {
                                                maincategoryAlldataIdPass?.map((row) => {
                                                    return (
                                                        <>
                                                            <Option value={row?.value}>{row?.label}</Option>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Select>
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
                            pagination={{
                                current: currentPage,
                                pageSize: pageSize,
                                total: totalItems,
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

export default Subcategory;