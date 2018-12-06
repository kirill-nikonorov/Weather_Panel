import {render} from 'react-dom';
import React from 'react';
import {Provider} from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom';
import Root from "./containers/Root"
import configureStore from "./store/configureStore"

const store = configureStore();

render(
    <Provider store={store}>
        <Router>
            <Root/>
        </Router>
    </Provider>
    ,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept()
}


