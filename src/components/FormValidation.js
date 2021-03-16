import React, { Component } from 'react';
import {Form,Col,Button,InputGroup } from 'react-bootstrap';
class FormValidation extends Component {
    
    
state = {
    validated: false,
}
    
    handleSubmit = (event) => {
        alert('event')
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
      };
      handleCheck = (e,type)=>{
          let a = [];
          a.push(e.target.checked);
          console.log(a)
          a.forEach(e=>{
              if(e){
                  console.log(e)
              }
              else{
                  console.log("False",e);
              }
          })
//console.log(e.target.checked,type)
      }
    render() {
        return (
    
                <Form noValidate validated={this.state.validated} onSubmit={this.handleSubmit}>
                  
                  <Form.Group>
                    
                    {[{type:'checkbox',name:'check1'},{type:'checkbox',name:'check2'}]
                        .map((type) => (
                        <div key={type} className="mb-3">
                          <Form.Check type={type.type} id={`check-api-${type.type}`}>
                            <Form.Check.Input type={type.type} isValid 
                                onChange = {(e)=>this.handleCheck(e,type)}/>
                            <Form.Check.Label>{`Veera ${type.name}`}</Form.Check.Label>
                            <Form.Control.Feedback type="valid">You did it!</Form.Control.Feedback>
                          </Form.Check>
                        </div>
                      ))}
                    
                  </Form.Group>
                  <Button type="submit">Submit form</Button>
                </Form>
              );          
    }
}

export default FormValidation
