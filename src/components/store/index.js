// thire party
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { all } from 'redux-saga/effects';
import auth, { authSaga } from './auth';
import loading from './loading';

// ==============================|| REDUX  ||============================== //

const rootReducer = combineReducers({
    auth: persistReducer(
        {
            key: 'auth',
            storage,
            whitelist: ['isLoggedIn', 'user']
        },
        auth,
        loading
    )
});
// ==============================|| REDUX-SAGA ||============================== //

export function* rootSaga() {
    yield all([authSaga()]);
}

export default rootReducer;
