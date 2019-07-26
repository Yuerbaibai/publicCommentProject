import React, { Component } from 'react'
import { isLogin } from '../../redux/modules/login';
import {connect} from 'react-redux'
import {Route, Redirect} from 'react-router-dom'

class PrivateRoute extends Component {
    render() {
        const { component: Component, login, ...rest } = this.props
        return (
            <Route
                {...rest}
                render={(props) => {
                    return login ? (<Component />) : (<Redirect to={{ pathname: '/login', state: { from: props.location } }} />)
                }}
            ></Route>
        )
    }
}

const getStateToProps = (state) => {
   return {login: isLogin(state)}
}

export default connect(getStateToProps, null)(PrivateRoute)
