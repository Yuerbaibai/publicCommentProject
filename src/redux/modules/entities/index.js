import { combineReducers } from 'redux'
import orders from './orders'
import comments from './comments'
import shops from './shops'
import products from './products'
import keywords from './keywords'

//合并根reducer

const rootReducer = combineReducers({
    orders,
    comments,
    shops,
    products,
    keywords
})

export default rootReducer