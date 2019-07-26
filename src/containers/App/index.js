import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import ErrorToast from '../../components/ErrorToast/index'
import { actions as appActions, getError } from '../../redux/modules/app';
// import Home from '../Home'
// import ProductDetail from '../ProductDetail';
// import Search from '../Search'
// import SearchResult from '../SearchResult'
// import Login from '../Login'
// import User from '../User'
// import Purchase from '../Purchase'
import PrivateRoute from '../PrivateRoute'
import asyncComponent from '../../utils/AsyncComponent'
import './style.css';

const Home = asyncComponent(() => import('../Home'))
const ProductDetail = asyncComponent(() => import('../ProductDetail'))
const Search = asyncComponent(() => import('../Search'))
const SearchResult = asyncComponent(() => import('../SearchResult'))
const Login = asyncComponent(() => import('../Login'))
const User = asyncComponent(() => import('../User'))
const Purchase = asyncComponent(() => import('../Purchase'))

class App extends Component {
  render() {
    const { error, appActions: { clearError } } = this.props
    return (
      <div className="App">
        <Router basename="/dianping">
          <Switch>
            <Route path="/login" component={Login} />
            <PrivateRoute path="/user" component={User} />
            <PrivateRoute path="/purchase/:id" component={Purchase} />
            <Route path="/detail/:id" component={ProductDetail} />
            <Route path="/search" component={Search} />
            <Route path="/search_result" component={SearchResult} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>
        {error ? <ErrorToast msg={error} clearError={clearError} /> : null}
      </div>
    )
  }
}

//容器型组件专有
const mapStateToProps = (state, props) => {
  return {
    error: getError(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
