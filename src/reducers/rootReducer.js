import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {foundCitiesByNamePagination} from './pagination/foundCitiesByNamePagination';
import {monitoredCitiesPagination} from './pagination/monitoredCitiesPagination';
import {searchedName} from './searchedNameReducer';
import {entitiesReducer} from './entitiesReducer';

const entities = (state = fromJS({}), action) => {
    const {payload: {entities, result} = {}} = action;

    if (entities) {
        const newEntities = fromJS(entities);
        let newStore = state.mergeDeep(newEntities);
        newStore = replaceWeatherListMixedByMergingDataWithNewData(newStore, newEntities, result);
        return newStore;
    }
    return entitiesReducer(state, action);
};

const replaceWeatherListMixedByMergingDataWithNewData = (newStore, newEntities, result) => {
    const idsOfNew = typeof result === 'number' ? [result] : result;
    return newStore.withMutations(newStore => {
        idsOfNew.forEach(id => {
            const idStr = `${id}`;

            const newWeather = newEntities
                .get('cities')
                .get(idStr)
                .get('weather');
            newStore.setIn(['cities', idStr, 'weather'], newWeather);
        });
    });
};

const paginationReducer = combineReducers({
    monitoredCitiesPagination,
    foundCitiesByNamePagination
});

const rootReducer = combineReducers({
    entities,
    pagination: paginationReducer,
    searchedName
});

export default rootReducer;
