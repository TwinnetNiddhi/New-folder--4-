import React, { Fragment, useEffect } from "react";
import Navbar from "./Component/Headers/Navbar";
import Header from "./Component/Headers/Header";
import { useLocation } from "react-router-dom";

const App = ({ children }) => {
  const location = useLocation();

  // Extract the pathname from the location object
  const currentPath = location.pathname;

  // Define a condition to hide the section
  const hideSection = currentPath === '/';
  const hideSectionsignup = currentPath === '/signup';
  const hideSectionforgetpassword = currentPath === '/forget-password';

  return (
    <Fragment>
      {!hideSection && !hideSectionsignup && !hideSectionforgetpassword ? (
        <section id='dashboard-page' className='pages'>
          <main className="h-100" id="dashboard-main">
            <div className="row gx-lg-2 gx-0">
              <div className="bg-overlay"></div>
              <Header />
              <div className="col-lg-9 left-col main-dashboard header-custom-col">
                <Navbar showGoodMorning />
                {children}
              </div>
            </div>
          </main>
        </section>
      ) : (
        <Fragment>
          {children}
        </Fragment>
      )}
    </Fragment>
  );
};

export default App;
