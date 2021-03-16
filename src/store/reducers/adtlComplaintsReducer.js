import * as actionTypes from '../actions/actionTypes';

const updateObjects = (oldObj,newObj) =>{
    return{
        ...oldObj,
        ...newObj
    }
}
const initialState = {
    users:{},
    loading: false,
};
export const fetchComplaintsStart = (state,action)=>{
    return updateObjects(state,{
        ...state,
        loading:true
    });
};
export const fetchComplaintsSuccess = (state,action)=>{
    //console.log("rEDUCER-17",action);
    return updateObjects(state,{
        ...state,
        users: action.users,
        loading:false
    })
};
export const fetchComplaintsFail = (state,action)=>{
    return updateObjects(state,{
        ...state,
        loading:false});
};
const reducer = (state=initialState,action) =>{
    switch(action.type){
        case actionTypes.FETCH_ADTL_COMPLAINTS_START: fetchComplaintsStart(state,action);
        case actionTypes.FETCH_ADTL_COMPLAINTS_SUCCESS: fetchComplaintsSuccess(state,action);
        case actionTypes.FETCH_ADTL_COMPLAINTS_FAIL: fetchComplaintsFail(state,action);
        default: return state
    }
}
export default reducer;
