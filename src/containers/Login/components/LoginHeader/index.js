import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './style.css'

export class LoginHeader extends Component {
    render() {
        return (
            <div className="loginHeader">
                <Link to='/' className="loginHeader__back"></Link>
                <div className="loginHeader__title">账号密码登陆</div>
            </div>
        )
    }
}

export default LoginHeader
