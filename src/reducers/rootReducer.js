import {combineReducers} from 'redux-immutable';
import {fromJS} from 'immutable';
import {foundCitiesByName} from './pagination/foundCitiesByName';
import {monitoredCitiesIds} from './pagination/monitoredCitiesIds';
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

const pagination = combineReducers({
    monitoredCitiesIds,
    foundCitiesByName
});

const rootReducer = combineReducers({
    entities,
    pagination,
    searchedName
});

export default rootReducer;
