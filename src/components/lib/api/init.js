/* eslint no-underscore-dangle: 0 */
import axios from 'axios';
import appConfig from 'components/config';

export const req = axios.create({
    // 비 로그인 상태 
    timeout: 60,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

export const authReq = axios.create({
    // 로그인 상태
    timeout: 120,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
});

authReq.interceptors.request.use(
    config => {
        // 토큰 확인
        const token = localStorage.getItem(appConfig.ACCESS_TOKEN);
        config.headers.Authorization = `Bearer ${token}`;
        config.headers['Content-Type'] = 'application/json';

        return config;
    },
    error => Promise.reject(error)
);

authReq.interceptors.response.use(
    // token refresh
    // http status 401(Unauthorized) 인 경우 토큰 갱신 후, 다시 요청
    response => response,
    async err => {
        const originalReq = err.config;
        if (err.response.status === 401 && err.config && !err.config.__isRetryRequest) {
            // 401 이고, err.config가 있고, retry reqeust가 아니면 토큰 만료라고 판단하여 refresh 요청
            originalReq._retry = true;
            try {
                const res = await axios.post(`${config.authAdminApiUrl}/api/v1/auth/token/refresh/`, {
                    refresh_token: localStorage.getItem(appConfig.REFRESH_TOKEN)
                });
                const data = res.data;

                localStorage.setItem(appConfig.ACCESS_TOKEN, data.data.access_token);
                localStorage.setItem(appConfig.REFRESH_TOKEN, data.data.refresh_token);

                originalReq.headers.Authorization = `Bearer ${data.data.access_token}`;

                return axios(originalReq);
            } catch (error) {
                // refresh 토큰도 만료되었거나 오류 발생 시
                window.location.href = '/auth/logout';
                
                return Promise.reject(err);
            }
        }
        return Promise.reject(err);
    }
);
