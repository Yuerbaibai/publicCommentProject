import {combineReducers } from 'redux'
import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema as keywordSchema, getKeywordById } from './entities/keywords'
import { schema as shopSchema, getShopById} from './entities/shops'

const initialState = {
    inputText: '',
    popularKeywords: {
        isFetching: false,
        ids: []
    },
    //这里需要以inputText值为key返回的结构是键为inputText的对象
    relatedKeywords: {},
    //保存关键词id
    historyKeywords: [],
    //保存搜索结果页的SHOP数据
    searchShopsByKeywords: {}
}

export const types = {
    //获取热门关键词action types
    FETCH_POPULAR_KEYWORDS_REQUEST: 'SEARCH/FETCH_POPULAR_KEYWORDS_REQUEST',
    FETCH_POPULAR_KEYWORDS_SUCCESS: 'SEARCH/FETCH_POPULAR_KEYWORDS_SUCCESS',
    FETCH_POPULAR_KEYWORDS_FAILURE: 'SEARCH/FETCH_POPULAR_KEYWORDS_FAILURE',
    //根据输入的文本获取相关关键词的action types
    FETCH_RELATED_KEYWORDS_REQUEST: 'SEARCH/FETCH_RELATED_KEYWORDS_REQUEST',
    FETCH_RELATED_KEYWORDS_SUCCESS: 'SEARCH/FETCH_RELATED_KEYWORDS_SUCCESS',
    FETCH_RELATED_KEYWORDS_FAILURE: 'SEARCH/FETCH_RELATED_KEYWORDS_FAILURE',
    //设置当前输入的action types
    SET_INPUT_TEXT: 'SEARCH/SET_INPUT_TEXT',
    CLEAR_INPUT_TEXT: 'SEARCH/CLEAR_INPUT_TEXT',
    //设置历史查询记录的action types
    ADD_HISTORY_KEYWORDS: 'SEARCH/ADD_HISTORY_KEYWORDS',
    CLEAR_HISTORY_KEYWORDS: 'SEARCH/CLEAR_HISTORY_KEYWORDS',
    //设置搜索结果页的action types
    FETCH_SHOPS_REQUEST: 'SEARCH/FETCH_SHOPS_REQUEST',
    FETCH_SHOPS_SUCCESS: 'SEARCH/FETCH_SHOPS_SUCCESS',
    FETCH_SHOPS_FAILURE: 'SEARCH/FETCH_SHOPS_FAILURE',
}

export const actions = {
    //获取热门关键词
    loadPopularKeywords: () => {
        return (dispatch, getState) => {
            const { ids } = getState().search.popularKeywords
            if (ids.length > 0) {
                return null
            }
            const endpoint = url.getPopularKeywords()
            return dispatch(fetchPopularKeywords(endpoint))
        }
    },
    //根据输入获取相关关键词
    loadRelatedKeywords: (text) => {
        return (dispatch, getState) => {
            const { relatedKeywords } = getState().search
            if (relatedKeywords[text]) {
                return null
            }
            const endpoint = url.getRelatedKeywords(text)
            return dispatch(fetchRelatedKeywords(text, endpoint))
        }
    },
    //搜索框输入文本
    setInputText: (text) => ({
        type: types.SET_INPUT_TEXT,
        text
    }),
    clearInputText: () => ({
        type: types.CLEAR_INPUT_TEXT
    }),
    //历史查询记录
    addHistoryKeywords: (keywordId) => ({
        type: types.ADD_HISTORY_KEYWORDS,
        text: keywordId
    }),
    clearHistoryKeywords: () => ({
        type: types.CLEAR_HISTORY_KEYWORDS
    }),
    LoadSearchShopsByKeywords: (text) => {
        return (dispatch, getState) => {
            const searchShopsByKeywords = getState().search
            if(searchShopsByKeywords[text]) {
                return null
            }
            const endpoint = url.getSearchShopsByKeywords(text)
            return dispatch(fetchSearchShopsByKeywords(text,endpoint))
        }
    }
}

const fetchPopularKeywords = (endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_POPULAR_KEYWORDS_REQUEST,
            types.FETCH_POPULAR_KEYWORDS_SUCCESS,
            types.FETCH_POPULAR_KEYWORDS_FAILURE
        ],
        endpoint,
        schema: keywordSchema
    }
})

const fetchRelatedKeywords = (text, endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_RELATED_KEYWORDS_REQUEST,
            types.FETCH_RELATED_KEYWORDS_SUCCESS,
            types.FETCH_RELATED_KEYWORDS_FAILURE
        ],
        endpoint,
        schema: keywordSchema
    },
    text
})

