import {fetchWeatherForCityByName} from "../lib/reduxActions/actions"
import {handleActions} from 'redux-actions'
import {combineReducers} from "redux"


const paginationReducer = handleActions(
    {
        [fetchWeatherForCityByName]: (state, {payload: {cityName, data}}) => {
            //     console.log("УЗнаем погоду города по имени");

            return state
        }
    },
    {}
);

const entities = (state = {}, {payload = {}}) => {
    const entities = payload && payload.entities;
    console.log(state);
    if (entities) {
        const newStore = {...state, cities: {...state.cities, ...entities.cities}    }

        console.log(newStore);
        return newStore;
    }
    return state;

};

const rootReducer = combineReducers({
    entities,
    pagination: paginationReducer
});

export default rootReducer;