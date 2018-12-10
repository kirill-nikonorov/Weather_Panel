import {createAction} from 'redux-actions';

export const loadCitiesByNameRequest = createAction('LOAD_CITIES_BY_NAME_REQUEST');
export const pushCityToMonitored = createAction('PUSH_CITY_TO_MONITORED');
export const deleteCityFromMonitored = createAction('DELETE_CITY_FROM_MONITORED');
