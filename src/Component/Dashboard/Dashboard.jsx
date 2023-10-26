import Navbar from '../Headers/Navbar';
import Header from '../Headers/Header';
import { useEffect } from 'react';
import $ from 'jquery'
import Cookies from 'universal-cookie';
import socket from '../socket.io/service';
import { Helmet } from 'react-helmet';

const Dashboard = () => {

  const cookies = new Cookies(); // Create an instance of Cookies


  let token = cookies.get('token');
  // useEffect(() =>{
  //   socket.emit('login|post', );
  // },[token])

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

  // useEffect(() => {
  //   document.title = 'Dashboard'; // Set the title to "Dashboard"
  // }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <div id="dashboard-page" className="pages">
        <main className="h-100" id="dashboard-maain">
          {/* <div className="row gx-lg-2 gx-0"> */}
          {/* <Header /> */}
          {/* <!-- main dashboard --> */}
          {/* <div className="col-lg-9 left-col main-dashboard header-custom-col"> */}
          {/* <!-- top navbar --> */}
          {/* <Navbar /> */}
          {/* <!-- create project --> */}
          <div className="project">
            <h2>Create Project</h2>
            <div className="body">
              <div className="d-lg-flex d-md-flex">
                <div className="form-group sname">
                  <label htmlFor="sname">Short Name</label>
                  <input
                    type="text"
                    id="sname"
                    name="sname"
                    className="form-control Name"
                    placeholder="Short Name"
                  />
                </div>
                <div className="form-group name">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control Name"
                    placeholder="Name"
                  />
                </div>
                <div className="form-group pname">
                  <label htmlFor="pname">Package Name</label>
                  <input
                    type="text"
                    id="pname"
                    name="pname"
                    className="form-control Package Name"
                    placeholder="Package Name"
                  />
                </div>

                <div className="form-group platform">
                  <label htmlFor="platform">Platform</label>
                  <select name="platform" id="platform" className="form-control">
                    <option value="ios" selected>IOS</option>
                    <option value="Android">Android</option>
                  </select>
                </div>
                <div className="form-group d-flex align-items-end">
                  <button className="btn">Save</button>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- Project Records --> */}
          <div className="project-records">
            <div className="header">
              <div className="row">
                <div className="col-lg-6 col-md-4 left">
                  <h2>Project Records</h2>
                </div>
                <div className="col-lg-6 col-md-8 right d-lg-flex d-md-flex justify-content-end">
                  <div className="form-group platform">
                    <label htmlFor="platform">Platform</label>
                    <select name="platform" id="platform" className="form-control">
                      <option value="ios">IOS</option>
                      <option value="android">Android</option>
                    </select>
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                  <div className="form-group status">
                    <label htmlFor="status">Status</label>
                    <select name="status" id="status" className="form-control">
                      <option value="Active">Active</option>
                      <option value="Disable">Disable</option>
                    </select>
                    <i className="ri-arrow-down-s-line"></i>
                  </div>
                  <div className="form-group d-flex align-items-end search">
                    <input type="search" className="form-control" placeholder="search text" />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="body">
              <table>table</table>
            </div>
          </div>
          {/* </div>
          </div> */}
        </main>
      </div>
    </>
  );
};

export default Dashboard;
