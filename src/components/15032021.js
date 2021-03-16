import React from 'react'
import {Form,Row, Col,Control,Button, FormLabel} from 'react-bootstrap'
import Datepicker from "react-datepicker"
import { AddAdlForm } from '../services/APIService';
import 'bootstrap/dist/css/bootstrap.css';
import {useLocation,withRouter} from 'react-router-dom';
import './Form.css';
import axios from 'axios';
import * as actions from '../store/actions/adtlComplaintsActions';
import { connect } from 'react-redux';
import { findAllByDisplayValue } from '@testing-library/dom';
//import {Label} from 'semantic-ui-react';



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
                valid: false,
                readOnly:false,
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
        /** Their fields */
        message:'',
        success:false,
        complaintNum:'',
        //validationFlag:0,
        //requiredmessage:'',
        //applicationNameflag:false,
        //accountNumberFlaf:false,
        //zipNumberFlag:false,
        //clientNameFlag:false,
        //complaintID:''

    };


    componentDidMount(){
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
                    this.setState({message:"complaint registered successfully!"+data.complaintID}):
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
            this.setState({checkbox: e.target.checked});
        }
        else if(identifier==='checkbox1'&&e.target.checked){
            this.setState({checkbox1:e.target.checked});
        }
        else{
            this.setState({checkbox1:false,checkbox:false});
        }
        let stringRegx = /^[A-Za-z]+$/;
        let numregx = /^\d+4/;
        const updateAdlFormFields = updateObjects(this.state.adlFormData[identifier],{
            isEmpty:false,
            value: stringval,
            valid: e.target.value !==''&& e.target.checked,
            // isAlpha:stringRegx.test(e.target.value),
            // isNumeric:numregx.test(e.target.value),
            // maxLength:e.target.value<= (identifier==='name'&&identifier==='client')?50:identifier==='accountNumber'?19:10,
            
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
        for(let ele in this.state.adlFormData[e.target.name]){
            if(ele==='isEmpty'&&e.target.value ===''){
                const updateAdlFormFields = updateObjects(this.state.adlFormData[e.target.name],{
                    isEmpty: true
                });
                const updateAdlformObject = updateObjects(
                    this.state.adlFormData,
                    {[e.target.name] :updateAdlFormFields}
                );
                this.setState({
                    adlFormData: updateAdlformObject,
                })
            }
            else{
                const updateAdlFormFields = updateObjects(this.state.adlFormData[e.target.name],{
                    isEmpty: false,
                });
                const updateAdlformObject = updateObjects(
                    this.state.adlFormData,
                    {[e.target.name] :updateAdlFormFields}
                );
                this.setState({
                    adlFormData: updateAdlformObject,
                })
            }
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
        let x = false;
        console.log(this.state);
        if(this.state.checkbox||this.state.checkbox1){
            if(e.target.name==='name'){
                x = this.state.adlFormData.name.value!==''; 
                console.log(x);
            }
            else if(e.target.name==='client'){
                x = this.state.adlFormData.client.value!==''; 
                console.log(x);
            }
            else if(e.target.name==='zipcode'){
                x = this.state.adlFormData.date.value!==''; 
                console.log(x);
            }
            else if(e.target.name==='accountNumber'){
                x = this.state.adlFormData.date.value!==''; 
                console.log(x);
            }
            else if(e.target.name==='date'){
                x = this.state.adlFormData.date.value!==''; 
                console.log(x);
            }
            else {
                x =false;
            }
            console.log(x);

            if(x===true){
                AddAdlForm(
                    this.state.adlFormData.date?.value,
                    this.state.adlFormData.name?.value,
                    this.state.adlFormData.zipCode?.value,
                    this.state.adlFormData.accountNumber?.value,
                    this.state.adlFormData.client?.value,
                    this.state.adlFormData.checkbox,
                    this.state.adlFormData.checkbox1,
                    
                )
                .then((res)  =>{
                        if(res.status === 'success' && res.complaintID!=''){
                                this.setState({
                                    message: 'compalint registered successfully.',
                                    success: true,
                                    complaintNum:res.complaintID,
                                    error:false
                                })
                        }
                    });
                }
                else{
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
        const isNotValid = {
            border: '1px solid #f50c4e !importent',
        }
        return(
            <Form onSubmit={this.handlesubmit}>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                style = {!this.state.adlFormData.name.isEmpty?{}:{border: '1px solid #f50c4e'}}
                                size="sm"
                                type="text"
                                placeholder="Enter Name"
                                name="name"
                                onBlur ={(e) =>this.isEmptyValue(e)}
                                value = {this.state.adlFormData.name.value}
                                onKeyPress = {(e)=>this.isMaxlenth(e)}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            />
                            {this.state.adlFormData.name.isEmpty?
                            <small className="text-danger">
                                <b>Please enter a valid Name</b></small> :''}
                            {this.state.adlFormData.name.maxLength?
                                <small className="text-danger">
                                <b>Name should be 50 chars</b></small>:''}

                            {this.state.adlFormData.name.isAlpha?
                                <small className="text-danger">
                                <b>Please enter alphabets only</b></small>:''}

                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>zipcode</Form.Label>
                            <Form.Control
                            onKeyPress = {(e) =>this.isMaxlenth(e)}
                                size="sm"
                                type="number"
                                placeholder="Enter zipcode"
                                onBlur={(e)=>this.isEmptyValue(e)}
                                name="zipcode"
                                value = {this.state.adlFormData.zipcode.value}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            />{!this.state.adlFormData.zipcode.valid && this.state.adlFormData.zipcode.isEmpty?<small className="text-danger"><b>Please enter valid Zipcode</b></small>:''}
                        </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control
                        onKeyPress={(e) =>this.isMaxlenth(e)}
                            size="sm"
                            onBlur={(e) =>this.isEmptyValue(e)}
                            type="text"
                            placeholder="Enter Account Number"
                            name="accountNumber"
                            value = {this.state.adlFormData.accountNumber.value}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />{!this.state.adlFormData.accountNumber.valid && this.state.adlFormData.accountNumber.isEmpty?<small className="text-danger"><b>Please enter valid account number</b></small>:''}
                    
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
                            size="sm"
                            type="text"
                            placeholder="Enter Client"
                            name="client"
                            value = {this.state.adlFormData.client.value}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />{!this.state.adlFormData.client.valid && this.state.adlFormData.client.isEmpty?<small className="text-danger"><b>Please enter valid client Name</b></small>:''}
                    </Form.Group>
                
                </Form.Row>
                <div id="chk_option_error" style = {erroMessgStyle}>Select atleast one!</div>
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
                             style = {(this.state.checkbox===false&&this.state.checkbox1===false)&&this.state.isFormValid===false?{display: 'none'}:{}}
                             href="https://kbr-synchrony.kb.net/Article/Index/12/3?id=2344&fromwidget=false&search=true" target="_blank">Notify Mod & follow genius doc #2344</a>
                </Form.Row>
                <Form.Row className="justify-content-md-center">
                    <Button  type="submit"
                            disabled={this.state.checkbox===false&&this.state.checkbox1===false?true:false}
                             className="font-weight-bold px-5" 
                             size="sm" varient="warning">submit
                    </Button>
                </Form.Row>
                <div align="center" className="font-weight-bold px-5" size="sm">
                     {/**containSuccessmsg} {containEqualTo*/}
                </div>
                
            </Form>
        )
    }
}

// const mapDispatchToProps = dispatch =>{
//     return {
//         onFetchAdtlComplaints:() =>dispatch(actions.fetchComplaints())
//     }
// }
export default  withRouter(ADLForm);
