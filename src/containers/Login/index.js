import React, { Component } from 'react'
import LoginHeader from './components/LoginHeader'
import LoginForm from './components/LoginForm'
import { actions as loginActions, getUsername, getPassword, isLogin } from '../../redux/modules/login'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'

export class Login extends Component {
    render() {
        const { username, password, login, location:{ state } } = this.props
        if(login) {
            if (state && state.from) {
                return <Redirect to={state.from} />
            }
            return <Redirect to="/user" />
        }
        return (
            <div className="login">
                <LoginHeader onBack={this.handleBack}/>
                <LoginForm 
                username={username}
                password={password}
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                />
            </div>
        )
    }
    handleChange=(e)=>{
        if(e.target.name ==="username") {
            this.props.loginActions.setUsername(e.target.value)
        }
        if(e.target.name ==="password") {
            this.props.loginActions.setPassword(e.target.value)
        }
    }

    handleSubmit=()=> {
        this.props.loginActions.login()
    }

    handleBack=() => {
        this.props.history.goBack()
    }
}

const getStateToProps = (state, props) => {
    return {
        usename: getUsername(state),
        password: getPassword(state),
        login: isLogin(state)
    }
}

const getDispatchToProps = (dispatch) => {
    return { loginActions: bindActionCreators(loginActions, dispatch) }
}

export default connect(getStateToProps, getDispatchToProps)(Login)
