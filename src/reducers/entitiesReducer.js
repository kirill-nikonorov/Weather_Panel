import {addAndMonitorCities, deleteCities} from '../lib/reduxActions/actions';
import {fromJS} from 'immutable';
import {handleActions} from 'redux-actions';

export const entitiesReducer = handleActions(
    {
        [deleteCities]: (state, {payload}) => {
            //console.log(payload);
            const cities = state.get('cities');
            return state.set('cities', cities.removeAll(payload));
        },
        [addAndMonitorCities]: (state, {payload}) => {
            //console.log(payload);
            const newState = state.withMutations(state => {
                payload.forEach(city => {
                    const id = city.get('id');
                    state.setIn(['cities', `${id}`], fromJS(city));
                });
            });
            return newState;
        }
    },
    fromJS({})
);
