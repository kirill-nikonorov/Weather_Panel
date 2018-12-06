import {render} from 'react-dom';
import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

render(
    <Router>
        <h1>ggggg</h1>
    </Router>,
    document.getElementById('root')
);

if (module.hot) {
    module.hot.accept();
}
