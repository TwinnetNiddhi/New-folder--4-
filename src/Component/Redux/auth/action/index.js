import socket, { setupSocket } from "../../../socket.io/service";
import socketData from '../../../socket/socket/service'
import { actionTypes } from "./actionTypes";
import CustomMessage from "../../../CustomMessage/CustomMessage";
import Cookies from 'universal-cookie';

export const initializeSocket = () => {
  const cookies = new Cookies();
  const token = cookies.get('token'); // Get the token from cookies or elsewhere
  return setupSocket(token);
};

//  login Page
export const loginHandler = (otp, emailAllData, navigation) => {
  const cookies = new Cookies();

  return (dispatch) => {
    try {
      socket.emit('otp|verify', {
        email: emailAllData,
        otp: otp,
      });

      socket.once('otp|verify', (response) => {
        if (response?.success) {
          dispatch({
            type: actionTypes.SET_LOGIN_PERMISSION_AND_ROLE,
            payload: response,
          });
          cookies.set('token', response.token, { path: "/" })
          localStorage.setItem('_id', response._id);
          navigation('/dashboard');
          CustomMessage('success', response?.message);
          const socket = initializeSocket();
        } else {
          CustomMessage('error', response?.message);
        }
      });
    } catch (error) {
      console.error(error);
      CustomMessage('error', error?.message)
    }
  };
};


//  User Page

export const fetchUserData = (currentPage, pageSize, setTotalItems, setTableData, searchDataAll, setLoading, setSearchLoading, selectedYear, selectedMonth, projectIdDetails, countrySelected, searchLoading) => {
  return (dispatch) => {
    try {
      if (searchLoading) {
        setSearchLoading(false);
        socket.emit('user|get|all', {
          page: currentPage,
          limit: pageSize,
          search: searchDataAll,
          year: selectedYear?.toString(),
          month: selectedMonth?.toString(),
          projectId: projectIdDetails,
          country: countrySelected,
        });

        socket.on('user|get|all', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_USER_DATA,
              payload: response?.data,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS,
              payload: response?.totalItems,
            });
            setTableData(response?.data);
            setLoading(false);
            setTotalItems(response?.totalItems);
            setLoading(false);
          }
          setLoading(false);
        });
      } else {
        setLoading(true);
        setSearchLoading(false);
        socket.emit('user|get|all', {
          page: currentPage,
          limit: pageSize,
          search: searchDataAll,
          year: selectedYear?.toString(),
          month: selectedMonth?.toString(),
          projectId: projectIdDetails,
          country: countrySelected,
        });

        socket.on('user|get|all', (response) => {
          if (response.success) {
            const formattedData = response?.data;
            dispatch({
              type: actionTypes.SET_USER_DATA,
              payload: formattedData,
            });
            dispatch({
              type: actionTypes.SET_TOTAL_ITEMS,
              payload: response?.totalItems,
            });
            setTableData(response.data);
            setLoading(false);
            setTotalItems(response?.totalItems);
            setLoading(false);
          }
          setLoading(false);
        });
      }
    } catch (error) {
      console.error(error, "error");
      setLoading(false);
      setSearchLoading(false);
    }
  };


};
//  MainMenu Page

export const MainMenurData = (currentPage, pageSize, setTotalItems,
  selectedStatusData, setTableData, filterroteTypeAllDataAll, searchDataAll,
  setLoading, setSearchLoading, searchLoading, menuGroupFilterAllData) => {
  return (dispatch) => {
    try {
      if (searchLoading) {
        setSearchLoading(false)
        setLoading(false)
        socket.emit('mainMenu|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll,
              mainGroup: menuGroupFilterAllData
            }
          });
        socket.on('mainMenu|getAll', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_MAINMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_MAINMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });

      } else {
        setLoading(true)
        setSearchLoading(false)
        socket.emit('mainMenu|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll,
              mainGroup: menuGroupFilterAllData
            }
          });
        socket.on('mainMenu|getAll', (response) => {
          setLoading(true)
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_MAINMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_MAINMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });
      }
    } catch (error) {
      console.error(error, "error");
      setLoading(false);
      setSearchLoading(false);
    }
  };
};

//  MainMenu Group Page

