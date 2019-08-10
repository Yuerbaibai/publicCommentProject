import url from '../../utils/url'
import { FETCH_DATA } from '../middleware/api'
import { schema as orderSchema, TO_PAY_TYPE, AVAILABLE_TYPE, REFUND_TYPE, getOrderById, getAllOrders, actions as orderActions, types as orderTypes } from './entities/orders'
import { combineReducers } from 'redux'
import { actions as commentActions } from './entities/comments'
import { createSelector } from 'reselect';

const typeToKey = {
    TO_PAY_TYPE: "toPayIds",
    AVAILABLE_TYPE: "availableIds",
    REFUND_TYPE: "refundIds"
}

const initialState = {
    orders: {
        isFetching: false,
        fetched: false,//为解决下完一个订单后，个人中心页只显示当前订单的情况，在actions。loadOrders中满足ids && ids.length > 0，不再获取订单数据
        ids: [],
        toPayIds: [],//待付款id
        availableIds: [],//可使用id
        refundIds: []//退款订单id
    },
    currentTab: 0,
    currentOrder: {
        id: null,
        isDeleting: false,
        isCommenting: false,
        comment: '',
        stars: 0
    }
}

const types = {
    //获取个人订单的action types
    FETCH_ORDERS_REQUEST: 'USER/FETCH_ORDERS_REQUEST',
    FETCH_ORDERS_SUCCESS: 'USER/FETCH_ORDERS_SUCCESS',
    FETCH_ORDERS_FAILURE: 'USER/FETCH_ORDERS_FAILURE',
    //获取tab的action types
    SET_CURRENT_TAB: 'USER/SET_CURRENT_TAB',
    //删除订单的action types
    DELETE_ORDER_REQUEST: 'USER/DELETE_ORDER_REQUEST',
    DELETE_ORDER_SUCCESS: 'USER/DELETE_ORDER_SUCCESS',
    DELETE_ORDER_FAILURE: 'USER/DELETE_ORDER_FAILURE',
    //是否显示删除框
    SHOW_DELETE_DIALOG: 'USER/SHOW_DELETE_DIALOG',
    HIDE_DELETE_DIALOG: 'USER/HIDE_DELETE_DIALOG',
    //显示或隐藏评论框
    SHOW_COMMENT_AREA: 'USER/SHOW_COMMENT_AREA',
    HIDE_COMMENT_AREA: 'USER/HIDE_COMMENT_AREA',
    //设置评论信息
    SET_COMMENT: 'USER/SET_COMMENT',
    //设置打分信息
    SET_STARS: 'USER/SET_STARS',
    //提交评论
    POST_COMMENT_REQUEST: 'USER/POST_COMMENT_REQUEST',
    POST_COMMENT_SUCCESS: 'USER/POST_COMMENT_SUCCESS',
    POST_COMMENT_FAILURE: 'USER/POST_COMMENT_FAILURE'
}

export const actions = {
    //获取订单列表
    loadOrders: () => {
        return (dispatch, getState) => {
            const { fetched } = getState().user.orders
            if (fetched) {
                return null
            }
            const endpoint = url.getOrderByUser()
            return dispatch(fetchOrders(endpoint))
        }
    },
    //获取当前tab
    setCurrentTab: (index) => ({
        type: types.SET_CURRENT_TAB,
        index

    }),
    removeOrder: () => {
        return (dispatch, getState) => {
            const { id } = getState().user.currentOrder
            if (id) {
                dispatch(deleteOrderRequest())
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        dispatch(deleteOrderSuccess(id))
                        dispatch(orderActions.deleteOrder(id))
                        resolve()
                    }, 500)
                })
            }
        }
    },
    showDeleteDialog: (orderId) => ({
        type: types.SHOW_DELETE_DIALOG,
        orderId
    }),
    hideDeleteDialog: () => ({
        type: types.HIDE_DELETE_DIALOG
    }),
    showCommentArea: (orderId) => ({
        type: types.SHOW_COMMENT_AREA,
        orderId
    }),
    hideCommentArea: () => ({
        type: types.HIDE_COMMENT_AREA,
    }),
    setComment: comment => ({
        type: types.SET_COMMENT,
        comment
    }),
    setStars: stars => ({
        type: types.SET_STARS,
        stars
    }),
    submitComment: () => {
        return (dispatch, getState) => {
            dispatch(postCommentRequest())
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const { currentOrder: { id, stars, comment } } = getState().user
                    const commentObj = {
                        id: Date(),
                        stars: stars,
                        comment: comment
                    }
                    dispatch(postCommentSuccess())
                    dispatch(commentActions.addComment(commentObj))
                    dispatch(orderActions.addComment(id, commentObj.id))
                    resolve()
                })
            })
        }
    }
}

const deleteOrderRequest = () => ({
    type: types.DELETE_ORDER_REQUEST
})

const deleteOrderSuccess = orderId => ({
    type: types.DELETE_ORDER_SUCCESS,
    orderId
})

