import { getProductDetail } from './entities/products'
import { AVAILABLE_TYPE, actions as orderActions } from './entities/orders'
import { createSelector } from 'reselect';

const initialState = {
    quantity: 1,
    showTip: false
}

const types = {
    SET_ORDER_QUANTITY: 'PURCHASE/SET_ORDER_QUANTITY',
    CLOSE_TIP: 'PURCHASE/CLOSE_TIP',
    SUBMIT_ORDER_REQUEST: 'PURCHASE/SUBMIT_ORDER_REQUEST',
    SUBMIT_ORDER_SUCCESS: 'PURCHASE/SUBMIT_ORDER_SUCCESS',
    SUBMIT_ORDER_FAILURE: 'PURCHASE/SUBMIT_ORDER_FAILURE',
}

export const actions = {
    setOrderQuantity: (quantity) => ({
        type: types.SET_ORDER_QUANTITY,
        quantity
    }),
    closeTip: () => ({
        type: types.CLOSE_TIP
    }),
    submitOrder: (productId) => {
        return (dispatch, getState) => {
            dispatch({ type: types.SUBMIT_ORDER_REQUEST })
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const product = getProductDetail(getState(), productId)
                    const { currentPrice = 999999, validityPeriod = '2018-10-20至2019-09-15', product: productName, shop } = product
                    const quantity = getState().purchase.quantity
                    const totalPrice = (quantity * currentPrice).toFixed(1)
                    const text1 = `${quantity}张 | 总价：${totalPrice}`
                    const vaildDate = validityPeriod.substring(11)
                    const text2 = `有效期至${vaildDate}`
                    const order = {
                        title: `${shop}:${productName}`,
                        orderPicUrl: product.picture,
                        channel: "团购",
                        statusText: "待消费",
                        text: [text1, text2],
                        type: AVAILABLE_TYPE
                    }
                    dispatch(orderActions.addOrder(order))
                    dispatch({ type: types.SUBMIT_ORDER_SUCCESS })
                }, 500)
            })
        }
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SET_ORDER_QUANTITY:
            return { ...state, quantity: action.quantity }
        case types.CLOSE_TIP:
            return { ...state, showTip: false }
        case types.SUBMIT_ORDER_SUCCESS:
            return { ...state, showTip: true }
        default:
            return state
    }
}

export default reducer

//selectors

export const getQuantity = state => {
    return state.purchase.quantity
}

export const getTipStatus = state => {
    return state.purchase.showTip
}

export const getProducts = (state, id) => {
    return getProductDetail(state, id)
}

//使用reselect.js库
export const getTotalPrice = createSelector([getQuantity, getProducts], (quantity, product) => {
    if (!product) {
        return 0
    }
    return (product.currentPrice * quantity).toFixed(1)
})