import { combineReducers } from 'redux'
import app from './app'
import home from './home'
import detail from './detail'
import search from './search'
import entities from './entities'
import login from './login'
import user from './user'
import purchase from './purchase'


//合并根reducer

const rootReducer = combineReducers({
    app,
    home,
    detail,
    search,
    entities,
    login,
    user,
    purchase
})

export default rootReducer