export const MainMenuGroupData = (currentPage, pageSize, setTotalItems,
  selectedStatusData, setTableData, filterroteTypeAllDataAll, searchDataAll,
  setLoading, setSearchLoading, searchLoading) => {
  return (dispatch) => {
    try {
      if (searchLoading) {
        setSearchLoading(false)
        socket.emit('mainGroup|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll
            }
          });
        socket.on('mainGroup|getAll', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_MAINMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_MAINMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });

      } else {
        setLoading(true)
        setSearchLoading(false)
        socket.emit('mainGroup|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll
            }
          });
        socket.on('mainGroup|getAll', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_MAINMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_MAINMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });
      }
    } catch (error) {
      console.error(error, "error");
      setLoading(false);
      setSearchLoading(false);
    }
  };
};

// Main-Category
export const fetchMaincategoryData = (currentPage, pageSize, searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, setTotalItems) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('mainCategory|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('mainCategory|getAll', (response) => {
                  // console.log(response, "responseresponseresponseresponse");
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_MAIN_CATEGORY_DATA,
                          payload: response?.data?.items,
                      });
                      setAlldata(response?.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('mainCategory|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('mainCategory|getAll', (response) => {
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_MAIN_CATEGORY_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Category
export const fetchCategoryData = (currentPage,pageSize,searchAllData,statusAll,id,searchLoading,setSearchLoading,setAlldata,setTotalItems,setLoading) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('category|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: statusAll,
                      mainCategory: id,
                  },
              });

              socketData.on('category|getAll', (response) => {
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_CATEGORY_DATA,
                          payload: response?.data?.items,
                      });
                      
                      setAlldata(response?.data?.items);
                      // setLoading(false);
                      setTotalItems(response?.totalItems);
                      // setLoading(false);
                  }
                  // setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('category|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: statusAll,
                      mainCategory: id,
                  },
              });

              socketData.on('category|getAll', (response) => {
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_CATEGORY_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Sub-Category
export const fetchSubCateData = (currentPage,pageSize,searchAllData,statusAll,id,cateid,setAlldata,setTotalItems,searchLoading,setSearchLoading,setLoading) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('subCategory|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: statusAll,
                      mainCategory: id,
                      category: cateid
                  },
              });

              socketData.once('subCategory|getAll', (response) => {
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_SUB_CATEGORY_DATA,
                          payload: response?.data?.items,
                      });
               
                      setAlldata(response?.data?.items);
                      // setLoading(false);
                      setTotalItems(response?.totalItems);
                      // setLoading(false);
                  }
                  // setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('subCategory|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: statusAll,
                      mainCategory: id,
                      category: cateid
                  },
              });

              socketData.once('subCategory|getAll', (response) => {
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_SUB_CATEGORY_DATA,
                          payload: formattedData,
                      });
                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Role
