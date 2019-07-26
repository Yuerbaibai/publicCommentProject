import React, { Component } from 'react'
import './style.css'

class LoginForm extends Component {
    render() {
        const { username, password, onSubmit, onChange } = this.props
        return (
            <div className="loginForm">
                <div className="loginForm__inputContainer">
                    <div className="loginForm__row">
                        <label className="loginForm__mobileLabel">86</label>
                        <input className="loginForm__input" name="username" onChange={onChange} value={username}/>
                    </div>
                    <div className="loginForm__row">
                        <label className="loginForm__passwordLabel">密码</label>
                        <input className="loginForm__input" name="password" type="password" onChange={onChange} value={password}/>
                    </div>
                </div>
                <div className="loginForm__btnContainer">
                    <button className="loginForm__btn" onClick={onSubmit}>登陆</button>
                </div>
            </div>
        )
    }
}

export default LoginForm
