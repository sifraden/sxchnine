import * as actions from '../actions/actions';

const initialState = {
    ordersByMonth: [],
    ordersByMonthCount: 0,
    ordersNumber: '',
    loading: false,
    ordersByMonthError: '',
    ordersNumbersError: '',

    ordersNotificationData: [],
    ordersNotificationCount: 0,

    orderByIdLoading: false,
    orderById: '',
    orderByIdError: undefined,
    orderByIdPopup: false,

    saveOrderLoading: false,
    saveOrderResponse: '',
    saveOrderError: undefined,

    searchOrdersData: [],
    searchOrdersLoading: false,
    searchOrdersError: undefined
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actions.ORDERS_BY_MONTH_START:
            return {
                ...state,
                loading: action.loading
            };
        case actions.ORDERS_BY_MONTH_SUCCESS:
            return {
                ...state,
                ordersByMonth: action.ordersByMonth
            };
        case actions.ORDERS_BY_MONTH_FAIL:
            return {
                ...state,
                ordersByMonthError: action.ordersByMonthError
            };
        case actions.ORDERS_BY_MONTH_COUNT:
            return {
                ...state,
                ordersByMonthCount: action.ordersByMonthCount
            };
        case actions.ORDERS_NOTIFICATION_DATA:
            let oldOrders = [...state.ordersNotificationData];
            let newOrdersList = oldOrders.concat(action.ordersNotificationData);
            return {
                ...state,
                ordersNotificationData: newOrdersList
            };
        case actions.ORDERS_NOTIFICATION_INCREMENT:
            return {
                ...state,
                ordersNotificationCount: state.ordersNotificationCount + 1
            };
        case actions.ORDERS_NOTIFICATION_RESET_SIZE:
            return {
                ...state,
                ordersNotificationCount: 0
            };
        case actions.ORDERS_NUMBERS_SUCCESS:
            return {
                ...state,
                ordersNumber: action.ordersNumber
            };
        case actions.ORDERS_NUMBERS_FAIL:
            return {
                ...state,
                ordersNumbersError: action.ordersNumbersError
            };
        case actions.ORDER_BY_ID_START:
            return {
                ...state,
                orderByIdLoading: action.orderByIdLoading
            };
        case actions.ORDER_BY_ID_SUCCESS:
            return {
                ...state,
                orderById: action.orderById
            };
        case actions.ORDER_BY_ID_FAIL:
            return {
                ...state,
                orderByIdError: action.orderByIdError
            };
        case actions.ORDER_BY_ID_POPUP:
            return {
                ...state,
                orderByIdPopup: action.orderByIdPopup
            };
        case actions.SAVE_ORDER_START:
            return {
                ...state,
                saveOrderLoading: action.saveOrderLoading
            };
        case actions.SAVE_ORDER_SUCCESS:
            return {
                ...state,
                saveOrderResponse: action.saveOrderResponse
            };
        case actions.SAVE_ORDER_FAIL:
            return {
                ...state,
                saveOrderError: action.saveOrderError
            };
        case actions.SEARCH_ORDERS_START:
            return {
                ...state,
                searchOrdersLoading: action.searchOrdersLoading
            };
        case actions.SEARCH_ORDERS_SUCCESS:
            return {
                ...state,
                searchOrdersData: action.searchOrdersData
            };
        case actions.SEARCH_ORDERS_BY_STATUS_SUCCESS:
            return {
                ...state,
                searchOrdersData: action.searchOrdersByStatusData
            };
        case actions.SEARCH_ORDERS_FAIL:
            return {
                ...state,
                searchOrdersError: action.searchOrdersFail
            }
        default:
            return state;
    }
}

export default reducer;