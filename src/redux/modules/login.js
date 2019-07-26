const initialState = {
    username: localStorage.getItem('username') || '',
    password: '',
    isFetching: false,
    status: localStorage.getItem('login') || false //登陆状态标识
}

const types = {
    LOGIN_REQUEST: 'LOGIN/LOGIN_REQUEST',
    LOGIN_SUCCESS: 'LOGIN/LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN/LOGIN_FAILURE',
    LOGINOUT: 'LOGIN/LOGINOUT',
    SET_USERNAME: 'LOGIN/SET_USERNAME',
    SET_PASSWORD: 'LOGIN/SET_PASSWORD'
}

export const actions = {
    login: () => {
        return (dispatch, getState) => {
            const { username, password } = getState().login
            if (
                !(username && username.length > 0 && password && password.length > 0)
            ) {
                return dispatch(loginFailure('用户名和密码不能为空'))
            }
            dispatch(loginRequest())
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    localStorage.setItem('username', username)
                    localStorage.setItem('login', true)
                    dispatch(loginSuccess())
                }, 1000)
            })
        }
    },
    loginout: () => {
        localStorage.removeItem('username')
        localStorage.removeItem('login')
        return {
                type: types.LOGINOUT
        }
    },
    setUsername: (username) => ({
        type: types.SET_USERNAME,
        username
    }),
    setPassword: (password) => ({
        type: types.SET_PASSWORD,
        password
    })
}

const loginRequest = () => ({
    type: types.LOGIN_REQUEST,
})

const loginSuccess = () => ({
    type: types.LOGIN_SUCCESS
})

const loginFailure = (error) => ({
    type: types.LOGIN_FAILURE,
    error
})

//reducer

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.LOGIN_REQUEST:
            return { ...state, isFetching: true }
        case types.LOGIN_SUCCESS:
            return { ...state, isFetching: false, status: true }
        case types.LOGIN_FAILURE:
            return { ...state, isFetching: false }
        case types.LOGINOUT:
            return { ...state, username: '', password: '', status: false }
        case types.SET_USERNAME:
            return { ...state, username: action.username }
        case types.SET_PASSWORD:
            return { ...state, password: action.password }
        default:
            return state
    }
}

export default reducer

//selectors

export const getUsername = (state) => {
    return state.login.username
}

export const getPassword = (state) => {
    return state.login.password
}

export const isLogin = (state) => {
    return state.login.status
}