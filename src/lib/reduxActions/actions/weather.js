import {createAction} from 'redux-actions';

export const weatherForCityByNameRequest = createAction('WEATHER_FOR_CITY_BY_NAME_REQUEST');
export const weatherForCityByIdRequest = createAction('WEATHER_FOR_CITY_BY_ID_REQUEST');
export const weatherForSeveralCitiesByIdsRequest = createAction('FETCH_WEATHER_FOR_SEVERAL_CITIES_BY_IDS_REQUEST');
