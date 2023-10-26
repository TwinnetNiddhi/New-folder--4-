import Header from '../../Headers/Header'
import Navbar from '../../Headers/Navbar'
import React, { useEffect, useState } from 'react';
import { Cascader, Form, Tooltip } from 'antd';
import { Line } from '@ant-design/plots';
import dayjs from 'dayjs';
import { DatePicker, Select, Space } from 'antd';
import moment from 'moment/moment';
import { Spin } from 'antd';
import { Table } from 'antd';
import '../../../Component/Preferences/BasicGraph/BasicGraph.css'
import '../../../Component/App_Details_theme/css/usersgraph.css';
import socket from '../../socket.io/service';
import { useLocation, useNavigate } from 'react-router-dom';
import { Typography } from 'antd';
import CustomMessage from '../../CustomMessage/CustomMessage';
import mainHoc from '../../hoc/mainHoc';
import { Helmet } from 'react-helmet';

const { SHOW_CHILD } = Cascader;

const { Paragraph } = Typography;

const { RangePicker } = DatePicker;

const rangePresets = [
  {
    label: 'Today',
    value: [dayjs().add(-30, 'm'), dayjs()],
  },
  {
    label: 'Yesterday',
    value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')],
  },
  {
    label: 'Last 7 Days',
    value: [dayjs().add(-6, 'd'), dayjs()],
  },
  {
    label: 'This Month',
    value: [dayjs().startOf('month'), dayjs()],
  },
  {
    label: 'Pervious Month',
    value: [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')],
  },
  {
    label: 'Last 3 Months',
    value: [dayjs().subtract(3, 'month').startOf('month'), dayjs()],
  },
  {
    label: 'Last 6 Months',
    value: [dayjs().subtract(5, 'month').startOf('month'), dayjs()],
  },
  {
    label: 'This Year',
    value: [dayjs().startOf('year'), dayjs()],
  },
  {
    label: 'All Time',
    value: [dayjs().startOf('year'), dayjs()],
  },
];

const BasicGraph = () => {
  const [optionsMultipleData, setOptionsMultipleData] = useState([]);
  const [optionsMultipleDataDevice, setOptionsMultipleDataDevice] = useState([]);
  const [deviceOptionsMultipleData, setDeviceOptionsMultipleData] = useState()
  const [deviceIdOptionData, setDeviceIdOptionData] = useState()
  const dateFormat = moment().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState([moment(dateFormat), moment(dateFormat)]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [projectId, setProjectId] = useState();
  const [firstAllDataCharts, setFirstAllDataCharts] = useState([]);
  const [deviceIdAll, setDeviceIdAll] = useState([]);
  const [userProperties, setUserProperties] = useState({});
  const [deviceIdAllData, setDeviceIdAllData] = useState([])
  const [devicesProperties, setDevicesProperties] = useState({});
  const [searchDataAll, setSearchDataAll] = useState('');
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sorter: {},
  });
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [searchQuery, setSearchQuery] = useState('');
  const [pageSize, setPageSize] = useState(10); // Set the initial page size (e.g., 10)
  const navigation = useNavigate()

  const handleDateRangeChange = (dates) => {
    setStartDate(dates);
    if (dates && dates?.length === 2) {
      queryParams.set('startDate', dates[0].format('YYYY-MM-DD'));
      queryParams.set('endDate', dates[1].format('YYYY-MM-DD'));
    } else {
      queryParams.set('startDate', dateFormat);
      queryParams.set('endDate', dateFormat);
    }
    navigate(`?${queryParams.toString()}`);
  };

  useEffect(() => {
    const savedStartDate = queryParams.get('startDate');
    const savedEndDate = queryParams.get('endDate');

    if (savedStartDate && savedEndDate) {
      setStartDate([dayjs(savedStartDate), dayjs(savedEndDate)]);
    } else {
      queryParams.set('startDate', dateFormat);
      queryParams.set('endDate', dateFormat);
      navigate(`?${queryParams.toString()}`);
    }
  }, []);

  const onChangeMultipleDevice = (value) => {
    const updatedDeviceIdAllData = [];

    value.forEach((item) => {
      // Assuming item is an array with two elements: [label, value]
      const [label, selectedValue] = item;
      // Check if the selectedValue is not null and not undefined
      if (selectedValue !== null && selectedValue !== undefined) {
        if (label === 'Device List') {
          // Handle "Device List" label differently
          updatedDeviceIdAllData.push({
            deviceId: selectedValue,
          });
        }
      }
    });

    setDeviceIdAllData(updatedDeviceIdAllData);
  }

  const renderOptions = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }
    return data.map((item) => {
      const { label, value, children } = item;
      const option = {
        label,
        value,
      };

      if (Array.isArray(children)) {
        option.children = renderOptions(children);
      }
      return option;
    });
  };

  const onChangeMultiple = (value) => {
    const updatedUserProperties = {};
    let selectedProjectId = projectId;
    const referrerData = [];
    const AppListData = [];

    value.forEach((item) => {
      const [label, selectedValue] = item;
      if (selectedValue !== null && selectedValue !== undefined) {
        if (label === 'Device List') {
        } else if (label === 'Project ID') {
          selectedProjectId = selectedValue;
        } else if (label === 'referrer') {
          const referrerItem = optionsMultipleData.find((option) => option.label === label);

          if (referrerItem) {
            const selectedReferrer = referrerItem.children.find((child) => child.value === selectedValue);
            if (selectedReferrer) {
              const referrerObject = {
                [selectedReferrer.label]: selectedReferrer.value,
              };
              referrerData.push(referrerObject);
            }
          }
        }

        else if (label === 'app_list') {
          const referrerItem = optionsMultipleData.find((option) => option.value === label);
          if (referrerItem) {
            const selectedReferrer = referrerItem.children.find((child) => child.value === selectedValue);
            if (selectedReferrer && selectedReferrer.children[0]) {
              const packageNameArray = [];
              for (const child of selectedReferrer.children) {
                packageNameArray.push(child.value);
              }
              const referrerObject = {
                packageName: packageNameArray,
              };
              AppListData.push(referrerObject);
            }
          }
        }

        else {
          if (updatedUserProperties.hasOwnProperty(label)) {
            updatedUserProperties[label].push(selectedValue);
          } else {
            updatedUserProperties[label] = [selectedValue];
          }
        }
      }
    });

    if (referrerData.length > 0) {
      updatedUserProperties.referrer = referrerData;
    }
    if (AppListData.length > 0) {
      updatedUserProperties.app_list = AppListData;
    }
    setUserProperties(updatedUserProperties);
    setProjectId(selectedProjectId);
  };

  const onChangeDeviceMultiple = (value) => {
    const updatedDeviceProperties = {};

    value.forEach((item) => {
      const [label, selectedValue] = item;

      if (selectedValue !== null && selectedValue !== undefined) {
        if (updatedDeviceProperties.hasOwnProperty(label)) {
          updatedDeviceProperties[label].push(selectedValue);
        } else {
          updatedDeviceProperties[label] = [selectedValue];
        }
      }
    });

    setDevicesProperties(updatedDeviceProperties);
  };




  const chartTitle = 'Basic Chart';
  const chartSubtitle = 'Basic Chart Date and Count';

  function handleTooltipClick(year) {
    const newDataUrl = `https://example.com/data?year=${year}`;

    // Open a new tab with the specified URL
    window.open(newDataUrl, '_blank');
  }

  useEffect(() => {
    try {
      setLoading(true);
      socket.emit('project|get|all', { page: 1, limit: 10000000000, search: '' });
      socket.on('project|get|all', (response) => {
        setLoading(true);
        if (response.success) {
          setLoading(false);
          setTableData(response?.data);
        }
      });
    } catch (error) {
      console.log(error, "error");
    } finally {
      setLoading(false);
    }

    return () => {
      socket.off('project|get|all');
    };
  }, []);

  useEffect(() => {
    try {
      setLoading(true);
      const savedStartDate = queryParams.get('startDate');
      const savedEndDate = queryParams.get('endDate');
      const SavedprojectIdParam = queryParams.get('projectId');

      const SavedprojectId = SavedprojectIdParam === null || SavedprojectIdParam === 'null' ? null : SavedprojectIdParam;

      socket.emit('session|get|basicGraph', {
        startDate: savedStartDate,
        endDate: savedEndDate,
        projectId: SavedprojectId,
        userProperties: userProperties,
        deviceProperties: devicesProperties,
        pagination: tableParams.pagination,
        sorting: tableParams.sorter,
        deviceId: Array.isArray(deviceIdAllData) && deviceIdAllData?.length > 0 ? deviceIdAllData : {}
      });

      socket.on('session|get|basicGraph', (response) => {
        setLoading(false);

        if (response.success) {
          setFirstAllDataCharts(response?.deviceList?.deviceCount);
          setDeviceIdAll(response?.deviceList?.filteredDeviceIds);
          setTableParams({
            ...tableParams,
            pagination: {
              ...tableParams.pagination,
              total: deviceIdAll?.length,
            },
          });
        } else {
        }
      });
    } catch (error) {
      console.error('Error in useEffect:', error);
      setLoading(false);
      CustomMessage('error', error?.message);
    }

    return () => {
      socket.off('session|get|basicGraph');
    };
  }, [startDate, projectId, userProperties, deviceIdAllData, devicesProperties]);


  useEffect(() => {
    try {
      setLoading(true);
      socket.once('session|get|genericFilterUserProperties', (response) => {
        if (response?.success) {
          const dynamicLabels = [];

          Object.keys(response?.userProperties).forEach((key) => {
            dynamicLabels.push({
              label: key.replace(/_/g, ' '), // Replace underscores with spaces
              value: key,
              data: response.userProperties[key] || [],
            });
          });

          let selectedKey = null;
          const labelToFind = 'app_list';

          const processNestedData = (data, keyToFind, valueToFind, keyClicked, labelToFind) => {
            const processedKeys = [];
            const processedValues = [];

            if (Array.isArray(data)) {
              data.forEach((element) => {
                if (Array.isArray(element)) {
                  element.forEach((element1) => {
                    const { keys, values } = processNestedData(element1, keyToFind, valueToFind, keyClicked, labelToFind);
                    processedKeys.push(...keys);
                    processedValues.push(...values);
                  });
                } else {
                  const { keys, values } = processNestedData(element, keyToFind, valueToFind, keyClicked, labelToFind);
                  processedKeys.push(...keys);
                  processedValues.push(...values);
                }
              });
            } else if (typeof data === 'object' && data !== null) {
              for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                  const value = data[key];
                  processedKeys.push(key);
                  processedValues.push(value);

                  if (key === keyToFind && value === valueToFind) {
                    if (key === keyClicked && !data[keyClicked]) {
                      data[keyClicked] = {};
                    }
                  }
                }
              }
            } else {
              const key = data?.toString()?.replace(/_/g, ' ') || '';
              const value = data?.toString()?.replace(/_/g, ' ') || '';
              processedKeys.push(key);
              processedValues.push(value);
            }

            return { keys: processedKeys, values: processedValues };
          };

          const updatedOptionsMultipleData = dynamicLabels?.map((labelData) => {
            const { keys, values } = processNestedData(labelData.data, selectedKey, labelToFind, null, null);
            let children;

            if (Array.isArray(labelData.data)) {
              children = keys.map((key, index) => {
                let labelValue = values[index];

                if (labelValue === 'not_found' && selectedKey !== null) {
                  const selectedIndex = keys.indexOf(selectedKey);
                  if (selectedIndex !== -1) {
                    labelValue = values[selectedIndex];
                  }
                }

                const childrenObject = [labelValue];

                const result = childrenObject?.reduce((acc, element) => {
                  if (Array.isArray(element)) {
                    return acc.concat(element);
                  } else {
                    console.error("element is not an array:", element);
                    return acc;
                  }
                }, []);

                const labelValueArray = result.map((element) => ({
                  label: element,
                  value: element,
                }));
                let children;
                if (labelData?.label === 'app list') {
                  children = childrenObject?.map((element) => ({
                    label: element || '',
                    value: element || '',
                  }));
                } else if (labelData?.label === 'referrer') {
                  children = childrenObject?.map((element) => ({
                    label: element || '',
                    value: element || '',
                  }));
                } else {
                  children = [];
                }

                const truncatedKey = key.length > 30 ? `${key.slice(0, 30)}...` : key;

                return {
                  label: selectedKey === truncatedKey ? `${truncatedKey}-${labelValue}` : `${truncatedKey}`,
                  value: values[index],
                  children: children,
                };
              }).filter((child) => child.value !== 'not_found');
            } else if (Array.isArray(labelData.data[0]?.children)) {
              children = keys.map((key, index) => {
                let labelValue = values[index];

                if (labelValue === 'not_found' && selectedKey !== null) {
                  const selectedIndex = keys.indexOf(selectedKey);
                  if (selectedIndex !== -1) {
                    labelValue = values[selectedIndex];
                  }
                }

                const childrenObject = labelData.data[0]?.children.map((child) => ({
                  label: child.label || '',
                  value: child.value || '',
                }));

                return {
                  label: selectedKey === key ? `${key}-${labelValue}` : `${key}`,
                  value: values[index],
                  children: childrenObject,
                };
              }).filter((child) => child.value !== 'not_found');
            }

            return {
              label: labelData.label || '',
              value: labelData.value || '',
              children,
            };
          });

          const deviceListLabelData = updatedOptionsMultipleData.find((data) => data.label === 'Device List');
          if (deviceListLabelData) {
            setDeviceIdOptionData(deviceListLabelData.children);
          } else {
            setDeviceIdOptionData([]);
          }
          console.log(updatedOptionsMultipleData, "updatedOptionsMultipleData");
          setOptionsMultipleData(updatedOptionsMultipleData);

        } else {
          CustomMessage('error', response?.message);
        }
      });
    } catch (error) {
      console.log(error, "error");
      CustomMessage('error', error?.message);
      setLoading(false);
    }

    try {
      setLoading(true);
      socket.once('session|get|genericFilterUserProperties', (response) => {
        if (response?.success) {
          const dynamicLabels = [];

          dynamicLabels.unshift({
            label: 'Device List',
            value: 'Device List',
            data: response.deviceList || [],
          });

          const processNestedData = (data) => {
            const processedKeys = [];
            const processedValues = [];

            if (Array.isArray(data)) {
              data.forEach((element) => {
                const { keys, values } = processNestedData(element);
                processedKeys.push(...keys);
                processedValues.push(...values);
              });
            } else if (typeof data === 'object' && data !== null) {
              for (const key in data) {
                if (Object.hasOwnProperty.call(data, key)) {
                  const value = data[key];
                  processedKeys.push(key);
                  processedValues.push(value);
                }
              }
            } else {
              processedKeys.push(data?.toString()?.replace(/_/g, ' ') || '');
              processedValues.push(data?.toString()?.replace(/_/g, ' ') || '');
            }

            return { keys: processedKeys, values: processedValues };
          };

          let selectedKey = null; // Initialize the selected key to null

          const updatedOptionsMultipleData = dynamicLabels?.map((labelData) => {
            const { keys, values } = processNestedData(labelData.data);

            const children = keys
              .map((key, index) => {
                let labelValue = values[index];

                if (labelValue === 'not_found' && selectedKey !== null) {
                  const selectedIndex = keys.indexOf(selectedKey);
                  if (selectedIndex !== -1) {
                    labelValue = values[selectedIndex];
                  }
                }

                return {
                  label: `${labelValue}`,
                  value: values[index],
                  onClick: () => {
                    selectedKey = key; // Update the selected key
                  },
                  isSelected: selectedKey === key, // Check if the key is selected
                };
              })
            return {
              label: labelData.label || '',
              value: labelData.value || '',
              children,
            };
          });

          const deviceListLabelData = updatedOptionsMultipleData.find((data) => data.label === 'Device List');
          if (deviceListLabelData) {
            setDeviceIdOptionData(deviceListLabelData.children);
          } else {
            setDeviceIdOptionData([]);
          }
          setOptionsMultipleDataDevice(updatedOptionsMultipleData)

        } else {
          CustomMessage('error', response?.message);
        }
      });
    } catch (error) {
      console.log(error, "error");
      CustomMessage('error', error?.message);
      setLoading(false);
    }


    const savedStartDate = queryParams.get('startDate');
    const savedEndDate = queryParams.get('endDate');
    const SavedprojectId = queryParams.get('projectId');

    // Ensure that startDate is a valid date object
    socket.emit('session|get|genericFilterUserProperties', {
      startDate: savedStartDate,
      endDate: savedEndDate,
      projectId: SavedprojectId,
    });

    try {
      setLoading(true);
      socket.once('session|get|genericFilterDeviceProperties', (response) => {
        if (response?.success) {
          const dynamicLabels = [];

          Object.keys(response?.deviceProperties).forEach((key) => {
            dynamicLabels.push({
              label: key.replace(/_/g, ' '), // Replace underscores with spaces
              value: key,
              data: response.deviceProperties[key] || [],
            });
          });

          const updatedOptionsMultipleDataDevice = dynamicLabels?.map((labelData) => ({
            label: labelData.label || '',
            value: labelData.value || '',
            children: Array.isArray(labelData.data)
              ? labelData?.data?.map((item) => ({
                label: item ? (item?.toString()?.replace(/_/g, ' ') || '') : '',
                value: item ? (item?.toString() || '') : '',
              }))
              : [],
          }));

          setDeviceOptionsMultipleData(updatedOptionsMultipleDataDevice);
        } else {
        }
      });
    } catch (error) {
      console.log(error, "error");
      // toast.error(error.message, "error");
      setLoading(false);
    }

    socket.emit('session|get|genericFilterDeviceProperties', {
      startDate: savedStartDate, // Format as ISO string
      endDate: savedEndDate,   // Format as ISO string
      projectId: SavedprojectId,
    });

    return () => {
      socket.off('session|get|genericFilterDeviceProperties');
      socket.off('session|get|genericFilterUserProperties');
    };
  }, [startDate, projectId]);


  useEffect(() => {
    const savedProjectId = queryParams.get('projectId');

    if (savedProjectId !== null) {
      setProjectId(savedProjectId);
    } else {
      setProjectId(''); // Set to an empty string if projectId is not found in URL
    }
  }, []);


  const handleChangesProjectId = (e) => {
    setProjectId(e);

    const updatedQueryParams = new URLSearchParams(location.search);
    if (e !== '') {
      updatedQueryParams.set('projectId', e);
    } else {
      updatedQueryParams.delete('projectId');
    }

    navigate(`?${updatedQueryParams.toString()}`, { replace: true });
  };


  const config = {
    data: firstAllDataCharts || [],
    xField: 'date',
    yField: 'count',
    title: null,
    description: null,
    xAxis: {
      title: {
        text: 'Date',
      },
    },
    yAxis: {
      title: {
        text: 'Numbers Of Users',
      },
    },
    label: {},
    lineStyle: {
      stroke: "green"
    },
    point: {
      size: 5,
      shape: 'round',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
    tooltip: {
      showMarkers: true,
      enterable: true,
      follow: true,
      customContent: (x, y) => {
        const dataPoint = firstAllDataCharts.find((item) => item.date === x);
        if (dataPoint) {
          const formattedDate = moment(x).format('DD/MM/YYYY'); // Replace 'Your Desired Format' with the desired format

          return (
            <div
              style={{
                width: '200px',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: '#FFFFFF',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: 'none', // Remove the shadow
                cursor: 'pointer',
              }}
            >
              <div onClick={() => handleTooltipClick(x)}>
                <p style={{ marginBottom: '5px', color: 'white' }}>Date: {formattedDate}</p>
                <p style={{ marginBottom: '5px', color: 'white' }}>Value: {dataPoint.count}</p>
              </div>
            </div>
          );
        }
        return null;
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };


  function convertUtcToIst(utcDate) {
    const utcDateTime = new Date(utcDate);

    const utcTimeMillis = utcDateTime.getTime();

    const istOffsetMillis = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;

    const istTimeMillis = utcTimeMillis + istOffsetMillis;

    const istDateTime = new Date(istTimeMillis);

    return istDateTime;
  }

  const properset = (createdAt) => {
    const istTime = convertUtcToIst(createdAt);

    const createdAtMoment = moment(istTime);
    const currentDateTime = moment();

    const diffInMinutes = currentDateTime.diff(createdAtMoment, 'minutes');
    const diffInHours = currentDateTime.diff(createdAtMoment, 'hours');
    const diffInDays = currentDateTime.diff(createdAtMoment, 'days');

    if (diffInMinutes <= 1) {
      return 'Just now';
    } else if (diffInMinutes <= 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    } else if (diffInHours <= 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays <= 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return createdAtMoment.format('DD/MM/YYYY hh:mm');
    }
  };

  let flattenedData = []

  deviceIdAll?.forEach((row) => {
    row?.deviceList?.forEach((rowData) => {
      flattenedData.push({
        country: rowData.country,
        code: rowData.code,
        deviceId: rowData.deviceId,
        emoji: rowData.emoji,
        lastTimeEventActivity: rowData.lastTimeEventActivity,
      });
    });
  });

  const filteredData = flattenedData.filter((rowData) =>
    (rowData.country || '').toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      title: 'Project ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      render: (deviceId) => (
        <td>{5454545415}</td>
      ),
    },
    {
      title: 'Country Name',
      dataIndex: 'country',
      key: 'country',
      render: (country, rowData) => (
        <div className="d-flex justify-content-between">
          {rowData.emoji || country ? <div className="d-flex">
            {rowData.emoji} {' '}
            {country}
          </div> : '-'}
          {rowData.code ? <div>({rowData.code})</div> : ''}
        </div>
      ),

    },

    {
      title: 'Device ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      sorter: (a, b) => a['deviceId'].localeCompare(b['deviceId']),
      render: (deviceId) => (
        <Paragraph
          copyable={{
            text: deviceId,
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
          <div className='color-blue-deviceId cursor-pointer' onClick={() => handlePassId(deviceId)}>{deviceId}</div>
        </Paragraph>
        // </Tooltip>
      ),

    },
    {
      title: 'Time & Duration',
      dataIndex: 'lastTimeEventActivity',
      key: 'lastTimeEventActivity',
      render: (lastTimeEventActivity) => {
        const formattedDateTime = properset(lastTimeEventActivity);

        // Split the formatted date and time
        const [formattedDate, formattedTime] = formattedDateTime.split(' ');

        return (
          <td className="datetime">
            <Tooltip title={moment(lastTimeEventActivity).format('DD/MM/YYYY hh:mm A')}>
              <div className="d-flex">
                <div className="date">{formattedDate}</div>
                <div className="time">{formattedTime}</div>
              </div>
            </Tooltip>
          </td>
        );
      },
    },
  ];


  const handleTableChange = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDeviceIdAll([]);
    }
  };

  useEffect(() => {
    // Page height setting
    const setPageHeight = () => {
      const windowtop = document.getElementById('dashboard-maain').offsetTop;
      const breadcumb = document.querySelector('#users-graph .breadcumb').offsetHeight;
      const graph = document.querySelector('#users-graph .graph').offsetHeight;
      const projectidtablepadding = window.getComputedStyle(document.querySelector('#users-graph .main-dashboard .main-content .projectid')).paddingTop;
      const projectidtableHeight = document.querySelector('#users-graph .main-dashboard .main-content .projectid .header').offsetHeight;
      const projectidtablefooter = document.querySelector('#users-graph .main-dashboard .main-content .projectid .footer').offsetHeight;
      const bodyHeight = document.querySelector('main').offsetHeight;
      const mobileNav = document.querySelector('.mobile-nav').offsetHeight;

      const total = bodyHeight - windowtop;
      const projectid = bodyHeight - windowtop - breadcumb - graph - 10;
      const projectidtable = projectid - parseFloat(projectidtablepadding) - projectidtableHeight - projectidtablefooter;
      const mobile = bodyHeight - windowtop - 15;

      // Set heights
      document.querySelector('#users-graph .main-dashboard .main-content .projectid .body').style.height = `${projectidtable}px`;

      if (window.innerWidth > 991) {
        // document.querySelector('#users-graph .main-content-body').style.height = `${total}px`;
        // document.querySelector('.detailed-menu').style.height = `${bodyHeight}px`;
        document.querySelector('#users-graph .main-dashboard .main-content .projectid').style.height = `${projectid}px`;
      }

      if (window.innerWidth < 991) {
        document.querySelector('#users-graph .main-dashboard .main-content').style.height = `${mobile}px`;
      }
    };

    // Listen for window resize and adjust heights
    window.addEventListener('resize', setPageHeight);
    setPageHeight();

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', setPageHeight);
    };
  }, []);


  const savedStartDate = queryParams.get('startDate');
  const savedEndDate = queryParams.get('endDate');
  const SavedprojectId = queryParams.get('projectId');

  const handlePassId = (deviceId) => {
    navigation(`/app-analytic?projectId=${SavedprojectId}&deviceId=${deviceId}&startDate=${savedStartDate}&endDate=${savedEndDate}`);
  };

  return (
    <>
      <Helmet>
        <title>Basic Graph</title>
      </Helmet>
      <div id="users-graph">

        <main class="h-100" id="dashboard-maain">
          <div class="col-lg-9 left-col main-dashboard header-custom-col">
            <div class="main-content-body overflow-scroll">
              {/* <!-- breadcumb --> */}
              <div class="breadcumb">
                <div class="row gx-0">
                  <div class="col-lg-8 col-md-6 left d-flex align-items-center">
                    <p><a href="dashboard.html">Dashboard</a> <span>/</span> <a href="">UserGraph</a> <span>/</span> User Details</p>
                  </div>
                </div>
              </div>

              {/* <!-- main content --> */}
              <div class="main-content row gx-0">

                <div class="col-lg-4 col-md-4">
                  {/* <!-- event --> */}
                  <div class="event">
                    <div class="header">
                      <div class="row">
                        <div class="col-8 d-flex left d-flex align-items-center">
                          <i class="ri-arrow-down-s-line"></i>
                          <h6>Event</h6>
                        </div>
                        <div class="col-4 right d-flex align-items-center justify-content-end">
                          <i class="ri-more-2-line"></i>
                        </div>
                      </div>
                    </div>

                    <div class="body">
                      <Form.Item className='height-set-Description'>
                        <Select
                          showSearch
                          style={{
                            width: "100%",
                          }}
                          placeholder="Project ID"
                          optionFilterProp="children"
                          filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                          }
                          onChange={(e) => handleChangesProjectId(e)}
                          value={projectId}
                        >
                          <option value=''>All</option>
                          {
                            Array.isArray(tableData) ? (
                              tableData?.map((projectData, i) => {
                                return (
                                  <option key={i} value={projectData?.projectId}>{projectData?.projectId}</option>
                                )
                              })
                            ) : null
                          }
                        </Select>
                      </Form.Item>

                      <Form.Item className='height-set-Description'>
                        <Cascader
                          options={optionsMultipleDataDevice}
                          onChange={onChangeMultipleDevice}
                          multiple
                          style={{
                            width: "100%",
                          }}
                          maxTagCount="responsive"
                          placeholder='Device List'
                          showCheckedStrategy={SHOW_CHILD}
                          showSearch={{
                            filter: (inputValue, path) => {
                              return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                            }
                          }}
                        />
                      </Form.Item>
                      {/* </div> */}
                      <Form.Item className='height-set-Description'>
                        <Cascader
                          options={optionsMultipleData}
                          onChange={onChangeMultiple} // Pass optionsMultipleData as an argument
                          multiple
                          style={{
                            width: "100%",
                          }}
                          maxTagCount="responsive"
                          placeholder='User Properties'
                          showCheckedStrategy={SHOW_CHILD}
                          showSearch={{
                            filter: (inputValue, path) => {
                              return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                            }
                          }}
                        />
                      </Form.Item>

                      <Form.Item className='height-set-Description'>
                        <Cascader
                          options={deviceOptionsMultipleData}
                          onChange={onChangeDeviceMultiple}
                          multiple
                          style={{
                            width: "100%",
                          }}
                          maxTagCount="responsive"
                          placeholder='Device Properties'
                          showCheckedStrategy={SHOW_CHILD}
                          showSearch={{
                            filter: (inputValue, path) => {
                              return path.some(option => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                            }
                          }}
                        />
                      </Form.Item>
                    </div>
                  </div>

                  {/* <!-- measured --> */}
                  <div class="measured">
                    <div class="header">
                      <div class="row">
                        <div class="col-8 d-flex left d-flex align-items-center">
                          <i class="ri-arrow-down-s-line"></i>
                          <h6>Measured</h6>
                        </div>
                        <div class="col-4 right d-flex align-items-center justify-content-end">
                          <i class="ri-more-2-line"></i>
                        </div>
                      </div>
                    </div>
                    <div class="body">
                      <div class="row gx-0">
                        <div class="col-4 item border-right-0">
                          <h4>All Users</h4>
                        </div>
                        <div class="col-4 item border-right-0">
                          <h4>Retension</h4>
                        </div>
                        <div class="col-4 item">
                          <h4>Unique Users</h4>
                        </div>
                        <div class="col-4 item border-right-0 border-top-0">
                          <h4>Average</h4>
                        </div>
                        <div class="col-4 item border-right-0 border-top-0 border-left-0">
                          <h4>Frequency</h4>
                        </div>
                        <div class="col-4 item border-top-0 border-left-0 d-flex align-items-center button">
                          <h4>Property S... <i class="ri-arrow-down-s-line"></i></h4>
                          <div class="dropdown">
                            <ul>
                              <li><a href="" class="active">1st menu item</a></li>
                              <li><a href="">2nd menu item</a></li>
                              <li><a href="">3rd menu item</a></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-8 col-md-8">
                  {/* <!-- graph --> */}
                  <div class="graph">
                    <div class="header">
                      <div class="row gx-0">
                        <div class="col-6 d-flex align-items-center">
                          <h2>Basic Graph</h2>
                          <h6> ( Percentage of xyz )</h6>
                        </div>
                        <div class="col-6 d-flex justify-content-end align-items-center right">
                          <div class="setting button">
                            <i class="ri-settings-2-line"></i>
                            <div class="dropdown">
                              <ul>
                                <li><a href="" class="active">1st menu item</a></li>
                                <li><a href="">2nd menu item</a></li>
                                <li><a href="">3rd menu item</a></li>
                              </ul>
                            </div>
                          </div>
                          <a href="" class="btn">Share</a>
                        </div>
                      </div>
                    </div>
                    <div class="date">
                      <div class="row gx-0">
                        <div class="col-lg-4 col-md-3 d-flex align-items-center left">
                          <div class="form-group select">
                            <select class="form-select" aria-label=".form-select-lg example">
                              <option selected>Basic Graph</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                          </div>
                        </div>
                        <div class="col-lg-8 col-md-9 d-lg-flex d-md-flex align-items-center justify-content-end right">

                          <div class="input-group form-group input-daterange">
                            <Space direction="vertical" size={15}>
                              <DatePicker.RangePicker
                                presets={rangePresets}
                                defaultValue={[dayjs(dateFormat), dayjs(dateFormat)]}
                                onChange={handleDateRangeChange}
                                format="DD-MM-YYYY"
                              />
                            </Space>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="main-graph">
                      <h3 class="mt-3"></h3>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="row">
                            <div className="col-md-12">
                              <div className="text-center">
                                <h4>{chartTitle}</h4>
                                <p>{chartSubtitle}</p>
                              </div>
                              <br />

                              {firstAllDataCharts && (
                                <div className="chart-container" style={{ position: 'relative' }}>
                                  {loading && (
                                    <div className="loading-spinner">
                                      <Spin size="large" />
                                    </div>
                                  )}
                                  <Line {...config} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <!-- project id --> */}
                  <div class="projectid">
                    <div class="header">
                      <div class="row">
                        <div class="col-lg-5 col-md-5 d-flex align-items-center">
                          <div class="user">
                            <h6>All User</h6>
                            <div class="badge">50</div>
                          </div>
                        </div>
                        <div class="col-lg-4 col-md-4 d-flex align-items-end">
                          <div class="form-group w-100 d-flex align-items-center">
                            <select class="form-select form-control" aria-label=".form-select-lg example">
                              <option selected disabled>Search Country</option>
                              <option value="1">One</option>
                              <option value="2">Two</option>
                              <option value="3">Three</option>
                            </select>
                            <div class="badge">50</div>
                          </div>
                        </div>
                        <div class="col-lg-3 col-md-3 d-flex align-items-end">
                          <div class="form-group">
                            <input
                              type="search"
                              placeholder="Search text"
                              className="form-control"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <i class="ri-search-line"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="body">
                      {deviceIdAll && (
                        <Table
                          columns={columns}
                          rowKey={(record) => record.id}
                          dataSource={filteredData}
                          pagination={{
                            ...tableParams.pagination,
                            pageSize: pageSize, // Set the page size here
                          }}
                          loading={loading}
                          onChange={handleTableChange}
                          size="small"
                        />
                      )}
                    </div>

                    <div class="footer d-flex justify-content-end">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default BasicGraph