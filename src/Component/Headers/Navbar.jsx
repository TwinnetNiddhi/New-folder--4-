import { Link, NavLink } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import '../../Component/App_Details_theme/css/navbar.css';
import { useSelector } from 'react-redux';
import ProfileDropdown from '../App_Details_theme/js/ProfileDropdown';

const Navbar = ({ showGoodMorning, showIconText }) => {
  const cookies = new Cookies();
  const navigation = useNavigate();
  const [auth, setAuth] = useState(cookies.get('token'));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [notifcationAllData, setNotifcationAllData] = useState(false)
  const data_Name = useSelector(state => state?.authReducer?.name)
  const data_Name_type = useSelector(state => state?.authReducer?.type)
  const payload = useSelector((state) => state.authReducer.payload);

  const toggleUserMenu = () => {
    setUserMenuOpen((prevState) => !prevState);
    setProfileMenuOpen(false);
  };

  const handleProfileImgClick = () => {
    setIsMenuOpen(!isMenuOpen);

    // ProfileDropdown()
  };
  const handleNotificationImgClick = () => {
    setNotifcationAllData(!notifcationAllData);
  };

  useEffect(() => {
    const checkToken = () => {
      const newToken = cookies.get('token');
      if (newToken !== auth) {
        handleLogOut();
      }
    };

    const intervalId = setInterval(checkToken); // Check every second

    return () => {
      clearInterval(intervalId);
    };
  }, [auth]);

  const handleLogOut = () => {
    cookies.remove('token', { path: '/' });
    localStorage.clear();
    sessionStorage.clear();
    navigation('/');
    setAuth(null);
  };

  return (
    <>
      <div className="top-header">
        <div className="row">
          <div className="col-lg-6 left d-flex align-items-center">
            {showGoodMorning && (
              <div className="col-lg-6 left d-flex align-items-center">
                <h3>Good morning!</h3>
              </div>
            )}
            {showIconText && (
              <>
                <div className="icon">
                  <img src={payload[0]?.projectInfo?.appDetails[0]?.logo ? payload[0]?.projectInfo?.appDetails[0]?.logo :
                 <img src={require('../../Component/App_Details_theme/images/navbarNull.png')} />} style={{ width: '46px', height: '46px' }} alt="Icon" />
                </div>
                <div className="text">
                  <h4>{payload[0]?.projectInfo?.appDetails[0]?.appName || '-'}</h4>
                  <p className="d-flex align-items-center">
                    {payload[0]?.projectInfo?.appDetails[0]?.packageName || '-'}{' '}
                    <a href="" className="copy">
                      <i className="ri-file-copy-line"></i>
                    </a>{' '}
                    <a href="" className="playstore">
                      <img src={require('../../Component/App_Details_theme/images/play-store-icon-sm.png')} alt="Play-store-icon" />
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="col-lg-6 right d-flex align-items-center justify-content-end">
            <div className="notification" onClick={handleNotificationImgClick}>
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

              <div className={`notification-menu ${notifcationAllData ? 'show' : ''}`} >
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
                              <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home" type="button" role="tab" aria-controls="home" aria-selected="true">Actions</button>
                            </li>
                            <li className="nav-item" role="presentation">
                              <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile" type="button" role="tab" aria-controls="profile" aria-selected="false">Reports <span className="total">9</span></button>
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
                    <div className="tab-pane fade show active action-tab" id="home" role="tabpanel" aria-labelledby="home-tab">
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-10 d-flex">
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                            <div className="tick"><img src={require('../../Component/App_Details_theme/images/tick.png')} alt="Tick" /></div>
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
                    <div className="tab-pane fade report-tab" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8">
                            <h3>Report is ready to download</h3>
                            <p>2 minutes ago</p>
                          </div>
                          <div className="col-4 img d-flex justify-content-end">
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
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
                            <img src={require('../../Component/App_Details_theme/images/report-img.png')} alt="Report-img" />
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade updates-tab" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                            <p>2m ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                            <p>2m ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                            <p>2m ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                            <p>2m ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
                            <a href="" className="close"><i className="ri-close-line"></i></a>
                            <p>2m ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="item">
                        <div className="row gx-0">
                          <div className="col-8 d-flex align-items-center">
                            <img src={require('../../Component/App_Details_theme/images/update-icon.png')} alt="Icon" />
                            <div className="content">
                              <h3>New updates are available </h3>
                              <h6>Update your account now.</h6>
                            </div>
                          </div>
                          <div className="col-4 d-flex flex-column align-items-end">
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
            </div>
            <div className="profile">
              <div className="profile-img" onClick={handleProfileImgClick}>
                <img src={require('../../Component/App_Details_theme/images/profile-img.png')} alt="Profile-Image" />
              </div>
              <div className={`profile-menu ${isMenuOpen ? 'show' : ''}`}>
                <div className="menu-header d-flex">
                  <div className="row gx-0 w-100">
                    <div className="col-10">
                      <div className="d-flex">
                        <div className="img">
                          <img src={require('../../Component/App_Details_theme/images/profile-img.png')} alt="profile-img" />
                        </div>
                        <div className="name">
                          <h5>{data_Name}</h5>
                          <p>{data_Name_type}</p>
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
                  <h3 className="mt-0">Profile Settings</h3>
                  <ul className="top-menu">
                    <li>
                      <a href="">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M8.75 1.25C6.68625 1.25 5 2.93625 5 5C5 7.06375 6.68625 8.75 8.75 8.75C10.8137 8.75 12.5 7.06375 12.5 5C12.5 2.93625 10.8137 1.25 8.75 1.25ZM8.75 2.5C10.1381 2.5 11.25 3.6125 11.25 5C11.25 6.38812 10.1381 7.5 8.75 7.5C7.36187 7.5 6.25 6.38812 6.25 5C6.25 3.6125 7.36187 2.5 8.75 2.5ZM6.875 10C3.76937 10 1.25 12.5194 1.25 15.625V16.875C1.25 17.0408 1.31585 17.1997 1.43306 17.3169C1.55027 17.4342 1.70924 17.5 1.875 17.5H8.655C8.82076 17.5 8.97973 17.4342 9.09694 17.3169C9.21415 17.1997 9.28 17.0408 9.28 16.875C9.28 16.7092 9.21415 16.5503 9.09694 16.4331C8.97973 16.3158 8.82076 16.25 8.655 16.25H2.5V15.625C2.5 13.1906 4.44062 11.25 6.875 11.25H9.385C9.55076 11.25 9.70973 11.1842 9.82694 11.0669C9.94415 10.9497 10.01 10.7908 10.01 10.625C10.01 10.4592 9.94415 10.3003 9.82694 10.1831C9.70973 10.0658 9.55076 10 9.385 10H6.875ZM14.3669 10C14.2846 10.0009 14.2033 10.018 14.1277 10.0504C14.052 10.0827 13.9835 10.1297 13.926 10.1885C13.8686 10.2474 13.8233 10.317 13.7927 10.3934C13.7622 10.4698 13.7471 10.5515 13.7481 10.6337V11.3125C13.3565 11.3941 12.9843 11.5505 12.6519 11.7731L12.1719 11.2931C12.0244 11.1419 11.8575 11.0844 11.6994 11.0931C11.2262 11.1181 10.8337 11.735 11.2881 12.1769L11.77 12.6594C11.5485 12.9918 11.3932 13.3638 11.3125 13.755H10.6337C9.78875 13.7431 9.78875 15.0175 10.6337 15.005H11.315C11.3962 15.3994 11.5556 15.7662 11.7712 16.0919L11.2856 16.5775C10.6794 17.1669 11.58 18.0675 12.1694 17.4612L12.6544 16.9769C12.9862 17.1985 13.3575 17.3543 13.7481 17.4356V18.1156C13.7356 18.9606 15.01 18.9606 14.9981 18.1156V17.4375C15.388 17.3563 15.7587 17.201 16.09 16.98L16.5787 17.4675C16.6358 17.5295 16.7048 17.5793 16.7816 17.614C16.8584 17.6486 16.9414 17.6674 17.0257 17.6691C17.1099 17.6709 17.1936 17.6555 17.2718 17.6241C17.35 17.5927 17.421 17.5458 17.4806 17.4862C17.5401 17.4266 17.5871 17.3556 17.6185 17.2774C17.6499 17.1993 17.6652 17.1155 17.6635 17.0313C17.6617 16.9471 17.643 16.864 17.6083 16.7872C17.5737 16.7104 17.5239 16.6414 17.4619 16.5844L16.9762 16.0981C17.1977 15.7669 17.3534 15.3962 17.435 15.0062H18.1162C18.282 15.0062 18.441 14.9404 18.5582 14.8232C18.6754 14.706 18.7412 14.547 18.7412 14.3812C18.7412 14.2155 18.6754 14.0565 18.5582 13.9393C18.441 13.8221 18.282 13.7562 18.1162 13.7562H17.4375C17.3569 13.3625 17.2006 12.9881 16.9775 12.6537L17.4594 12.1719C17.5194 12.1138 17.5671 12.0443 17.5997 11.9674C17.6323 11.8905 17.6491 11.8079 17.6491 11.7244C17.6491 11.6409 17.6323 11.5582 17.5997 11.4813C17.5671 11.4045 17.5194 11.3349 17.4594 11.2769C17.3408 11.1613 17.1813 11.0972 17.0156 11.0987C16.8505 11.1016 16.6932 11.1697 16.5781 11.2881L16.095 11.7712C15.7629 11.5494 15.3911 11.3937 15 11.3125V10.6337C15.0013 10.5504 14.9859 10.4676 14.9547 10.3902C14.9235 10.3129 14.8771 10.2426 14.8183 10.1835C14.7594 10.1244 14.6893 10.0777 14.6121 10.0462C14.5349 10.0147 14.4521 9.99899 14.3687 10H14.3669ZM14.375 12.5C15.4175 12.5 16.25 13.3319 16.25 14.375C16.25 15.4175 15.4175 16.25 14.375 16.25C13.3319 16.25 12.5 15.4175 12.5 14.375C12.5 13.3319 13.3319 12.5 14.375 12.5Z" fill="#888888" />
                        </svg>
                        Manage Profile
                      </a>
                    </li>
                    <li>
                      <NavLink to="/changes-password" exact activeclassname="active">
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
                      </NavLink>
                    </li>
                  </ul>
                  <h3 className={`user-btn ${isUserMenuOpen ? 'active' : ''}`} onClick={toggleUserMenu}>User Settings
                    <i className="ri-arrow-up-s-fill"></i></h3>
                  {isUserMenuOpen && <ul className={`top-menu user-menu ${isUserMenuOpen ? 'open' : ''}`}>
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
                  </ul>}
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
                      <Link to="" onClick={handleLogOut}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.54578 18.9584C8.68495 18.9584 9.60412 18.9584 10.3266 18.8609C11.0766 18.7609 11.7083 18.5442 12.2099 18.0434C12.6466 17.6059 12.8683 17.0684 12.9841 16.4367C13.0966 15.8225 13.1183 15.0717 13.1233 14.17C13.1242 14.0043 13.0592 13.845 12.9426 13.7271C12.826 13.6093 12.6674 13.5426 12.5016 13.5417C12.3359 13.5408 12.1765 13.6058 12.0587 13.7224C11.9409 13.839 11.8742 13.9976 11.8733 14.1634C11.8683 15.0742 11.8449 15.72 11.7549 16.2109C11.6674 16.6825 11.5283 16.9567 11.3258 17.1592C11.0949 17.39 10.7708 17.54 10.1591 17.6225C9.52995 17.7067 8.69578 17.7084 7.49995 17.7084H6.66662C5.46995 17.7084 4.63578 17.7067 4.00662 17.6225C3.39495 17.54 3.07162 17.3892 2.83995 17.1592C2.60828 16.9292 2.45995 16.605 2.37745 15.9925C2.29245 15.3642 2.29162 14.5292 2.29162 13.3334L2.29162 6.66671C2.29162 5.47087 2.29245 4.63587 2.37745 4.00671C2.45995 3.39504 2.60995 3.07171 2.84078 2.84088C3.07162 2.61004 3.39495 2.46004 4.00662 2.37754C4.63578 2.29338 5.46995 2.29171 6.66662 2.29171H7.49995C8.69578 2.29171 9.52995 2.29338 10.1599 2.37754C10.7708 2.46004 11.0949 2.61087 11.3258 2.84088C11.5283 3.04338 11.6674 3.31754 11.7549 3.78921C11.8449 4.28004 11.8683 4.92587 11.8733 5.83671C11.8737 5.91878 11.8903 5.99997 11.9221 6.07563C11.9539 6.15129 12.0004 6.21995 12.0587 6.27767C12.117 6.3354 12.1862 6.38107 12.2622 6.41208C12.3382 6.44308 12.4195 6.45881 12.5016 6.45837C12.5837 6.45794 12.6649 6.44134 12.7405 6.40952C12.8162 6.37771 12.8849 6.33131 12.9426 6.27296C13.0003 6.21461 13.046 6.14547 13.077 6.06947C13.108 5.99348 13.1237 5.91212 13.1233 5.83004C13.1183 4.92837 13.0966 4.17754 12.9841 3.56337C12.8674 2.93171 12.6466 2.39421 12.2091 1.95671C11.7083 1.45504 11.0758 1.24004 10.3258 1.13837C9.60412 1.04171 8.68495 1.04171 7.54578 1.04171H6.62078C5.48078 1.04171 4.56245 1.04171 3.83995 1.13921C3.08995 1.23921 2.45828 1.45587 1.95662 1.95671C1.45495 2.45837 1.23995 3.09004 1.13828 3.84004C1.04162 4.56254 1.04162 5.48171 1.04162 6.62087L1.04162 13.3792C1.04162 14.5184 1.04162 15.4375 1.13828 16.16C1.23911 16.91 1.45495 17.5417 1.95662 18.0434C2.45828 18.545 3.08995 18.76 3.83995 18.8609C4.56245 18.9584 5.48162 18.9584 6.62078 18.9584H7.54578Z" fill="#666A70" />
                          <path d="M7.49945 10.6251C7.33369 10.6251 7.17472 10.5592 7.05751 10.442C6.9403 10.3248 6.87445 10.1658 6.87445 10.0001C6.87445 9.8343 6.9403 9.67533 7.05751 9.55812C7.17472 9.44091 7.33369 9.37506 7.49945 9.37506L16.6436 9.37506L15.0095 7.97506C14.8835 7.86721 14.8055 7.71373 14.7927 7.54838C14.7799 7.38304 14.8333 7.21937 14.9411 7.0934C15.049 6.96742 15.2025 6.88945 15.3678 6.87663C15.5331 6.86382 15.6968 6.91721 15.8228 7.02506L18.7395 9.52506C18.8081 9.58374 18.8632 9.65658 18.9009 9.73858C18.9387 9.82058 18.9583 9.90978 18.9583 10.0001C18.9583 10.0903 18.9387 10.1796 18.9009 10.2615C18.8632 10.3435 18.8081 10.4164 18.7395 10.4751L15.8228 12.9751C15.7604 13.0285 15.6881 13.0691 15.6101 13.0945C15.532 13.12 15.4497 13.1298 15.3678 13.1235C15.2859 13.1172 15.2061 13.0947 15.1329 13.0575C15.0597 13.0204 14.9945 12.9691 14.9411 12.9067C14.8877 12.8444 14.8471 12.7721 14.8217 12.694C14.7962 12.6159 14.7863 12.5336 14.7927 12.4517C14.799 12.3699 14.8214 12.2901 14.8586 12.2168C14.8958 12.1436 14.9471 12.0785 15.0095 12.0251L16.6428 10.6251L7.49945 10.6251Z" fill="#666A70" />
                        </svg>
                        Log Out
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
