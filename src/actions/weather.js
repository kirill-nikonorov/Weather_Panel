import {CALL_API} from "../middlewares/api"

import {
    weatherForCityByNameRequest,
    weatherForCityByIdRequest,
    weatherForSeveralCitiesByIdsRequest
} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";
import {WEATHER_ENDPOINT, GROUP} from "../constants/Api";

export const fetchWeatherByCityName = (cityName) => ({
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
export const fetchWeatherByCityId = (id) => ({
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

export const fetchWeatherForSeveralCitiesByIds = (ids) => ({
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


