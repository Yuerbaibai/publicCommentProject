import React, { Component } from 'react'
import { connect } from 'react-redux'
import SearchList from './components/ShopList'
import SearchHeader from './components/SearchHeader'
import KeywordBox from './components/KeywordBox'
import Banner from '../../components/Banner'
import {getSearchedShops, getCurrentKeyword} from '../../redux/modules/search'

class SearchResult extends Component {
    render() {
        const {searchShopsByKeywords,  currentKeyword } = this.props
        console.log(this.props)
        return (
            <div className="searchResult">
                <SearchHeader onBack={this.handleBack} onSearch={this.handleSearch} />
                <KeywordBox text={currentKeyword} />
                <Banner dark/>
                <SearchList data={searchShopsByKeywords}/>

            </div>
        )
    }
    handleBack = () => {
        this.props.history.push('/')
    }

    handleSearch = () => {
        this.props.history.push('/search')
    }
}

const mapStateToProps = (state, props) => {
    console.log(getSearchedShops(state))
    return {
        searchShopsByKeywords: getSearchedShops(state),
        currentKeyword: getCurrentKeyword(state)
    }
}

export default connect(mapStateToProps, null)(SearchResult)
