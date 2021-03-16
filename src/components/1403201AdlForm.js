import React from 'react'
import {Form,Row, Col,Button, FormLabel} from 'react-bootstrap'
import Datepicker from "react-datepicker"
import { AddAdlForm } from '../services/APIService';
import 'bootstrap/dist/css/bootstrap.css';
import {useLocation,withRouter} from 'react-router-dom';
import axios from 'axios';
//import {Label} from 'semantic-ui-react';

//Util method
const updateObjects = (oldObject,newObject) =>{
    return{
        ...oldObject,
        ...newObject
    }
    
}
class ADLForm extends React.Component{
    state={
        adlFormData:{
            date:{
                value: '',
                valid: false,
                readOnly:false,
                
                },
            name:{
                value:'',
                valid: false,
                readOnly:false,
                validations:{
                    maxLength: 50,
                    minLength: 3,
                }
                
            },
            zipcode:{
                value:'',
                valid: false,
                readOnly:false,
                isEmpty: false,
                validations:{
                    maxLength: 10,
                    minLength: 3,
                }
            },
            accountNumber:{
                value:'',
                valid: false,
                readOnly:false,
                validations:{
                    maxLength: 19,
                    minLength: 3,
                }
            },
            client:{
                value:'',
                valid: false,
                readOnly:false,
                isEmpty: false,
                validations:{
                    maxLength: 50,
                    minLength: 3,
                }
                
            },
        },
        checkbox:false,
        checkbox1:false,
        isFormValid : false,
        isChecked: true,
        length: false,
        
        
        /** Their fields */
        message:'',
        complaintNum:'',
        validationFlag:0,
        requiredmessage:'',
        applicationNameflag:false,
        zipNumberFlag:false,
        clientNameFlag:false,
        complaintID:''

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
                axios.post(url,body,'').then(response=>{
                    const{data}=response;
                    data["httpStatus"]=response.httpStatus;
                    //added for testing new relic integration
                    response.status?
                    this.setState({message:"complaint registered successfully!"+data.complaintID}):
                    this.setState({message:""});
                    try{
                        console.log("i am in a new relic page")
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
         this.setState({length:false});
        if(this.state.checkbox===false && this.state.checkbox1===false){
            this.setState({isChecked:true})
        }
        if(identifier==='checkbox'){
            this.setState({checkbox: e.target.checked,isChecked:e.target.checked});
           
        }
        if(identifier==='checkbox1'){
            this.setState({checkbox1: e.target.checked,isChecked:e.target.checked});
        }
        const updateAdlFormFields = updateObjects(this.state.adlFormData[identifier],{
            value: e.target.value,
            valid: (identifier!=='checkbox'&&identifier!=='checkbox1')?this.checkValidity(e.target.value,this.state.adlFormData[identifier].validations):'',
        });
        const updateAdlformObject = updateObjects(
            this.state.adlFormData,
            {[identifier] : updateAdlFormFields} 
        );
        let formIsValid =true;
        for(let ele in updateAdlformObject){
            formIsValid = updateAdlformObject[ele].valid && formIsValid;
           // alert(this.state.isChecked);
        }
        this.setState({
            adlFormData:updateAdlformObject,
            isFormValid:formIsValid});
    }
/** 12/03/2021 Validations started*/
checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }
    if (rules.isAlpha) {
        const pattern = /^[A-Za-z]+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}
  onEmpty = (e)=>{
      if(e.target.value===''){
          //alert('empty')
         const field = updateObjects(this.state.adlFormData[e.target.name],{
             isEmpty:true
         });
         const update_obj = updateObjects(this.state.adlFormData,{
             [e.target.name]:field
         });
         this.setState({adlFormData:update_obj});
         console.log(this.state.adlFormData)
      }
      else{
           const field = updateObjects(this.state.adlFormData[e.target.name],{
             isEmpty:false
         });
         const update_obj = updateObjects(this.state.adlFormData,{
             [e.target.name]:field
         });
         this.setState({adlFormData:update_obj})
      }
}
  
  isLengthGreater = (e)=>{
      if(e.target.value.length>50&&e.target.name==='name'){
          //alert('')
          this.setState({length:true})
            e.preventDefault();
      }
      else
      if(e.target.value.length>50&&e.target.name==='client'){
        this.setState({length:true})
          e.preventDefault();
    }
    else if(e.target.value.length>19&&e.target.name==='accountNumber'){
        this.setState({length:true})
          e.preventDefault();
    }
    else if(e.target.value.length>10&&e.target.name==='zipcode'){
        this.setState({length:true})
          e.preventDefault();
    }
    else{
        this.setState({length:false})
    }
  }
/** ended */

    
    handlesubmit = (e) => {
        e.preventDefault();

        var response = AddAdlForm(
            this.state.date,
            this.state.name,
            this.state.zipCode,
            this.state.accountNumber,
            this.state.client,
            this.state.checkbox,
            this.state.checkbox1,
            
        );
       response.then((res)  =>{
           //console.log(res.complaint)
           //alert('complaintID: '+ res.complaintID)
           console.log(res)
           if(res.status === 'success' && res.complaintID!=''){
               //alert("checkingmethiod")
               this.setState({
                   message: 'compalint registered successfully.',
                   success: true,
                   complaintNum:res.complaintID,
                   error:false
               })
               //alert('message;'+this.state.medssage);
               //this.props.history.push('/view-users');
           }
       });
    }

    render(){
        const styles = {
            border:'1px solid #eb346b',
        };
        const erroMessgStyle = {
            color:'#eb346b',
            fontSize:'12px',
            padding:'10px 0px 0px 5px',
        };
        return(
            <Form onSubmit={this.handlesubmit}>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Name<span className="text-danger">*</span></Form.Label>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                            style = {this.state.isEmpty?styles:{}}
                            size="sm"
                            type="text"
                            placeholder="Enter Name"
                            name="name"
                            value = {this.state.adlFormData.name.value}
                            onBlur = {(e)=>this.onEmpty(e)}
                            onKeyPress = {(e)=>this.isLengthGreater(e)}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />      {this.state.length&&!this.state.isFormValid&&
                                    !this.state.adlFormData.name.isEmpty?
                                    <div style={erroMessgStyle}>
                                    <strong>Maxlength exceeded</strong></div>:''
                                }
                                {this.state.isEmpty?<div style={erroMessgStyle}><strong>Field not empty</strong></div>:''}


                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>zipcode</Form.Label>
                            <Form.Control
                                size="sm"
                                type="number"
                                placeholder="Enter zipcode"
                                name="zipcode"
                                value = {this.state.adlFormData.zipcode.value}
                                onBlur = {(e)=>this.onEmpty(e)}
                                onKeyPress = {(e)=>this.isLengthGreater(e)}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            />
                            {this.state.length&&!this.state.isFormValid&&!this.state.isEmpty?
                                <div style={erroMessgStyle}>
                                <strong>Maxlength exceeded</strong></div>:''}
                            {this.state.isEmpty?<div style={erroMessgStyle}><strong>Field not empty</strong></div>:''}
                        </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Account Number</Form.Label>
                        <Form.Control
                            
                            size="sm"
                            type="number"
                            placeholder="Enter Account Number"
                            name="accountNumber"
                            value = {this.state.adlFormData.accountNumber.value}
                            onKeyPress = {(e)=>this.isLengthGreater(e)}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />
                        {this.state.length&&!this.state.isFormValid&&!this.state.isEmpty?
                            <div style={erroMessgStyle}>
                            <strong>Maxlength exceeded</strong></div>:''}
                       
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Date<span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                size="sm"
                                type="date"
                                name="date"
                                value = {this.state.adlFormData.date.value}
                                onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                                />
                        </Form.Group>
                        <Form.Group as={Col}>
                        <Form.Label>Client<span className="text-danger">*</span></Form.Label>
                        <Form.Control
                            size="sm"
                            type="text"
                            placeholder="Enter Client"
                            name="client"
                            value = {this.state.adlFormData.client.value}
                            onBlur = {(e)=>this.onEmpty(e)}
                            onKeyPress = {(e)=>this.isLengthGreater(e)}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                        />{this.state.length&&!this.state.isFormValid&&!this.state.isEmpty?
                            <div style={erroMessgStyle}>
                            <strong>Maxlength exceeded</strong></div>:''}
                        {this.state.isEmpty?<div style={erroMessgStyle}><strong>Field not empty</strong></div>:''}

                    </Form.Group>
                
                </Form.Row>
                <Form.Row className='mt-3 w-75'>
                    <Form.Group>
                        <Form.Check

                        type = "checkbox"
                        name = "checkbox"
                        id = "checkbox"
                        checked = {this.state.checkbox}
                        onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            label="Did the casller/customer/cardholder/account owner verbally abuse  or use discriminatory language toward you ; this may include discriminatory slurs, racial epithets, or sexually suggestive language?"
                       />
                    </Form.Group>  
                    <Form.Group>
                        <Form.Check
                            type = "checkbox"
                            name = "checkbox1"
                            id = "checkbox1"
                            checked = {this.state.checkbox1}
                            onChange = {(e) =>this.onInputChangeHandler(e,e.target.name)}
                            label="Did you  encounter a situvation where a caller/customer/cardholder/account owner makes a specific credible threat to commit a violent acr or  crime?"
                            feedback="you must agree before submiting."
                        />
                    </Form.Group>                
                </Form.Row>
                <Form.Row className="mb-3">
                            <a  className="text-primary"
                             style = {!this.state.isFormValid&& this.state.isChecked?{display: 'none'}:{}}
                             href="https://kbr-synchrony.kb.net/Article/Index/12/3?id=2344&fromwidget=false&search=true" target="_blank">Notify Mod & follow genius doc #2344</a>
                </Form.Row>
                
                <Form.Row className="justify-content-md-center">
                    <Button  type="submit"
                            disabled={!this.state.isFormValid &&this.state.isChecked}
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
export default withRouter(ADLForm)