export const fetchRoleData = (currentPage, pageSize, searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, setTotalItems) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('role|getRole', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('role|getRole', (response) => {
                  // console.log(response, "responseresponseresponseresponse");
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_ROLE_DATA,
                          payload: response?.data?.items,
                      });

                      setAlldata(response?.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('role|getRole', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('role|getRole', (response) => {
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_ROLE_DATA,
                          payload: formattedData,
                      });

                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Device
export const fetchDeviceData = (currentPage, pageSize, searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, setTotalItems) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('device|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('device|getAll', (response) => {
                  // console.log(response, "responseresponseresponseresponse");
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_DEVICE_DATA,
                          payload: response?.data?.items,
                      });
                      //   dispatch({
                      //     type: actionTypes?.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      //   });
                      setAlldata(response?.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('device|getAll', {
                  details: {
                      page: currentPage,
                      limit: pageSize,
                      search: searchAllData,
                      status: selectedFilter,
                  },
              });

              socketData.on('device|getAll', (response) => {
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_DEVICE_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Tier
export const fetchTierData = (searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('tier|getall', {


                  search: searchAllData,
                  status: selectedFilter,

              });

              socketData.on('tier|getall', (response) => {
                  // console.log(response, "responseresponseresponseresponse");
                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_TIER_DATA,
                          payload: response?.data,
                      });

                      setAlldata(response?.data);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('tier|getall', {

                  search: searchAllData,
                  status: selectedFilter,

              });

              socketData.on('tier|getall', (response) => {
                  console.log(response, "responseresponse");
                  if (response.success) {
                      const formattedData = response?.data;
                      dispatch({
                          type: actionTypes.SET_TIER_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data);
                      setLoading(false);
                      // setTotalItems(response?.totalItems);
                      // setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Continent
export const fetchContinentData = (searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('continentget', {
                  search: searchAllData,
                  status: selectedFilter,
              });

              socketData.on('continentget', (response) => {

                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_TIER_CONTINENT_DATA,
                          payload: response?.data,
                      });

                      setAlldata(response?.data);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('continentget', {
                  search: searchAllData,
                  status: selectedFilter,

              });

              socketData.on('continentget', (response) => {
                  console.log(response, "responseresponse");
                  if (response.success) {
                      const formattedData = response?.data;
                      dispatch({
                          type: actionTypes.SET_TIER_CONTINENT_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data);
                      setLoading(false);
                      // setTotalItems(response?.totalItems);
                      // setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};

// Country
export const fetchCountryData = (searchAllData, setSearchLoading, selectedFilter, searchLoading, setLoading, setAlldata, selectedTier, selectedContinent, setTotalItems) => {
  return (dispatch) => {
      try {
          if (searchLoading) {
              setSearchLoading(false);
              socketData.emit('Tiergetallcountry', {
                  search: searchAllData,
                  page: 1,
                  limit: 1000,
                  status: selectedFilter,
                  tierid: selectedTier,
                  continentid: selectedContinent
              });

              socketData.on('Tiergetallcountry', (response) => {

                  if (response.success) {
                      dispatch({
                          type: actionTypes?.SET_TIER_COUNTRY_DATA,
                          payload: response?.data?.items,
                      });

                      setAlldata(response?.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          } else {
              setLoading(true);
              setSearchLoading(false);
              socketData.emit('Tiergetallcountry', {
                  search: searchAllData,
                  page: 1,
                  limit: 1000,
                  status: selectedFilter,
                  tierid: selectedTier,
                  continentid: selectedContinent
              });

              socketData.on('Tiergetallcountry', (response) => {
                  console.log(response, "responseresponse");
                  if (response.success) {
                      const formattedData = response?.data?.items;
                      dispatch({
                          type: actionTypes.SET_TIER_COUNTRY_DATA,
                          payload: formattedData,
                      });
                      // dispatch({
                      //     type: actionTypes.SET_TOTAL_ITEMS,
                      //     payload: response?.totalItems,
                      // });
                      setAlldata(response.data?.items);
                      setLoading(false);
                      setTotalItems(response?.totalItems);
                      setLoading(false);
                  }
                  setLoading(false);
              });
          }
      } catch (error) {
          console.error(error, "error");
          setLoading(false);
          setSearchLoading(false);
      }
  };


};
// Sub Menu Page
export const SubMenuData = (currentPage, pageSize, setTotalItems,
  selectedStatusData, setTableData, filterroteTypeAllDataAll, searchDataAll,
  setLoading, setSearchLoading, searchLoading, menuGroupFilterAllData) => {
  return (dispatch) => {
    try {
      if (searchLoading) {
        setSearchLoading(false)
        socket.emit('subMenu|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll,
              mainMenu: menuGroupFilterAllData
            }
          });
        socket.on('subMenu|getAll', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_SUBMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_SUBMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });

      } else {
        setLoading(true)
        setSearchLoading(false)
        socket.emit('subMenu|getAll',
          {
            details: {
              page: currentPage.toString(),
              limit: pageSize.toString(),
              search: searchDataAll,
              status: selectedStatusData,
              type: filterroteTypeAllDataAll,
              mainMenu: menuGroupFilterAllData
            }
          });
        socket.on('subMenu|getAll', (response) => {
          if (response.success) {
            dispatch({
              type: actionTypes?.SET_SUBMENU_DATA,
              payload: response?.data?.items,
            });
            dispatch({
              type: actionTypes?.SET_TOTAL_ITEMS_SUBMENU,
              payload: response?.data?.totalItems,
            });
            setTableData(response?.data?.items);
            setTotalItems(response?.data?.totalItems);
          }
          setLoading(false)
        });
      }
    } catch (error) {
      console.error(error, "error");
      setLoading(false);
      setSearchLoading(false);
    }
  };
};


// Access Event
export const AccessAllData = (setAccessFiledAdd, data_Name_type) => {
  return (dispatch) => {
    try {
      socket.emit('mainGroup|mainMenu|subMenu',
        {
          roleType: data_Name_type.toString()
        });
      socket.on('mainGroup|mainMenu|subMenu', (response) => {
        if (response.success) {
          dispatch({
            type: actionTypes?.ROUTER_PATH,
            payload: response?.data,
          });
          setAccessFiledAdd(response?.data)
        }
      });

    } catch (error) {
      console.log(error, "error");
      CustomMessage('error', error?.message);
    }
  };
};


