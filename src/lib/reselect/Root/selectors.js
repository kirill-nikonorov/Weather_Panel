import {createSelector} from 'reselect'
import {fromJS, Set} from "immutable";

const citiesSelector = state => state.get("entities").get('cities') || fromJS([]);
const monitoredCitiesPaginationSelector = state => state.get("pagination").get('monitoredCitiesPagination') || Set([]);
const foundCitiesByNamePaginationSelector = state => state.get("pagination").get('foundCitiesByNamePagination') || Set([]);
export const searchedNameSelector = state => state.get("searchedName") || '';

export const foundCitiesPaginationNamePartSelector = createSelector(
    [
        foundCitiesByNamePaginationSelector,
        searchedNameSelector
    ],
    (foundCitiesByNamePagination, searchedName) => foundCitiesByNamePagination.get(searchedName) || fromJS({})
);

const foundCitiesIdsByNameSelector = createSelector(
    foundCitiesPaginationNamePartSelector,
    (foundCitiesPaginationNamePart) => foundCitiesPaginationNamePart.get('ids') || Set([])
);

export const foundCitiesSelector = createSelector(
    [citiesSelector, foundCitiesIdsByNameSelector],
    (cities, foundCitiesIdsByName) => cities.filter(city => {
        const id = city.get('id');
        return foundCitiesIdsByName.includes(+id)
    })
);


export const monitoredCitiesSelector = createSelector(
    [
        citiesSelector,
        monitoredCitiesPaginationSelector
    ],
    (cities, monitoredCitiesPagination) => Set([...cities.filter(city => monitoredCitiesPagination.has(city.get(`id`))).values()])
);
