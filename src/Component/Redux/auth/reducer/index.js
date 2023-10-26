import { actionTypes } from '../action/actionTypes';

let init = {
    userId: 0,
    name: '',
    type: ''
};

const authReducer = (state = init, { type, payload }) => {
    switch (type) {
        case actionTypes.SET_LOGIN_PERMISSION_AND_ROLE:
            return {
                ...state,
                userId: payload.userId,
                name: payload.name,
                type: payload.type,
                token: payload.token
            };
        case actionTypes.SET_TOTAL_ITEMS:
            return {
                ...state,
                totalItems: payload, // Assuming this is what you want to update
            };
        case actionTypes.SET_USER_DATA:
            return {
                ...state,
                payload: payload, // Assuming this is what you want to update
            };
        case actionTypes.SET_TOTAL_ITEMS_MAINMENU:
            return {
                ...state,
                totalItems1: payload, // Assuming this is what you want to update
            };
        case actionTypes.SET_MAINMENU_DATA:
            return {
                ...state,
                payload_MainMenu: payload, // Assuming this is what you want to update
            };
        case actionTypes.SET_SUBMENU_DATA:
            return {
                ...state,
                payload_SubMenu: payload, // Assuming this is what you want to update
            };
        case actionTypes.ACCESS_TOKEN:
            return {
                ...state,
                access: payload, // Assuming this is what you want to update
            };
        case actionTypes.ROUTER_PATH:
            return {
                ...state,
                PATH: payload, // Assuming this is what you want to update
            };
        default:
            return state;
    }
};

export default authReducer;
