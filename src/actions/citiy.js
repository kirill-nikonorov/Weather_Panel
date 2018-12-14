import {CALL_API} from "../middlewares/api"
import {
    deleteCityFromMonitored, loadCitiesByNameRequest, pushCityToMonitored,
} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";

const fetchCitiesByName = (cityName) => ({
    [CALL_API]: {
        endpoint: "find",
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

export const addCityToMonitored = (cityName) => {
    return (pushCityToMonitored(cityName));
};

export const removeCityFromMonitored = (cityName) => {
    return (deleteCityFromMonitored(cityName));
};

