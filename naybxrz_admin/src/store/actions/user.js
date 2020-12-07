import axios from './../../axios/axios';
import {store} from "../../index";
import * as actions from './actions';

const setAxiosToken = () => {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getState().authentication.data.access_token
};

export const authenticatedUserStart = (loading) => {
    return {
        type: actions.AUTHENTICATION_USER_START,
        loading: loading
    }
};

export const authenticatedUserError = (error) => {
    return {
        type: actions.AUTHENTICATION_USER_ERROR,
        error: error
    }
};

export const authenticatedUserSuccess = (user) => {
    return {
        type: actions.AUTHENTICATION_USER_SUCCESS,
        user: user
    }
};

export const authenticatedUserReset = (reset) => {
    return {
        type: actions.AUTHENTICATION_USER_RESET,
        reset: reset
    }
};

export const authenticatedUserFail = (fail) => {
    return {
        type: actions.AUTHENTICATION_USER_FAIL,
        fail: fail
    }
};

export const login = (email, password, history) => {
    return dispatch => {
        setAxiosToken();
        dispatch(authenticatedUserStart(true));
        axios.post('/user/loginAdmin?email=' + email + "&password=" + password)
            .then(response => {
                dispatch(authenticatedUserSuccess(response.data))
                dispatch(authenticatedUserStart(false));
                if (response.data !== '') {
                    history.push('/home');
                    dispatch(authenticatedUserReset(true));
                } else {
                    dispatch(authenticatedUserFail(true));
                }
            })
            .catch(error => {
                dispatch(authenticatedUserStart(false));
                dispatch(authenticatedUserError(error));
            })
    }
}

const searchUsersStart = (loading) => {
    return {
        type: actions.SEARCH_USERS_START,
        usersLoading: loading
    }
};

const searchUsersError = (error) => {
    return {
        type: actions.SEARCH_USERS_FAIL,
        usersError: error
    }
};

const searchUsersSuccess = (users) => {
    return {
        type: actions.SEARCH_USERS_SUCCESS,
        usersData: users
    }
};

const searchUsersNotFound = (found) => {
    return {
        type: actions.SEARCH_USERS_NOT_FOUND,
        usersNotFound: found
    }
};

export const searchUsers = (email) => {
    return dispatch => {
        setAxiosToken();
        dispatch(searchUsersStart(true));
        axios.get('/user/email/' + email)
            .then(response => {
                if (response.data !== '') {
                    dispatch(searchUsersSuccess(response.data));
                    dispatch(searchUsersNotFound(false));
                } else {
                    dispatch(searchUsersNotFound(true));
                }
                dispatch(searchUsersStart(false));
                dispatch(searchUsersError(undefined));
            })
            .catch(error => {
                dispatch(searchUsersError(error));
                dispatch(searchUsersStart(false));
                dispatch(searchUsersNotFound(false));
            })
    }
}

const getUserStart = (loading) => {
    return {
        type: actions.GET_USER_START,
        getUserLoading: loading
    }
};

const getUserSuccess = (response) => {
    return {
        type: actions.GET_USER_SUCCESS,
        getUserData: response
    }
};

const getUserFail = (error) => {
    return {
        type: actions.GET_USER_FAIL,
        getUserError: error
    }
};

export const getUserPopup = (open) => {
    return {
        type: actions.GET_USER_POPUP,
        getUserPopup: open
    }
};

export const getUser = (email, history) => {
    return dispatch => {
        setAxiosToken();
        dispatch(getUserStart(true));
        axios.get('/user/email/' + email)
            .then(response => {
                dispatch(getUserSuccess(response.data));
                dispatch(getUserFail(undefined));
                dispatch(getUserStart(false));
                dispatch(getUserPopup(true));
                history.push('/user/' + email)

            })
            .catch(error => {
                dispatch(getUserStart(false));
                dispatch(getUserFail(error));
            })
    }
}

export const addUserClicked = (history) => {
    return dispatch => {
        dispatch(getUserSuccess(undefined));
        dispatch(getUserPopup(true));
        history.push('/user/new');
    }
};

export const closeUserModalAndRedirectBack = (history) => {
    return dispatch => {
        dispatch(getUserPopup(false));
        history.goBack();
    }
};

const saveUserStart = (loading) => {
    return {
        type: actions.SAVE_USER_START,
        saveUserLoading: loading
    }
};
const saveUserFail = (error) => {
    return {
        type: actions.SAVE_USER_FAIL,
        saveUserError: error
    }
};
const saveUserSuccess = (response) => {
    return {
        type: actions.SAVE_USER_SUCCESS,
        saveUserSuccess: response
    }
};

export const saveUser = (user, history) => {
    return dispatch => {
        setAxiosToken();
        dispatch(saveUserStart(true));
        axios.post('/user/save', user)
            .then(response => {
                dispatch(saveUserStart(false));
                dispatch(saveUserSuccess(response.data));
                dispatch(saveUserFail(undefined));
                history.goBack();
            })
            .catch(error => {
                dispatch(saveUserStart(false));
                dispatch(saveUserFail(error));
            })
    }
};