const fetchSearchShopsByKeywords = (text, endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_SHOPS_REQUEST,
            types.FETCH_SHOPS_SUCCESS,
            types.FETCH_SHOPS_FAILURE
        ],
        endpoint,
        schema: shopSchema
    },
    text
})

//reducer
const popularKeywords = (state = initialState.popularKeywords, action) => {
    switch (action.type) {
        case types.FETCH_POPULAR_KEYWORDS_REQUEST:
            return { ...state, isFetching: true }
        case types.FETCH_POPULAR_KEYWORDS_SUCCESS:
            return { ...state, isFetching: false, ids: state.ids.concat(action.response.ids) }
        case types.FETCH_POPULAR_KEYWORDS_FAILURE:
            return { ...state, isFetching: true }
        default:
            return state
    }
}

const relatedKeywords = (state = initialState.relatedKeywords, action) => {

    switch (action.type) {
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return {
                ...state,
                [action.text]: relatedKeywordsByText(state[action.text], action)
            }
        default:
            return state
    }
}
const relatedKeywordsByText = (state = { isFetching: false, ids: [] }, action) => {
    switch (action.type) {
        case types.FETCH_RELATED_KEYWORDS_REQUEST:
            return { ...state, isFetching: true }
        case types.FETCH_RELATED_KEYWORDS_SUCCESS:
            return { ...state, isFetching: false, ids: state.ids.concat(action.response.ids) }
        case types.FETCH_RELATED_KEYWORDS_FAILURE:
            return { ...state, isFetching: true }
        default:
            return state
    }
}

const inputText = (state = initialState.inputText, action) => {
    switch (action.type) {
        case types.SET_INPUT_TEXT:
            return action.text
        case types.CLEAR_INPUT_TEXT:
            return ''
        default:
            return state
    }
}

const historyKeywords = (state = initialState.historyKeywords, action) => {
    switch (action.type) {
        case types.ADD_HISTORY_KEYWORDS:
            const data = state.filter(item => {
                if(item !==action.text) {
                    return true
                }
                return false
            })
            return [action.text, ...data]
        case types.CLEAR_HISTORY_KEYWORDS:
            return []
        default:
            return state
    }
}

const searchShopsByKeywords = (state = initialState.searchShopsByKeywords, action) => {
    switch (action.type) {
        case types.FETCH_SHOPS_REQUEST:
        case types.FETCH_SHOPS_SUCCESS:
        case types.FETCH_SHOPS_FAILURE:
            return {
                ...state,
                [action.text]: searchShopsByKeywordsByText(state[action.text], action)
            }
        default:
            return state
    }
}
const searchShopsByKeywordsByText = (state = { isFetching: false, ids: [] }, action) => {
    switch (action.type) {
        case types.FETCH_SHOPS_REQUEST:
            return { ...state, isFetching: true }
        case types.FETCH_SHOPS_SUCCESS:
            return { ...state, isFetching: false, ids: action.response.ids }
        case types.FETCH_SHOPS_FAILURE:
            return { ...state, isFetching: true }
        default:
            return state
    }
}

const reducer = combineReducers({
    popularKeywords,
    relatedKeywords,
    inputText,
    historyKeywords,
    searchShopsByKeywords
})

export default reducer

//selectors
export const getPopularKeywords = (state) => {
    return state.search.popularKeywords.ids.map(id => {
        return getKeywordById(state, id)
    })
}

export const getRelatedKeywords = (state) => {
    const text = state.search.inputText
    if (!text || text.trim().length === 0) {
        return []
    }
    const relatedKeywords = state.search.relatedKeywords[text]
    if (!relatedKeywords) {
        return []
    } 
    return relatedKeywords.ids.map(id => {
        return getKeywordById(state, id)
    })
}

export const getInputText = (state) => {
    return state.search.inputText
}

export const getHistoryKeywords = (state) => {
    return state.search.historyKeywords.map(id => {
        return getKeywordById(state, id)
    })
}

//获取搜索结果页的店铺列表
export const getSearchedShops = (state) => {
    const keywordId = state.search.historyKeywords[0]
    if(!keywordId) {
        return ""
    }
    const shops = state.search.searchShopsByKeywords[keywordId]
    return shops.ids.map(id => {
        return getShopById(state, id)
    })
}

//获取当前关键词
export const getCurrentKeyword = (state) => {
    const keywordId = state.search.historyKeywords[0]
    if(!keywordId) {
        return ""
    }
        return getKeywordById(state, keywordId).keyword
}