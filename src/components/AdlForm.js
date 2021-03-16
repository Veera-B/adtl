import React from 'react'
import {Form,Row, Col,Control,Button, FormLabel} from 'react-bootstrap'
import Datepicker from "react-datepicker"
import { AddAdlForm } from '../services/APIService';
import 'bootstrap/dist/css/bootstrap.css';
import {useLocation,withRouter} from 'react-router-dom';
import './Form.css';
import  axios from 'axios';
//import * as axios from '../AdtlBaseUrl';
import * as actions from '../store/actions/adtlComplaintsActions';
import { connect } from 'react-redux';
import { findAllByDisplayValue } from '@testing-library/dom';
//import {Label} from 'semantic-ui-react';
import Spinner from './UI/Spinner';



//Util method
const updateObjects = (oldObject,newObject) =>{
    return{
        ...oldObject,
        ...newObject
    }
}


const toDayDate = new Date();
const formatedDate = `${toDayDate.getMonth()+1}/${toDayDate.getDate()}/${toDayDate.getFullYear()}`

class ADLForm extends React.Component{
    state={
        adlFormData:{
            date:{
                value:formatedDate,
                valid: true,
                readOnly:true,
            },
            name:{
                value:'',
                valid: false,
                readOnly:false,
                isEmpty:false,
                validation:{
                    required:true,
                    maxLength:50,
                    isAlpha:false
                }
                
            },
            zipcode:{
                value:'',
                valid: false,
                readOnly:false,
                isEmpty:false,
                validation:{
                    required:true,
                    maxLength:10,
                    isNumeric:false,
                }
            },
            accountNumber:{
                value:'',
                valid: false,
                readOnly:false,
                validation:{
                    maxLength:19,
                    isNumeric:false
                }
                
            },
            client:{
                value:'',
                valid: false,
                readOnly:false,
                isEmpty:false,
                validation:{
                    required:true,
                    maxLength:50,
                    isAlpha:false
                }
                
                
            },
        },
        checkbox:false,
        checkbox1:false,
        isFormValid : false,
        fieldName:'',
        isLoading:true,
        /** Their fields */
        message:'',
        success:false,
        complaintNum:'',
        complaintID:'',
        

    };


    componentDidMount(){
        /** ME */
            axios.get('https://adtl-cd297-default-rtdb.firebaseio.com/adtlComplaints.json')
            .then(res=>{
                /** Extracting data from firebase obj */
                let adtlComplaint = {};
                for(let key in res.data){
                    adtlComplaint = {
                        ...res.data[key],
                        complaintId:key
                    };
                }
               // console.log(adtlComplaint)
                // this.setState({
                //     adlFormData:{
                //         name:{value:adtlComplaint.name,valid:true,readOnly:true},
                //         client:{value:adtlComplaint.client,valid:true,readOnly:true},
                //         accountNumber:{value:adtlComplaint.accountNumber,valid:true,readOnly:true},
                //         date:{value:adtlComplaint.date,valid:true,readOnly:true},
                //         zipcode:{value:adtlComplaint.zipcode,valid:true,readOnly:true},
                //     },
                //      isPrefetchedValue: true,
                //     complaintNum:adtlComplaint.complaintId,
                // })
                //console.log("After respnse",this.state.adlFormData)

            })
            .catch(err=>err)
        /** ME */
        //this.props.onFetchAdtlComplaints();
        console.log("PROPS==",this.props.users);
        let search=this.props.location.search;
        if(search){
            const res=this.commonService.get('http://localhost:8080/AdlForm'+search,"error msg");
            res.then(result=>this.setState({...result,}))
            this.setState({...res});
            this.setState({readonly:true,success:"your Complaint Registered successfully."});
        }
     }

    commonService = {
        post:(url,body,LoggerMessage)=>new Promise(async (resolve,reject)=>{
            try{
                axios.post(url,body,'')
                .then(response=>{
                    const{data}=response;
                    data["httpStatus"]=response.httpStatus;
                    response.status?
                    this.setState({message:"complaint registered successfully!"+data.complaintID,complaintId:data.complaintID}):
                    this.setState({message:""});
                    try{
                       // console.log("i am in a new relic page")
                        throw new Error("this is to test the new Relic");

                    } catch(e){
                        console.error("this is to test the console logging for new Relic",e);
                    }
                    resolve(data);
                }).catch(error=> {
                    reject(error);
                });
            } catch(error){
                reject(error);
            }
        }),
        get:(url,LoggerMessage) => new Promise(async (resolve, reject)=>{
            try{
                await axios.get(url).then(response =>{
                    const {data}=response;
                    resolve(data);
                }).catch(error =>{
                    reject(error);
                });
            } catch(error) {
                reject(error);
            }
        }),

    }

