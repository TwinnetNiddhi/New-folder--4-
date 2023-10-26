import React, { useEffect, useState } from "react";
import Header from '../../Headers/Header';
import Navbar from '../../Headers/Navbar';
import $ from "jquery"
import { Form, Input, Button, Table, Tooltip, Skeleton } from 'antd';
import socket from "../../socket/socket/service";
import { Link } from "react-router-dom";
import '../../../Component/App_Details_theme/css/users.css';
import '../../../Component/Preferences/CustomStoreListing/CustomStoreListing.css';
import ReactCountryFlag from "react-country-flag";
import CustomMessage from "../../CustomMessage/CustomMessage";
import mainHoc from "../../hoc/mainHoc";
import { Helmet } from "react-helmet";
const { Search } = Input;

const { Column } = Table;

const CustomStoreListing = () => {
  const [loading, setLoading] = useState(false);
  const [appIDAllDataNameData, setAppIDAllDataNameData] = useState({
    appId: '',
  });
  const [counteryWiseTabeDataShow, setCounteryWiseTabeDataShow] = useState([]);
  const [counteryWiseTabeDataShowDefult, setCounteryWiseTabeDataShowDefult] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [form] = Form.useForm();
  const [activeIndex, setActiveIndex] = useState(null);
  const [selectedCountryData, setSelectedCountryData] = useState(null);
  const [searchTerm1, setSearchTerm1] = useState('');
  const [popupDataAllShow, setPopupDataAllShow] = useState()
  const [searchQuery, setSearchQuery] = useState('');
  const [searchQueries, setSearchQueries] = useState({});
  const [scrollLeft, setScrollLeft] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const initialSearchQueries = {};
    filteredData.forEach((row) => {
      row.language.forEach((rowData) => {
        initialSearchQueries[rowData.languageName] = '';
      });
    });
    setSearchQueries(initialSearchQueries);
  }, [filteredData]);


  useEffect(() => {
    // Handle the opening of the popup
    $('.popup-open').on('click', function() {
      $('#country-popup').addClass('open');
      $('.bg-overlay').addClass('open');
    });

    // Handle the closing of the popup
    $('#country-popup .close-btn, .bg-overlay').on('click', function() {
      $('#country-popup').removeClass('open');
      $('.bg-overlay').removeClass('open');
    });
  }, []);

  const openPopup = (row) => {
    setPopupDataAllShow(row)

    // $('.popup-open').on('click', function(){
    //   $('#country-popup').addClass('open');
    //   $('.bg-overlay').addClass('open');
    // })
    // $('#country-popup .close-btn, .bg-overlay').on('click', function(){
    //   $('#country-popup').removeClass('open');
    //   $('.bg-overlay').removeClass('open');
    // });
  };


  const handleItemClick = (index) => {
    setActiveIndex(index);
    setSelectedCountryData(counteryWiseTabeDataShow[index]);
    };

  const onFinish = (value) => {
    setLoading(true)
    socket.emit('custom-Store-Listing', value);
    socket.once('custom-Store-Listing', (response) => {
      setLoading(true)
      try {
        if (response?.success) {
          setCounteryWiseTabeDataShow(response?.data?.Different || []);
          setCounteryWiseTabeDataShowDefult(response?.data?.Default || []);
          setFilteredData(response?.data?.Different || []);
          CustomMessage('success', response?.message);
        } else {
          CustomMessage('error', response?.message);
        }
        setLoading(false)
      } catch (error) {
        console.log(error, "error");
        CustomMessage('error', error?.message);
      } finally {
        setLoading(false)
      }
    });
  };

  useEffect(() => {
    var windowtop = $('#users-page .top-header').outerHeight();
    var bodyHeight = $('main').height();
    var mobilenav = $('.mobile-nav').height();

    const mobile = bodyHeight - mobilenav - 20;
    const total = bodyHeight - windowtop;

    $('#users-page .lc').css('height', total);

  }, []);

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChanges = (e) => {
    setAppIDAllDataNameData({
      ...appIDAllDataNameData,
      [e.target.id]: e.target.value, // Use e.target.id to identify the input field
    });
  };

  let countery = counteryWiseTabeDataShow[activeIndex]?.country
  let flattenedData = []

  filteredData.forEach((row) => {
    row.language.forEach((rowData) => {
      flattenedData.push({
        languageName: rowData.languageName,
        icon: rowData.icon,
        title: rowData.title,
        langCode: rowData.langCode,
        description: rowData.description,
        desScript: rowData.desScript,
        summary: rowData.summary,
        screenshots: rowData.screenshots,
        link: rowData.link,
        CountryName: row.CountryName,
        Emoji: row.Emoji,
        country: row.country,
      });
    });
  });

  const groupedData = flattenedData.reduce((result, item) => {
    const key = item.CountryName;
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {});

  const columnsBottom = [
    {
        title: 'Language',
        dataIndex: 'languageName',
        key: 'languageName',
        render: (text,lang) => (
          <Tooltip title={lang?.langCode}>
            {text}
          </Tooltip>
        )
    },
    {
      title: "Logo",
      dataIndex: "icon",
      key: "icon",
      render: (icon) => (
        <span className="logo text-center">
          {icon ? (
            <a href={icon} target="_blank" rel="noopener noreferrer">
              <img className="border-1 rounded w-px-40 image-width-set" src={icon || '-'} alt="logo" />
            </a>
          ) : (
            <span className='no-icon-color'>-</span>
          )}
        </span>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: '183px',
      render: (title) => (
        <Tooltip title={title}>
          <p>{title || '-'}</p>
        </Tooltip>
      ),
    },
    {
      title: "Link",
      key: "link",
      render: (row, lang) => {
        return (
          <>
            <td className="icon text-center">
              <a href={`https://play.google.com/store/apps/details?id=${appIDAllDataNameData.appId}&hl=${row?.langCode}&gl=${row?.country}`} target="_blank" rel="noopener noreferrer">
                <img src={require('../../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="Playstore" />
              </a>
            </td>
          </>
        )
      }
    },
    {
      title: "Action",
      key: "action",
      className: "text-center",
      render: (row) => {

        return (
          <>
            <td class="text-center d-flex justify-content-center action">
              {row?.summary ? (
                <Tooltip title="Summary">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-file-list-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Summary">
                  <div className="icon-width-set dark-icon">
                    <i className="ri-file-list-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              )}
              {row?.desScript ? (
                <Tooltip title="Description">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-file-edit-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Description">
                  <div className="icon-width-set dark-icon">
                    <i className="ri-file-edit-line dark-icon"></i>
                  </div>
                </Tooltip>
              )}
              {row?.screenshots && row?.screenshots[0] ? (
                <Tooltip title="Screenshots">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-qr-scan-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Screenshots">
                  <div className="icon-width-set dark-icon"> <i className="ri-qr-scan-2-line dark-icon"></i></div>
                </Tooltip>
              )}
          <a href="javascript:void(0);" className="popup-open" onClick={() => openPopup(row)}>
            <i className="ri-arrow-right-s-line"></i>
          </a>
            </td>
          </>
        )
      },
    },
  ];

  const columns = [
    {
      title: 'Language',
      dataIndex: 'languageName',
      key: 'languageName',
      width: '210px',
      render: (text) => (
        <Tooltip title={countery}>
          {text}
        </Tooltip>
      ),
    },
    {
      title: 'Logo',
      dataIndex: 'icon',
      key: 'icon',
      width: '75px',
      render: (icon, record) =>
        <td className="logo text-center">
          {icon ? (
            <Link href={icon} target="_blank" rel="noopener noreferrer">
              <img className="border-1 rounded w-px-40" src={icon || '-'} alt="logo" />
            </Link>
          ) : (
            <span className='no-icon-color'>-</span>
          )}
        </td>
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '237.25px',
      render: (title) => (
        <Tooltip title={title}>
          <p>{title || '-'}</p>
        </Tooltip>
      ),
    },
    {
      title: "Link",
      key: "link",
      width: '200px',
      render: (row, lang) => {
        return (
          <>
            <td className="icon text-center">
              <a href={`https://play.google.com/store/apps/details?id=${appIDAllDataNameData.appId}&hl=${row?.langCode}&gl=${countery}`} target="_blank" rel="noopener noreferrer">
                <img src={require('../../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="Playstore" />
              </a>
            </td>
          </>
        )
      }
    },
    {
      title: "Action",
      key: "action",
      width: '200px',
      className: "text-center",
      render: (row) => {
        return (
          <>
            <td class="text-center d-flex justify-content-center action">
              {row?.summary ? (
                <Tooltip title="Summary">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-file-list-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Summary">
                  <div className="icon-width-set dark-icon">
                    <i className="ri-file-list-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              )}
              {row?.desScript ? (
                <Tooltip title="Description">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-file-edit-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Description">
                  <div className="icon-width-set dark-icon">
                    <i className="ri-file-edit-line dark-icon"></i>
                  </div>
                </Tooltip>
              )}
              {row?.screenshots && row?.screenshots[0] ? (
                <Tooltip title="Screenshots">
                  <div className="icon-width-set dark-icon active" style={{ backgroundColor: 'dark' }}>
                    <i className="ri-qr-scan-2-line dark-icon"></i>
                  </div>
                </Tooltip>
              ) : (
                <Tooltip title="Screenshots">
                  <div className="icon-width-set "><i className="ri-qr-scan-2-line dark-icon"></i></div>
                </Tooltip>
              )}
            </td>
          </>
        )

      },
    },
    {
      title: 'Details',
      dataIndex: '',
      render: (row) => (
        <td className="text-center details">
          <a href="javascript:void(0);" className="popup-open" onClick={() => openPopup(row)}>
            <i className="ri-arrow-right-s-line"></i>
          </a>
        </td>
      ),
    },

  ];

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value.toLowerCase();
    setSearchTerm1(newSearchTerm);
  };

  const filteredData1 = counteryWiseTabeDataShow[activeIndex]?.language.filter(
    (lang) =>
      lang.languageName.toLowerCase().includes(searchTerm1) ||
      lang.title.toLowerCase().includes(searchTerm1)
  );

  const handleSearchChangeCountery = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const displayData = counteryWiseTabeDataShow.filter((row) =>
    row.CountryName.toLowerCase().includes(searchQuery)
  );

  const handleNextClick = () => {
    const newScrollLeft = scrollLeft + 460;
    setScrollLeft(newScrollLeft);
    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
      imageSlider.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const handlePrevClick = () => {
    const newScrollLeft = scrollLeft - 460;
    setScrollLeft(newScrollLeft);
    const imageSlider = document.querySelector('.image-slider');
    if (imageSlider) {
      imageSlider.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  const skeletonItems = Array.from({ length: 4 }, (_, index) => index);

  const SkeletonRow = () => {
    return (
      <>
        {skeletonItems?.map((item) => (
          <tr key={item}>
            <td colSpan="8" className="skeleton-loader">

              <Skeleton loading={loading} round={true} active avatar paragraph={{
                rows: 1,
              }} className='loading-avatar'>

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

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const mainElement = document.querySelector('main');
    const topHeaderElement = document.querySelector('.pages .top-header');
    const mobileNavElement = document.querySelector('.mobile-nav');
    const breadcumbElement = document.querySelector('.breadcumb');

    if (mainElement && topHeaderElement && mobileNavElement && breadcumbElement) {
      const bodyHeight = mainElement.offsetHeight;
      const windowtop = topHeaderElement.offsetHeight;
      const mobilenav = mobileNavElement.offsetHeight;
      const breadcumbheight = breadcumbElement.offsetHeight;

      const mobile = bodyHeight - mobilenav - breadcumbheight - 20;
      const total = bodyHeight;
      const maindashboardsize = bodyHeight - windowtop - breadcumbheight;

      // Update element heights based on window width
      if (windowWidth > 991) {
        document.querySelector('.pages .detailed-menu').style.height = `${total}px`;
        document.querySelector('.pages .main-content-body').style.height = `${maindashboardsize}px`;
      } else if (windowWidth < 991) {
        document.querySelector('.pages .main-content-body').style.height = `${mobile}px`;
      }
    }
  }, [windowWidth]);


  useEffect(() => {
    var $window = $('#users-page .main-content-body');
    var $sidebar = $("#users-page #myAffix");
    var $sidebarHeight = $sidebar.innerHeight();
    var $sidebarOffset = $sidebar.offset();
    var $sidebarWidth = $("#users-page #myAffix").outerWidth();

    if ($(window).width() > 991) {
      $window.scroll(function () {
        if ($window.scrollTop() > $sidebarOffset.top) {
          $sidebar.addClass("fixed");
          $sidebar.css('width', $sidebarWidth);
        } else {
          $sidebar.removeClass("fixed");
        }
        if ($window.scrollTop() + $sidebarHeight) {
          $sidebar.css({ top: -($window.scrollTop() + $sidebarHeight) });
        } else {
          $sidebar.css({ top: "0" });
        }
      });
    }
  }, [])

  return (
    <>
     <Helmet>
        <title>Custom Store Listing</title>
      </Helmet>
      <div id="users-page"  >
        <main class="h-100" id="dashboard-maain" >
            <div class="col-lg-9 left-col main-dashboard header-custom-col" >

              <div class="breadcumb" >
                <div class="row gx-0">
                  <div class="col-lg-8 col-md-6 left d-flex align-items-center">
                    <p><a href="dashboard.html">Dashboard</a> <span>/</span> <a href="">UserGraph</a> <span>/</span> User Details</p>
                  </div>
                </div>
              </div>

              <div class="main-content-body overflow-scroll" >
                {/* <!-- listing --> */}
                <div class="listing">
                  <h2>Custom Store Listing Records</h2>
                  <div class="body">
                    <div class="row">
                      <div class="col-lg-5 col-md-5 align-items-center">
                        <Form
                          name="basic"
                          form={form}
                          initialValues={{
                            remember: true,
                          }}
                          onFinish={onFinish}
                          onFinishFailed={onFinishFailed}
                          autoComplete="off"
                        >
                          <div class="d-flex w-100 align-items-end">
                            <div class="form-group">
                              <label for="appid">App ID</label>
                              <Form.Item
                                name="appId"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Please Enter Your AppId!',
                                  },
                                ]}
                              >
                                <Input
                                  type="text"
                                  id="appId"
                                  placeholder="Enter Your appId"
                                  value={appIDAllDataNameData?.appId}
                                  onChange={handleChanges}
                                />
                              </Form.Item>
                            </div>
                            <div className="button">
                              <Button type="primary" htmlType="submit" className="btn button-class-margin">Submit</Button> {/* Ant Design Button */}
                            </div>
                          </div>
                        </Form>
                      </div>
                      <div class="col-lg-6 col-md-6 d-flex align-items-center" >
                        <table class="table mb-0">
                          <thead>
                            <tr>
                              <th width="22%" class="text-center">Country Name</th>
                              <th width="15%" class="text-center">Logo</th>
                              <th>Title</th>
                              <th width="10%" class="text-center">Icon</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ?
                            
                              <td colSpan="8" className="skeleton-loader1">

                                <Skeleton loading={loading} round={true} active avatar paragraph={{
                                  rows: 0,
                                }} className='loading-avatar'>

                                </Skeleton>
                              </td>
                              : counteryWiseTabeDataShowDefult?.map((row, i) => {
                                return (
                                  <tr key={i}>
                                    <td className="text-center">{row?.CountryName}</td>
                                    <td className="logo text-center">
                                      {row?.language.map((languagerow, j) => {
                                        return (
                                          <img src={languagerow?.icon} alt="linkedin-logo" />
                                        );
                                      })}
                                    </td>
                                    <td>
                                      {row?.language.map((languagerow, j) => (
                                        <span key={j}>{languagerow?.title}</span>
                                      ))}
                                    </td>

                                    <td className="icon text-center">
                                      <a href={`https://play.google.com/store/apps/details?id=${appIDAllDataNameData.appId}`} target="_blank" rel="noopener noreferrer">
                                        <img src={require('../../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="Playstore" />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- country --> */}
                <div class="country ">
                  <div class="row gx-0">
                    <div class="col-lg-2 col-md-3 left-panel-col">
                      <div class="left-panel" id="myAffix" data-spy="affix">
                        <div class="header">
                          <div class="row gx-0">
                            <div class="col-6">
                              <h2>Country</h2>
                            </div>
                            <div class="col-6 d-flex justify-content-end">
                              <div href="" class="sort">
                                <img src={require('../../../Component/App_Details_theme/images/sort-icon.png')} alt="Sort-icon" />
                                Sort by
                                <div class="dropdown">
                                  <a href="" class="active">Language Wise</a>
                                </div>
                              </div>
                              <a href="" class="pin"><i class="ri-pushpin-fill"></i></a>
                            </div>
                          </div>
                          &nbsp;&nbsp;
                          <Search
                            placeholder="Search"
                            // value={searchQuery}
                            // onChange={handleSearchChangeCountery}
                            loading={loading}
                          />
                        </div>
                        <div class="body body-scroll-country" >
                          <ul>
                            {displayData?.length > 0 ? (
                              <>

                                {displayData?.map((row, i) => {
                                  return (
                                    <>
                                      <li key={i}>
                                        <Link
                                          to=""
                                          className={` ${activeIndex === i ? 'active' : ''}`}
                                          onClick={() => handleItemClick(i)}
                                        >
                                          <div className="left emojit-class-width-fix">
                                            <div className="emojit-class-width-fix">
                                              <ReactCountryFlag
                                                countryCode={row?.country || '-'}
                                                svg
                                                style={{
                                                  width: '28px',
                                                  height: '20px',
                                                }}
                                                title="US"
                                              />
                                            </div>
                                            <div className={`text ${activeIndex === i ? 'active' : ''}`}>
                                              {row?.CountryName}
                                            </div>
                                          </div>
                                          <div className="right">
                                            <div className="badge">{row?.language?.length}</div>
                                            {activeIndex === i && (
                                              <div>
                                                <i className="ri-pushpin-fill"></i>
                                              </div>
                                            )}
                                          </div>
                                        </Link>
                                      </li>
                                    </>
                                  )
                                }
                                )}
                              </>
                            ) : (
                              <li className="data-not-found"></li>
                            )}

                          </ul>
                        </div>
                      </div>
                    </div>
                    <div class="col-lg-10 col-md-9 right-panel-col" >
                      <div class="right-panel">
                        {/* <!-- top --> */}
                        <div class="top" >
                          <div class="country-detail country-detail-top w-100">
                            <div class="header">
                              <div class="row gx-0">
                                <div class="col-lg-6 col-4 d-flex align-items-center">
                                  <div class="name d-flex align-items-center">
                                    <span className="emojit-class-width-fix">
                                      <ReactCountryFlag
                                        countryCode={selectedCountryData?.country ? selectedCountryData?.country :
                                          <img src={require('../../../Component/App_Details_theme/images/ImageNull.png')} alt='null-image' />}
                                        svg
                                        style={{
                                          width: '28px',
                                          height: '20px',
                                        }}
                                        title="US"
                                      />
                                    </span>
                                    <h4>{selectedCountryData?.CountryName}</h4>
                                  </div>
                                </div>
                                <div class="col-lg-6 col-8 d-flex align-items-center justify-content-end">
                                  <div class="form-group position-relative">

                                    <Search
                                      placeholder="Search text"
                                    // value={searchTerm1}
                                    // onChange={handleSearchChange}
                                    />
                                  </div>
                                  <a href="" class="pin">
                                    <i class="ri-pushpin-fill"></i>
                                  </a>
                                </div>
                              </div>
                            </div>
                            <div class="body">
                              <Table
                                dataSource={filteredData1}
                                columns={columns}
                                pagination={false}
                                size="small"
                                components={customComponents}
                              />
                            </div>
                          </div>
                        </div>

                        {/* <!-- bottom --> */}
                        <div class="bottom">
                          <div class="row gx-lg-0">
                            {Object.keys(groupedData).map((rowData, i) => {
                              const countryData = groupedData[rowData];
                              const firstLanguageEmoji = countryData[0]?.country;

                              return (
                                <>
                                  <div class="col-lg-6">
                                    <div class="country-detail country-detail-bottom country-detail-bottom-right">
                                      <div class="header">
                                        <div class="row gx-0">
                                          <div class="col-lg-6 col-4 d-flex align-items-center">
                                            <div class="name d-flex align-items-center">
                                              {firstLanguageEmoji === null ? (
                                                <img src={require('../../../Component/App_Details_theme/images/ImageNull.png')} alt='null-image' />
                                              ) : (
                                                <ReactCountryFlag
                                                  countryCode={firstLanguageEmoji ? firstLanguageEmoji :
                                                    <img src={require('../../../Component/App_Details_theme/images/ImageNull.png')} alt='null-image' />}
                                                  svg
                                                  style={{
                                                    width: '28px',
                                                    height: '20px',
                                                  }}
                                                  title="US"
                                                />
                                              )}
                                              <h4>{rowData || '-'}</h4>
                                            </div>
                                          </div>
                                          <div class="col-lg-6 col-8 d-flex align-items-center justify-content-end">
                                            <div class="form-group position-relative">
                                             
                                              <Search
                                                //  className="form-control"
                                                placeholder="Search text"
                                              // value={searchQueries[rowData] || ''}
                                              // onChange={(e) => {
                                              //   setSearchQueries((prevQueries) => ({
                                              //     ...prevQueries,
                                              //     [rowData]: e.target.value,
                                              //   }));
                                              // }}
                                              />
                                            </div>
                                            <a href="" class="pin">
                                              <i class="ri-pushpin-fill"></i>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="body">
                                        <Table
                                          dataSource={countryData}
                                          // dataSource={countryData.filter((item) =>
                                          //   (item.languageName || '').toLowerCase().includes((searchQueries[rowData] || '').toLowerCase()) ||
                                          //   (item.title || '').toLowerCase().includes((searchQueries[rowData] || '').toLowerCase())
                                          // )}
                                          columns={columnsBottom}
                                          pagination={false}
                                          size="small"
                                          className="custom-store-listing-table"
                                          components={customComponents}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* </div> */}
        </main>

        {/* <!-- country popup --> */}
        <div id="country-popup">
          <div class="content">
            <div class="header">
              <div class="row gx-2">
                <div class="col-lg-9 col-md-9 d-flex align-items-center left">
                  <div class="name d-flex">
                    <div class="icon">
                      {popupDataAllShow?.icon ? (
                        <img src={popupDataAllShow.icon} alt="zoom" className="logo-popup-width" />
                      ) : (
                        counteryWiseTabeDataShowDefult?.map((element, i) => {
                          return (
                            <>
                              {
                                element?.language?.map((row, i) => {
                                  return (
                                    <>
                                      <img src={row?.icon} alt="zoom" className="logo-popup-width" />
                                    </>
                                  )
                                })
                              }
                            </>
                          )
                        })
                      )}
                    </div>
                    <div class="text">
                      <h3>{popupDataAllShow?.title}</h3>
                      <p>{popupDataAllShow?.summary}</p>
                    </div>
                  </div>
                </div>
                <div class="col-lg-3 col-md-3 d-flex align-items-center justify-content-end right">
                  <div class="lang d-flex flex-column w-100">
                    <div class="country-name d-flex">
                      <span className="emojit-class-width-fix">  <ReactCountryFlag
                        countryCode={selectedCountryData?.country ? selectedCountryData?.country :
                          <img src={require('../../../Component/App_Details_theme/images/ImageNull.png')} alt='null-image' />}
                        svg
                        style={{
                          width: '28px',
                          height: '20px',
                        }}
                        title="US"
                      /></span>
                      <h5>{selectedCountryData?.CountryName || popupDataAllShow?.CountryName || '-'}</h5>
                    </div>
                    <h5 class="m-0 mt-2">Language: <span>{popupDataAllShow?.languageName}</span></h5>
                  </div>
                  <div class="button d-flex align-items-center">
                    <a href={`https://play.google.com/store/apps/details?id=${appIDAllDataNameData.appId}&hl=${popupDataAllShow?.langCode}&gl=${popupDataAllShow?.country}`} target="_blank" rel="noopener noreferrer">
                      <img src={require('../../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="Play Store" />
                    </a>
                    <a to="" class="close-btn" ><i class="ri-close-line"></i></a>
                  </div>
                </div>
              </div>
            </div>
            <div class="body">
              <div class="slider-parent">
                <div class="nav-prev arrow" onClick={handlePrevClick}><i class="ri-arrow-left-s-line"></i></div>
                <div class="image-slider" style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  {
                    popupDataAllShow?.screenshots?.map((iamgeData, i) => {
                      return (
                        <div class="item" key={i}>
                          <a class="nav-item active">
                            <img src={iamgeData || '-'} alt="Popup-Images" />
                          </a>
                        </div>
                      );
                    })
                  }
                </div>
                <div class="nav-next arrow" onClick={handleNextClick}><i class="ri-arrow-right-s-line"></i></div>
              </div>
              <p dangerouslySetInnerHTML={{ __html: popupDataAllShow?.desScript }} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomStoreListing
