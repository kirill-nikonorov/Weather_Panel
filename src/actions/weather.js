import {CALL_API} from '../middlewares/api';

import {weatherForCityByIdRequest, weatherForCityByIdSuccess} from '../lib/reduxActions/actions';
import {Schemas} from '../constants/Schemas';
import {WEATHER_ENDPOINT} from '../constants/Api';

export const fetchWeatherByCityId = id => ({
    [CALL_API]: {
        endpoint: WEATHER_ENDPOINT,
        queryParams: {
            id
        },
        types: [weatherForCityByIdRequest, weatherForCityByIdSuccess],
        schema: Schemas.CITY,
        extractDataForNormalizingFromResponseData: data => data
    },
    id
});

/* не разрешает запрос
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
*/
