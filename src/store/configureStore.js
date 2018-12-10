import {createStore, applyMiddleware, compose} from 'redux';
import {fromJS} from 'immutable'
import rootReducer from "../reducers/rootReducer"
import apiMiddleware from "../middlewares/api"
import thunk from "redux-thunk"
import DevTools from '../containers/DevTools'

const initialStore = fromJS({entities: {} , pagination: {}});

const enhancer = compose(
    applyMiddleware(thunk, apiMiddleware),
    DevTools.instrument()
);

const configurateStore = () => {
    const store = createStore(rootReducer, initialStore, enhancer );

    if (module.hot) {
        module.hot.accept('../reducers/rootReducer', () => {
            store.replaceReducer(rootReducer);
        });
    }
    return store;
};

export default configurateStore;
