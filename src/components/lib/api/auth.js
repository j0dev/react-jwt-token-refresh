import { req } from './init';
import appConfig from 'components/config';

export const userLogin = ({ email, password }) =>
    req.post(`${appConfig.API_HOST}/api/v1/auth/login`, { email, password });

export const userRegister = ({ email, password1, password2 }) =>
    req.post(`${appConfig.API_HOST}/api/v1/auth/register`, {
        email,
        password1,
        password2
    });
