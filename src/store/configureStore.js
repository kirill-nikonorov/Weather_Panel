import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from '../reducers/rootReducer';
import apiMiddleware from '../middlewares/api';
import thunk from 'redux-thunk';
import DevTools from '../containers/DevTools';
import persistState from 'redux-localstorage';
import {convertStateToImmutableAccordingToNeededStructure} from '../utils';
import {copyImmutableMapAccordingToEtalonObject} from '../utils';
import {PROTOTYPE_OF_PERSISTING_PART_OF_STORE} from '../constants/StoreStructure';

import {fromJS} from 'immutable';

const initialStore = fromJS({});

const config = {
    key: 'weatherPanel',
    merge: (initialState, persistedState) => {
        return initialState.mergeDeep(persistedState);
    },
    slicer: paths => state => {
        //console.log(copyImmutableMapAccordingToEtalonObject(state, paths));

        return copyImmutableMapAccordingToEtalonObject(state, paths);
    },
    deserialize: serializedData =>
        convertStateToImmutableAccordingToNeededStructure(JSON.parse(serializedData))
};

const enhancer = compose(
    applyMiddleware(thunk, apiMiddleware),
    persistState(PROTOTYPE_OF_PERSISTING_PART_OF_STORE, config),
    DevTools.instrument()
);

const configurateStore = () => {
    const store = createStore(rootReducer, initialStore, enhancer);

    if (module.hot) {
        module.hot.accept('../reducers/rootReducer', () => {
            store.replaceReducer(rootReducer);
        });
    }
    return store;
};

export default configurateStore;
