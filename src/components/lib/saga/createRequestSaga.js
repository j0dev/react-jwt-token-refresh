import { call, put } from 'redux-saga/effects';
import { startLoading, finishLoading } from 'components/store/loading';

const createRequestSaga = (type, request) => {
    const SUCCESS = `${type}_SUCCESS`;
    const FAILURE = `${type}_FAILURE`;

    return function* generator(action) {
        yield put(startLoading(type)); // 로딩 시작
        try {
            const response = yield call(request, action.payload);
            yield put({
                type: SUCCESS,
                payload: response.data,
                params: action.payload,
            });
        } catch (e) {
            yield put({
                type: FAILURE,
                payload: e.response,
                params: action.payload,
            });
        }

        yield put(finishLoading(type)); // 로딩 끝
    };
}

export default createRequestSaga;