    getQueryParams = () =>{
        const location = this.props.location ;
        var search = location.search.substring(1);
        JSON.parse('{"'+ decodeURI(search).replace(/"/g, '\\"').replace(/=/g,'":"')+'"}')
    }  
    /** Input element Handling */
    
    
     onInputChangeHandler(e,identifier){
         //console.log();
        let stringval = '';
         if(identifier==='name'||identifier==='client'){
             stringval =  e.target.value.replace(/[^A-Za-z]/g,'');
             console.log(stringval)
         }
         else if(identifier==='zipcode'||identifier==='accountNumber'){
            stringval =  e.target.value.replace(/\D+/g, '');
         }
         else if(identifier==='zipcode'){
            stringval =  e.target.value
         }
        if(identifier==='checkbox'&&e.target.checked){
            this.setState({checkbox: e.target.checked,checkbox1:this.state.checkbox1});
        }
        else if(identifier==='checkbox1'&&e.target.checked){
            this.setState({checkbox1:e.target.checked,checkbox:this.state.checkbox});
        }
        else{
            this.setState({checkbox1:false,checkbox:false});
        }
        const updateAdlFormFields = updateObjects(this.state.adlFormData[identifier],{
            value: stringval,
            valid: e.target.value !=='',
        });
        const updateAdlformObject = updateObjects(
            this.state.adlFormData,
            {[identifier] : updateAdlFormFields} 
        );
        let formIsValid =true;
        for(let ele in updateAdlformObject){
            formIsValid = updateAdlformObject[ele].value!=='' && formIsValid;
        }
        this.setState({
            adlFormData:updateAdlformObject,
            isFormValid:formIsValid
        });
    }
    isEmptyValue = (e) =>{
        let str = e.target.name.charAt(0).toUpperCase() + e.target.name.slice(1);
        if(e.target.value===''){
            this.setState({
                fieldName: e.target.name,
                message: `Please enter the ${str} field`
            })
        }
        else{
            this.setState({
                fieldName: '',
                message: '',
            })
        }
    }
    isMaxlenth = (e) =>{
        let x =e.target.value.length;
        if(e.target.name === 'name' && x>=50){
            e.preventDefault()
        }
        if(e.target.name === 'zipcode' && x>=10){
            e.preventDefault()
        }
        if(e.target.name === 'accountnumber' && x>=19){
            e.preventDefault()
        }
        if(e.target.name === 'client' && x>=50){
            e.preventDefault()
        }
        
 
        
    }

    handlesubmit = (e) => {
        e.preventDefault();
        if(this.state.checkbox||this.state.checkbox1){
           // console.log(this.state);
            if(this.state.adlFormData.date.valid&&
                this.state.adlFormData.name.valid&&
                this.state.adlFormData.zipcode.valid&&
                this.state.adlFormData.accountNumber.valid&&
                this.state.adlFormData.client.valid){
                /**ME */
                axios.post('https://adtl-cd297-default-rtdb.firebaseio.com/adtlComplaints.json',{
                    
                    date:this.state.adlFormData.date?.value,
                    name:this.state.adlFormData.name?.value,
                    zipcode:this.state.adlFormData.zipcode?.value,
                    accountNumber:this.state.adlFormData.accountNumber?.value,
                    client:this.state.adlFormData.client?.value,
                    checkbox:this.state.checkbox,
                    checkbox1:this.state.checkbox1,
                })
                .then(res=>{
                    alert(res.data.name);
                    this.setState({
                        complaintID:res.data.name,
                        message: 'compalint registered successfully.'+this.state.complaintID,
                    })
                })
                .catch(err=>console.log(err))   



                /**ME */
                AddAdlForm(
                    this.state.adlFormData.date?.value,
                    this.state.adlFormData.name?.value,
                    this.state.adlFormData.zipcode?.value,
                    this.state.adlFormData.accountNumber?.value,
                    this.state.adlFormData.client?.value,
                    this.state.checkbox,
                    this.state.checkbox1,
                    
                )
                .then((res)  =>{
                        if(res.status === 'success' && res.complaintID!=''){
                                this.setState({

                                    success: true,
                                    complaintNum:res.complaintID,
                                    error:false
                                })
                        }
                    });
                }
                else{
                    this.setState({
                        checkbox:false,
                        checkbox1:false
                    })
                    alert('Please enter all valid data!')
                }
        }
        else{
        
            alert('Please check atleast on checkbox!');
        }
    }

    render(){
        
        const erroMessgStyle = {
            color:'#f50c4e',
            fontSize:'12px',
            padding:'10px 0px 0px 5px',
        };
        let adlData = '';
        if(this.state.isLoading){
            adlData  = <Spinner />;
        }
        return(
<>

            <Form onSubmit={this.handlesubmit}>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                style = {!this.state.adlFormData.name.isEmpty?{}:{border: '1px solid #f50c4e'}}
                                size="sm"
                                readOnly = {this.state.adlFormData.name.readOnly}
                                type="text"
                                placeholder="Enter Name"
                                name="name"
                                onBlur ={(e) =>this.isEmptyValue(e)}
                                value = {this.state.adlFormData.name.value}
                                onKeyUp = {(e)=>this.isMaxlenth(e)}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            />{this.state.fieldName==='name'?<div style = {erroMessgStyle}>{this.state.message}</div>:''}
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>zipcode</Form.Label>
                            <Form.Control
                                onKeyPress = {(e) =>this.isMaxlenth(e)}
                                readOnly = {this.state.adlFormData.zipcode.readOnly}
                                size="sm"
                                type="number"
                                placeholder="Enter zipcode"
                                onBlur={(e)=>this.isEmptyValue(e)}
                                name="zipcode"
                                value = {this.state.adlFormData.zipcode.value}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            />
                        </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control
                            readOnly = {this.state.adlFormData.accountNumber.readOnly}
                            onKeyPress={(e) =>this.isMaxlenth(e)}
                            size="sm"
                            onBlur={(e) =>this.isEmptyValue(e)}
                            type="text"
                            placeholder="Enter Account Number"
                            name="accountNumber"
                            value = {this.state.adlFormData.accountNumber.value}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />{this.state.adlFormData.accountNumber.valid===false &&
                             this.state.adlFormData.accountNumber.isEmpty?<small className="text-danger"><b>Please enter valid account number</b></small>:''}
                    
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        
                    <Form.Label>Date<span className="text-danger">*</span></Form.Label>
                        <div className = "form-control-sm form-control">
                            <Datepicker 
                                readOnly= {this.state.adlFormData.date.value?true:false}
                                size="sm"
                                type="date"
                                name="date"
                                onKeyPress={(e) =>this.isMaxlenth(e)}
                                value = {this.state.adlFormData.date.value}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                                />
                        </div>
                        
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Form.Label>Client<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            onKeyPress={(e) =>this.isMaxlenth(e)}
                            onBlur={(e)=>this.isEmptyValue(e)}
                            readOnly = {this.state.adlFormData.client.readOnly}
                            size="sm"
                            type="text"
                            placeholder="Enter Client"
                            name="client"
                            value = {this.state.adlFormData.client.value}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />{this.state.fieldName==='client'?<div style = {erroMessgStyle}>{this.state.message}</div>:''}
                    </Form.Group>

                </Form.Row>
                <Form.Row className='mt-3 w-75'>
                    <Form.Group>
                        <Form.Check
                        type = "checkbox"
                        name = "checkbox"
                        id = "checkbox"
                        checked = {this.state.checkbox}
                        onChange = {(e) =>this.onInputChangeHandler(e,e.target.id)}
                        label="Did the casller/customer/cardholder/account owner verbally abuse  or use discriminatory language toward you ; this may include discriminatory slurs, racial epithets, or sexually suggestive language?"
                        />
                    </Form.Group>  
                    <Form.Group>
                        <Form.Check
                            type = "checkbox"
                            name = "checkbox"
                            id = "checkbox1"
                            checked = {this.state.checkbox1}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.id)}
                            label="Did you  encounter a situvation where a caller/customer/cardholder/account owner makes a specific credible threat to commit a violent acr or  crime?"
                            feedback="you must agree before submiting."
                          />
                    </Form.Group>                
                </Form.Row>
                <Form.Row className="mb-3">
                            <a  className="text-primary"
                            id="chk_option_error"
                             style = {
                                 !(this.state.checkbox===false&&this.state.checkbox1===false)||
                                 !this.state.adlFormData.date.valid&&
                                 !this.state.adlFormData.name.valid&&
                                 !this.state.adlFormData.zipcode.valid&&
                                 !this.state.adlFormData.accountNumber.valid&&
                                 !this.state.adlFormData.client.valid?{}:{display: 'none'}}
                             href="https://kbr-synchrony.kb.net/Article/Index/12/3?id=2344&fromwidget=false&search=true" target="_blank">Notify Mod & follow genius doc #2344</a>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Button  type="submit"
                            disabled={(this.state.checkbox===false&&this.state.checkbox1===false)||this.state.adlFormData.date.valid&&
                                !this.state.adlFormData.name.valid&&
                                !this.state.adlFormData.zipcode.valid&&
                                !this.state.adlFormData.accountNumber.valid&&
                                !this.state.adlFormData.client.valid?true:false}
                             className="font-weight-bold px-5" 
                             size="sm" varient="warning">submit
                    </Button>
                </Form.Row>
                <div align="center" className="font-weight-bold px-5" size="sm">
                     {this.state.complaintID?this.state.message:''}
                </div>
                
            </Form>
        
</>        )
    }
}
// const mapStateToProps = state =>{
//     console.log("State from map",state)
//     return {
//         user: state.users.users
//     }
// }
// const mapDispatchToProps = dispatch =>{
//     return {
//         onFetchAdtlComplaints:() =>dispatch(actions.fetchComplaints())
//     }
// }
//export default connect(mapStateToProps,mapDispatchToProps)( withRouter(ADLForm));
export default  withRouter(ADLForm);
