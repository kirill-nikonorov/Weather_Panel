import axios from "axios"
import {BASE_URL, API_KEY, adjustUrl} from "../constants/Api";
import {normalize} from 'normalizr'
import {showErrorNotification} from "../service"


const buildUrl = (endpoint, queryParams) => {
    queryParams.appid = API_KEY;

    return adjustUrl(BASE_URL, endpoint)(queryParams);
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

    const {
            endpoint,
            queryParams,
            types: [requestAction, successAction, errorAction],
            schema,
            extractDataForNormalizingFromResponseData = data => data,
        } = callApi,
        url = buildUrl(endpoint, queryParams),
        axiosConfig = configureAxios(url);

    next(requestAction(actionWith()));

    axios(axiosConfig)
        .then((response) => {
            const {data} = response;
            //  console.log(data);
            //  console.log("data from response = ", data);
            const dataForNormalizing = extractDataForNormalizingFromResponseData(data);

            const normalizedData = normalize(dataForNormalizing, schema);


            next(successAction(actionWith(normalizedData)))
        })
        .catch(e => {
            showErrorNotification("ошибка запроса", e);
            next(errorAction(actionWith({e: e.message})))

            console.log(e)
        });
};

export default apiMiddleware;