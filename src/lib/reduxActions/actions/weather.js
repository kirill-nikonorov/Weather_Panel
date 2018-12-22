import {createActions} from 'redux-actions';

export const {weatherForCityByIdRequest, weatherForCityByIdSuccess} = createActions(
    'WEATHER_FOR_CITY_BY_ID_REQUEST',
    'WEATHER_FOR_CITY_BY_ID_SUCCESS'
);

// не разрешает запрос Api
// export const weatherForSeveralCitiesByIdsRequest = createAction('FETCH_WEATHER_FOR_SEVERAL_CITIES_BY_IDS_REQUEST');
// не нужен
// export const weatherForCityByNameRequest = createAction('WEATHER_FOR_CITY_BY_NAME_REQUEST');
