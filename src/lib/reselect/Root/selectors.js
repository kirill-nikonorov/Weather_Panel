import {createSelector} from 'reselect';
import {fromJS, Set} from 'immutable';

const citiesSelector = state => state.get('entities').get('cities') || fromJS([]);
const monitoredCitiesIds = state => state.get('pagination').get('monitoredCitiesIds') || Set([]);
const foundCitiesByNameSelector = state =>
    state.get('pagination').get('foundCitiesByName') || Set([]);
export const searchedNameSelector = state => state.get('searchedName') || '';

export const foundCitiesPaginationSelector = createSelector(
    [foundCitiesByNameSelector, searchedNameSelector],
    (foundCitiesByName, searchedName) => foundCitiesByName.get(searchedName) || fromJS({})
);

const foundCitiesIdsSelector = createSelector(
    foundCitiesPaginationSelector,
    foundCitiesPagination => foundCitiesPagination.get('ids') || Set([])
);

export const foundCitiesSelector = createSelector(
    [citiesSelector, foundCitiesIdsSelector],
    (cities, foundCitiesIdsByName) =>
        Set([
            ...cities
                .filter(city => {
                    const id = city.get('id');
                    return foundCitiesIdsByName.includes(+id);
                })
                .values()
        ])
);

export const monitoredCitiesSelector = createSelector(
    [citiesSelector, monitoredCitiesIds],
    (cities, monitoredCitiesIds) =>
        Set([...cities.filter(city => monitoredCitiesIds.has(city.get(`id`))).values()])
);
