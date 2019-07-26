import createReducer from "../../../utils/createReducer";

export const schema = {
    name: 'orders',
    id: 'id'
}

export const USER_TYPE = 1  //已消费
export const TO_PAY_TYPE = 2  //待付款
export const AVAILABLE_TYPE = 3  //可使用
export const REFUND_TYPE = 4  //退款订单

export const types = {
    //删除订单
    DELETE_ORDER: 'OREDER/DELETE_ORDER',
    //新增评价
    ADD_COMMENT: 'ORDER/ADD_COMMENT',
    //增加订单
    ADD_ORDER: 'ORDER/ADD_ORDER'
}

let orderIdCounter = 10

export const actions = {
    deleteOrder: (orderId) => ({
        type: types.DELETE_ORDER,
        orderId
    }),
    addComment: (orderId, commentId) => ({
        type: types.ADD_COMMENT,
        orderId,
        commentId
    }),
    addOrder: (order) => {
        const orderId = `s-${orderIdCounter++}`
        return {
            type: types.ADD_ORDER,
            orderId,
            order: { ...order, id: orderId }
        }
    }
}

const normalReducer = createReducer(schema.name)

const reducer = (state, action) => {
    if (action.type === types.ADD_COMMENT) {
        return {
            ...state,
            [action.orderId]: {
                ...state[action.orderId],
                commentId: action.commentId
            }
        }
    } else if (action.type === types.ADD_ORDER) {
        return {
            ...state,
            [action.orderId]: action.order
        }
    } else if (action.type === types.DELETE_ORDER) {
        const { [action.orderid]: deleteOrder, ...restOrders } = state
        return restOrders
    } else {
        return normalReducer(state, action)
    }
}

export default reducer;

//selectors

export const getOrderById = (state, id) => state.entities.orders[id] 

export const getAllOrders = (state) => state.entities.orders
