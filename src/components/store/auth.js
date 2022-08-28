import { createAction, handleActions } from 'redux-actions';
import { takeLatest } from 'redux-saga/effects';
import createRequestSaga from 'components/lib/saga/createRequestSaga';
import createRequestActionTypes from 'components/lib/saga/createRequestActionTypes';
import * as authAPI from 'components/lib/api/auth';

// ==============================|| ACTIONS ||============================== //

const LOGOUT = 'LOGOUT';

const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('LOGIN');

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('REGISTER');

export const userLogin = createAction(LOGIN, ({ email, password }) => ({
    email,
    password
}));

export const userRegister = createAction(REGISTER, ({ email, password1, password2 }) => ({
    email,
    password1,
    password2
}));

export const logout = createAction(LOGOUT);

// ==============================|| STATE ||============================== //

export const initialState = {
    error: {
        type: null,
        description: null
    },
    result: { type: null, description: null },
    user: null,
    isLoggedIn: false
};

// ==============================|| SAGA ||============================== //

// saga 생성
const userLoginSaga = createRequestSaga(LOGIN, authAPI.userLogin);
const userRegisterSaga = createRequestSaga(REGISTER, authAPI.userRegister);

export function* authSaga() {
    yield takeLatest(LOGIN, userLoginSaga);
    yield takeLatest(REGISTER, userRegisterSaga);
}

// ==============================|| REDUCER ||============================== //

const auth = handleActions(
    {
        [LOGIN_SUCCESS]: (state, { payload: data }) => ({
            ...state,
            error: initialState.error,
            user: data.user,
            isLoggedIn: true
        }),
        [LOGIN_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error: {
                type: 'login',
                description: error.data.msg
            }
        }),
        [REGISTER_SUCCESS]: (state, { payload: data }) => ({
            ...state,
            error: initialState.error,
            result: data.msg,
            isLoggedIn: false
        }),
        [REGISTER_FAILURE]: (state, { payload: error }) => ({
            ...state,
            error: {
                type: 'register',
                description: error.data.msg
            }
        }),
        [LOGOUT]: state => ({
            ...state,
            error: initialState.error,
            user: initialState.user,
            isLoggedIn: false
        })
    },
    initialState
);

export default auth;
