import axios from '../../AdtlBaseUrl';
//import axios from 'axios';
import * as actionTypes from '../actions/actionTypes';

/** Fetching ADTL Complaints actions */

export const fetchComplaintsStart = ()=>{
    console.log("started...");
    return {
        type: actionTypes.FETCH_ADTL_COMPLAINTS_START
    };
}
export const fetchComplaintsSucees = (users)=>{
    console.log("acction==",users);
    return {
        type: actionTypes.FETCH_ADTL_COMPLAINTS_SUCCESS,
        users:{...users},
    };
}
export const fetchComplaintsFail = (error)=>{
    //console.log(error);
    return {
        type: actionTypes.FETCH_ADTL_COMPLAINTS_FAIL,
        error: error
    };
}
/** Action dispatchers */
 export const fetchComplaints = () =>{
    return dispatch =>{
        dispatch(fetchComplaintsStart());
        axios.get('https://adtl-cd297-default-rtdb.firebaseio.com/adtlComplaints.json')
        .then(res=>{
            let users = {};
            for(let key in res.data){
                users={
                    ...res.data[key],
                    userId:key
                };
            }
            dispatch(fetchComplaintsSucees(users))
        })
        .catch(error=>{
            alert('error from actions')
            dispatch(error=>fetchComplaintsFail(error))
        })
    }
}
