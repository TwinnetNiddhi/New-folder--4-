import React, { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import '../../Component/Headers/Header.css'
import '../../Component/App_Details_theme/css/navbar.css';
import { Select, Spin, Tooltip } from 'antd';
import $ from 'jquery';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import CustomMessage from '../CustomMessage/CustomMessage';
import socketData from '../socket/socket/service';
import * as AntIcons from '@ant-design/icons';
import { AccessAllData } from '../Redux/auth/action';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}

function truncateTextScript() {
  $(document).ready(function () {
    // detailed menu open close arrow
    $('.pages ').on('click', '.arrow', function () {
      $('.detailed-menu-col').toggleClass('close');
      $(this).toggleClass('right');
      $('.pages .main-dashboard').toggleClass('expand');
    });

    // mobile nav
    $('.pages .mobile-nav .right .menu-icon').on('click', function () {
      $('.pages .mobile-nav .mobile-menu').addClass('open');
      $('.bg-overlay').addClass('open');
    });
    $('.pages .close-icon, .bg-overlay').on('click', function () {
      $('.pages .mobile-nav .mobile-menu').removeClass('open');
      $('.bg-overlay').removeClass('open');
    });

    // dropdown
    $('.submenu').slideUp(500);
    $('ul li a:not(:only-child)').click(function (e) {
      $(this).siblings('.submenu').slideToggle(500);
      $(this).toggleClass('open-arrow');
      // Close one dropdown when selecting another
      if ($(window).width() > 991) {
        $('.submenu').not($(this).siblings()).slideUp(500);
        $('.pages .detailed-menu ul li a').not($(this)).removeClass('open-arrow');
      }
      e.stopPropagation();
    });

    // profile dropdown menu
    $('#dashboard-page .top-header .right .profile .profile-menu .menu-body ul.user-menu').slideUp();
    $('.user-btn').on('click', function () {
      $('.user-menu').slideToggle(500);
      $(this).toggleClass('active');
    });

    // black mode switch
    $('.switch input').on('click', function () {
      $(this).parent().toggleClass('active');
    });

    // slide down open dropdown
    if ($(window).width() > 991) {
      $('.pages .detailed-menu ul li .submenu ul li a.active').each(function () {
        $(this).closest('.detailed-menu-main-li').children().addClass('open-arrow');
        $(this).closest('.submenu').slideDown();
      });
    }
    if ($(window).width() < 991) {
      $('.pages ul li .submenu ul li .submenu ul li a.active').each(function () {
        $(this).closest('.mobile-menu-li').children().addClass('open-arrow');
        // $(this).parent().closest('.pages ul li .submenu ul li .submenu ul li').children(). addClass('open-arrow');
        $(this).parent().parent().parent().parent().children().addClass('open-arrow');
        $(this).parent().closest('.submenu').slideDown();
        $(this).parent().parent().parent().parent().closest('.submenu').slideDown().addClass('this');
      });
    }

    // profile dropdown 
    $('.pages .profile .profile-img').on('click', function () {
      $('.pages .profile .profile-menu').toggleClass('show');
      $('.pages .notification-menu').removeClass('show');
    });

    // notification dropdown
    $('.pages .notification svg.main-svg').on('click', function () {
      $('.pages .notification-menu').toggleClass('show');
      $('.pages .profile .profile-menu').removeClass('show');
    });
    $('.pages .notification-menu .close-btn').on('click', function () {
      $('.pages .notification-menu').removeClass('show');
    });

    // sort button dropdown
    $('#users-page .main-dashboard .country .left-panel .header .sort').on('click', function () {
      $('#users-page .main-dashboard .country .left-panel .header .sort .dropdown').toggleClass('open');
    });

    // popup image slider
    console.log('init-scroll: ' + $('.nav-next').scrollLeft());
    $('#country-popup .body .slider-parent .arrow.nav-next').on('click', function () {
      $('#country-popup .body .image-slider').animate({ scrollLeft: '+=460' }, 200);
    });
    $('#country-popup .body .slider-parent .arrow.nav-prev').on('click', function () {
      $('#country-popup .body .image-slider').animate({ scrollLeft: '-=460' }, 200);
    });

    // timeline collapse
    // $('#user-details-page .main-content .left-panel .timeline .main-item .information .timeline-collapse-btn').on('click', function(){
    //   $('#user-details-page .main-content .left-panel .timeline .main-item').closest('.timeline .main-item .body').slideToggle();
    // });
    $('#user-details-page .main-content .left-panel .timeline .main-item .body').slideUp();
    $('.timeline-collapse-btn').click(function (e) {
      $(this).parent().parent().parent().parent().children('#user-details-page .main-content .left-panel .timeline .main-item .body').slideToggle(500);
      $(this).toggleClass('arrow-down');
      e.stopPropagation();
    });
  });
}

