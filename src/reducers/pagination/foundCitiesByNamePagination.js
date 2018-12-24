import {
    citiesByNameError,
    citiesByNameRequest,
    citiesByNameSuccess
} from '../../lib/reduxActions/actions';
import {fromJS, Set} from 'immutable';
import {handleActions} from 'redux-actions';

export const foundCitiesByNamePagination = handleActions(
    {
        [citiesByNameRequest]: (state, {payload: {cityName}}) => {
            return state.setIn([cityName, 'isFetching'], true);
        },
        [citiesByNameSuccess]: (state, {payload: {cityName, result}}) => {
            const newNameValue = fromJS({
                isFetching: false,
                hasMore: false,
                ids: Set(result)
            });
            return state.set(cityName, newNameValue);
        },
        [citiesByNameError]: (state, {payload: {cityName, e}}) => {
            const newNameValue = fromJS({
                isFetching: false,
                hasMore: false,
                ids: Set([]),
                e
            });
            return state.set(cityName, newNameValue);
        }
    },
    fromJS({'': {hasMore: false}})
);
