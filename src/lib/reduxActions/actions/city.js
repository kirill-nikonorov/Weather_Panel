import {createActions, createAction} from 'redux-actions';

export const {citiesByNameRequest, citiesByNameSuccess, citiesByNameError} = createActions(
    'CITIES_BY_NAME_REQUEST',
    'CITIES_BY_NAME_SUCCESS',
    'CITIES_BY_NAME_ERROR'
);

export const addAndMonitorCities = createAction('ADD_AND_MONITOR_CITIES');
export const deleteCities = createAction('DELETE_CITIES');
export const pushCityToMonitored = createAction('PUSH_CITY_TO_MONITORED');
export const deleteCityFromMonitored = createAction('DELETE_CITY_FROM_MONITORED');
