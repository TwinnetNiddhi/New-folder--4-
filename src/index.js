import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import './Component/App_Details_theme/css/login.css';
import './Component/App_Details_theme/css/common.css';
import './Component/App_Details_theme/css/register.css';
import './Component/App_Details_theme/css/navbar.css';
import './Component/App_Details_theme/css/dashboard.css';
import './Component/App_Details_theme/css/userdetails.css';
import './Component/App_Details_theme/css/users.css';
import './Component/App_Details_theme/css/usersgraph.css';
import reportWebVitals from './reportWebVitals';
import store, { persistor } from './Component/Redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Component/Loader/Loader';
import RoutePublicAndPrivate from './Component/routers/RoutePublicAndPrivate'
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <HashRouter>
                <ToastContainer />
                <Suspense fallback={Loader}>
                    <App>
                        <RoutePublicAndPrivate />
                    </App>
                </Suspense>
            </HashRouter>
        </PersistGate>
    </Provider>
);

reportWebVitals();
