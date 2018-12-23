import {cleanSearchedName, installSearchedName} from '../lib/reduxActions/actions';
import {handleActions} from 'redux-actions';

export const searchedName = handleActions(
    {
        [installSearchedName]: (state, {payload}) => {
            return payload;
        },
        [cleanSearchedName]: () => {
            return '';
        }
    },
    ''
);
