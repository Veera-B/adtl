import React from 'react'
import {Container,Row,Col,Card,Form,Button} from 'react-bootstrap'
import ADLForm from '../components/AdlForm.js'

class Adlservice extends React.Component{
    render(){
        const headingDiv={
            borderBottom: '1px solid #d7d7d7',
            marginBottom: '10px'
        }
        const textmar={
            marginLeft: '110px'
        }
        return(
            <Container className="container pt-5 pl-5 pr-5 mb-0">
                <Row>
                    <Col xs={12} className="mt-3">
                        <div className="bg-secondary text-warning">
                            <h4 style={{marginLeft:'90px'}}>abusive,  Discriminatory and/or threating language form</h4>
                        </div>
                        <div className='' style={headingDiv}style={{paddingTop:'0px',marginTop:'-8px',paddingLeft:'10px'}}>
                                <li class="navbar-brand" style={{paddingTop:'0px', paddingBottom:'0px', backgroundColor:'#ffffff',marginLeft:'-10px',fontSize:'15px'}}><strong>Account information</strong></li>
                                {/*<Button size="sm">X</Button> save it run tammudu save chesi run cheyi save it*/}
                        </div>
                       <Card className="card">
                           <div className="card-body">
                                <ADLForm />
                            </div>
                       </Card>
                    </Col>
                </Row>
            </Container>
        )
        
    }

}


export default Adlservice;