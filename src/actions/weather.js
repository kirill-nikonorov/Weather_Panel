import {CALL_API} from "../middlewares/api"
import {
    weatherForCityByNameRequest,
    weatherForCityByIdRequest,
    weatherForSeveralCitiesByIdsRequest
} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";

const fetchWeatherByCityName = (cityName) => ({
    [CALL_API]: {
        endpoint: "weather",
        queryParams: {
            q: cityName,
        },
        type: weatherForCityByNameRequest,
        schema: Schemas.CITY,
        extractDataForNormalizingFromResponseData: data => data
    },
    cityName
});
const fetchWeatherByCityId = (id) => ({
    [CALL_API]: {
        endpoint: "weather",
        queryParams: {
            id
        },
        type: weatherForCityByIdRequest,
        schema: Schemas.CITY,
        extractDataForNormalizingFromResponseData: data => data
    },
    id
});

const fetchWeatherForSeveralCitiesByIds = (ids) => ({
    [CALL_API]: {
        endpoint: "group",
        queryParams: {
            id: ids
        },
        type: weatherForSeveralCitiesByIdsRequest,
        schema: Schemas.CITIES,
        extractDataForNormalizingFromResponseData: ({list}) => list
    }
});

export const loadWeatherByCityName = (cityName) => {
    return (fetchWeatherByCityName(cityName));
};
export const loadWeatherByCityId = (id) => {
    return (fetchWeatherByCityId(id));
};
export const loadWeatherForSeveralCitiesByIds = (ids) => {
    return (fetchWeatherForSeveralCitiesByIds(ids.join()));
};

