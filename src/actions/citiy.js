export {
    addAndMonitorCities,
    deleteCities,
    pushCityToMonitored,
    deleteCityFromMonitored
} from '../lib/reduxActions/actions/city'

import {CALL_API} from "../middlewares/api"
import {loadCitiesByNameError, loadCitiesByNameRequest, loadCitiesByNameSuccess} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";
import {FIND_ENDPOINT} from "../constants/Api";

export const fetchCitiesByName = (cityName) => {
    return {
        [CALL_API]: {
            endpoint: FIND_ENDPOINT,
            queryParams: {
                q: cityName,
                type: 'like',
                sort: 'population',
                cnt: '30',
            },
            types: [loadCitiesByNameRequest, loadCitiesByNameSuccess, loadCitiesByNameError],
            schema: Schemas.CITIES,
            extractDataForNormalizingFromResponseData: ({list}) => list
        },
        cityName: cityName.toLowerCase()
    }
};


