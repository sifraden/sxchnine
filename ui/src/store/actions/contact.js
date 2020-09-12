import * as actionTypes from './actionTypes';
import axios from '../../axios/axios';


export const contact = (contact) => {
    return dispatch => {
        dispatch(contractStart(true));
        axios.post("/mail/contact", contact)
            .then(response => {
                dispatch(contractStart(false));
            })
            .catch(error => {
                dispatch(contractStart(false));
                dispatch(contractError(error));
            })
    }
}

export const contractStart = (start) => {
    return {
        type: actionTypes.CONTACT_START,
        loading: start
    }
}

export const contractError = (error) => {
    return {
        type: actionTypes.CONTACT_FAIL,
        error: error
    }
}