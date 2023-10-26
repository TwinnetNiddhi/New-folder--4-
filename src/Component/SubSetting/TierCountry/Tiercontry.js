import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select, Table, Switch, Tooltip, Space, Skeleton } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2';
import moment from "moment/moment";
import ReactCountryFlag from "react-country-flag";
import Search from "antd/es/input/Search";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import { fetchCountryData } from '../../Redux/auth/action';
import socketData from '../../socket/socket/service';
import socket from '../../socketTier/socket';
import CustomMessage from '../../CustomMessage/CustomMessage';
import $ from 'jquery';
import { Helmet } from 'react-helmet';
const { Option } = Select

const Tiercontry = () => {

    const [alldata, setAlldata] = useState([]);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(10);
    const [idpass, setIdpass] = useState();
    const [defultValue, setDefultValue] = useState();
    const [status, setStatus] = useState();
    const [id, setId] = useState('');
    const [cateid, setCateId] = useState('');
    const [codeId, setCodeId] = useState('');
    const [selectedContinent, setSelectedContinent] = useState('');
    const [selectedTier, setSelectedTier] = useState('');
    const [continentOptions, setContinentOptions] = useState([]);
    const [tierOptions, setTierOptions] = useState([]);
    const [contrycode, setContrycode] = useState([]);
    const [contrycodeOptions, setContrycodeOptions] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState('0');
    const [loading, setLoading] = useState(true);
    const [createData, setCreateData] = useState({
        name: "",
        countrycode: "",
        priority: "",
        status: "",
    });
    const formRef = useRef();
    const [searchAllData, setSearchAllData] = useState('')
    const [searchLoading, setSearchLoading] = useState(true);
    const [isFetching, setIsFetching] = useState(false);

    const handleRefreshClick = () => {
        if (!isFetching) {
            CountryAllDataShow();
        }
    };

    useEffect(() => {
        tierdata();
        continentdata();
        countrycodedata();
    }, []);



    const tierdata = () => {
        socketData.emit('tier|getall', {});
        socketData.once('tier|getall', (response) => {
            if (response) {
                const options = response.data.map(item => ({
                    value: item._id,
                    label: item.tier,
                }));
                setTierOptions(options);
            }
        });
    };

    const continentdata = () => {
        socketData.emit('continentget', {});
        socketData.on('continentget', (response) => {
            if (response) {
                const options = response.data.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setContinentOptions(options);
            }
        });
    };

    const countrycodedata = () => {
        socket.emit('get|countrycodeorname', {});
        setLoading(true);

        socket.on('get|countrycodeorname', (response) => {
            if (response?.success) {
                const options = response.codesAndNames.map(item => ({
                    value: item._id,
                    label: item.name,
                }));
                setLoading(false);
                setContrycodeOptions(options);
            }
        });
    };
    const handleTierChange = (selectedValue) => {
        setId(selectedValue);
        setSelectedTier(selectedValue);
    };

    const handleContinentChange = (selectedValue) => {
        setCateId(selectedValue);
        setSelectedContinent(selectedValue);
    };

    const handleChangeCatedata = (selectedValue) => {
        setCateId(selectedValue);
    };

    const handleSelectChange = (selectedValue) => {
        console.log(selectedValue, "selectedValueselectedValue");
        setId(selectedValue);
    };

    const handleSelectChangecode = (selectedValue) => {
        setCodeId(selectedValue)

    };

    let dispatch = useDispatch()
    useEffect(() => {
        CountryAllDataShow()
    }, [selectedTier, selectedFilter, searchAllData, selectedContinent]);

    const CountryAllDataShow = async () => {
        try {

            await dispatch(fetchCountryData(searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, selectedTier, selectedContinent, setTotalItems));

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
        console.log(values, "valuesvalues");

        if (!validate(values)) {
            return;
        }

        const { priority, contrycode } = values;

        if (defultValue) {
            try {
                socketData.emit('Tierupdatecountry', { _id: idpass, status: status, tierid: id, continentid: cateid, priority: priority, contrycode: codeId });
                socketData.once('Tierupdatecountry', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        CountryAllDataShow();
                        setDefultValue(false);
                        setSelectedTier('');
                        setSelectedContinent('');

                    } else {
                        CustomMessage('error', response?.message);
                    }
                });
            } catch (error) {
                console.log(error, "error");
            }
        } else {
            try {
                socketData.emit('Tiercountry|post', { tierid: id, continentid: cateid, ...values });
                socketData.once('Tiercountry|post', (response) => {
                    if (response.success) {
                        CustomMessage('success', response?.message);
                        form.resetFields();
                        CountryAllDataShow();
                        setSelectedTier('');
                        setSelectedContinent('');

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
        const trimmedname = values.priority.trim();
        if (!trimmedname) {
            isValid = false;
            CustomMessage('warning', 'Please Enter a Name');
        }
        return isValid;
    };

    let flatTableAllData = alldata.map(rowData => {

        console.log(rowData, "rowDatarowData");

        let continent_data_All = rowData?.continent_data.map(element => element?.name).filter(Boolean);
        let continent_data_id = rowData?.continentid
        let tier_data_id = rowData?.tierid
        let tier_data_All = rowData?.tier_data.map(element => element?.tier).filter(Boolean);
        let name = rowData?.country.map(element => element?.name).filter(Boolean);

        return {
            countrycode: rowData?.countrycode,
            priority: rowData?.priority,
            status: rowData?.status,
            registerdate: rowData?.registerdate,
            continent_data: continent_data_All,
            tier_data: tier_data_All,
            name: name,
            _id: rowData?._id,
            continent_id: continent_data_id,
            tier_id: tier_data_id
        };
    });

    const filteredData = flatTableAllData.filter(item => {
        if (selectedFilter === '0') {
            return item.status === 0;
        } else if (selectedFilter === '') {
            return true;
        } else if (selectedFilter === '1') {
            return item.status === 1;
        }
        return false;
    });

    const handleUpdate = (row) => {
        console.log(row, "rowrowrow");

        formRef?.current?.resetFields();
        formRef?.current?.setFieldsValue({
            tier: row.tier_data,
            ContinentName: row.continent_data,
            countrycode: row.countrycode,
            priority: row.priority,

            tierid: row.continent_id,
            continentid: row.tier_id,
        });
        setId(row.tier_id);
        setCateId(row.continent_id);
        setCodeId(row.countrycode);
        setIdpass(row?._id);
        setStatus(row?.status);
        setDefultValue(true);
    };

    const handleToggleChange = async (id, checked) => {
        try {
            const continueCall = checked ? 0 : 1;
            socketData.emit('tier|status', {
                _id: id,
                status: continueCall.toString()
            });
            socketData.once('tier|status', (response) => {
                if (response?.success) {
                    setAlldata((prevData) =>
                        prevData.map((row) => (row._id === id ? { ...row, status: continueCall } : row))
                    );
                    CustomMessage('success', response?.message);
                    CountryAllDataShow();
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
                socketData.emit('Tierdeletecountry', { _id: _id });
                try {
                    socketData.once('Tierdeletecountry', (response) => {
                        if (response.success) {
                            CustomMessage('success', response?.message);
                            CountryAllDataShow();
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

    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());


    const skeletonItems = Array.from({ length: 3 }, (_, index) => index);
    const SkeletonRow = () => {
        return (
            <>
                {skeletonItems?.map((item) => (
                    <tr key={item}>
                        <td colSpan="7" className="skeleton-loader">
                            <Skeleton loading={loading}
                                active
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
            title: 'Tier',
            dataIndex: 'Tier',
            key: 'Continent Name',
            render: (text, record) => {
                return (
                    <>
                        {record?.tier_data}
                    </>
                )
            }
        },
        {
            title: 'Continent Name',
            dataIndex: 'Continent Name',
            key: 'Continent Name',
            render: (text, record) => {
                return (
                    <>
                        {record?.continent_data}
                    </>
                )
            }
        },
        {
            title: 'Country Code',
            dataIndex: 'countrycode',
            key: 'countrycode',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ReactCountryFlag
                        countryCode={record.countrycode}
                        svg
                        style={{
                            width: '2em',
                            height: '2em',
                        }}
                    />
                    <span style={{ marginLeft: '10px' }}>
                        {record.name}
                    </span>
                </div>
            ),
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            render: (priority) => (
                <span>
                    {priority || '-'}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status, record) => {
                return (
                    <>
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
                    </>
                )
            }
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: (_, row) => {
                return (
                    <>
                        <Tooltip title="Edit">
                            <EditOutlined onClick={() => handleUpdate(row)} style={{ width: '2em', fontSize: '120%' }} />
                        </Tooltip>
                        <Tooltip title="Delete">
                            <DeleteOutlined onClick={() => handleDelete(row?._id)} style={{ fontSize: '120%' }} theme="outlined" />
                        </Tooltip>
                    </>
                )
            },
        },
        {
            title: 'Register Date',
            dataIndex: 'registerdate',
            key: 'registerdate',
            render: (registerdate) => (
                <span>
                    {moment(registerdate).format('DD/MM/YYYY hh:mm:ss A')}
                </span>
            ),
        },
    ];

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
                <title>Tier Country</title>
            </Helmet>
            <main className="h-100" id="dashboard-maain">
                <div className="project">
                    <Form form={form} onFinish={handleInsertData} ref={formRef} layout="vertical">
                        <div class="right-header">
                            <div class="row gx-0">
                                <div class="col-6 d-flex align-items-start">
                                    <h2>{defultValue ? `Update Tier Country` : `Create Tier Country`}</h2>
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
                                    <label htmlFor="sname">Tier<span className="required">*</span></label>
                                    <Form.Item
                                        htmlFor="sname"
                                        name="tier"
                                        className='height-set-Description'
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Tier is required'
                                            },
                                        ]}>
                                        <Select
                                            placeholder="Tier"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            options={tierOptions}
                                            onChange={handleSelectChange}
                                            value={selectedTier}
                                        />
                                    </Form.Item>
                                </div>
                                <div className="form-group platform">
                                    <label htmlFor="sname">Continent<span className="required">*</span></label>
                                    <Form.Item
                                        htmlFor="sname"
                                        className="height-set-Description"
                                        name="ContinentName"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Enter a Continent',
                                            },
                                        ]}
                                    >
                                        <Select
                                            placeholder="Continent"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            options={continentOptions}
                                            onChange={handleChangeCatedata}
                                            value={selectedContinent}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group sname">
                                    <label htmlFor="sname">Countrycode<span className="required">*</span></label>
                                    <Form.Item name="countrycode"
                                        className="height-set-Description"
                                        htmlFor="sname"
                                        rules={[{ required: true, message: 'Please enter a Countrycode' }]}>
                                        <Select
                                            placeholder="Countrycode"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            onChange={handleSelectChangecode}
                                            value={contrycode}
                                        >
                                            {
                                                contrycodeOptions?.map((row) => {
                                                    return (
                                                        <>
                                                            <Option value={row?.value}>
                                                                <ReactCountryFlag
                                                                    countryCode={row?.value}
                                                                    svg
                                                                    style={{
                                                                        width: '1em',
                                                                        height: '1em',
                                                                        marginRight: '8px'
                                                                    }}
                                                                />
                                                                {row?.label}
                                                            </Option>
                                                        </>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="form-group sname">
                                    <label htmlFor="name">Priority</label>
                                    <Form.Item htmlFor="sname" name="priority">
                                        <Input
                                            type="text"
                                            id="name"
                                            placeholder="Priority"
                                            value={createData?.priority}
                                            onChange={(e) => onInputChange(e, 'priority')}
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
                                <h2>Tier Country Records</h2>
                            </div>
                            <div className="col-lg-7 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                                <div className="form-group platform">
                                    <label htmlFor="platform">Tier</label>
                                    <Form.Item className='height-set-Description' name="mainCategory">
                                        <Select
                                            placeholder="Tier"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            options={[
                                                { value: '', label: 'All' },
                                                ...tierOptions,
                                            ]}
                                            onChange={handleTierChange}
                                            value={selectedTier}
                                        />
                                    </Form.Item>
                                </div>

                                <div className="form-group platform">
                                    <label htmlFor="platform">Continent</label>
                                    <Form.Item className='height-set-Description' name="category">
                                        <Select
                                            placeholder="Continent"
                                            showSearch
                                            optionFilterProp="children"
                                            filterOption={filterOption}
                                            options={[
                                                { value: '', label: 'All' },
                                                ...continentOptions,
                                            ]}
                                            onChange={handleContinentChange}
                                            value={selectedContinent}
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
                            dataSource={flatTableAllData}
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

export default Tiercontry;