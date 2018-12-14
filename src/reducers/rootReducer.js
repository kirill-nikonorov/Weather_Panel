import {
    loadCitiesByNameRequest,
    pushCityToMonitored,
    deleteCityFromMonitored
} from "../lib/reduxActions/actions"
import {handleActions} from 'redux-actions'
import {combineReducers} from "redux-immutable"
import {fromJS, Set, isImmutable} from "immutable"
import * as immutable from "immutable"

//console.log(immutable)


const foundByActualSearchRequestCitiesPagination = handleActions(
    {
        [loadCitiesByNameRequest]: (state, {payload, payload: {result}}) => {

            return fromJS(result)
        },
    },
    fromJS([])
);
const monitoredCitiesPagination = handleActions(
    {
        [pushCityToMonitored]: (state, {payload}) => {
            return state.add(payload)
        },
        [deleteCityFromMonitored]: (state, {payload}) => {
            return state.delete(payload)
        }
    },
    Set()
);

const paginationReducer = combineReducers({
        foundByActualSearchRequestCitiesPagination,
        monitoredCitiesPagination,
    }
);
const replaceWeatherListMixedByMergingDataWithNewData = (newStore, newEntities, result) => {
    const idsOfNew = (typeof result === "number") ? [result] : result;
    newStore = newStore.withMutations(newStore => {
        idsOfNew.forEach((id) => {
            const idStr = `${id}`;

            const newWeather = newEntities.get('cities').get(idStr).get('weather');
            newStore.setIn(['cities', idStr, "weather"], newWeather);
        });
    });

    return newStore;
};

const entities = (state = fromJS({}), {payload: {entities, result} = {}}) => {
    if (entities) {
        const newEntities = fromJS(entities);
        let newStore = state.mergeDeep(newEntities);
        newStore = replaceWeatherListMixedByMergingDataWithNewData(newStore, newEntities, result)
        return newStore;
    }
    return state;

};

const rootReducer = combineReducers({
    entities,
    pagination: paginationReducer
});

export default rootReducer;