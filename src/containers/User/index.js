import React, { Component } from 'react'
import UserHeader from './components/UserHeader'
import UserMain from './containers/UserMain'
import { actions as userActions, getCurrentTab, getOrders } from '../../redux/modules/user'
import { actions as loginActions } from '../../redux/modules/login'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import {withRouter} from 'react-router-dom'

class User extends Component {
    render() {
        const { orders } = this.props
        return (
            <div>
                <UserHeader onBack={this.handleBack} onLoginOut={this.handleLoginOut} />
                <UserMain data={orders} />
            </div>
        )
    }

    componentDidMount() {
        this.props.userActions.loadOrders()
    }

    handleBack = () => {
        this.props.history.push("/")
    }
    handleLoginOut = () => {
        this.props.loginActions.loginout()
    }
    handleSetCurrentTab = (index) => {
        this.props.userActions.setCurrentTab(index)
    }
}

const mapStateToProps = state => ({
    orders: getOrders(state),
    currentTab: getCurrentTab(state)
})

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        loginActions: bindActionCreators(loginActions, dispatch)
    }
}


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(User))
