import axios from "axios"
import {BASE_URL, API_KEY} from "../constants/api";
import {normalize} from 'normalizr'

const adjustUrl = (endpoint, queryParams) => {
    const url = endpoint.indexOf(BASE_URL) > -1 ? endpoint : BASE_URL + endpoint;
    return addParamsToUrl(url, queryParams);
};

const addParamsToUrl = (url, params = {}) => {
    params.appid = API_KEY;

    return Object.keys(params).reduce((string, param, index) => {
        const devider = index === 0 ? "" : "&";
        return `${string}${devider}${param}=${params[param]}`
    }, url + "?")
};

const configureAxios = (url) => {
    return {url, method: "GET"}
};
export const CALL_API = 'Call API';

const apiMiddleware = () => next => action => {

    const callApi = action[CALL_API];
    if (!callApi || callApi === null) return next(action);

    const actionWith = (data) => {
        const newAction = Object.assign({}, action, data);
        delete newAction[CALL_API];
      //  console.log("Итоговый экшен = ", newAction);
        return newAction;
    };

    const {endpoint, queryParams, type, schema} = callApi,
        url = adjustUrl(endpoint, queryParams),
        axiosConfig = configureAxios(url);

    axios(axiosConfig)
        .then(({data}) => {
          //  console.log("data from response = ", data);
            const normalizedData = normalize(data, schema);

            next(type(actionWith(normalizedData)))
        })
        .catch(e => {console.log(e)});

 //   console.log("callApi ", url);

};

export default apiMiddleware;