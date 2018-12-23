import {
    addAndMonitorCities,
    deleteCities,
    deleteCityFromMonitored,
    pushCityToMonitored
} from '../../lib/reduxActions/actions';
import {Set} from 'immutable';
import {handleActions} from 'redux-actions';

export const monitoredCitiesPagination = handleActions(
    {
        [pushCityToMonitored]: (state, {payload}) => {
            return state.add(payload);
        },
        [deleteCityFromMonitored]: (state, {payload}) => {
            return state.delete(payload);
        },
        [addAndMonitorCities]: (state, {payload}) => {
            const citiesIds = payload.reduce((ids, city) => {
                const id = city.get('id');
                ids.push(id);
                return ids;
            }, []);
            //console.log('addAndMonitorCities = ', citiesIds);

            return state.withMutations(state => {
                citiesIds.forEach(id => {
                    state.add(id);
                });
            });
        },
        [deleteCities]: (state, {payload}) => {
            //console.log(payload);
            return state.filterNot(id => payload.includes(id));
        }
    },
    Set()
);
