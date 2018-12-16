import {
    loadCitiesByNameRequest,
    pushCityToMonitored,
    deleteCityFromMonitored,
    cleanSearchResults,
    deleteCities,
    addAndMonitorCities
} from "../lib/reduxActions/actions"
import {handleActions} from 'redux-actions'
import {combineReducers} from "redux-immutable"
import {fromJS, Set, Map} from "immutable"


const foundByActualSearchRequestCitiesPagination = handleActions(
    {
        [loadCitiesByNameRequest]: (state, {payload: {result}}) => {

            return fromJS(result)
        },
        [cleanSearchResults]: (state) => Map(),
        [deleteCities]: (state, {payload}) => {
            console.log(payload);
            return state.filterNot(id => payload.includes(id))
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
        },
        [addAndMonitorCities]: (state, {payload}) => {
            //console.log(payload)
            const citiesIds = payload.reduce((ids, {id}) => {
                ids.push(id)
                return ids;
            }, []);
            return state.withMutations(state => {
                citiesIds.forEach(id => {
                    state.add(id)
                })
            })
        },
        [deleteCities]: (state, {payload}) => {
            console.log(payload);
            return state.filterNot(id => payload.includes(id))
        },
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

const entities = (state = fromJS({}), action) => {
    const {payload: {entities, result} = {}} = action;
    if (entities) {
        const newEntities = fromJS(entities);
        let newStore = state.mergeDeep(newEntities);
        newStore = replaceWeatherListMixedByMergingDataWithNewData(newStore, newEntities, result)
        return newStore;
    }
    return entitiesReducer(state, action);
};

const entitiesReducer = handleActions(
    {
        [deleteCities]: (state, {payload}) => {
            //console.log(payload);
            const cities = state.get("cities");
            return state.set("cities", cities.removeAll(payload))
        },
        [addAndMonitorCities]: (state, {payload}) => {
            //console.log(payload);
            const newState = state.withMutations(state => {
                payload.forEach(city => {
                    const {id} = city;
                    state.setIn(["cities", `${id}`], fromJS(city))
                });
            });
            return newState;
        }
    },
    fromJS({})
);

const rootReducer = combineReducers({
    entities,
    pagination: paginationReducer
});

export default rootReducer;