const Header = ({ deviceIdShow, loading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scheduledOpen, setScheduledOpen] = useState(false)
  const [isMenuClosed, setIsMenuClosed] = useState(false);
  const [isArrowRight, setIsArrowRight] = useState(false);
  const [isMainDashboardExpanded, setIsMainDashboardExpanded] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [showFullDeviceId, setShowFullDeviceId] = useState(false);
  const navigation = useNavigate(false)
  const [selectedId, setSelectedId] = useState()
  const maxCharacters = 12; // Maximum number of characters before truncation
  const [showFullText, setShowFullText] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('');
  const [accessFiledAdd, setAccessFiledAdd] = useState([]);
  const data_Name_type = useSelector(state => state?.authReducer?.type)
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [allMenuName, setAllMenuName] = useState()
  const [allMenuNameSub, setAllMenuNameSub] = useState()
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch()
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  const toggleFullDeviceId = () => {
    setShowFullDeviceId(!showFullDeviceId);
  };

  const handleDeviceIdClick = (deviceId) => {
    queryParams.set('deviceId', deviceId);
    const newSearch = queryParams.toString();
    navigation(`?${newSearch}`)
  };

  useEffect(() => {
    // Your jQuery code here
    $('.detailed-menu .event-menu').slideUp();

    // Set the checkbox to checked
    $('.event-toggle').prop('checked', true);

    $('.form-switch').change(function () {
      if ($('.event-toggle').is(":checked")) {
        $('.detailed-menu .normal-menu').slideUp();
        $('.detailed-menu .event-menu').slideDown();
      } else {
        $('.detailed-menu .normal-menu').slideDown();
        $('.detailed-menu .event-menu').slideUp();
      }
    });
  }, []);


  useEffect(() => {
    const deviceIdFromQuery = queryParams.get('deviceId');
    if (deviceIdFromQuery) {
      setSelectedId(deviceIdFromQuery);
    }
  }, [location.search]);

  useEffect(() => {

  }, [isMenuClosed, isArrowRight, isMainDashboardExpanded])

  const handleArrowClick = () => {
    setIsMenuClosed(!isMenuClosed);
    setIsArrowRight(!isArrowRight);
    setIsMainDashboardExpanded(!isMainDashboardExpanded);
  };

  // Function to toggle the dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdownScheduled = () => {
    setScheduledOpen(!scheduledOpen);

  };


  // Function to toggle the dropdown state
  const toggleDropdownPreferences = () => {
    setPreferencesOpen(!preferencesOpen);
  };

  // Function to close the dropdown when a click occurs outside of it
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setPreferencesOpen(true);
    }
  };

  useEffect(() => {
    // Add a click event listener to the document
    document.addEventListener('click', handleClickOutside);
    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);


  useEffect(() => {
    AllModuleAccessGetEventCall()
    truncateTextScript()
  }, [])

  const AllModuleAccessGetEventCall = async () => {
    try {
      await dispatch(AccessAllData(setAccessFiledAdd, data_Name_type));
    } catch (error) {
      console.log(error, "error");
      CustomMessage('error', error?.message);
    }
  }

  const dateAgo = (date) => {
    const startDate = new Date(date);
    const diffDate = new Date(new Date() - startDate);
    const years = diffDate.getUTCFullYear() - 1970;
    const months = diffDate.getUTCMonth();
    const days = diffDate.getUTCDate() - 1;

    let formattedString = "";

    if (years > 0) {
      formattedString += years + " Year ";
    }

    if (months > 0) {
      formattedString += months + " Month ";
    }

    if (days > 0) {
      formattedString += days + " Day ";
    }

    return formattedString.trim();
  };


  const getDisplayText = (deviceIdAll) => {
    const text = deviceIdAll?.deviceId || '-';
    const maxCharacters = 20; // Adjust this number as needed

    if (showFullText[deviceIdAll._id]) {
      return text; // Display the full text
    } else if (text.length <= maxCharacters) {
      return text; // Display the text as is if it's shorter than or equal to the limit
    } else {
      return text.substring(0, maxCharacters) + '...'; // Display a truncated version with ellipsis
    }
  };

  const getDisplayTextCounttery = (deviceIdAll) => {
    if (!deviceIdAll || !deviceIdAll.country) {
      return '-'; // Handle the case when deviceIdAll or its country property is missing
    }

    const text = deviceIdAll.country || '-';
    const maxCharacters = 20; // Adjust this number as needed

    if (showFullText[deviceIdAll._id]) {
      return text; // Display the full text
    } else if (text.length <= maxCharacters) {
      return text; // Display the text as is if it's shorter than or equal to the limit
    } else {
      return text.substring(0, maxCharacters) + '...'; // Display a truncated version with ellipsis
    }
  };

  const handleToggleText = (id) => {
    setShowFullText((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const getDisplayTextDate = (deviceIdAll, formattedDate) => {
    const maxCharacters = 7; // Adjust this number as needed

    if (showFullText[deviceIdAll._id]) {
      return formattedDate; // Display the full formatted date
    } else if (formattedDate.length <= maxCharacters) {
      return formattedDate; // Display the formatted date as is if it's shorter than or equal to the limit
    } else {
      return formattedDate.substring(0, maxCharacters) + '...'; // Display a truncated version of the formatted date with ellipsis
    }
  };

  const handleChange = (value) => {
    setSelectedCountry(value);
  };

  const uniqueCountries = Array.from(
    new Set(
      deviceIdShow?.flatMap((data) =>
        data?.deviceList?.filter((device) => device?.country?.length > 0).map((device) => device?.country[0])
      )
    )
  );


  useEffect(() => {
    const pathInWindowLocation = window.location.href.slice(window.location.href.lastIndexOf('/')).toLowerCase();
    const continueAccess = accessFiledAdd?.filter(element => {
      return element?.routerPath.toLowerCase() === pathInWindowLocation
    });

    if (continueAccess && continueAccess.length > 0) {
      setSelectedMenuItem(continueAccess[0]);
    }
  }, [accessFiledAdd]);


  const handleIconClick = (row) => {
    setSelectedMenuItem(row);
    setAllMenuName(row.menuName);
    truncateTextScript();
  };

  useEffect(() => {
    // Find the menu item that matches the current pathname
    const matchedItem = accessFiledAdd.find((row) => row.routerPath === location.pathname);

    if (matchedItem) {
      setSelectedMenuItem(matchedItem);
      setAllMenuName(matchedItem.menuName);
      truncateTextScript();
    }
  }, [location.pathname, accessFiledAdd]);
  
  return (
    <>
      {/* <!-- black overlay --> */}
      <div className="bg-overlay"></div>
      {/* <!-- mobile navbar --> */}
      <div className="col-12 mobile-nav d-lg-none position-relative">
        {/* <!-- mobile notification dropdown --> */}
        <div className="notification-menu">
          <div className="notification-header">
            <div className="top">
              <div className="row w-100 gx-0">
                <div className="col-10 d-flex align-items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_72_7893)">
                      <path d="M16.4515 12.6484V8.84839C16.4515 6.02581 14.645 3.56453 12.1579 2.64519C12.187 2.50001 12.2031 2.35165 12.2031 2.20324C12.2031 0.987117 11.216 0 9.99988 0C8.78376 0 7.79664 0.987117 7.79664 2.20324C7.79664 2.34842 7.81275 2.49354 7.83855 2.63226C6.98374 2.93549 6.19341 3.41612 5.51923 4.06774C4.24827 5.29355 3.54828 6.94193 3.54828 8.70967V12.6484C3.54828 12.7871 3.43537 12.9033 3.29342 12.9033C2.10311 12.9033 1.08695 13.8 0.977273 14.942C0.915969 15.5775 1.12569 16.2097 1.55471 16.6807C1.9805 17.1484 2.5902 17.4194 3.22565 17.4194H7.11599C7.27728 18.8678 8.50956 20.0001 9.99988 20.0001C11.4902 20.0001 12.7225 18.8678 12.8838 17.4194H16.7741C17.4096 17.4194 18.0193 17.1484 18.4451 16.6807C18.8708 16.2097 19.0806 15.5775 19.0225 14.942C18.9128 13.8 17.8935 12.9033 16.7063 12.9033C16.6728 12.9034 16.6396 12.897 16.6086 12.8842C16.5776 12.8715 16.5494 12.8527 16.5257 12.829C16.502 12.8053 16.4832 12.7772 16.4705 12.7462C16.4577 12.7151 16.4513 12.6819 16.4515 12.6484ZM9.99988 1.2903C10.5031 1.2903 10.9128 1.69998 10.9128 2.20318C10.9128 2.24509 10.9063 2.28383 10.8998 2.32574C10.6805 2.29347 10.4579 2.2709 10.2353 2.26443C9.85141 2.2515 9.474 2.27736 9.09982 2.32897C9.09335 2.28706 9.08689 2.24833 9.08689 2.20641C9.087 1.69998 9.49668 1.2903 9.99988 1.2903ZM9.99988 18.7096C9.22248 18.7096 8.57087 18.1548 8.41922 17.4193H11.5805C11.4289 18.1548 10.7773 18.7096 9.99988 18.7096ZM17.7386 15.0645C17.7644 15.342 17.6773 15.6097 17.4934 15.8129C17.3031 16.0161 17.0515 16.129 16.7741 16.129H3.22571C2.94827 16.129 2.6967 16.0161 2.50956 15.8129C2.32246 15.6097 2.23536 15.3419 2.26116 15.0645C2.3063 14.5774 2.76118 14.1935 3.29342 14.1935C4.14505 14.1935 4.83858 13.5 4.83858 12.6484V8.70967C4.83858 7.29677 5.39985 5.97743 6.416 4.99678C7.38696 4.05809 8.65151 3.54837 9.99988 3.54837C10.0644 3.54837 10.1257 3.54837 10.1902 3.55161C12.9289 3.64836 15.1612 6.02581 15.1612 8.84839V12.6484C15.1612 13.5 15.8547 14.1935 16.7063 14.1935C17.2386 14.1935 17.6902 14.5774 17.7386 15.0645Z" fill="#3C4043" />
                    </g>
                    <defs>
                      <clipPath id="clip0_72_7893">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <h5>Notification</h5>
                  <h6 className="tag">4 New</h6>
                </div>
                <div className="col-2 d-flex align-items-center justify-content-end">
                  <i className="ri-close-line close-btn"></i>
                </div>
              </div>
              <div className="bottom w-100">
                <div className="row w-100 gx-0">
                  <div className="col-8">
                    <ul className="nav nav-tabs d-flex border-0 align-items-center justify-content-between" id="myTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-mb" type="button" role="tab" aria-controls="home-mb" aria-selected="true">Actions</button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-mb" type="button" role="tab" aria-controls="profile-mb" aria-selected="false">Reports <span className="total">9</span></button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button className="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact" type="button" role="tab" aria-controls="contact" aria-selected="false">Updates <span className="red"></span></button>
                      </li>
                    </ul>
                  </div>
                  <div className="col-4 d-flex align-items-center justify-content-end">
                    <a href="" className="clear">Clear All</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="body">
            <div className="tab-content" id="myTabContent">
              <div className="tab-pane fade show active action-tab" id="home-mb" role="tabpanel" aria-labelledby="home-tab">
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>16 new user has signed up</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="view"><i className="ri-eye-line"></i></a>
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <a href="" className="view-btn">View</a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>3 Urgent tickets arrived htmlFor you</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                  <div className="button d-flex justify-content-end">
                    <a href="" className="btn btn1">Decline</a>
                    <a href="" className="btn btn2">Accept</a>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>16 new user has signed up</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="view"><i className="ri-eye-line"></i></a>
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <a href="" className="view-btn">View</a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>3 Urgent tickets arrived htmlFor you</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                  <div className="button d-flex justify-content-end">
                    <a href="" className="btn btn1">Decline</a>
                    <a href="" className="btn btn2">Accept</a>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex">
                      <div className="tick"><img src="images/tick.png" alt="Tick" /></div>
                      <div className="info">
                        <h3>Report is ready to download</h3>
                        <p>2 minutes ago</p>
                      </div>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade report-tab" id="profile-mb" role="tabpanel" aria-labelledby="profile-tab">
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-8">
                      <h3>Report is ready to download</h3>
                      <p>2 minutes ago</p>
                    </div>
                    <div className="col-4 img d-flex justify-content-end">
                      <img src="images/report-img.png" alt="Report-img" />
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab-pane fade updates-tab" id="contact-mb" role="tabpanel" aria-labelledby="contact-tab">
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
                <div className="item">
                  <div className="row gx-0">
                    <div className="col-10 d-flex align-items-center">
                      <img src="images/update-icon.png" alt="Icon" />
                      <div className="content">
                        <h3>New updates are available </h3>
                        <h6>Update your account now.</h6>
                      </div>
                    </div>
                    <div className="col-2 d-flex flex-column align-items-end">
                      <a href="" className="close"><i className="ri-close-line"></i></a>
                      <p>2m ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer d-flex justify-content-end">
            <a href="">
              View All Notifications
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <g clipPath="url(#clip0_72_7982)">
                  <path d="M19.2138 12.5412L17.7517 11.2912C17.8209 10.8671 17.8567 10.434 17.8567 10.001C17.8567 9.56796 17.8209 9.13492 17.7517 8.71082L19.2138 7.46082C19.3241 7.36641 19.403 7.24067 19.4401 7.10032C19.4772 6.95997 19.4706 6.81166 19.4214 6.6751L19.4013 6.61706C18.9988 5.49212 18.3961 4.44929 17.6223 3.53894L17.5821 3.49207C17.4882 3.38169 17.3631 3.30235 17.2233 3.26449C17.0834 3.22664 16.9353 3.23205 16.7986 3.28001L14.9839 3.9251C14.3142 3.37599 13.5665 2.94296 12.7584 2.63939L12.408 0.742065C12.3816 0.599302 12.3123 0.467964 12.2094 0.365498C12.1066 0.263032 11.975 0.19429 11.8321 0.168405L11.7718 0.157244C10.6089 -0.0525774 9.38568 -0.0525774 8.22273 0.157244L8.16246 0.168405C8.0196 0.19429 7.88799 0.263032 7.78513 0.365498C7.68226 0.467964 7.61301 0.599302 7.58657 0.742065L7.23389 2.64832C6.4323 2.95195 5.68583 3.38476 5.02407 3.92957L3.19594 3.28001C3.05926 3.23167 2.9111 3.22606 2.77116 3.26394C2.63121 3.30182 2.50611 3.38138 2.41246 3.49207L2.37228 3.53894C1.5994 4.44993 0.996784 5.49259 0.593266 6.61706L0.573177 6.6751C0.47273 6.95412 0.55532 7.26662 0.780766 7.46082L2.26068 8.72421C2.19148 9.14385 2.158 9.57242 2.158 9.99876C2.158 10.4273 2.19148 10.8559 2.26068 11.2733L0.780766 12.5367C0.670489 12.6311 0.591562 12.7569 0.55448 12.8972C0.517399 13.0376 0.52392 13.1859 0.573177 13.3224L0.593266 13.3805C0.997284 14.5055 1.5955 15.5434 2.37228 16.4586L2.41246 16.5055C2.50633 16.6158 2.63144 16.6952 2.77131 16.733C2.91117 16.7709 3.05922 16.7655 3.19594 16.7175L5.02407 16.068C5.68925 16.6148 6.43255 17.0479 7.23389 17.3492L7.58657 19.2555C7.61301 19.3982 7.68226 19.5296 7.78513 19.632C7.88799 19.7345 8.0196 19.8032 8.16246 19.8291L8.22273 19.8403C9.39636 20.0512 10.5982 20.0512 11.7718 19.8403L11.8321 19.8291C11.975 19.8032 12.1066 19.7345 12.2094 19.632C12.3123 19.5296 12.3816 19.3982 12.408 19.2555L12.7584 17.3581C13.5662 17.0554 14.3181 16.6209 14.9839 16.0724L16.7986 16.7175C16.9353 16.7659 17.0835 16.7715 17.2234 16.7336C17.3634 16.6957 17.4885 16.6161 17.5821 16.5055L17.6223 16.4586C18.3991 15.5412 18.9973 14.5055 19.4013 13.3805L19.4214 13.3224C19.5218 13.0479 19.4392 12.7354 19.2138 12.5412ZM16.1669 8.97421C16.2227 9.31126 16.2517 9.65724 16.2517 10.0032C16.2517 10.3492 16.2227 10.6952 16.1669 11.0322L16.0196 11.9273L17.687 13.3537C17.4342 13.936 17.1152 14.4873 16.7361 14.9965L14.6647 14.2622L13.9638 14.838C13.4303 15.2755 12.8366 15.6193 12.1937 15.8604L11.3433 16.1796L10.9437 18.3447C10.3133 18.4162 9.67682 18.4162 9.04639 18.3447L8.64684 16.1751L7.80309 15.8514C7.16693 15.6104 6.57541 15.2666 6.04639 14.8314L5.3455 14.2532L3.26068 14.9943C2.88121 14.4831 2.56425 13.9318 2.30978 13.3514L3.99505 11.9117L3.84996 11.0189C3.79639 10.6863 3.76737 10.3425 3.76737 10.0032C3.76737 9.66171 3.79416 9.32019 3.84996 8.9876L3.99505 8.09474L2.30978 6.65501C2.56202 6.07242 2.88121 5.52332 3.26068 5.01215L5.3455 5.75323L6.04639 5.1751C6.57541 4.73983 7.16693 4.39608 7.80309 4.15501L8.64907 3.83582L9.04862 1.66617C9.67586 1.59474 10.3165 1.59474 10.9459 1.66617L11.3455 3.83135L12.1959 4.15055C12.8366 4.39162 13.4326 4.73537 13.966 5.17287L14.6669 5.74876L16.7384 5.01439C17.1178 5.52555 17.4348 6.07689 17.6892 6.65724L16.0218 8.08358L16.1669 8.97421ZM9.99952 5.85144C7.82987 5.85144 6.07095 7.61037 6.07095 9.78001C6.07095 11.9497 7.82987 13.7086 9.99952 13.7086C12.1692 13.7086 13.9281 11.9497 13.9281 9.78001C13.9281 7.61037 12.1692 5.85144 9.99952 5.85144ZM11.7674 11.5479C11.5355 11.7804 11.2599 11.9648 10.9565 12.0905C10.6531 12.2161 10.3279 12.2805 9.99952 12.28C9.33211 12.28 8.70487 12.0189 8.23166 11.5479C7.99912 11.316 7.81473 11.0404 7.68908 10.737C7.56343 10.4336 7.499 10.1084 7.49952 9.78001C7.49952 9.1126 7.76068 8.48537 8.23166 8.01215C8.70487 7.53894 9.33211 7.28001 9.99952 7.28001C10.6669 7.28001 11.2942 7.53894 11.7674 8.01215C11.9999 8.24403 12.1843 8.51959 12.31 8.82298C12.4356 9.12638 12.5 9.45163 12.4995 9.78001C12.4995 10.4474 12.2384 11.0747 11.7674 11.5479Z" fill="#2C72E8" />
                </g>
                <defs>
                  <clipPath id="clip0_72_7982">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
          </div>
        </div>
        <div className="row gx-0 h-100 align-items-center">
          <div className="col-6 left">
            <a href="" className="brand">
              <img src={require('../../Component/App_Details_theme/images/t-logo.png')} alt="Logo" className="img-fluid" />
            </a>
          </div>
          <div className="col-6 right d-flex align-items-center justify-content-end">
            <i className="ri-menu-line menu-icon"></i>
            <div className="notification">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none" className="main-svg">
                <g clipPath="url(#clip0_72_1354)">
                  <path d="M16.4515 13.1484V9.34839C16.4515 6.52581 14.645 4.06453 12.1579 3.14519C12.187 3.00001 12.2031 2.85165 12.2031 2.70324C12.2031 1.48712 11.216 0.5 9.99988 0.5C8.78376 0.5 7.79664 1.48712 7.79664 2.70324C7.79664 2.84842 7.81275 2.99354 7.83855 3.13226C6.98374 3.43549 6.19341 3.91612 5.51923 4.56774C4.24827 5.79355 3.54828 7.44193 3.54828 9.20967V13.1484C3.54828 13.2871 3.43537 13.4033 3.29342 13.4033C2.10311 13.4033 1.08695 14.3 0.977273 15.442C0.915969 16.0775 1.12569 16.7097 1.55471 17.1807C1.9805 17.6484 2.5902 17.9194 3.22565 17.9194H7.11599C7.27728 19.3678 8.50956 20.5001 9.99988 20.5001C11.4902 20.5001 12.7225 19.3678 12.8838 17.9194H16.7741C17.4096 17.9194 18.0193 17.6484 18.4451 17.1807C18.8708 16.7097 19.0806 16.0775 19.0225 15.442C18.9128 14.3 17.8935 13.4033 16.7063 13.4033C16.6728 13.4034 16.6396 13.397 16.6086 13.3842C16.5776 13.3715 16.5494 13.3527 16.5257 13.329C16.502 13.3053 16.4832 13.2772 16.4705 13.2462C16.4577 13.2151 16.4513 13.1819 16.4515 13.1484ZM9.99988 1.7903C10.5031 1.7903 10.9128 2.19998 10.9128 2.70318C10.9128 2.74509 10.9063 2.78383 10.8998 2.82574C10.6805 2.79347 10.4579 2.7709 10.2353 2.76443C9.85141 2.7515 9.474 2.77736 9.09982 2.82897C9.09335 2.78706 9.08689 2.74833 9.08689 2.70641C9.087 2.19998 9.49668 1.7903 9.99988 1.7903ZM9.99988 19.2096C9.22248 19.2096 8.57087 18.6548 8.41922 17.9193H11.5805C11.4289 18.6548 10.7773 19.2096 9.99988 19.2096ZM17.7386 15.5645C17.7644 15.842 17.6773 16.1097 17.4934 16.3129C17.3031 16.5161 17.0515 16.629 16.7741 16.629H3.22571C2.94827 16.629 2.6967 16.5161 2.50956 16.3129C2.32246 16.1097 2.23536 15.8419 2.26116 15.5645C2.3063 15.0774 2.76118 14.6935 3.29342 14.6935C4.14505 14.6935 4.83858 14 4.83858 13.1484V9.20967C4.83858 7.79677 5.39985 6.47743 6.416 5.49678C7.38696 4.55809 8.65151 4.04837 9.99988 4.04837C10.0644 4.04837 10.1257 4.04837 10.1902 4.05161C12.9289 4.14836 15.1612 6.52581 15.1612 9.34839V13.1484C15.1612 14 15.8547 14.6935 16.7063 14.6935C17.2386 14.6935 17.6902 15.0774 17.7386 15.5645Z" fill="#555555" />
                </g>
                <defs>
                  <clipPath id="clip0_72_1354">
                    <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span className="no">4</span>

            </div>
            <div className="profile">
              <div className="profile-img">
                <img src={require('../../Component/App_Details_theme/images/profile-img.png')} alt="Profile-Image" />
              </div>
              <div className="profile-menu">
                <div className="menu-header d-flex">
                  <div className="row gx-0 w-100">
                    <div className="col-10">
                      <div className="d-flex">
                        <div className="img">
                          <img src={require('../../Component/App_Details_theme/images/profile-img.png')} alt="profile-img" />
                        </div>
                        <div className="name">
                          <h5>James Rodge</h5>
                          <p>UI/UX Designer</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-end">
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <g clipPath="url(#clip0_72_7813)">
                            <path d="M23.0564 15.0494L21.3019 13.5494C21.3849 13.0405 21.4278 12.5209 21.4278 12.0012C21.4278 11.4816 21.3849 10.9619 21.3019 10.453L23.0564 8.953C23.1887 8.83972 23.2834 8.68883 23.3279 8.52041C23.3724 8.35199 23.3646 8.17401 23.3055 8.01015L23.2814 7.9405C22.7984 6.59057 22.0751 5.33917 21.1465 4.24675L21.0983 4.1905C20.9857 4.05805 20.8356 3.96284 20.6677 3.91742C20.4999 3.87199 20.3222 3.87848 20.1582 3.93604L17.9805 4.71015C17.1769 4.05122 16.2796 3.53157 15.3099 3.16729L14.8894 0.890503C14.8577 0.719187 14.7746 0.561581 14.6511 0.438622C14.5277 0.315663 14.3698 0.233173 14.1983 0.20211L14.126 0.188717C12.7305 -0.0630685 11.2626 -0.0630685 9.86708 0.188717L9.79476 0.20211C9.62332 0.233173 9.46539 0.315663 9.34196 0.438622C9.21852 0.561581 9.13542 0.719187 9.10369 0.890503L8.68048 3.178C7.71857 3.54236 6.8228 4.06173 6.02869 4.7155L3.83494 3.93604C3.67092 3.87803 3.49313 3.8713 3.32519 3.91675C3.15726 3.9622 3.00713 4.05768 2.89476 4.1905L2.84655 4.24675C1.91908 5.33994 1.19595 6.59114 0.711724 7.9405L0.687617 8.01015C0.567081 8.34497 0.666188 8.71997 0.936724 8.953L2.71262 10.4691C2.62958 10.9726 2.5894 11.4869 2.5894 11.9985C2.5894 12.5128 2.62958 13.0271 2.71262 13.528L0.936724 15.0441C0.804391 15.1574 0.709679 15.3082 0.665181 15.4767C0.620684 15.6451 0.628509 15.8231 0.687617 15.9869L0.711724 16.0566C1.19655 17.4066 1.9144 18.6521 2.84655 19.7503L2.89476 19.8066C3.00741 19.939 3.15754 20.0342 3.32537 20.0797C3.49321 20.1251 3.67087 20.1186 3.83494 20.061L6.02869 19.2816C6.8269 19.9378 7.71887 20.4575 8.68048 20.8191L9.10369 23.1066C9.13542 23.2779 9.21852 23.4355 9.34196 23.5585C9.46539 23.6814 9.62332 23.7639 9.79476 23.795L9.86708 23.8084C11.2754 24.0615 12.7177 24.0615 14.126 23.8084L14.1983 23.795C14.3698 23.7639 14.5277 23.6814 14.6511 23.5585C14.7746 23.4355 14.8577 23.2779 14.8894 23.1066L15.3099 20.8298C16.2792 20.4665 17.1816 19.9451 17.9805 19.2869L20.1582 20.061C20.3222 20.1191 20.5 20.1258 20.6679 20.0803C20.8358 20.0349 20.986 19.9394 21.0983 19.8066L21.1465 19.7503C22.0787 18.6494 22.7965 17.4066 23.2814 16.0566L23.3055 15.9869C23.426 15.6575 23.3269 15.2825 23.0564 15.0494ZM19.4001 10.7691C19.4671 11.1735 19.5019 11.5887 19.5019 12.0039C19.5019 12.4191 19.4671 12.8343 19.4001 13.2387L19.2233 14.3128L21.2242 16.0244C20.9209 16.7232 20.538 17.3848 20.0832 17.9959L17.5974 17.1146L16.7564 17.8057C16.1162 18.3307 15.4037 18.7432 14.6323 19.0325L13.6117 19.4155L13.1323 22.0137C12.3758 22.0994 11.612 22.0994 10.8555 22.0137L10.376 19.4101L9.36351 19.0218C8.60012 18.7325 7.8903 18.32 7.25547 17.7976L6.4144 17.1039L3.91262 17.9932C3.45726 17.3798 3.0769 16.7182 2.77155 16.0218L4.79387 14.2941L4.61976 13.2226C4.55547 12.8235 4.52065 12.411 4.52065 12.0039C4.52065 11.5941 4.5528 11.1843 4.61976 10.7851L4.79387 9.71372L2.77155 7.98604C3.07422 7.28693 3.45726 6.628 3.91262 6.01461L6.4144 6.9039L7.25547 6.21015C7.8903 5.68782 8.60012 5.27532 9.36351 4.98604L10.3787 4.603L10.8582 1.99943C11.6108 1.91372 12.3796 1.91372 13.1349 1.99943L13.6144 4.59765L14.6349 4.98068C15.4037 5.26997 16.1189 5.68247 16.759 6.20747L17.6001 6.89854L20.0858 6.01729C20.5412 6.63068 20.9215 7.29229 21.2269 7.98872L19.226 9.70032L19.4001 10.7691ZM11.9992 7.02175C9.39565 7.02175 7.28494 9.13247 7.28494 11.736C7.28494 14.3396 9.39565 16.4503 11.9992 16.4503C14.6028 16.4503 16.7135 14.3396 16.7135 11.736C16.7135 9.13247 14.6028 7.02175 11.9992 7.02175ZM14.1207 13.8575C13.8424 14.1365 13.5117 14.3578 13.1477 14.5086C12.7836 14.6593 12.3933 14.7367 11.9992 14.736C11.1983 14.736 10.4457 14.4226 9.8778 13.8575C9.59875 13.5792 9.37748 13.2486 9.2267 12.8845C9.07592 12.5204 8.99861 12.1301 8.99922 11.736C8.99922 10.9351 9.31262 10.1825 9.8778 9.61461C10.4457 9.04675 11.1983 8.73604 11.9992 8.73604C12.8001 8.73604 13.5528 9.04675 14.1207 9.61461C14.3997 9.89285 14.621 10.2235 14.7718 10.5876C14.9225 10.9517 14.9998 11.342 14.9992 11.736C14.9992 12.5369 14.6858 13.2896 14.1207 13.8575Z" fill="#888888" />
                          </g>
                          <defs>
                            <clipPath id="clip0_72_7813">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="menu-body">
                  <h3 className="mt-0 profile-inner-btn">Profile Settings <i className="ri-arrow-up-s-fill"></i></h3>
                  <ul className="top-menu profile-inner-menu">
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M8.75 1.25C6.68625 1.25 5 2.93625 5 5C5 7.06375 6.68625 8.75 8.75 8.75C10.8137 8.75 12.5 7.06375 12.5 5C12.5 2.93625 10.8137 1.25 8.75 1.25ZM8.75 2.5C10.1381 2.5 11.25 3.6125 11.25 5C11.25 6.38812 10.1381 7.5 8.75 7.5C7.36187 7.5 6.25 6.38812 6.25 5C6.25 3.6125 7.36187 2.5 8.75 2.5ZM6.875 10C3.76937 10 1.25 12.5194 1.25 15.625V16.875C1.25 17.0408 1.31585 17.1997 1.43306 17.3169C1.55027 17.4342 1.70924 17.5 1.875 17.5H8.655C8.82076 17.5 8.97973 17.4342 9.09694 17.3169C9.21415 17.1997 9.28 17.0408 9.28 16.875C9.28 16.7092 9.21415 16.5503 9.09694 16.4331C8.97973 16.3158 8.82076 16.25 8.655 16.25H2.5V15.625C2.5 13.1906 4.44062 11.25 6.875 11.25H9.385C9.55076 11.25 9.70973 11.1842 9.82694 11.0669C9.94415 10.9497 10.01 10.7908 10.01 10.625C10.01 10.4592 9.94415 10.3003 9.82694 10.1831C9.70973 10.0658 9.55076 10 9.385 10H6.875ZM14.3669 10C14.2846 10.0009 14.2033 10.018 14.1277 10.0504C14.052 10.0827 13.9835 10.1297 13.926 10.1885C13.8686 10.2474 13.8233 10.317 13.7927 10.3934C13.7622 10.4698 13.7471 10.5515 13.7481 10.6337V11.3125C13.3565 11.3941 12.9843 11.5505 12.6519 11.7731L12.1719 11.2931C12.0244 11.1419 11.8575 11.0844 11.6994 11.0931C11.2262 11.1181 10.8337 11.735 11.2881 12.1769L11.77 12.6594C11.5485 12.9918 11.3932 13.3638 11.3125 13.755H10.6337C9.78875 13.7431 9.78875 15.0175 10.6337 15.005H11.315C11.3962 15.3994 11.5556 15.7662 11.7712 16.0919L11.2856 16.5775C10.6794 17.1669 11.58 18.0675 12.1694 17.4612L12.6544 16.9769C12.9862 17.1985 13.3575 17.3543 13.7481 17.4356V18.1156C13.7356 18.9606 15.01 18.9606 14.9981 18.1156V17.4375C15.388 17.3563 15.7587 17.201 16.09 16.98L16.5787 17.4675C16.6358 17.5295 16.7048 17.5793 16.7816 17.614C16.8584 17.6486 16.9414 17.6674 17.0257 17.6691C17.1099 17.6709 17.1936 17.6555 17.2718 17.6241C17.35 17.5927 17.421 17.5458 17.4806 17.4862C17.5401 17.4266 17.5871 17.3556 17.6185 17.2774C17.6499 17.1993 17.6652 17.1155 17.6635 17.0313C17.6617 16.9471 17.643 16.864 17.6083 16.7872C17.5737 16.7104 17.5239 16.6414 17.4619 16.5844L16.9762 16.0981C17.1977 15.7669 17.3534 15.3962 17.435 15.0062H18.1162C18.282 15.0062 18.441 14.9404 18.5582 14.8232C18.6754 14.706 18.7412 14.547 18.7412 14.3812C18.7412 14.2155 18.6754 14.0565 18.5582 13.9393C18.441 13.8221 18.282 13.7562 18.1162 13.7562H17.4375C17.3569 13.3625 17.2006 12.9881 16.9775 12.6537L17.4594 12.1719C17.5194 12.1138 17.5671 12.0443 17.5997 11.9674C17.6323 11.8905 17.6491 11.8079 17.6491 11.7244C17.6491 11.6409 17.6323 11.5582 17.5997 11.4813C17.5671 11.4045 17.5194 11.3349 17.4594 11.2769C17.3408 11.1613 17.1813 11.0972 17.0156 11.0987C16.8505 11.1016 16.6932 11.1697 16.5781 11.2881L16.095 11.7712C15.7629 11.5494 15.3911 11.3937 15 11.3125V10.6337C15.0013 10.5504 14.9859 10.4676 14.9547 10.3902C14.9235 10.3129 14.8771 10.2426 14.8183 10.1835C14.7594 10.1244 14.6893 10.0777 14.6121 10.0462C14.5349 10.0147 14.4521 9.99899 14.3687 10H14.3669ZM14.375 12.5C15.4175 12.5 16.25 13.3319 16.25 14.375C16.25 15.4175 15.4175 16.25 14.375 16.25C13.3319 16.25 12.5 15.4175 12.5 14.375C12.5 13.3319 13.3319 12.5 14.375 12.5Z" fill="#888888" />
                        </svg>
                        Manage Profile
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <svg className="password" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clipPath="url(#clip0_72_7826)">
                            <path d="M8.53835 18.4851C4.48015 17.791 1.39136 14.2561 1.39136 10C1.39136 5.74391 4.48015 2.20898 8.53835 1.51492M8.53835 1.51492L7.65558 3.0818M8.53835 1.51492L6.99847 0.585938M11.4617 1.51492C15.5199 2.20898 18.6087 5.74391 18.6087 10C18.6087 14.2561 15.52 17.791 11.4617 18.4851M11.4617 18.4851L12.3445 16.9182M11.4617 18.4851L13.0016 19.4141" stroke="#555555" strokeWidth="0.9" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13.0079 8.81852V7.89062C13.0079 6.22945 11.6612 4.88281 10.0001 4.88281C8.3389 4.88281 6.99226 6.22945 6.99226 7.89062V8.81852M10.0001 11.2891V12.0998M12.8944 14.5703H7.10573C6.53968 14.5703 6.08081 14.1114 6.08081 13.5454V9.84344C6.08081 9.27738 6.53968 8.81852 7.10573 8.81852H12.8944C13.4605 8.81852 13.9194 9.27738 13.9194 9.84344V13.5454C13.9193 14.1114 13.4605 14.5703 12.8944 14.5703Z" stroke="#555555" strokeWidth="0.9" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          </g>
                          <defs>
                            <clipPath id="clip0_72_7826">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Change Password
                      </a>
                    </li>
                  </ul>
                  <h3 className="user-btn">User Settings <i className="ri-arrow-up-s-fill"></i></h3>
                  <ul className="top-menu user-menu">
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M17.5 14.0625H15.3125V11.875C15.3125 11.7092 15.2467 11.5503 15.1294 11.4331C15.0122 11.3158 14.8533 11.25 14.6875 11.25C14.5217 11.25 14.3628 11.3158 14.2456 11.4331C14.1283 11.5503 14.0625 11.7092 14.0625 11.875V14.0625H11.875C11.7092 14.0625 11.5503 14.1283 11.4331 14.2456C11.3158 14.3628 11.25 14.5217 11.25 14.6875C11.25 14.8533 11.3158 15.0122 11.4331 15.1294C11.5503 15.2467 11.7092 15.3125 11.875 15.3125H14.0625V17.5C14.0625 17.6658 14.1283 17.8247 14.2456 17.9419C14.3628 18.0592 14.5217 18.125 14.6875 18.125C14.8533 18.125 15.0122 18.0592 15.1294 17.9419C15.2467 17.8247 15.3125 17.6658 15.3125 17.5V15.3125H17.5C17.6658 15.3125 17.8247 15.2467 17.9419 15.1294C18.0592 15.0122 18.125 14.8533 18.125 14.6875C18.125 14.5217 18.0592 14.3628 17.9419 14.2456C17.8247 14.1283 17.6658 14.0625 17.5 14.0625Z" fill="#888888" />
                          <path d="M10 18.125H3.75C3.58424 18.125 3.42527 18.0591 3.30806 17.9419C3.19085 17.8247 3.125 17.6657 3.125 17.5C3.12715 15.6773 3.85217 13.9298 5.14102 12.641C6.42986 11.3521 8.1773 10.6271 10 10.625C11.208 10.6287 12.3768 10.1963 13.2915 9.4073C14.2062 8.61826 14.8055 7.5256 14.9791 6.33012C15.1527 5.13464 14.889 3.91667 14.2364 2.90006C13.5839 1.88345 12.5863 1.13651 11.4272 0.796508C10.268 0.456509 9.02502 0.546301 7.92674 1.04938C6.82846 1.55246 5.94865 2.43502 5.449 3.53487C4.94935 4.63471 4.86344 5.87794 5.20706 7.03606C5.55068 8.19417 6.30073 9.18937 7.31937 9.83873C5.73054 10.3952 4.35355 11.431 3.37838 12.8032C2.40321 14.1755 1.87793 15.8165 1.875 17.5C1.875 17.9973 2.07254 18.4742 2.42417 18.8258C2.77581 19.1774 3.25272 19.375 3.75 19.375H10C10.1658 19.375 10.3247 19.3091 10.4419 19.1919C10.5592 19.0747 10.625 18.9157 10.625 18.75C10.625 18.5842 10.5592 18.4252 10.4419 18.308C10.3247 18.1908 10.1658 18.125 10 18.125ZM6.25 5.62498C6.25 4.8833 6.46993 4.15828 6.88199 3.54159C7.29404 2.92491 7.87971 2.44426 8.56494 2.16043C9.25016 1.8766 10.0042 1.80234 10.7316 1.94703C11.459 2.09173 12.1272 2.44888 12.6516 2.97333C13.1761 3.49778 13.5332 4.16596 13.6779 4.89339C13.8226 5.62082 13.7484 6.37482 13.4645 7.06004C13.1807 7.74527 12.7001 8.33093 12.0834 8.74299C11.4667 9.15505 10.7417 9.37498 10 9.37498C9.00574 9.37399 8.05249 8.97858 7.34945 8.27553C6.6464 7.57249 6.25099 6.61924 6.25 5.62498Z" fill="#888888" />
                        </svg>
                        Add User
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path fillRule="evenodd" clipRule="evenodd" d="M9.68823 1.25122C7.27386 1.25122 5.31323 3.21185 5.31323 5.62622C5.31323 8.04122 7.27386 10.0012 9.68823 10.0012C12.1026 10.0012 14.0632 8.04122 14.0632 5.62622C14.0632 3.21185 12.1026 1.25122 9.68823 1.25122ZM9.68823 2.50122C11.4132 2.50122 12.8132 3.90185 12.8132 5.62622C12.8132 7.35122 11.4132 8.75122 9.68823 8.75122C7.96323 8.75122 6.56323 7.35122 6.56323 5.62622C6.56323 3.90185 7.96323 2.50122 9.68823 2.50122ZM2.18823 17.5012H10.0001C10.1659 17.5012 10.3248 17.5671 10.442 17.6843C10.5593 17.8015 10.6251 17.9605 10.6251 18.1262C10.6251 18.292 10.5593 18.451 10.442 18.5682C10.3248 18.6854 10.1659 18.7512 10.0001 18.7512H1.56323C1.39747 18.7512 1.2385 18.6854 1.12129 18.5682C1.00408 18.451 0.938232 18.292 0.938232 18.1262V16.8762C0.938232 15.3844 1.53086 13.9536 2.58576 12.8987C3.64065 11.8439 5.07139 11.2512 6.56323 11.2512H10.0001C10.1659 11.2512 10.3248 11.3171 10.442 11.4343C10.5593 11.5515 10.6251 11.7105 10.6251 11.8762C10.6251 12.042 10.5593 12.201 10.442 12.3182C10.3248 12.4354 10.1659 12.5012 10.0001 12.5012H6.56323C5.40291 12.5012 4.29011 12.9622 3.46964 13.7826C2.64917 14.6031 2.18823 15.7159 2.18823 16.8762V17.5012ZM15.0014 11.2512C12.7595 11.2512 10.9395 13.0712 10.9395 15.3131C10.9395 17.555 12.7595 19.375 15.0014 19.375C17.2432 19.375 19.0632 17.555 19.0632 15.3131C19.0632 13.0712 17.2432 11.2512 15.0014 11.2512ZM15.0014 12.5012C16.5532 12.5012 17.8132 13.7612 17.8132 15.3131C17.8132 16.865 16.5532 18.125 15.0014 18.125C13.4495 18.125 12.1895 16.865 12.1895 15.3131C12.1895 13.7612 13.4495 12.5012 15.0014 12.5012Z" fill="#888888" />
                          <path fillRule="evenodd" clipRule="evenodd" d="M16.9857 12.4381L12.1264 17.2975C12.0125 17.4153 11.9495 17.5732 11.951 17.7371C11.9524 17.901 12.0181 18.0577 12.134 18.1736C12.2499 18.2895 12.4066 18.3552 12.5705 18.3566C12.7344 18.3581 12.8922 18.2951 13.0101 18.1812L17.8695 13.3218C17.9275 13.2638 17.9736 13.1949 18.005 13.1191C18.0364 13.0433 18.0525 12.962 18.0525 12.88C18.0525 12.7979 18.0364 12.7166 18.005 12.6408C17.9736 12.565 17.9275 12.4961 17.8695 12.4381C17.8115 12.3801 17.7426 12.334 17.6668 12.3026C17.5909 12.2712 17.5097 12.2551 17.4276 12.2551C17.3456 12.2551 17.2643 12.2712 17.1885 12.3026C17.1127 12.334 17.0438 12.3801 16.9857 12.4381Z" fill="#888888" />
                        </svg>
                        Blocked Users
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M8.75 1.25C6.68625 1.25 5 2.93625 5 5C5 7.06375 6.68625 8.75 8.75 8.75C10.8137 8.75 12.5 7.06375 12.5 5C12.5 2.93625 10.8137 1.25 8.75 1.25ZM8.75 2.5C10.1381 2.5 11.25 3.6125 11.25 5C11.25 6.38812 10.1381 7.5 8.75 7.5C7.36187 7.5 6.25 6.38812 6.25 5C6.25 3.6125 7.36187 2.5 8.75 2.5ZM6.875 10C3.76937 10 1.25 12.5194 1.25 15.625V16.875C1.25 17.0408 1.31585 17.1997 1.43306 17.3169C1.55027 17.4342 1.70924 17.5 1.875 17.5H8.655C8.82076 17.5 8.97973 17.4342 9.09694 17.3169C9.21415 17.1997 9.28 17.0408 9.28 16.875C9.28 16.7092 9.21415 16.5503 9.09694 16.4331C8.97973 16.3158 8.82076 16.25 8.655 16.25H2.5V15.625C2.5 13.1906 4.44062 11.25 6.875 11.25H9.385C9.55076 11.25 9.70973 11.1842 9.82694 11.0669C9.94415 10.9497 10.01 10.7908 10.01 10.625C10.01 10.4592 9.94415 10.3003 9.82694 10.1831C9.70973 10.0658 9.55076 10 9.385 10H6.875ZM14.3669 10C14.2846 10.0009 14.2033 10.018 14.1277 10.0504C14.052 10.0827 13.9835 10.1297 13.926 10.1885C13.8686 10.2474 13.8233 10.317 13.7927 10.3934C13.7622 10.4698 13.7471 10.5515 13.7481 10.6337V11.3125C13.3565 11.3941 12.9843 11.5505 12.6519 11.7731L12.1719 11.2931C12.0244 11.1419 11.8575 11.0844 11.6994 11.0931C11.2262 11.1181 10.8337 11.735 11.2881 12.1769L11.77 12.6594C11.5485 12.9918 11.3932 13.3638 11.3125 13.755H10.6337C9.78875 13.7431 9.78875 15.0175 10.6337 15.005H11.315C11.3962 15.3994 11.5556 15.7662 11.7712 16.0919L11.2856 16.5775C10.6794 17.1669 11.58 18.0675 12.1694 17.4612L12.6544 16.9769C12.9862 17.1985 13.3575 17.3543 13.7481 17.4356V18.1156C13.7356 18.9606 15.01 18.9606 14.9981 18.1156V17.4375C15.388 17.3563 15.7587 17.201 16.09 16.98L16.5787 17.4675C16.6358 17.5295 16.7048 17.5793 16.7816 17.614C16.8584 17.6486 16.9414 17.6674 17.0257 17.6691C17.1099 17.6709 17.1936 17.6555 17.2718 17.6241C17.35 17.5927 17.421 17.5458 17.4806 17.4862C17.5401 17.4266 17.5871 17.3556 17.6185 17.2774C17.6499 17.1993 17.6652 17.1155 17.6635 17.0313C17.6617 16.9471 17.643 16.864 17.6083 16.7872C17.5737 16.7104 17.5239 16.6414 17.4619 16.5844L16.9762 16.0981C17.1977 15.7669 17.3534 15.3962 17.435 15.0062H18.1162C18.282 15.0062 18.441 14.9404 18.5582 14.8232C18.6754 14.706 18.7412 14.547 18.7412 14.3812C18.7412 14.2155 18.6754 14.0565 18.5582 13.9393C18.441 13.8221 18.282 13.7562 18.1162 13.7562H17.4375C17.3569 13.3625 17.2006 12.9881 16.9775 12.6537L17.4594 12.1719C17.5194 12.1138 17.5671 12.0443 17.5997 11.9674C17.6323 11.8905 17.6491 11.8079 17.6491 11.7244C17.6491 11.6409 17.6323 11.5582 17.5997 11.4813C17.5671 11.4045 17.5194 11.3349 17.4594 11.2769C17.3408 11.1613 17.1813 11.0972 17.0156 11.0987C16.8505 11.1016 16.6932 11.1697 16.5781 11.2881L16.095 11.7712C15.7629 11.5494 15.3911 11.3937 15 11.3125V10.6337C15.0013 10.5504 14.9859 10.4676 14.9547 10.3902C14.9235 10.3129 14.8771 10.2426 14.8183 10.1835C14.7594 10.1244 14.6893 10.0777 14.6121 10.0462C14.5349 10.0147 14.4521 9.99899 14.3687 10H14.3669ZM14.375 12.5C15.4175 12.5 16.25 13.3319 16.25 14.375C16.25 15.4175 15.4175 16.25 14.375 16.25C13.3319 16.25 12.5 15.4175 12.5 14.375C12.5 13.3319 13.3319 12.5 14.375 12.5Z" fill="#888888" />
                        </svg>
                        User Management
                      </a>
                    </li>
                  </ul>
                  <ul className="bottom-menu">
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clipPath="url(#clip0_72_7862)">
                            <path d="M19.4013 12.5342C19.3177 12.4508 19.2121 12.3928 19.0968 12.3669C18.9816 12.341 18.8613 12.3483 18.75 12.388C17.2546 12.9212 15.6386 13.0191 14.0898 12.6703C12.541 12.3216 11.1229 11.5405 10.0003 10.4179C8.87772 9.29522 8.09673 7.87709 7.74808 6.32823C7.39943 4.77937 7.49742 3.16338 8.03067 1.668C8.0703 1.5567 8.07757 1.43645 8.05164 1.32119C8.02571 1.20593 7.96764 1.10038 7.88416 1.01678C7.80069 0.933175 7.69523 0.874942 7.58001 0.848831C7.46479 0.822719 7.34453 0.829799 7.23317 0.869249C5.88498 1.34534 4.66151 2.11933 3.6538 3.13362C1.84731 4.94148 0.832769 7.39277 0.833252 9.94849C0.833735 12.5042 1.84921 14.9551 3.65638 16.7623C5.46355 18.5695 7.91446 19.5849 10.4702 19.5854C13.0259 19.5859 15.4772 18.5714 17.285 16.7649C18.2994 15.757 19.0734 14.5333 19.5494 13.1849C19.5887 13.0735 19.5957 12.9533 19.5695 12.8381C19.5432 12.723 19.4849 12.6176 19.4013 12.5342ZM16.4013 15.8811C15.5491 16.731 14.524 17.3875 13.3956 17.806C12.2672 18.2246 11.0619 18.3955 9.86161 18.3071C8.66132 18.2187 7.49411 17.873 6.43924 17.2936C5.38436 16.7142 4.46652 15.9145 3.74802 14.949C3.02953 13.9834 2.52721 12.8746 2.27517 11.6977C2.02314 10.5209 2.02728 9.30358 2.28733 8.12847C2.54738 6.95336 3.05724 5.84797 3.7823 4.88734C4.50735 3.92672 5.43062 3.13336 6.48942 2.56112C6.17598 4.12158 6.25149 5.73521 6.70929 7.25958C7.16709 8.78395 7.99311 10.1722 9.11442 11.3017C10.2439 12.4233 11.6321 13.2494 13.1565 13.7072C14.6809 14.165 16.2946 14.2404 17.855 13.9267C17.4686 14.6458 16.9788 15.3042 16.4013 15.8811Z" fill="#666A70" />
                          </g>
                          <defs>
                            <clipPath id="clip0_72_7862">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Dark Mode
                        <label className="switch">
                          <input type="checkbox" checked />
                          <span className="slider round"></span>
                        </label>
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <g clipPath="url(#clip0_72_7868)">
                            <path d="M10 0C4.486 0 0 4.48606 0 10.0001C0 15.5141 4.486 20 10 20C15.514 20 20 15.5141 20 10.0001C20 4.48606 15.514 0 10 0ZM10 18.1818C5.48848 18.1818 1.81818 14.5115 1.81818 10.0001C1.81818 5.48861 5.48848 1.81818 10 1.81818C14.5115 1.81818 18.1818 5.48861 18.1818 10.0001C18.1818 14.5115 14.5115 18.1818 10 18.1818Z" fill="#666A70" />
                            <path d="M9.99996 4.24243C9.33172 4.24243 8.78809 4.78643 8.78809 5.4551C8.78809 6.12316 9.33172 6.66667 9.99996 6.66667C10.6682 6.66667 11.2118 6.12316 11.2118 5.4551C11.2118 4.78643 10.6682 4.24243 9.99996 4.24243ZM10.0001 8.48486C9.49803 8.48486 9.091 8.89189 9.091 9.39395V14.8485C9.091 15.3506 9.49803 15.7576 10.0001 15.7576C10.5021 15.7576 10.9092 15.3506 10.9092 14.8485V9.39395C10.9092 8.89189 10.5021 8.48486 10.0001 8.48486Z" fill="#666A70" />
                          </g>
                          <defs>
                            <clipPath id="clip0_72_7868">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        Help Center
                      </a>
                    </li>
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.54578 18.9584C8.68495 18.9584 9.60412 18.9584 10.3266 18.8609C11.0766 18.7609 11.7083 18.5442 12.2099 18.0434C12.6466 17.6059 12.8683 17.0684 12.9841 16.4367C13.0966 15.8225 13.1183 15.0717 13.1233 14.17C13.1242 14.0043 13.0592 13.845 12.9426 13.7271C12.826 13.6093 12.6674 13.5426 12.5016 13.5417C12.3359 13.5408 12.1765 13.6058 12.0587 13.7224C11.9409 13.839 11.8742 13.9976 11.8733 14.1634C11.8683 15.0742 11.8449 15.72 11.7549 16.2109C11.6674 16.6825 11.5283 16.9567 11.3258 17.1592C11.0949 17.39 10.7708 17.54 10.1591 17.6225C9.52995 17.7067 8.69578 17.7084 7.49995 17.7084H6.66662C5.46995 17.7084 4.63578 17.7067 4.00662 17.6225C3.39495 17.54 3.07162 17.3892 2.83995 17.1592C2.60828 16.9292 2.45995 16.605 2.37745 15.9925C2.29245 15.3642 2.29162 14.5292 2.29162 13.3334L2.29162 6.66671C2.29162 5.47087 2.29245 4.63587 2.37745 4.00671C2.45995 3.39504 2.60995 3.07171 2.84078 2.84088C3.07162 2.61004 3.39495 2.46004 4.00662 2.37754C4.63578 2.29338 5.46995 2.29171 6.66662 2.29171H7.49995C8.69578 2.29171 9.52995 2.29338 10.1599 2.37754C10.7708 2.46004 11.0949 2.61087 11.3258 2.84088C11.5283 3.04338 11.6674 3.31754 11.7549 3.78921C11.8449 4.28004 11.8683 4.92587 11.8733 5.83671C11.8737 5.91878 11.8903 5.99997 11.9221 6.07563C11.9539 6.15129 12.0004 6.21995 12.0587 6.27767C12.117 6.3354 12.1862 6.38107 12.2622 6.41208C12.3382 6.44308 12.4195 6.45881 12.5016 6.45837C12.5837 6.45794 12.6649 6.44134 12.7405 6.40952C12.8162 6.37771 12.8849 6.33131 12.9426 6.27296C13.0003 6.21461 13.046 6.14547 13.077 6.06947C13.108 5.99348 13.1237 5.91212 13.1233 5.83004C13.1183 4.92837 13.0966 4.17754 12.9841 3.56337C12.8674 2.93171 12.6466 2.39421 12.2091 1.95671C11.7083 1.45504 11.0758 1.24004 10.3258 1.13837C9.60412 1.04171 8.68495 1.04171 7.54578 1.04171H6.62078C5.48078 1.04171 4.56245 1.04171 3.83995 1.13921C3.08995 1.23921 2.45828 1.45587 1.95662 1.95671C1.45495 2.45837 1.23995 3.09004 1.13828 3.84004C1.04162 4.56254 1.04162 5.48171 1.04162 6.62087L1.04162 13.3792C1.04162 14.5184 1.04162 15.4375 1.13828 16.16C1.23911 16.91 1.45495 17.5417 1.95662 18.0434C2.45828 18.545 3.08995 18.76 3.83995 18.8609C4.56245 18.9584 5.48162 18.9584 6.62078 18.9584H7.54578Z" fill="#666A70" />
                          <path d="M7.49945 10.6251C7.33369 10.6251 7.17472 10.5592 7.05751 10.442C6.9403 10.3248 6.87445 10.1658 6.87445 10.0001C6.87445 9.8343 6.9403 9.67533 7.05751 9.55812C7.17472 9.44091 7.33369 9.37506 7.49945 9.37506L16.6436 9.37506L15.0095 7.97506C14.8835 7.86721 14.8055 7.71373 14.7927 7.54838C14.7799 7.38304 14.8333 7.21937 14.9411 7.0934C15.049 6.96742 15.2025 6.88945 15.3678 6.87663C15.5331 6.86382 15.6968 6.91721 15.8228 7.02506L18.7395 9.52506C18.8081 9.58374 18.8632 9.65658 18.9009 9.73858C18.9387 9.82058 18.9583 9.90978 18.9583 10.0001C18.9583 10.0903 18.9387 10.1796 18.9009 10.2615C18.8632 10.3435 18.8081 10.4164 18.7395 10.4751L15.8228 12.9751C15.7604 13.0285 15.6881 13.0691 15.6101 13.0945C15.532 13.12 15.4497 13.1298 15.3678 13.1235C15.2859 13.1172 15.2061 13.0947 15.1329 13.0575C15.0597 13.0204 14.9945 12.9691 14.9411 12.9067C14.8877 12.8444 14.8471 12.7721 14.8217 12.694C14.7962 12.6159 14.7863 12.5336 14.7927 12.4517C14.799 12.3699 14.8214 12.2901 14.8586 12.2168C14.8958 12.1436 14.9471 12.0785 15.0095 12.0251L16.6428 10.6251L7.49945 10.6251Z" fill="#666A70" />
                        </svg>
                        Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <!-- menu --> */}
        <div className="mobile-menu">
          <i className="ri-close-line close-icon"></i>
          <div className="brand">
            <img src={require('../../Component/App_Details_theme/images/logo.png')} alt="logo" />
          </div>
          <h2 className="nav-heading">Menu</h2>
          <ul className="main-mobile-menu">
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9.24994 8.00006H1.74994C0.784969 8.00006 0 7.21509 0 6.24994V1.74994C0 0.784969 0.784969 0 1.74994 0H9.24994C10.2151 0 11.0001 0.784969 11.0001 1.74994V6.24994C11.0001 7.21509 10.2151 8.00006 9.24994 8.00006ZM1.74994 1.5C1.68367 1.50005 1.62012 1.5264 1.57326 1.57326C1.5264 1.62012 1.50005 1.68367 1.5 1.74994V6.24994C1.50001 6.31624 1.52634 6.37982 1.57321 6.42672C1.62007 6.47362 1.68364 6.5 1.74994 6.50006H9.24994C9.31627 6.50004 9.37987 6.47368 9.42677 6.42677C9.47368 6.37987 9.50004 6.31627 9.50006 6.24994V1.74994C9.5 1.68364 9.47362 1.62007 9.42672 1.57321C9.37982 1.52634 9.31624 1.50001 9.24994 1.5H1.74994ZM9.24994 24H1.74994C0.784969 24 0 23.215 0 22.2501V11.7501C0 10.7849 0.784969 9.99994 1.74994 9.99994H9.24994C10.2151 9.99994 11.0001 10.7849 11.0001 11.7501V22.2501C11.0001 23.215 10.2151 24 9.24994 24ZM1.74994 11.4999C1.68364 11.5 1.62007 11.5264 1.57321 11.5733C1.52634 11.6202 1.50001 11.6838 1.5 11.7501V22.2501C1.50005 22.3163 1.5264 22.3799 1.57326 22.4267C1.62012 22.4736 1.68367 22.5 1.74994 22.5H9.24994C9.31624 22.5 9.37982 22.4737 9.42672 22.4268C9.47362 22.3799 9.5 22.3164 9.50006 22.2501V11.7501C9.50004 11.6837 9.47368 11.6201 9.42677 11.5732C9.37987 11.5263 9.31627 11.5 9.24994 11.4999H1.74994ZM22.2501 24H14.7501C13.7849 24 12.9999 23.215 12.9999 22.2501V17.7501C12.9999 16.7849 13.7849 15.9999 14.7501 15.9999H22.2501C23.215 15.9999 24 16.7849 24 17.7501V22.2501C24 23.215 23.215 24 22.2501 24ZM14.7501 17.4999C14.6837 17.5 14.6201 17.5263 14.5732 17.5732C14.5263 17.6201 14.5 17.6837 14.4999 17.7501V22.2501C14.5 22.3164 14.5264 22.3799 14.5733 22.4268C14.6202 22.4737 14.6838 22.5 14.7501 22.5H22.2501C22.3163 22.5 22.3799 22.4736 22.4267 22.4267C22.4736 22.3799 22.5 22.3163 22.5 22.2501V17.7501C22.5 17.6838 22.4737 17.6202 22.4268 17.5733C22.3799 17.5264 22.3164 17.5 22.2501 17.4999H14.7501ZM22.2501 14.0001H14.7501C13.7849 14.0001 12.9999 13.2151 12.9999 12.2499V1.74994C12.9999 0.784969 13.7849 0 14.7501 0H22.2501C23.215 0 24 0.784969 24 1.74994V12.2499C24 13.2151 23.215 14.0001 22.2501 14.0001ZM14.7501 1.5C14.6838 1.50001 14.6202 1.52634 14.5733 1.57321C14.5264 1.62007 14.5 1.68364 14.4999 1.74994V12.2499C14.5 12.3163 14.5263 12.3799 14.5732 12.4268C14.6201 12.4737 14.6837 12.5 14.7501 12.5001H22.2501C22.3164 12.5 22.3799 12.4736 22.4268 12.4267C22.4737 12.3798 22.5 12.3162 22.5 12.2499V1.74994C22.5 1.68367 22.4736 1.62012 22.4267 1.57326C22.3799 1.5264 22.3163 1.50005 22.2501 1.5H14.7501Z" fill="#555555" />
                </svg>
                Home
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1288)">
                          <path d="M19.825 8.22499L15.3583 12.8L16.4083 19.275C16.5008 19.7917 15.94 20.17 15.4917 19.925L10 16.8833V0.0249939C10.2333 0.0249939 10.4667 0.133327 10.5667 0.358327L13.325 6.23333L19.4667 7.16666C19.98 7.25833 20.1692 7.86249 19.825 8.22499Z" fill="#E0E0E0" />
                          <path d="M9.9999 0.0249939V16.8833L4.50823 19.925C4.0674 20.1725 3.49823 19.7975 3.59157 19.275L4.64157 12.8L0.174902 8.22499C0.0955067 8.14169 0.0404136 8.03825 0.0155868 7.92587C-0.0092399 7.8135 -0.00285426 7.69648 0.0340524 7.58748C0.0709591 7.47847 0.136981 7.38164 0.224969 7.30747C0.312957 7.23329 0.41956 7.1846 0.533235 7.16666L6.6749 6.23333L9.43324 0.358327C9.53323 0.133327 9.76657 0.0249939 9.9999 0.0249939Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1288">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Most active
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="" className="active">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 24C2.118 24 0 21.882 0 12C0 2.118 2.118 0 12 0C21.882 0 24 2.118 24 12C24 21.882 21.882 24 12 24ZM6.99998 12C7.55227 12 7.99997 12.4477 7.99997 13V17C7.99997 17.5522 7.55227 18 6.99998 18C6.4477 18 6 17.5523 6 17V13C6 12.4477 6.4477 12 6.99998 12ZM13 6.99998C13 6.4477 12.5523 6 12 6C11.4477 6 11 6.4477 11 6.99998V17C11 17.5522 11.4477 18 12 18C12.5523 18 13 17.5522 13 17V6.99998ZM17 9.99998C17.5523 9.99998 18 10.4477 18 11V17C18 17.5522 17.5523 18 17 18C16.4477 18 16 17.5522 16 17V11C16 10.4477 16.4477 9.99998 17 9.99998Z" fill="#555555"></path>
                </svg>
                Dashboard
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>

                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="19" viewBox="0 0 24 19" fill="none">
                  <path d="M8.57175 8.99999C9.41952 8.99999 10.2483 8.74859 10.9531 8.27758C11.658 7.80656 12.2074 7.1371 12.5318 6.35385C12.8562 5.57059 12.941 4.70873 12.7756 3.87726C12.6101 3.04579 12.2018 2.28205 11.6023 1.68264C11.0028 1.08323 10.239 0.675061 9.4075 0.50976C8.576 0.344459 7.71415 0.429447 6.93095 0.753979C6.14776 1.07851 5.47839 1.62801 5.0075 2.33297C4.53661 3.03794 4.28535 3.86672 4.2855 4.71449C4.28669 5.85084 4.73868 6.9403 5.54227 7.74375C6.34587 8.5472 7.4354 8.999 8.57175 8.99999ZM8.57175 1.92824C9.12282 1.92824 9.66151 2.09165 10.1197 2.39781C10.5779 2.70397 10.935 3.13912 11.1459 3.64824C11.3568 4.15736 11.412 4.71758 11.3045 5.25806C11.197 5.79854 10.9316 6.295 10.5419 6.68467C10.1523 7.07433 9.6558 7.3397 9.11532 7.4472C8.57484 7.55471 8.01462 7.49954 7.5055 7.28865C6.99638 7.07777 6.56122 6.72065 6.25507 6.26245C5.94891 5.80425 5.7855 5.26556 5.7855 4.71449C5.7861 3.97572 6.07984 3.26737 6.60223 2.74497C7.12463 2.22258 7.83297 1.92884 8.57175 1.92824ZM17.625 9.37499C18.2554 9.37499 18.8717 9.18805 19.3959 8.8378C19.9201 8.48755 20.3286 7.98974 20.5699 7.4073C20.8111 6.82486 20.8742 6.18396 20.7513 5.56564C20.6283 4.94733 20.3247 4.37937 19.8789 3.93359C19.4331 3.48781 18.8652 3.18423 18.2469 3.06124C17.6285 2.93825 16.9876 3.00137 16.4052 3.24263C15.8228 3.48388 15.3249 3.89243 14.9747 4.41661C14.6244 4.94079 14.4375 5.55706 14.4375 6.18749C14.4385 7.03257 14.7746 7.84274 15.3722 8.4403C15.9698 9.03786 16.7799 9.374 17.625 9.37499ZM17.625 4.49999C17.9588 4.49999 18.285 4.59896 18.5625 4.78439C18.84 4.96981 19.0563 5.23336 19.184 5.54171C19.3118 5.85006 19.3452 6.18936 19.2801 6.51671C19.215 6.84405 19.0542 7.14473 18.8182 7.38073C18.5822 7.61674 18.2816 7.77745 17.9542 7.84257C17.6269 7.90768 17.2876 7.87426 16.9792 7.74654C16.6709 7.61882 16.4073 7.40252 16.2219 7.12502C16.0365 6.84751 15.9375 6.52125 15.9375 6.18749C15.9379 5.74006 16.1158 5.31107 16.4322 4.99469C16.7486 4.67831 17.1776 4.50039 17.625 4.49999ZM17.625 10.2525C16.8682 10.2548 16.1197 10.4094 15.4239 10.707C14.7281 11.0046 14.0993 11.4393 13.575 11.985C12.4322 11.0351 11.0424 10.4304 9.56845 10.2415C8.09446 10.0526 6.59716 10.2874 5.25174 10.9184C3.90633 11.5494 2.76843 12.5506 1.97121 13.8047C1.17398 15.0588 0.750391 16.514 0.75 18C0.75 18.1989 0.829018 18.3897 0.96967 18.5303C1.11032 18.671 1.30109 18.75 1.5 18.75H15.645C15.8439 18.75 16.0347 18.671 16.1753 18.5303C16.316 18.3897 16.395 18.1989 16.395 18C16.3937 17.5397 16.3518 17.0804 16.2698 16.6275H22.5C22.6989 16.6275 22.8897 16.5485 23.0303 16.4078C23.171 16.2672 23.25 16.0764 23.25 15.8775C23.2484 14.3861 22.6553 12.9563 21.6007 11.9018C20.5462 10.8472 19.1164 10.2541 17.625 10.2525ZM2.29425 17.25C2.46306 15.8122 3.1205 14.476 4.15659 13.4649C5.19268 12.4539 6.54457 11.8293 7.98605 11.6957C9.42754 11.5621 10.8712 11.9275 12.0755 12.731C13.2797 13.5344 14.1716 14.727 14.6017 16.1092C14.7216 16.4805 14.8047 16.8625 14.85 17.25H2.29425ZM15.8333 15.1275C15.5398 14.3788 15.1322 13.68 14.625 13.056C15.1463 12.4995 15.8118 12.0987 16.5475 11.8981C17.2831 11.6974 18.06 11.7049 18.7916 11.9196C19.5232 12.1344 20.1809 12.5479 20.6915 13.1143C21.202 13.6806 21.5453 14.3776 21.6833 15.1275H15.8333Z" fill="#555555" />
                </svg>
                User
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1288)">
                          <path d="M19.825 8.22499L15.3583 12.8L16.4083 19.275C16.5008 19.7917 15.94 20.17 15.4917 19.925L10 16.8833V0.0249939C10.2333 0.0249939 10.4667 0.133327 10.5667 0.358327L13.325 6.23333L19.4667 7.16666C19.98 7.25833 20.1692 7.86249 19.825 8.22499Z" fill="#E0E0E0" />
                          <path d="M9.9999 0.0249939V16.8833L4.50823 19.925C4.0674 20.1725 3.49823 19.7975 3.59157 19.275L4.64157 12.8L0.174902 8.22499C0.0955067 8.14169 0.0404136 8.03825 0.0155868 7.92587C-0.0092399 7.8135 -0.00285426 7.69648 0.0340524 7.58748C0.0709591 7.47847 0.136981 7.38164 0.224969 7.30747C0.312957 7.23329 0.41956 7.1846 0.533235 7.16666L6.6749 6.23333L9.43324 0.358327C9.53323 0.133327 9.76657 0.0249939 9.9999 0.0249939Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1288">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Most active
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                  <path d="M18.7418 15.1781V10.6181C18.7418 7.23097 16.5741 4.27744 13.5895 3.17422C13.6243 3.00001 13.6437 2.82198 13.6437 2.64388C13.6437 1.18454 12.4592 0 10.9999 0C9.54051 0 8.35597 1.18454 8.35597 2.64388C8.35597 2.8181 8.3753 2.99225 8.40627 3.15871C7.38049 3.52259 6.4321 4.09935 5.62307 4.88128C4.09792 6.35226 3.25794 8.33031 3.25794 10.4516V15.1781C3.25794 15.3445 3.12244 15.4839 2.95211 15.4839C1.52373 15.4839 0.304343 16.56 0.172728 17.9304C0.0991626 18.693 0.350822 19.4516 0.865649 20.0168C1.3766 20.5781 2.10824 20.9033 2.87078 20.9033H7.53919C7.73274 22.6414 9.21147 24.0001 10.9999 24.0001C12.7882 24.0001 14.267 22.6414 14.4605 20.9033H19.1289C19.8915 20.9033 20.6231 20.5781 21.1341 20.0168C21.645 19.4516 21.8967 18.693 21.827 17.9304C21.6954 16.56 20.4722 15.4839 19.0476 15.4839C19.0074 15.4841 18.9675 15.4764 18.9303 15.4611C18.8931 15.4458 18.8593 15.4233 18.8308 15.3948C18.8024 15.3664 18.7799 15.3326 18.7646 15.2954C18.7493 15.2582 18.7415 15.2183 18.7418 15.1781ZM10.9999 1.54836C11.6037 1.54836 12.0953 2.03998 12.0953 2.64382C12.0953 2.69411 12.0876 2.74059 12.0798 2.79088C11.8166 2.75216 11.5495 2.72508 11.2824 2.71732C10.8217 2.7018 10.3688 2.73283 9.91978 2.79476C9.91202 2.74447 9.90427 2.69799 9.90427 2.6477C9.9044 2.03998 10.396 1.54836 10.9999 1.54836ZM10.9999 22.4516C10.067 22.4516 9.28504 21.7857 9.10307 20.9032H12.8966C12.7147 21.7858 11.9328 22.4516 10.9999 22.4516ZM20.2863 18.0774C20.3173 18.4103 20.2128 18.7316 19.9921 18.9755C19.7637 19.2194 19.4618 19.3548 19.1289 19.3548H2.87085C2.53793 19.3548 2.23604 19.2193 2.01147 18.9755C1.78696 18.7316 1.68243 18.4103 1.71339 18.0774C1.76756 17.4929 2.31342 17.0323 2.95211 17.0323C3.97407 17.0323 4.80629 16.2 4.80629 15.1781V10.4516C4.80629 8.75612 5.47982 7.17292 6.69921 5.99614C7.86435 4.86971 9.38181 4.25805 10.9999 4.25805C11.0773 4.25805 11.1508 4.25805 11.2282 4.26193C14.5147 4.37803 17.1934 7.23097 17.1934 10.6181V15.1781C17.1934 16.2 18.0256 17.0323 19.0476 17.0323C19.6863 17.0323 20.2283 17.4929 20.2863 18.0774Z" fill="#555555" />
                </svg>
                Notification
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1288)">
                          <path d="M19.825 8.22499L15.3583 12.8L16.4083 19.275C16.5008 19.7917 15.94 20.17 15.4917 19.925L10 16.8833V0.0249939C10.2333 0.0249939 10.4667 0.133327 10.5667 0.358327L13.325 6.23333L19.4667 7.16666C19.98 7.25833 20.1692 7.86249 19.825 8.22499Z" fill="#E0E0E0" />
                          <path d="M9.9999 0.0249939V16.8833L4.50823 19.925C4.0674 20.1725 3.49823 19.7975 3.59157 19.275L4.64157 12.8L0.174902 8.22499C0.0955067 8.14169 0.0404136 8.03825 0.0155868 7.92587C-0.0092399 7.8135 -0.00285426 7.69648 0.0340524 7.58748C0.0709591 7.47847 0.136981 7.38164 0.224969 7.30747C0.312957 7.23329 0.41956 7.1846 0.533235 7.16666L6.6749 6.23333L9.43324 0.358327C9.53323 0.133327 9.76657 0.0249939 9.9999 0.0249939Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1288">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Most active
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M17 0.5V2H18.9395L11 9.9395L8 6.9395L0.71975 14.2197L1.78025 15.2803L8 9.0605L11 12.0605L20 3.0605V5H21.5V0.5H17ZM1.6895 16.25L0.5 17.4395V21.5H6.5V17.4395L5.3105 16.25H1.6895ZM5 20H2V18.0605L2.3105 17.75H4.6895L5 18.0605V20ZM9.1895 13.25L8 14.4395V21.5H14V14.4395L12.8105 13.25H9.1895ZM12.5 20H9.5V15.0605L9.8105 14.75H12.1895L12.5 15.0605V20ZM16.6895 8.75L15.5 9.9395V21.5H21.5V9.9395L20.3105 8.75H16.6895ZM20 20H17V10.5605L17.3105 10.25H19.6895L20 10.5605V20Z" fill="#555555" />
                </svg>
                Charts
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1288)">
                          <path d="M19.825 8.22499L15.3583 12.8L16.4083 19.275C16.5008 19.7917 15.94 20.17 15.4917 19.925L10 16.8833V0.0249939C10.2333 0.0249939 10.4667 0.133327 10.5667 0.358327L13.325 6.23333L19.4667 7.16666C19.98 7.25833 20.1692 7.86249 19.825 8.22499Z" fill="#E0E0E0" />
                          <path d="M9.9999 0.0249939V16.8833L4.50823 19.925C4.0674 20.1725 3.49823 19.7975 3.59157 19.275L4.64157 12.8L0.174902 8.22499C0.0955067 8.14169 0.0404136 8.03825 0.0155868 7.92587C-0.0092399 7.8135 -0.00285426 7.69648 0.0340524 7.58748C0.0709591 7.47847 0.136981 7.38164 0.224969 7.30747C0.312957 7.23329 0.41956 7.1846 0.533235 7.16666L6.6749 6.23333L9.43324 0.358327C9.53323 0.133327 9.76657 0.0249939 9.9999 0.0249939Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1288">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Most active
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" viewBox="0 0 24 21" fill="none">
                  <path d="M22.5595 2.59366H14.3058C14.3004 2.59376 14.2951 2.59234 14.2904 2.58955C14.2858 2.58677 14.2821 2.58273 14.2796 2.57791L13.4284 0.851227C13.1882 0.362508 12.681 0.0468521 12.1361 0.0468521H7.14637C6.35208 0.0468521 5.70591 0.693258 5.70591 1.4877V2.90004H4.29309C3.49898 2.90004 2.85277 3.54616 2.85277 4.34051V5.7528H1.44047C0.646172 5.7528 0 6.39898 0 7.19327V18.8498C0 19.6441 0.646172 20.2902 1.44047 20.2902H16.8538C17.6481 20.2902 18.2942 19.6441 18.2942 18.8498V17.4373H19.7067C20.501 17.4373 21.1472 16.7911 21.1472 15.997V14.5847H22.5595C23.3538 14.5847 24 13.9385 24 13.1442V4.03451C24 3.24002 23.3538 2.59366 22.5595 2.59366ZM16.8538 18.8785H1.44047C1.43285 18.8785 1.42555 18.8755 1.42016 18.8701C1.41478 18.8647 1.41175 18.8574 1.41173 18.8498V7.19327C1.41173 7.17734 1.42477 7.16454 1.44047 7.16454H6.4305C6.43523 7.16454 6.43983 7.16618 6.44386 7.16838C6.44437 7.16876 6.44512 7.16857 6.44569 7.16895C6.44733 7.17002 6.44827 7.17204 6.44972 7.17331C6.45206 7.1757 6.45487 7.17771 6.45628 7.18066L7.30791 8.90787C7.55236 9.40334 8.0475 9.7113 8.59992 9.7113H16.8538C16.8614 9.71137 16.8686 9.71442 16.874 9.7198C16.8793 9.72518 16.8823 9.73245 16.8824 9.74004C16.8824 14.7184 16.8825 18.8043 16.8825 18.8497C16.8825 18.8657 16.8697 18.8785 16.8538 18.8785ZM19.7355 15.997C19.7354 16.0046 19.7324 16.0118 19.7271 16.0172C19.7217 16.0225 19.7145 16.0255 19.7069 16.0256H18.2942V9.74009C18.2942 8.94555 17.6479 8.29943 16.8536 8.29943H8.59992C8.59458 8.29936 8.58936 8.29782 8.58484 8.29497C8.58031 8.29213 8.57666 8.28809 8.57428 8.2833L7.72247 6.55606C7.47825 6.06115 6.98325 5.7528 6.43069 5.7528H4.26455V4.34046C4.26455 4.32452 4.27734 4.31173 4.29309 4.31173H9.28327C9.29423 4.31173 9.30412 4.31782 9.30905 4.32804L10.1609 6.05529C10.4055 6.55076 10.9005 6.85854 11.4527 6.85854H19.7069C19.7227 6.85854 19.7355 6.87138 19.7355 6.88732L19.7355 15.997ZM22.5883 13.1442C22.5883 13.1601 22.5754 13.1729 22.5595 13.1729H21.1472V6.88732C21.1472 6.09298 20.5012 5.44685 19.7069 5.44685H11.4527C11.4473 5.44677 11.442 5.44521 11.4375 5.44233C11.4329 5.43945 11.4293 5.43537 11.4269 5.43054L10.5752 3.70385C10.3312 3.20801 9.83602 2.89999 9.28327 2.89999H7.11764V1.4877C7.11764 1.47162 7.13048 1.45863 7.14623 1.45863H12.1358C12.1466 1.45863 12.1568 1.46463 12.1617 1.47471L13.0135 3.20252C13.2579 3.69762 13.753 4.0054 14.3058 4.0054H22.5595C22.5752 4.0054 22.5881 4.01843 22.5881 4.0347V13.1442H22.5883Z" fill="#555555" />
                  <path d="M12.5438 15.8093C12.1539 15.8093 11.8379 16.1254 11.8379 16.5152V16.9233C11.8379 17.3132 12.1539 17.6292 12.5438 17.6292C12.9336 17.6292 13.2496 17.3132 13.2496 16.9233V16.5152C13.2496 16.1254 12.9336 15.8093 12.5438 15.8093ZM14.6008 15.8093C14.2109 15.8093 13.8949 16.1254 13.8949 16.5152V16.9233C13.8949 17.3132 14.2109 17.6292 14.6008 17.6292C14.9906 17.6292 15.3066 17.3132 15.3066 16.9233V16.5152C15.3066 16.1254 14.9906 15.8093 14.6008 15.8093Z" fill="#555555" />
                </svg>
                Folder
                <i className="ri-arrow-right-s-fill"></i>
              </a>
              <div className="submenu">
                <ul>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                      </svg>
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                        <g clipPath="url(#clip0_72_1270)">
                          <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                            <path d="M20 0H0V20H20V0Z" fill="black" />
                          </mask>
                          <g mask="url(#mask0_72_1270)">
                            <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                              <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                            </mask>
                            <g mask="url(#mask1_72_1270)">
                              <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </g>
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1270">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      All reports
                    </a>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1288)">
                          <path d="M19.825 8.22499L15.3583 12.8L16.4083 19.275C16.5008 19.7917 15.94 20.17 15.4917 19.925L10 16.8833V0.0249939C10.2333 0.0249939 10.4667 0.133327 10.5667 0.358327L13.325 6.23333L19.4667 7.16666C19.98 7.25833 20.1692 7.86249 19.825 8.22499Z" fill="#E0E0E0" />
                          <path d="M9.9999 0.0249939V16.8833L4.50823 19.925C4.0674 20.1725 3.49823 19.7975 3.59157 19.275L4.64157 12.8L0.174902 8.22499C0.0955067 8.14169 0.0404136 8.03825 0.0155868 7.92587C-0.0092399 7.8135 -0.00285426 7.69648 0.0340524 7.58748C0.0709591 7.47847 0.136981 7.38164 0.224969 7.30747C0.312957 7.23329 0.41956 7.1846 0.533235 7.16666L6.6749 6.23333L9.43324 0.358327C9.53323 0.133327 9.76657 0.0249939 9.9999 0.0249939Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1288">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Most active
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <g clipPath="url(#clip0_72_1296)">
                          <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                          <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                          <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                        </g>
                        <defs>
                          <clipPath id="clip0_72_1296">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      Scheduled
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                  <li>
                    <a href="javascript:void(0);">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                      </svg>
                      Preferences
                      <i className="ri-arrow-right-s-fill"></i>
                    </a>
                    <div className="submenu">
                      <ul>
                        <li><a href="">Create Project</a></li>
                        <li><a href="">Templates</a></li>
                        <li><a href="">Integrations</a></li>
                        <li><a href="">Notification</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <g clipPath="url(#clip0_151_388)">
                    <path d="M23.0564 15.0494L21.3019 13.5494C21.3849 13.0405 21.4278 12.5209 21.4278 12.0012C21.4278 11.4816 21.3849 10.9619 21.3019 10.453L23.0564 8.953C23.1887 8.83972 23.2834 8.68883 23.3279 8.52041C23.3724 8.35199 23.3646 8.17401 23.3055 8.01015L23.2814 7.9405C22.7984 6.59057 22.0751 5.33917 21.1465 4.24675L21.0983 4.1905C20.9857 4.05805 20.8356 3.96284 20.6677 3.91742C20.4999 3.87199 20.3222 3.87848 20.1582 3.93604L17.9805 4.71015C17.1769 4.05122 16.2796 3.53157 15.3099 3.16729L14.8894 0.890503C14.8577 0.719187 14.7746 0.561581 14.6511 0.438622C14.5277 0.315663 14.3698 0.233173 14.1983 0.20211L14.126 0.188717C12.7305 -0.0630685 11.2626 -0.0630685 9.86708 0.188717L9.79476 0.20211C9.62332 0.233173 9.46539 0.315663 9.34196 0.438622C9.21852 0.561581 9.13542 0.719187 9.10369 0.890503L8.68048 3.178C7.71857 3.54236 6.8228 4.06173 6.02869 4.7155L3.83494 3.93604C3.67092 3.87803 3.49313 3.8713 3.32519 3.91675C3.15726 3.9622 3.00713 4.05768 2.89476 4.1905L2.84655 4.24675C1.91908 5.33994 1.19595 6.59114 0.711724 7.9405L0.687617 8.01015C0.567081 8.34497 0.666188 8.71997 0.936724 8.953L2.71262 10.4691C2.62958 10.9726 2.5894 11.4869 2.5894 11.9985C2.5894 12.5128 2.62958 13.0271 2.71262 13.528L0.936724 15.0441C0.804391 15.1574 0.709679 15.3082 0.665181 15.4767C0.620684 15.6451 0.628509 15.8231 0.687617 15.9869L0.711724 16.0566C1.19655 17.4066 1.9144 18.6521 2.84655 19.7503L2.89476 19.8066C3.00741 19.939 3.15754 20.0342 3.32537 20.0797C3.49321 20.1251 3.67087 20.1186 3.83494 20.061L6.02869 19.2816C6.8269 19.9378 7.71887 20.4575 8.68048 20.8191L9.10369 23.1066C9.13542 23.2779 9.21852 23.4355 9.34196 23.5585C9.46539 23.6814 9.62332 23.7639 9.79476 23.795L9.86708 23.8084C11.2754 24.0615 12.7177 24.0615 14.126 23.8084L14.1983 23.795C14.3698 23.7639 14.5277 23.6814 14.6511 23.5585C14.7746 23.4355 14.8577 23.2779 14.8894 23.1066L15.3099 20.8298C16.2792 20.4665 17.1816 19.9451 17.9805 19.2869L20.1582 20.061C20.3222 20.1191 20.5 20.1258 20.6679 20.0803C20.8358 20.0349 20.986 19.9394 21.0983 19.8066L21.1465 19.7503C22.0787 18.6494 22.7965 17.4066 23.2814 16.0566L23.3055 15.9869C23.426 15.6575 23.3269 15.2825 23.0564 15.0494ZM19.4001 10.7691C19.4671 11.1735 19.5019 11.5887 19.5019 12.0039C19.5019 12.4191 19.4671 12.8343 19.4001 13.2387L19.2233 14.3128L21.2242 16.0244C20.9209 16.7232 20.538 17.3848 20.0832 17.9959L17.5974 17.1146L16.7564 17.8057C16.1162 18.3307 15.4037 18.7432 14.6323 19.0325L13.6117 19.4155L13.1323 22.0137C12.3758 22.0994 11.612 22.0994 10.8555 22.0137L10.376 19.4101L9.36351 19.0218C8.60012 18.7325 7.8903 18.32 7.25547 17.7976L6.4144 17.1039L3.91262 17.9932C3.45726 17.3798 3.0769 16.7182 2.77155 16.0218L4.79387 14.2941L4.61976 13.2226C4.55547 12.8235 4.52065 12.411 4.52065 12.0039C4.52065 11.5941 4.5528 11.1843 4.61976 10.7851L4.79387 9.71372L2.77155 7.98604C3.07422 7.28693 3.45726 6.628 3.91262 6.01461L6.4144 6.9039L7.25547 6.21015C7.8903 5.68782 8.60012 5.27532 9.36351 4.98604L10.3787 4.603L10.8582 1.99943C11.6108 1.91372 12.3796 1.91372 13.1349 1.99943L13.6144 4.59765L14.6349 4.98068C15.4037 5.26997 16.1189 5.68247 16.759 6.20747L17.6001 6.89854L20.0858 6.01729C20.5412 6.63068 20.9215 7.29229 21.2269 7.98872L19.226 9.70032L19.4001 10.7691ZM11.9992 7.02175C9.39565 7.02175 7.28494 9.13247 7.28494 11.736C7.28494 14.3396 9.39565 16.4503 11.9992 16.4503C14.6028 16.4503 16.7135 14.3396 16.7135 11.736C16.7135 9.13247 14.6028 7.02175 11.9992 7.02175ZM14.1207 13.8575C13.8424 14.1365 13.5117 14.3578 13.1477 14.5086C12.7836 14.6593 12.3933 14.7367 11.9992 14.736C11.1983 14.736 10.4457 14.4226 9.8778 13.8575C9.59875 13.5792 9.37748 13.2486 9.2267 12.8845C9.07592 12.5204 8.99861 12.1301 8.99922 11.736C8.99922 10.9351 9.31262 10.1825 9.8778 9.61461C10.4457 9.04675 11.1983 8.73604 11.9992 8.73604C12.8001 8.73604 13.5528 9.04675 14.1207 9.61461C14.3997 9.89285 14.621 10.2235 14.7718 10.5876C14.9225 10.9517 14.9998 11.342 14.9992 11.736C14.9992 12.5369 14.6858 13.2896 14.1207 13.8575Z" fill="#555555" />
                  </g>
                  <defs>
                    <clipPath id="clip0_151_388">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                Setting
              </a>
            </li>
            <li className="mobile-menu-li">
              <a href="javascript:void(0);">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14.945 1.25C13.578 1.25 12.475 1.25 11.608 1.367C10.708 1.487 9.94996 1.747 9.34796 2.348C8.82396 2.873 8.55796 3.518 8.41896 4.276C8.28396 5.013 8.25796 5.914 8.25196 6.996C8.2509 7.19491 8.3289 7.3861 8.46881 7.5275C8.60871 7.6689 8.79905 7.74894 8.99796 7.75C9.19688 7.75106 9.38806 7.67306 9.52947 7.53316C9.67087 7.39326 9.7509 7.20291 9.75196 7.004C9.75796 5.911 9.78596 5.136 9.89396 4.547C9.99896 3.981 10.166 3.652 10.409 3.409C10.686 3.132 11.075 2.952 11.809 2.853C12.564 2.752 13.565 2.75 15 2.75H16C17.436 2.75 18.437 2.752 19.192 2.853C19.926 2.952 20.314 3.133 20.592 3.409C20.87 3.685 21.048 4.074 21.147 4.809C21.249 5.563 21.25 6.565 21.25 8V16C21.25 17.435 21.249 18.437 21.147 19.192C21.048 19.926 20.868 20.314 20.591 20.591C20.314 20.868 19.926 21.048 19.192 21.147C18.437 21.248 17.436 21.25 16 21.25H15C13.565 21.25 12.564 21.248 11.808 21.147C11.075 21.048 10.686 20.867 10.409 20.591C10.166 20.348 9.99896 20.019 9.89396 19.453C9.78596 18.864 9.75796 18.089 9.75196 16.996C9.75144 16.8975 9.73152 16.8001 9.69334 16.7093C9.65517 16.6185 9.59948 16.5361 9.52947 16.4668C9.45945 16.3976 9.37648 16.3428 9.28528 16.3056C9.19409 16.2684 9.09646 16.2495 8.99796 16.25C8.89947 16.2505 8.80205 16.2704 8.71126 16.3086C8.62046 16.3468 8.53808 16.4025 8.46881 16.4725C8.39953 16.5425 8.34473 16.6255 8.30752 16.7167C8.27032 16.8079 8.25144 16.9055 8.25196 17.004C8.25796 18.086 8.28396 18.987 8.41896 19.724C8.55896 20.482 8.82396 21.127 9.34896 21.652C9.94996 22.254 10.709 22.512 11.609 22.634C12.475 22.75 13.578 22.75 14.945 22.75H16.055C17.423 22.75 18.525 22.75 19.392 22.633C20.292 22.513 21.05 22.253 21.652 21.652C22.254 21.05 22.512 20.292 22.634 19.392C22.75 18.525 22.75 17.422 22.75 16.055V7.945C22.75 6.578 22.75 5.475 22.634 4.608C22.513 3.708 22.254 2.95 21.652 2.348C21.05 1.746 20.292 1.488 19.392 1.367C18.525 1.25 17.422 1.25 16.055 1.25H14.945Z" fill="#555555" />
                  <path d="M15.0006 11.25C15.1995 11.25 15.3902 11.329 15.5309 11.4697C15.6715 11.6103 15.7506 11.8011 15.7506 12C15.7506 12.1989 15.6715 12.3897 15.5309 12.5303C15.3902 12.671 15.1995 12.75 15.0006 12.75H4.02756L5.98856 14.43C6.13973 14.5594 6.2333 14.7436 6.24868 14.942C6.26405 15.1404 6.19998 15.3368 6.07056 15.488C5.94113 15.6392 5.75695 15.7327 5.55854 15.7481C5.36013 15.7635 5.16373 15.6994 5.01256 15.57L1.51256 12.57C1.43022 12.4996 1.36412 12.4122 1.31879 12.3138C1.27347 12.2154 1.25 12.1083 1.25 12C1.25 11.8917 1.27347 11.7846 1.31879 11.6862C1.36412 11.5878 1.43022 11.5004 1.51256 11.43L5.01256 8.43C5.08741 8.36591 5.17415 8.3172 5.26783 8.28664C5.36151 8.25607 5.4603 8.24426 5.55854 8.25188C5.65679 8.25949 5.75257 8.28638 5.84042 8.33101C5.92827 8.37565 6.00647 8.43714 6.07056 8.512C6.13464 8.58685 6.18336 8.67359 6.21392 8.76727C6.24448 8.86095 6.25629 8.95973 6.24868 9.05798C6.24106 9.15622 6.21417 9.25201 6.16954 9.33986C6.12491 9.42771 6.06341 9.50591 5.98856 9.57L4.02856 11.25H15.0006Z" fill="#555555" />
                </svg>
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>


      <div className="col-lg-1 nav-col header-custom-col d-none d-lg-block">
        {/* <!-- left nav panel --> */}
        <div className="left-nav">
          {/* <div className="arrow"><i className="ri-arrow-left-s-line"></i></div> */}
          <div className={`arrow ${isArrowRight ? 'right' : ''}`} onClick={handleArrowClick}>
            <i className="ri-arrow-left-s-line"></i>
          </div>
          <div className="top">
            <Link to="" className="brand">
              <img src={require('../../Component/App_Details_theme/images/t-logo.png')} alt="Logo" className="t-logo" />
            </Link>
            <div className="line"></div>
            <div className="menu">

              <ul className="w-100 d-flex flex-column align-items-center">
                {accessFiledAdd?.map((row, i) => {
                  const IconComponent = AntIcons[row?.iconName];
                  return (
                    row?.type?.map((element, j) => {
                      const shouldRenderButton = data_Name_type === element?.roleType;
                      return shouldRenderButton ? (
                        <li key={j}>
                          <NavLink
                            to={row?.routerPath}
                            onClick={() => handleIconClick(row)}
                            className={`${allMenuName === row?.menuName ? 'active' : ''}`}
                          >
                            <span className='icon' style={{ fontSize: '20px' }}>
                              <Tooltip title={row?.menuName} placement="right">
                                {IconComponent && <IconComponent />}
                              </Tooltip>
                            </span>
                          </NavLink>
                        </li>
                      ) : null;
                    })
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="bottom">
            <ul>
              <li>
                <a href="">
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <g clipPath="url(#clip0_83_371)">
                        <path d="M23.0564 15.0494L21.3019 13.5494C21.3849 13.0405 21.4278 12.5209 21.4278 12.0012C21.4278 11.4816 21.3849 10.9619 21.3019 10.453L23.0564 8.953C23.1887 8.83972 23.2834 8.68883 23.3279 8.52041C23.3724 8.35199 23.3646 8.17401 23.3055 8.01015L23.2814 7.9405C22.7984 6.59057 22.0751 5.33917 21.1465 4.24675L21.0983 4.1905C20.9857 4.05805 20.8356 3.96284 20.6677 3.91742C20.4999 3.87199 20.3222 3.87848 20.1582 3.93604L17.9805 4.71015C17.1769 4.05122 16.2796 3.53157 15.3099 3.16729L14.8894 0.890503C14.8577 0.719187 14.7746 0.561581 14.6511 0.438622C14.5277 0.315663 14.3698 0.233173 14.1983 0.20211L14.126 0.188717C12.7305 -0.0630685 11.2626 -0.0630685 9.86708 0.188717L9.79476 0.20211C9.62332 0.233173 9.46539 0.315663 9.34196 0.438622C9.21852 0.561581 9.13542 0.719187 9.10369 0.890503L8.68048 3.178C7.71857 3.54236 6.8228 4.06173 6.02869 4.7155L3.83494 3.93604C3.67092 3.87803 3.49313 3.8713 3.32519 3.91675C3.15726 3.9622 3.00713 4.05768 2.89476 4.1905L2.84655 4.24675C1.91908 5.33994 1.19595 6.59114 0.711724 7.9405L0.687617 8.01015C0.567081 8.34497 0.666188 8.71997 0.936724 8.953L2.71262 10.4691C2.62958 10.9726 2.5894 11.4869 2.5894 11.9985C2.5894 12.5128 2.62958 13.0271 2.71262 13.528L0.936724 15.0441C0.804391 15.1574 0.709679 15.3082 0.665181 15.4767C0.620684 15.6451 0.628509 15.8231 0.687617 15.9869L0.711724 16.0566C1.19655 17.4066 1.9144 18.6521 2.84655 19.7503L2.89476 19.8066C3.00741 19.939 3.15754 20.0342 3.32537 20.0797C3.49321 20.1251 3.67087 20.1186 3.83494 20.061L6.02869 19.2816C6.8269 19.9378 7.71887 20.4575 8.68048 20.8191L9.10369 23.1066C9.13542 23.2779 9.21852 23.4355 9.34196 23.5585C9.46539 23.6814 9.62332 23.7639 9.79476 23.795L9.86708 23.8084C11.2754 24.0615 12.7177 24.0615 14.126 23.8084L14.1983 23.795C14.3698 23.7639 14.5277 23.6814 14.6511 23.5585C14.7746 23.4355 14.8577 23.2779 14.8894 23.1066L15.3099 20.8298C16.2792 20.4665 17.1816 19.9451 17.9805 19.2869L20.1582 20.061C20.3222 20.1191 20.5 20.1258 20.6679 20.0803C20.8358 20.0349 20.986 19.9394 21.0983 19.8066L21.1465 19.7503C22.0787 18.6494 22.7965 17.4066 23.2814 16.0566L23.3055 15.9869C23.426 15.6575 23.3269 15.2825 23.0564 15.0494ZM19.4001 10.7691C19.4671 11.1735 19.5019 11.5887 19.5019 12.0039C19.5019 12.4191 19.4671 12.8343 19.4001 13.2387L19.2233 14.3128L21.2242 16.0244C20.9209 16.7232 20.538 17.3848 20.0832 17.9959L17.5974 17.1146L16.7564 17.8057C16.1162 18.3307 15.4037 18.7432 14.6323 19.0325L13.6117 19.4155L13.1323 22.0137C12.3758 22.0994 11.612 22.0994 10.8555 22.0137L10.376 19.4101L9.36351 19.0218C8.60012 18.7325 7.8903 18.32 7.25547 17.7976L6.4144 17.1039L3.91262 17.9932C3.45726 17.3798 3.0769 16.7182 2.77155 16.0218L4.79387 14.2941L4.61976 13.2226C4.55547 12.8235 4.52065 12.411 4.52065 12.0039C4.52065 11.5941 4.5528 11.1843 4.61976 10.7851L4.79387 9.71372L2.77155 7.98604C3.07422 7.28693 3.45726 6.628 3.91262 6.01461L6.4144 6.9039L7.25547 6.21015C7.8903 5.68782 8.60012 5.27532 9.36351 4.98604L10.3787 4.603L10.8582 1.99943C11.6108 1.91372 12.3796 1.91372 13.1349 1.99943L13.6144 4.59765L14.6349 4.98068C15.4037 5.26997 16.1189 5.68247 16.759 6.20747L17.6001 6.89854L20.0858 6.01729C20.5412 6.63068 20.9215 7.29229 21.2269 7.98872L19.226 9.70032L19.4001 10.7691ZM11.9992 7.02175C9.39565 7.02175 7.28494 9.13247 7.28494 11.736C7.28494 14.3396 9.39565 16.4503 11.9992 16.4503C14.6028 16.4503 16.7135 14.3396 16.7135 11.736C16.7135 9.13247 14.6028 7.02175 11.9992 7.02175ZM14.1207 13.8575C13.8424 14.1365 13.5117 14.3578 13.1477 14.5086C12.7836 14.6593 12.3933 14.7367 11.9992 14.736C11.1983 14.736 10.4457 14.4226 9.8778 13.8575C9.59875 13.5792 9.37748 13.2486 9.2267 12.8845C9.07592 12.5204 8.99861 12.1301 8.99922 11.736C8.99922 10.9351 9.31262 10.1825 9.8778 9.61461C10.4457 9.04675 11.1983 8.73604 11.9992 8.73604C12.8001 8.73604 13.5528 9.04675 14.1207 9.61461C14.3997 9.89285 14.621 10.2235 14.7718 10.5876C14.9225 10.9517 14.9998 11.342 14.9992 11.736C14.9992 12.5369 14.6858 13.2896 14.1207 13.8575Z" fill="#555555" />
                      </g>
                      <defs>
                        <clipPath id="clip0_83_371">
                          <rect width="24" height="24" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <a href="">
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14.945 1.25C13.578 1.25 12.475 1.25 11.608 1.367C10.708 1.487 9.94996 1.747 9.34796 2.348C8.82396 2.873 8.55796 3.518 8.41896 4.276C8.28396 5.013 8.25796 5.914 8.25196 6.996C8.2509 7.19491 8.3289 7.3861 8.46881 7.5275C8.60871 7.6689 8.79905 7.74894 8.99796 7.75C9.19688 7.75106 9.38806 7.67306 9.52947 7.53316C9.67087 7.39326 9.7509 7.20291 9.75196 7.004C9.75796 5.911 9.78596 5.136 9.89396 4.547C9.99896 3.981 10.166 3.652 10.409 3.409C10.686 3.132 11.075 2.952 11.809 2.853C12.564 2.752 13.565 2.75 15 2.75H16C17.436 2.75 18.437 2.752 19.192 2.853C19.926 2.952 20.314 3.133 20.592 3.409C20.87 3.685 21.048 4.074 21.147 4.809C21.249 5.563 21.25 6.565 21.25 8V16C21.25 17.435 21.249 18.437 21.147 19.192C21.048 19.926 20.868 20.314 20.591 20.591C20.314 20.868 19.926 21.048 19.192 21.147C18.437 21.248 17.436 21.25 16 21.25H15C13.565 21.25 12.564 21.248 11.808 21.147C11.075 21.048 10.686 20.867 10.409 20.591C10.166 20.348 9.99896 20.019 9.89396 19.453C9.78596 18.864 9.75796 18.089 9.75196 16.996C9.75144 16.8975 9.73152 16.8001 9.69334 16.7093C9.65517 16.6185 9.59948 16.5361 9.52947 16.4668C9.45945 16.3976 9.37648 16.3428 9.28528 16.3056C9.19409 16.2684 9.09646 16.2495 8.99796 16.25C8.89947 16.2505 8.80205 16.2704 8.71126 16.3086C8.62046 16.3468 8.53808 16.4025 8.46881 16.4725C8.39953 16.5425 8.34473 16.6255 8.30752 16.7167C8.27032 16.8079 8.25144 16.9055 8.25196 17.004C8.25796 18.086 8.28396 18.987 8.41896 19.724C8.55896 20.482 8.82396 21.127 9.34896 21.652C9.94996 22.254 10.709 22.512 11.609 22.634C12.475 22.75 13.578 22.75 14.945 22.75H16.055C17.423 22.75 18.525 22.75 19.392 22.633C20.292 22.513 21.05 22.253 21.652 21.652C22.254 21.05 22.512 20.292 22.634 19.392C22.75 18.525 22.75 17.422 22.75 16.055V7.945C22.75 6.578 22.75 5.475 22.634 4.608C22.513 3.708 22.254 2.95 21.652 2.348C21.05 1.746 20.292 1.488 19.392 1.367C18.525 1.25 17.422 1.25 16.055 1.25H14.945Z" fill="#555555" />
                      <path d="M15.0006 11.25C15.1995 11.25 15.3902 11.329 15.5309 11.4697C15.6715 11.6103 15.7506 11.8011 15.7506 12C15.7506 12.1989 15.6715 12.3897 15.5309 12.5303C15.3902 12.671 15.1995 12.75 15.0006 12.75H4.02756L5.98856 14.43C6.13973 14.5594 6.2333 14.7436 6.24868 14.942C6.26405 15.1404 6.19998 15.3368 6.07056 15.488C5.94113 15.6392 5.75695 15.7327 5.55854 15.7481C5.36013 15.7635 5.16373 15.6994 5.01256 15.57L1.51256 12.57C1.43022 12.4996 1.36412 12.4122 1.31879 12.3138C1.27347 12.2154 1.25 12.1083 1.25 12C1.25 11.8917 1.27347 11.7846 1.31879 11.6862C1.36412 11.5878 1.43022 11.5004 1.51256 11.43L5.01256 8.43C5.08741 8.36591 5.17415 8.3172 5.26783 8.28664C5.36151 8.25607 5.4603 8.24426 5.55854 8.25188C5.65679 8.25949 5.75257 8.28638 5.84042 8.33101C5.92827 8.37565 6.00647 8.43714 6.07056 8.512C6.13464 8.58685 6.18336 8.67359 6.21392 8.76727C6.24448 8.86095 6.25629 8.95973 6.24868 9.05798C6.24106 9.15622 6.21417 9.25201 6.16954 9.33986C6.12491 9.42771 6.06341 9.50591 5.98856 9.57L4.02856 11.25H15.0006Z" fill="#555555" />
                    </svg>
                  </span>
                </a>
              </li>
              <li>
                <p>V-1.01</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* <!-- detailed-menu --> */}
      <div class="col-lg-2 detailed-menu-col header-custom-col d-none d-lg-block">
        <div class="detailed-menu">
          {<div class="normal-menu">
            <h3>Dashboard</h3>
            <ul>
              {/* <li className="detailed-menu-main-li">
                <Link to="" clLinkssName="detailed-menu-main-a">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M20 9.99543C20 12.1893 19.3018 14.2718 17.9808 16.0182C17.7202 16.3629 17.23 16.4298 16.8864 16.1699C16.5423 15.9096 16.4745 15.4196 16.7346 15.0755C17.8487 13.6029 18.4375 11.8462 18.4375 9.99543C18.4375 5.33203 14.6608 1.5625 10 1.5625C5.33602 1.5625 1.5625 5.33492 1.5625 9.99543C1.5625 11.8462 2.15133 13.6029 3.26523 15.0755C3.52555 15.4196 3.45766 15.9096 3.11355 16.1699C2.76934 16.4302 2.27949 16.3623 2.01902 16.0182C0.698242 14.2719 0 12.1893 0 9.99543C0 4.46809 4.4757 0 10 0C15.5273 0 20 4.47109 20 9.99543ZM14.9501 5.29035C15.2551 5.59543 15.2551 6.09008 14.9501 6.39512L12.4036 8.94164C12.6199 9.34027 12.733 9.78674 12.7325 10.2403C12.7325 11.7471 11.5066 12.9729 10 12.9729C8.4932 12.9729 7.26746 11.7471 7.26746 10.2403C7.26746 8.73367 8.4932 7.50777 10 7.50777C10.4536 7.50726 10.9 7.62037 11.2987 7.83676L13.8452 5.29023C14.1504 4.9852 14.6449 4.9852 14.9501 5.29039V5.29035ZM11.17 10.2405C11.17 9.59535 10.6452 9.07043 10 9.07043C9.35484 9.07043 8.82996 9.59535 8.82996 10.2405C8.82996 10.8856 9.35484 11.4105 10 11.4105C10.6452 11.4105 11.17 10.8857 11.17 10.2405V10.2405Z" fill="#555555" />
                  </svg>
                  Overview
                </Link>
              </li>
              <li className="detailed-menu-main-li">
                <Link href="" className="detailed-menu-main-a">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" className="reports">
                    <g clipPath="url(#clip0_72_1270)">
                      <mask id="mask0_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                        <path d="M20 0H0V20H20V0Z" fill="black" />
                      </mask>
                      <g mask="url(#mask0_72_1270)">
                        <path d="M8.79048 12.772H11.1342V6.52206H8.79048V12.772ZM8.79048 12.772V9.64701H6.44678V12.772L8.79048 12.772ZM11.1342 8.08452H13.4779V12.772H11.1342V8.08452Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <mask id="mask1_72_1270" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                          <path d="M0 5.91278e-05H19.9999V20H0V5.91278e-05Z" fill="white" />
                        </mask>
                        <g mask="url(#mask1_72_1270)">
                          <path d="M8.78545 2.96977C5.81432 3.46863 3.46859 5.81437 2.96972 8.78549H0.585938C1.11765 4.50695 4.5069 1.1177 8.78545 0.585985V2.96977Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M2.96972 11.139C3.53304 14.4938 6.44983 17.0606 9.9622 17.0606C11.4951 17.0606 12.9122 16.5672 14.0737 15.7378L15.7601 17.4241C14.1589 18.67 12.1481 19.4141 9.9622 19.4141C5.14088 19.4141 1.16558 15.8033 0.585938 11.139H2.96972Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M17.4241 15.7602L15.7377 14.0738C16.5671 12.9122 17.0606 11.4951 17.0606 9.96225C17.0606 6.44988 14.4937 3.53309 11.1389 2.96977V0.58599C15.8033 1.16568 19.414 5.14094 19.414 9.96225C19.414 12.1481 18.67 14.159 17.4241 15.7602Z" stroke="#555555" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </g>
                    </g>
                    <defs>
                      <clipPath id="clip0_72_1270">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  All reports
                </Link>
              </li> */}

              {/* {selectedMenuItem?.mainMenu?.map((rowData, i) => {
                  console.log(rowData?.menuName, "rowDatarowData");
                  const isSelected = rowData.menuName;
                  console.log(isSelected, "isSelectedisSelected");
                  const IconComponent12 = AntIcons[rowData?.iconName];
                  return rowData?.type?.map((rowTypeAll, j) => {
                    const shouldRenderButton3 = data_Name_type === rowTypeAll?.roleType;
                    if (shouldRenderButton3) {
                      return (
                        <li className="detailed-menu-main-li" key={j}>
                          <NavLink
                            to={rowData?.routerPath}
                            // className="detailed-menu-main-a open-arrow"
                            className={`detailed-menu-main-a ${isSelected[0] ? 'open-arrow' : ''}`}
                            key={i}
                            onClick={(rowData) => {
                              handleDoubleClick(rowData);
                            }}
                          >
                            <span style={{ fontSize: '20px' }}>
                              {IconComponent12 && <IconComponent12 />}
                            </span>
                            {rowData?.menuName}
                            {rowData?.subMenu?.length > 0
                              ? rowData?.subMenu?.map((element, k) => {
                                return element?.type?.map((rowType) => {
                                  const shouldRenderButton2 = data_Name_type === rowType?.roleType;
                                  if (shouldRenderButton2) {
                                    return <i className="ri-arrow-right-s-fill"></i>;
                                  }
                                  return null;
                                });
                              })
                              : ''}
                          </NavLink>
                          {rowData?.subMenu?.length > 0 ? (
                            <div className="submenu">
                              <ul>
                                {rowData?.subMenu?.map((element, k) => {
                                  return element?.type?.map((rowType) => {
                                    const shouldRenderButton2 = data_Name_type === rowType?.roleType;
                                    if (shouldRenderButton2) {
                                      return (
                                        <li key={k}>
                                          <NavLink to={element.routerPath} exact activeClassName="active">
                                            {element.subMenu}
                                          </NavLink>
                                        </li>
                                      );
                                    }
                                    return null;
                                  });
                                })}
                              </ul>
                            </div>
                          ) : ''}
                        </li>
                      );
                    }
                    return null;
                  });
                })} */}

              {selectedMenuItem?.mainMenu?.map((rowData, i) => {
                const isSelected = rowData.menuName;
                const IconComponent12 = AntIcons[rowData?.iconName];

                const handleItemClick = (index) => {
                  if (selectedItemIndex === index) {
                    setSelectedItemIndex(null); // Toggle off if already selected
                  } else {
                    setSelectedItemIndex(index); // Set the index of the clicked item
                  }
                };

                return rowData?.type?.map((rowTypeAll, j) => {
                  const shouldRenderButton3 = data_Name_type === rowTypeAll?.roleType;

                  if (shouldRenderButton3) {
                    const isItemSelected = selectedItemIndex === i;
                    return (
                      <li className="detailed-menu-main-li" key={j}>
                        <NavLink
                          to={rowData?.routerPath}
                          className={`detailed-menu-main-a ${isItemSelected ? 'open-arrow' : ''}`}
                          key={i}
                          onClick={() => handleItemClick(i)} // Pass the index to the handler
                        >
                          <span style={{ fontSize: '20px' }}>
                            {IconComponent12 && <IconComponent12 />}
                          </span>
                          {rowData?.menuName}
                          {rowData?.subMenu?.length > 0
                              ? rowData?.subMenu?.map((element, k) => {
                                return element?.type?.map((rowType) => {
                                  const shouldRenderButton2 = data_Name_type === rowType?.roleType;
                                  if (shouldRenderButton2) {
                                    return <i className="ri-arrow-right-s-fill"></i>;
                                  }
                                  return null;
                                });
                              })
                              : ''}
                        </NavLink>
                        {rowData?.subMenu?.length > 0 ? (
                            <div className="submenu">
                              <ul>
                                {rowData?.subMenu?.map((element, k) => {
                                  return element?.type?.map((rowType) => {
                                    const shouldRenderButton2 = data_Name_type === rowType?.roleType;
                                    if (shouldRenderButton2) {
                                      return (
                                        <li key={k}>
                                          <NavLink to={element.routerPath} exact activeClassName="active">
                                            {element.subMenu}
                                          </NavLink>
                                        </li>
                                      );
                                    }
                                    return null;
                                  });
                                })}
                              </ul>
                            </div>
                          ) : ''}
                      </li>
                    );
                  }
                  return null;
                });
              })}


              {/* <li className="detailed-menu-main-li" >
                <NavLink to="javascript:void(0);" className="detailed-menu-main-a"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to document
                    toggleDropdownScheduled();
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_72_1296)">
                      <path d="M4.88739 4.75643H5.17353C5.60837 4.75643 5.96086 4.40382 5.96086 3.9691V0.983683C5.96086 0.548959 5.60837 0.196387 5.17353 0.196387H4.88739C4.45259 0.196387 4.1001 0.548959 4.1001 0.983683V3.9691C4.1001 4.40382 4.45259 4.75643 4.88739 4.75643ZM14.9861 4.73693H15.2722C15.707 4.73693 16.0595 4.38436 16.0595 3.94959V0.964135C16.0595 0.529452 15.707 0.17688 15.2722 0.17688H14.9861C14.5512 0.17688 14.1987 0.529452 14.1987 0.964135V3.94955C14.1988 4.38436 14.5513 4.73693 14.9861 4.73693Z" fill="#555555" />
                      <path d="M18.7201 1.79639H16.6994V4.15576C16.6994 4.94281 16.0591 5.37691 15.2722 5.37691H14.986C14.199 5.37691 13.5587 4.7366 13.5587 3.94955V1.79639H6.60079V3.96906C6.60079 4.75611 5.96052 5.39642 5.17347 5.39642H4.88734C4.10033 5.39642 3.46006 4.75611 3.46006 3.96906V1.79639H1.27996C0.574202 1.79639 0 2.37059 0 3.07639V18.5431C0 19.2489 0.574202 19.8231 1.27996 19.8231H18.7201C19.4258 19.8231 20 19.2489 20 18.5431V3.07639C20.0001 2.37063 19.4258 1.79639 18.7201 1.79639ZM18.7201 18.5431H1.28001L1.27996 6.86304H18.7203L18.721 18.5431L18.7201 18.5431Z" fill="#555555" />
                      <path d="M10.6608 10.7809H12.9591C13.0029 10.7809 13.0448 10.7635 13.0757 10.7326C13.1067 10.7016 13.1241 10.6597 13.1241 10.6159V8.62581C13.1241 8.58206 13.1067 8.5401 13.0757 8.50916C13.0448 8.47823 13.0029 8.46085 12.9591 8.46085H10.6608C10.6171 8.46085 10.5751 8.47823 10.5442 8.50916C10.5133 8.5401 10.4959 8.58206 10.4959 8.62581V10.6159C10.4959 10.6597 10.5133 10.7016 10.5442 10.7326C10.5751 10.7635 10.6171 10.7809 10.6608 10.7809ZM14.4115 10.7809H16.7098C16.7535 10.7809 16.7955 10.7635 16.8264 10.7326C16.8574 10.7016 16.8748 10.6597 16.8748 10.6159V8.62581C16.8748 8.58206 16.8574 8.5401 16.8264 8.50916C16.7955 8.47823 16.7535 8.46085 16.7098 8.46085H14.4115C14.3678 8.46085 14.3258 8.47823 14.2949 8.50916C14.2639 8.5401 14.2466 8.58206 14.2466 8.62581V10.6159C14.2466 10.6597 14.2639 10.7016 14.2949 10.7326C14.3258 10.7635 14.3678 10.7809 14.4115 10.7809ZM3.15959 14.0389H5.45781C5.50156 14.0389 5.54352 14.0216 5.57445 13.9906C5.60539 13.9597 5.62277 13.9177 5.62277 13.874V11.8838C5.62277 11.8401 5.60539 11.7981 5.57445 11.7672C5.54352 11.7362 5.50156 11.7189 5.45781 11.7189H3.15959C3.11584 11.7189 3.07388 11.7362 3.04295 11.7672C3.01201 11.7981 2.99463 11.8401 2.99463 11.8838V13.874C2.99463 13.9177 3.01201 13.9597 3.04295 13.9906C3.07388 14.0216 3.11584 14.0389 3.15959 14.0389ZM6.91024 14.0389H9.20845C9.2522 14.0389 9.29416 14.0216 9.3251 13.9906C9.35604 13.9597 9.37342 13.9177 9.37342 13.874V11.8838C9.37342 11.8401 9.35604 11.7981 9.3251 11.7672C9.29416 11.7362 9.2522 11.7189 9.20845 11.7189H6.91024C6.86649 11.7189 6.82453 11.7362 6.79359 11.7672C6.76266 11.7981 6.74528 11.8401 6.74528 11.8838V13.874C6.74528 13.9177 6.76266 13.9597 6.79359 13.9906C6.82453 14.0216 6.86649 14.0389 6.91024 14.0389ZM10.6609 14.0389H12.9591C13.0029 14.0389 13.0448 14.0216 13.0757 13.9906C13.1067 13.9597 13.1241 13.9177 13.1241 13.874V11.8838C13.1241 11.8401 13.1067 11.7981 13.0757 11.7672C13.0448 11.7362 13.0029 11.7189 12.9591 11.7189H10.6609C10.6171 11.7189 10.5752 11.7362 10.5442 11.7672C10.5133 11.7981 10.4959 11.8401 10.4959 11.8838V13.874C10.4959 13.9177 10.5133 13.9597 10.5442 13.9906C10.5752 14.0216 10.6171 14.0389 10.6609 14.0389ZM14.4115 14.0389H16.7098C16.7535 14.0389 16.7955 14.0216 16.8264 13.9906C16.8574 13.9597 16.8748 13.9177 16.8748 13.874V11.8838C16.8748 11.8401 16.8574 11.7981 16.8264 11.7672C16.7955 11.7362 16.7535 11.7189 16.7098 11.7189H14.4115C14.3678 11.7189 14.3258 11.7362 14.2949 11.7672C14.2639 11.7981 14.2466 11.8401 14.2466 11.8838V13.874C14.2466 13.9177 14.2639 13.9597 14.2949 13.9906C14.3258 14.0216 14.3678 14.0389 14.4115 14.0389ZM5.45781 14.9769H3.15964C3.11588 14.9769 3.07392 14.9943 3.04299 15.0252C3.01205 15.0562 2.99467 15.0981 2.99467 15.1419V17.132C2.99467 17.1758 3.01205 17.2177 3.04299 17.2487C3.07392 17.2796 3.11588 17.297 3.15964 17.297H5.45785C5.5016 17.297 5.54356 17.2796 5.57449 17.2487C5.60543 17.2177 5.62281 17.1758 5.62281 17.132V15.1419C5.62279 15.0981 5.6054 15.0562 5.57446 15.0253C5.54351 14.9943 5.50156 14.9769 5.45781 14.9769ZM9.20849 14.9769H6.91028C6.86653 14.9769 6.82457 14.9943 6.79363 15.0252C6.7627 15.0562 6.74532 15.0981 6.74532 15.1419V17.132C6.74532 17.1758 6.7627 17.2177 6.79363 17.2487C6.82457 17.2796 6.86653 17.297 6.91028 17.297H9.20849C9.25224 17.297 9.2942 17.2796 9.32514 17.2487C9.35608 17.2177 9.37346 17.1758 9.37346 17.132V15.1419C9.37346 15.0981 9.35608 15.0562 9.32514 15.0252C9.2942 14.9943 9.25224 14.9769 9.20849 14.9769ZM12.9592 14.9769H10.6609C10.6172 14.9769 10.5752 14.9943 10.5443 15.0252C10.5133 15.0562 10.496 15.0981 10.496 15.1419V17.132C10.496 17.1758 10.5133 17.2177 10.5443 17.2487C10.5752 17.2796 10.6172 17.297 10.6609 17.297H12.9592C13.0029 17.297 13.0449 17.2796 13.0758 17.2487C13.1068 17.2177 13.1241 17.1758 13.1241 17.132V15.1419C13.1241 15.0981 13.1068 15.0562 13.0758 15.0252C13.0449 14.9943 13.0029 14.9769 12.9592 14.9769ZM16.7098 14.9769H14.4115C14.3678 14.9769 14.3258 14.9943 14.2949 15.0252C14.2639 15.0562 14.2466 15.0981 14.2466 15.1419V17.132C14.2466 17.1758 14.2639 17.2177 14.2949 17.2487C14.3258 17.2796 14.3678 17.297 14.4115 17.297H16.7098C16.7535 17.297 16.7955 17.2796 16.8264 17.2487C16.8574 17.2177 16.8748 17.1758 16.8748 17.132V15.1419C16.8748 15.0981 16.8574 15.0562 16.8264 15.0252C16.7955 14.9943 16.7535 14.9769 16.7098 14.9769Z" fill="#555555" />
                    </g>
                    <defs>
                      <clipPath id="clip0_72_1296">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  Scheduled
                  {scheduledOpen ? (
                    <i className="ri-arrow-down-s-fill"></i> // Icon when closed
                  ) : (
                    <i className="ri-arrow-right-s-fill"></i> // Icon when open
                  )}
                </NavLink>
                {scheduledOpen && <div className="submenu">
                  <ul>
                    <li><NavLink to="/backend-routes" exact activeclassname="active">Backend Routes</NavLink></li>
                    <li><NavLink to="/main-menu-group" exact activeclassname="active">Menu Group</NavLink></li>
                    <li><NavLink to="/main-Menu" exact activeclassname="active">Main Menu</NavLink></li>
                    <li><NavLink to="/sub-Menu" exact activeclassname="active">Sub Menu</NavLink></li>
                  </ul>
                </div>}
              </li> */}

              {/* <li className={`detailed-menu-main-li`} ref={dropdownRef}>

                <a to="" exact activeclassname="active"
                  className={`detailed-menu-main-a`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to document
                    toggleDropdownPreferences();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                    </svg>
                  </svg>
                  Preferences
                  {preferencesOpen ? (
                    <i className="ri-arrow-down-s-fill"></i> // Icon when closed
                  ) : (
                    <i className="ri-arrow-right-s-fill"></i> // Icon when open
                  )}
                </a>

                {preferencesOpen && <div className="submenu">
                  <ul>
                    <li><NavLink to="/dashboard" exact activeclassname="active" >Dashboard</NavLink></li>
                    <li><NavLink to="/project" exact activeclassname="active" >Create Project</NavLink></li>
                    <li><NavLink to="/users">User look-UP</NavLink></li>
                    <li><NavLink to="/basic-graph">Basic Graph</NavLink></li>
                    <li><NavLink to="/custom-store-listing">Custom Store Listing</NavLink></li>
                  </ul>
                </div>}
              </li>

            {/* subsetting */}
              {/* <li className={`detailed-menu-main-li`} ref={dropdownRef}>

                <a to="" exact activeclassname="active"
                  className={`detailed-menu-main-a`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent the click event from propagating to document
                    toggleDropdownPreferences();
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.78673 8.34554C2.57656 8.34108 2.37654 8.2571 2.22953 8.11157C2.08252 7.96605 2.00019 7.77057 2.00019 7.56698C2.00019 7.3634 2.08252 7.16791 2.22953 7.02239C2.37654 6.87687 2.57656 6.79288 2.78673 6.78843H4.15734C4.28597 6.39736 4.5096 6.04189 4.80946 5.75184C5.05536 5.51315 5.34753 5.32385 5.66919 5.19482C5.99085 5.0658 6.33567 4.99959 6.68383 5C7.032 4.99963 7.37683 5.06587 7.69849 5.19492C8.02015 5.32398 8.31231 5.51331 8.5582 5.75203C8.85802 6.04203 9.08164 6.39743 9.21032 6.78843H17.2135C17.4236 6.79288 17.6236 6.87687 17.7707 7.02239C17.9177 7.16791 18 7.3634 18 7.56698C18 7.77057 17.9177 7.96605 17.7707 8.11157C17.6236 8.2571 17.4236 8.34108 17.2135 8.34554H9.21051C9.08181 8.73658 8.85819 9.09204 8.55839 9.38212C8.31247 9.62083 8.02026 9.81014 7.69857 9.93916C7.37687 10.0682 7.03202 10.1344 6.68383 10.134C5.95203 10.134 5.28891 9.84623 4.80966 9.38212C4.50985 9.09204 4.28622 8.73658 4.15754 8.34554H2.78673ZM17.2133 11.6545C17.4234 11.6589 17.6235 11.7429 17.7705 11.8884C17.9175 12.0339 17.9998 12.2294 17.9998 12.433C17.9998 12.6366 17.9175 12.8321 17.7705 12.9776C17.6235 13.1231 17.4234 13.2071 17.2133 13.2116H15.8427C15.714 13.6026 15.4904 13.9581 15.1905 14.2482C14.9446 14.4869 14.6525 14.6762 14.3308 14.8052C14.0092 14.9342 13.6643 15.0004 13.3162 15C12.968 15.0004 12.6232 14.9342 12.3015 14.8052C11.9799 14.6761 11.6877 14.4868 11.4418 14.2482C11.1419 13.9581 10.9183 13.6026 10.7897 13.2116H2.78654C2.57637 13.2071 2.37635 13.1231 2.22934 12.9776C2.08232 12.8321 2 12.6366 2 12.433C2 12.2294 2.08232 12.0339 2.22934 11.8884C2.37635 11.7429 2.57637 11.6589 2.78654 11.6545H10.7895C10.9182 11.2634 11.1419 10.9079 11.4418 10.6179C11.6877 10.3792 11.9799 10.1899 12.3015 10.0609C12.6232 9.93185 12.968 9.86564 13.3162 9.86604C14.048 9.86604 14.7111 10.1538 15.1903 10.6179C15.4901 10.908 15.7138 11.2634 15.8425 11.6545H17.2133ZM7.63828 6.64288C7.51309 6.52129 7.36432 6.42486 7.20052 6.35913C7.03673 6.2934 6.86113 6.25966 6.68383 6.25986C6.50656 6.25967 6.33099 6.29341 6.16723 6.35914C6.00346 6.42487 5.85473 6.5213 5.72957 6.64288C5.60403 6.76408 5.50445 6.90811 5.43658 7.0667C5.3687 7.22529 5.33386 7.39531 5.33406 7.56698C5.33406 7.92777 5.48551 8.25511 5.72957 8.49128C5.85475 8.61282 6.00349 8.70921 6.16725 8.77491C6.33101 8.84061 6.50657 8.87432 6.68383 8.87411C6.86113 8.8743 7.03673 8.84056 7.20052 8.77483C7.36432 8.7091 7.51309 8.61267 7.63828 8.49109C7.76381 8.36987 7.86337 8.22584 7.93125 8.06725C7.99912 7.90866 8.03397 7.73865 8.0338 7.56698C8.03399 7.39531 7.99915 7.22529 7.93127 7.0667C7.8634 6.90811 7.76383 6.76408 7.63828 6.64288Z" fill="#555555" />
                    </svg>
                  </svg>
                  Sub Setting
                  {preferencesOpen ? (
                    <i className="ri-arrow-down-s-fill"></i> // Icon when closed
                  ) : (
                    <i className="ri-arrow-right-s-fill"></i> // Icon when open
                  )}
                </a>

                {preferencesOpen && <div className="submenu">
                  <ul>
                    <li><NavLink to="/maincategory" exact activeclassname="active">Main Category</NavLink></li>
                    <li><NavLink to="/category">Category</NavLink></li>
                    <li><NavLink to="/sub-category">Sub Category</NavLink></li>
                    <li><NavLink to="/role">Role</NavLink></li>
                    <li><NavLink to="/device">Device</NavLink></li>
                    <li><NavLink to="/tier">Tier</NavLink></li>
                    <li><NavLink to="/continent">Continent</NavLink></li>
                    <li><NavLink to="/country">Country</NavLink></li>
                  </ul>
                </div>}
              </li> */}
            </ul>
          </div>}

          <div class="event-menu">
            <div class="header">
              <div class="row gx-0">
                <div class="col-6">
                  <h3>Users</h3>
                </div>
                <div class="col-6 d-flex align-items-center justify-content-end">
                  <h6 class="d-flex align-items-center">All User <div class="badge">50</div></h6>
                </div>
              </div>
            </div>

            <div class="body d-flex align-items-center w-100">
              <div class="form-group w-100">

                <Select
                  showSearch
                  style={{
                    width: '100%',
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                  }
                  value={selectedCountry}
                  onChange={handleChange}
                  name="countryName"
                >
                  <Select.Option value=''>All</Select.Option>
                  {uniqueCountries.map((country, i) => (
                    <Select.Option key={i} value={country}>
                      {country}
                    </Select.Option>
                  ))}
                </Select>
              </div>
              <div class="badge">50</div>
            </div>


            <ul>
              {loading ? <Spin /> : deviceIdShow?.map((rowData, i) => {
                return (
                  <React.Fragment key={i}>
                    <li className="date font-weigth-text">{moment(rowData?.date).format('DD MMMM YYYY') || '-'}</li>
                    {rowData?.deviceList
                      .filter((deviceIdAll) =>
                        selectedCountry ? deviceIdAll?.country?.includes(selectedCountry) : true
                      )
                      .map((deviceIdAll) => {
                        const deviceID = showFullDeviceId
                          ? deviceIdAll?.deviceId
                          : truncateText(deviceIdAll?.deviceId, maxCharacters);
                        return (
                          <li
                            className={`detailed-menu-main-li cursor_pointer device-id ${selectedId === deviceIdAll?.deviceId ? 'highlighted' : ''}`}
                            key={deviceIdAll._id}
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeviceIdClick(deviceIdAll?.deviceId);
                              toggleFullDeviceId();
                            }}
                          >
                            <div className={`img d-flex align-items-center emojit`}>
                              {deviceIdAll?.emoji ? deviceIdAll?.emoji : <img src={require('../../Component/App_Details_theme/images/ImageNull.png')} alt='null-image' />}
                            </div>
                            <div className="content">
                              <h4>{getDisplayTextCounttery(deviceIdAll || '-')}</h4>
                              <h6>
                                <span>
                                  {getDisplayTextDate(
                                    deviceIdAll,
                                    dateAgo(deviceIdAll?.lastTimeEventActivity, new Date()) || '-'
                                  )}
                                </span>
                                <span className="line">|</span>
                                <span onClick={() => handleToggleText(deviceIdAll._id)}>
                                  {getDisplayText(deviceIdAll)}
                                </span>
                              </h6>
                            </div>
                          </li>
                        );
                      })}
                  </React.Fragment>
                );
              })}
            </ul>
          </div>
        </div>
      </div >
    </>
  )
}

export default Header