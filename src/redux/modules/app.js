const initialState = {
    error: null
}

export const types = {
    CLEARN_ERROR : "APP/CLEARN_ERROR"
}

export const actions = {
    clearError: () => ({
        type: types.CLEARN_ERROR
    })
}

const reducer = (state = initialState, action) => {
    const {error, type} = action;
    if (type === types.CLEARN_ERROR) {
        return {...state, error: null}
    } else if (error) {
        return {...state, error: error}
    }
    return state;
}

export default reducer;

//selectors函数
export const getError = (state) => {
    return state.app.error
}

