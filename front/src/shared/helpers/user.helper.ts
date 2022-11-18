// Handles all the functions needed to manage User login/out and registration

import axios, { AxiosResponse, HeadersDefaults } from "axios";
import { NavigateFunction } from "react-router-dom";
import { Error, Ok } from "../interfaces/misc.interfaces";
import User, { RegistrationValues, SetUser } from "../interfaces/user.interfaces";

const auth_token = "auth_token";
const infos_user = "infos_user";

export const defaultUser: User = {
    id: 0,
    first_name: "",
    last_name: "",
    email: ""
}

async function signIn(
    email: String | undefined,
    password: String | undefined,
    setUser: SetUser,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    navigate: NavigateFunction
): Promise<[symbol, string]> {
    return await axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/users/sign_in`, { "user": { "email": email, "password": password } })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                setUserInfos(resp.data.user, setUser, resp.headers.authorization, setToken, axios.defaults.headers);
                navigate(`/user/${resp.data.user.id}`);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            };
        })
        .catch((err): [symbol, string] => { return [Error, err.response.data.message] });
}

async function signInWtihToken(
    token: string,
    setUser: SetUser,
    setToken: React.Dispatch<React.SetStateAction<string>>
): Promise<[symbol, string]> {
    return await axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user`, { headers: { authorization: token } })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                setUserInfosFromToken(resp.data.user, setUser, setToken);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            }
        })
        .catch((err): [symbol, string] => { return [Error, err.response.data.message] });
}

async function register(
    registrationValues: FormData,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    navigate: NavigateFunction
): Promise<[symbol, string]> {
    return await axios
        .post<FormData, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/users`, registrationValues)
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                setUserInfos(resp.data.user, setUser, resp.headers.authorization, setToken, axios.defaults.headers);
                navigate(`/user/${resp.data.user.id}`);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            };
        })
        .catch((err): [symbol, string] => { return [Error, err.data.message] });
}

function update(
    registrationValues: RegistrationValues,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    navigate: NavigateFunction
) {
    axios
        .patch<RegistrationValues, AxiosResponse<any, any>>(`${process.env.REACT_APP_BACKEND_URL}/users`, { "user": registrationValues })
        .then(resp => {
            if (resp.status === 200) {
                setUserInfos(resp.data.user, setUser, resp.headers.authorization, setToken, axios.defaults.headers);
                navigate(`/user/${resp.data.user.id}`);
            }
        })
        .catch(err => console.error(err));
}

async function signOut(
    token: string,
    defaultUser: User,
    setUser: SetUser,
    setToken: React.Dispatch<React.SetStateAction<string>>
): Promise<[symbol, string]> {
    return await axios
        .delete(`${process.env.REACT_APP_BACKEND_URL}/users/sign_out`, { headers: { authorization: token } })
        .then((resp): [symbol, string] => {
            if (resp.status === 200) {
                resetUserInfos(defaultUser, setUser, setToken, axios.defaults.headers);
                return [Ok, resp.data.message];
            } else {
                console.error(resp);
                return [Error, resp.data.message];
            };
        })
        .catch((err): [symbol, string] => { return [Error, err.data.message] });
}

function setUserInfos(
    user: User,
    setUser: SetUser,
    token: string,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    axiosHeaders: HeadersDefaults
) {
    setUser(user);
    setToken(token);
    localStorage.setItem(auth_token, token);
    axiosHeaders.common["Authorization"] = token;
}

function setUserInfosFromToken(
    user: User,
    setUser: SetUser,
    setToken: React.Dispatch<React.SetStateAction<string>>
) {
    setUser(user);
    setToken(localStorage.getItem(auth_token) as string);
}

function resetUserInfos(
    emptyUser: User,
    setUser: SetUser,
    setToken: React.Dispatch<React.SetStateAction<string>>,
    axiosHeaders: HeadersDefaults
) {
    setUser(emptyUser);
    setToken("");
    localStorage.removeItem(infos_user);
    localStorage.removeItem(auth_token);
    axiosHeaders.common["Authorization"] = "";
}

function getUserInfos(
    id: string,
    token: string,
    setUserProfile: React.Dispatch<React.SetStateAction<User>>,
    setIsLoaded: React.Dispatch<React.SetStateAction<boolean>>,
    setError: React.Dispatch<React.SetStateAction<boolean>>
) {
    axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/user/${id}`, { headers: { authorization: token } })
        .then(resp => {
            Object.assign(resp.data.user, { avatar: resp.data.avatar });

            setUserProfile(resp.data.user);
            setIsLoaded(true);
        })
        .catch(err => {
            console.log(err);
            setIsLoaded(true);
            setError(true);
        })
}

export { signIn, signInWtihToken, register, update, signOut, resetUserInfos, getUserInfos }