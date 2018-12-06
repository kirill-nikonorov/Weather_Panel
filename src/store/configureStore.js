import {createStore, applyMiddleware} from 'redux';
import rootReducer from "../reducers/rootReducer"
import apiMiddleware from "../middlewares/api"
import thunk from "redux-thunk"

const configurateStore = () => {
    const store = createStore(rootReducer,
        {totalCount: 0},
        applyMiddleware(thunk, apiMiddleware));

    if (module.hot) {
        module.hot.accept('../reducers/rootReducer', () => {
            store.replaceReducer(rootReducer);
        });
    }
    return store;
};

export default configurateStore;
