import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SerachBox from './components/SearchBox'
import PopularSearch from './components/PopularSearch'
import SearchHistory from './components/SearchHistory'
import {
    actions as searchActions,
    getPopularKeywords, getRelatedKeywords, getInputText, getHistoryKeywords
} from '../../redux/modules/search'

export class Search extends Component {
    render() {
        const { popularKeywords, relatedKeywords, inputText, historyKeywords } = this.props
        return (
            <div className="search">
                <SerachBox
                    inputText={inputText}
                    relatedKeywords={relatedKeywords}
                    onChange={this.handleChangeInput}
                    onClear={this.handleClear}
                    onCancel={this.handleCancel}
                    onClickItem={this.handleClickItem}
                />
                <PopularSearch
                    data={popularKeywords}
                    onClickItem={this.handleClickItem} />
                <SearchHistory
                    data={historyKeywords}
                    onClickItem={this.handleClickItem}
                    onClear={this.handleClearHistory} />
            </div>
        )
    }

    componentDidMount() {
        const { loadPopularKeywords } = this.props.searchActions
        loadPopularKeywords()
    }
    componentWillUnmount() {
        const { clearInputText } = this.props.searchActions
        clearInputText()
    }
    //搜索框文本变化
    handleChangeInput = (text) => {
        const { setInputText, loadRelatedKeywords } = this.props.searchActions
        setInputText(text)
        loadRelatedKeywords(text)
    }
    //清空搜索框内容
    handleClear = () => {
        const { clearInputText } = this.props.searchActions
        clearInputText()
    }
    //取消搜索
    handleCancel = () => {
        this.handleClear()
        this.props.history.goBack()
    }
    //处理点击关键词逻辑
    handleClickItem = (item) => {
        const { setInputText, addHistoryKeywords, LoadSearchShopsByKeywords} = this.props.searchActions
        setInputText(item.keyword)
        addHistoryKeywords(item.id)
        LoadSearchShopsByKeywords(item.id)
        //跳转结果页
        this.props.history.push("/search_result")

    }
    //清除历史记录
    handleClearHistory = () => {
        const { clearHistoryKeywords } = this.props.searchActions
        clearHistoryKeywords()
    }

}

const mapStateToProps = (state, props) => {
    return {
        popularKeywords: getPopularKeywords(state),
        relatedKeywords: getRelatedKeywords(state),
        inputText: getInputText(state),
        historyKeywords: getHistoryKeywords(state)
    }
}
const mapDispatchToProps = (dispatch) => {
    return { searchActions: bindActionCreators(searchActions, dispatch) }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
