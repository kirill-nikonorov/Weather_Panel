import {CALL_API} from "../middlewares/api"
import {
    weatherForCityByNameRequest,
    weatherForCityByIdRequest,
    weatherForSeveralCitiesByIdsRequest
} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";
import {WEATHER_ENDPOINT, GROUP} from "../constants/Api";

const fetchWeatherByCityName = (cityName) => ({
    [CALL_API]: {
        endpoint: WEATHER_ENDPOINT,
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
        endpoint: WEATHER_ENDPOINT,
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
        endpoint: GROUP,
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

