export {
    addAndMonitorCities,
    deleteCities,
    pushCityToMonitored,
    deleteCityFromMonitored
} from '../lib/reduxActions/actions/city'

import {CALL_API} from "../middlewares/api"
import {loadCitiesByNameRequest} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";
import {FIND_ENDPOINT} from "../constants/Api";

export const fetchCitiesByName = (cityName) => ({
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
    cityName: cityName.toLowerCase()
});


