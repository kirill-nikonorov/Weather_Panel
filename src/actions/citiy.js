import {CALL_API} from "../middlewares/api"
import {
    deleteCityFromMonitored,
    loadCitiesByNameRequest,
    pushCityToMonitored,
    deleteCities,
    addAndMonitorCities
} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";
import {FIND_ENDPOINT} from "../constants/Api";

const fetchCitiesByName = (cityName) => ({
    [CALL_API]: {
        endpoint: FIND_ENDPOINT,
        queryParams: {
            q: cityName,
            type: 'like',
            sort: 'population',
            cnt: '30',
        },
        type: loadCitiesByNameRequest,
        schema: Schemas.CITIES,
        extractDataForNormalizingFromResponseData: ({list}) => list
    },
    cityName
});

export const loadCitiesByName = (cityName) => {
    return (fetchCitiesByName(cityName));
};
export const insertAndMonitorCities = (cities) => {
    return (addAndMonitorCities(cities));
};
export const removeCities = (cities) => {
    return (deleteCities(cities));
};

export const addCityToMonitored = (cityName) => {
    return (pushCityToMonitored(cityName));
};

export const removeCityFromMonitored = (cityName) => {
    return (deleteCityFromMonitored(cityName));
};

