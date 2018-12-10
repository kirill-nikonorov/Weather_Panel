import {loadCitiesByNameRequest,
    pushCityToMonitored,
    deleteCityFromMonitored
} from "../lib/reduxActions/actions"
import {handleActions} from 'redux-actions'
import {combineReducers} from "redux-immutable"
import {fromJS, Set} from "immutable"

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


const entities = (state = fromJS({}), {payload = {}}) => {
    const entities = payload && payload.entities;
    //  console.log(state);
    if (entities) {
        const newStore = state.mergeDeep(fromJS(entities));

        //  console.log(newStore);
        return newStore;
    }
    return state;

};

const rootReducer = combineReducers({
    entities,
    pagination: paginationReducer
});

export default rootReducer;