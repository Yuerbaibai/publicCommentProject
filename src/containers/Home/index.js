import React, { Component } from 'react'
import propTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Category from './components/Category'
import Headline from './components/Headline'
import Discount from './components/Discount'
import LikeList from './components/LikeList'
import HomeHeader from './components/HomeHeader'
import Activity from './components/Activity'
import Banner from '../../components/Banner'
import Footer from '../../components/Footer'
import { actions as homeActions, getLikes, getDiscounts, getPageCountOfLikes } from '../../redux/modules/home'

class Home extends Component {
    render() {
        const { likes, discounts, pageCount } = this.props
        return (
            <div>
                <HomeHeader />
                <Banner />
                <Category />
                <Headline />
                <Activity />
                <Discount data={discounts} />
                <LikeList data={likes} pageCount={pageCount} fetchData={this.fetchMoreLikes} />
                <Footer />
            </div>
        )
    }
    fetchMoreLikes = () => {
        this.props.homeActions.loadLikes()
    }
    componentDidMount() {
        this.props.homeActions.loadDiscounts()
    }
}


const mapStateToProps = (state, props) => {
    return {
        likes: getLikes(state),
        discounts: getDiscounts(state),
        pageCount: getPageCountOfLikes(state)
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        homeActions: bindActionCreators(homeActions, dispatch)
    }
}

Home.propTypes = {
    likes: propTypes.array,
    discounts: propTypes.array,
    pageCount: propTypes.number
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