const fetchOrders = (endpoint) => ({
    [FETCH_DATA]: {
        types: [
            types.FETCH_ORDERS_REQUEST,
            types.FETCH_ORDERS_SUCCESS,
            types.FETCH_ORDERS_FAILURE
        ],
        endpoint,
        schema: orderSchema
    }
})

const postCommentRequest = () => ({
    type: types.POST_COMMENT_REQUEST
})

const postCommentSuccess = () => ({
    type: types.POST_COMMENT_SUCCESS
})

const orders = (state = initialState.orders, action) => {
    switch (action.type) {
        case types.FETCH_ORDERS_REQUEST:
            return { ...state, isFetching: true }
        case types.FETCH_ORDERS_SUCCESS:
            const toPayIds = action.response.ids.filter(id => action.response.orders[id].type === TO_PAY_TYPE)
            const availableIds = action.response.ids.filter(id => action.response.orders[id].type === AVAILABLE_TYPE)
            const refundIds = action.response.ids.filter(id => action.response.orders[id].type === REFUND_TYPE)
            return {
                ...state,
                isFetching: false,
                fetched: true,
                ids: state.ids.concat(action.response.ids),
                toPayIds: state.toPayIds.concat(toPayIds),
                availableIds: state.availableIds.concat(availableIds),
                refundIds: state.refundIds.concat(refundIds),
            }
        case orderTypes.DELETE_ORDER:
        case types.DELETE_ORDER_SUCCESS:
            return {
                ...state,
                ids: removeOrderId(state, 'ids', action.orderId),
                toPayIds: removeOrderId(state, 'toPayIds', action.orderId),
                availableIds: removeOrderId(state, 'availableIds', action.orderId),
                refundIds: removeOrderId(state, 'refundIds', action.orderId)
            }
        case orderTypes.ADD_ORDER:
            const { order } = action
            const key = typeToKey[order]
            return key ? {
                ...state,
                ids: [order.id].concat(state.ids),
                [key]: [order.id].concat(state[key])
            } : {
                    ...state,
                    ids: [order.id].concat(state.ids),
                }
        case types.FETCH_ORDERS_FAILURE:
            return { ...state, isFetching: false }
        default:
            return state
    }
}

const removeOrderId = (state, key, orderId) => {
    return state[key].filter(id => {
        return id !== orderId
    })
}

const currentTab = (state = initialState.currentTab, action) => {
    switch (action.type) {
        case types.SET_CURRENT_TAB:
            return action.index
        default:
            return state
    }
}

const currentOrder = (state = initialState.currentOrder, action) => {
    switch (action.type) {
        case types.SHOW_DELETE_DIALOG:
            return { ...state, isDeleting: true, id: action.orderId }
        case types.SHOW_COMMENT_AREA:
            return { ...state, id: action.orderId, isCommenting: true }
        case types.HIDE_DELETE_DIALOG:
        case types.HIDE_COMMENT_AREA:
        case types.DELETE_ORDER_SUCCESS:
        case types.DELETE_ORDER_FAILURE:
        case types.POST_COMMENT_SUCCESS:
        case types.POST_COMMENT_FAILURE:
            return initialState.currentOrder
        case types.SET_COMMENT:
            return { ...state, comment: action.comment }
        case types.SET_STARS:
            return { ...state, stars: action.stars }
        default:
            return state
    }
}

const reducer = combineReducers({
    orders,
    currentTab,
    currentOrder
})

export default reducer

//selectors
export const getCurrentTab = state => state.user.currentTab

// export const getOrders = state => {
//     const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][state.user.currentTab]
//     return state.user.orders[key].map(id => {
//         return getOrderById(state, id)
//     })
// }

/*                               用reselect对getOrders进行改造                        开始    */ 
const getUserOrders = state => state.user.orders

export const getOrders = createSelector([getCurrentTab, getUserOrders, getAllOrders], (tabIndex, userOrders, orders) => {
    const key = ['ids', 'toPayIds', 'availableIds', 'refundIds'][tabIndex]
    const orderIds = userOrders[key]
    return orderIds.map(id => {
        return orders[id]
    })
})
/*                               用reselect对getOrders进行改造                        结束   */ 

//获取正在删除的订单id
export const getDeletingOrderId = (state) => {
    return state.user.currentOrder && state.user.currentOrder.isDeleting ? state.user.currentOrder.id : null
}

//获取正在评论的订单id
export const getcommentingOrderId = (state) => {
    return state.user.currentOrder && state.user.currentOrder.isCommenting ? state.user.currentOrder.id : null
}

//获取当前的评论信息
export const getCurrentOrderComment = state => {
    return state.user.currentOrder ? state.user.currentOrder.comment : ''
}

//获取当前打分信息
export const getCurrentOrderStars = state => {
    return state.user.currentOrder ? state.user.currentOrder.stars : 0
}