import React, { Component } from 'react';
import {connect} from 'react-redux';
import * as actions from '../store/actions/adtlActions'


class ApiTest extends Component {
    componentDidMount(){
        const d = this.props.onMount();
        console.log(d);
    }
    render() {
        return (
            <div>
                <form onSubmit = {this.handleSubmit}>
                    Hello form
                    <button>Submit</button>
                </form>
                
            </div>
        )
    }
}
const mapDispatchToProps = dispatch =>{
    return{
        onMount:()=>dispatch(actions.fetchComplaints())
    }
}
export default connect(null,mapDispatchToProps)(ApiTest)
