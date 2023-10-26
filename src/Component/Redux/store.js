import {createStore,applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../../Component/Redux/rootReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import axiosClient from '../../Component/Api'

const persistConfig = {
    key: 'root',
    storage: storage,
    stateReconciler: autoMergeLevel2
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk))


export default store;
export const persistor = persistStore(store);