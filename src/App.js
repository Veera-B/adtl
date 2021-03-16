
//import { ReactComponent } from '*.svg';
import React from 'react'
import {BrowserRouter as Router ,Route,Switch } from 'react-router-dom';
import Adlservice from './services/adl-service';
//import ApiTest from './services/APIService';

//import Test from './pages/test';


class App extends React.Component{
        render(){
                return(
                        <Router>
                                 <Switch>
                                         <Route path="/adlForm" exact component={Adlservice}/>
                                          
                                 </Switch>
                        
                         </Router>
                );
        }
}


export default App;
