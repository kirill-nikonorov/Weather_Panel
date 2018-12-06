import React from 'react';
import {connect} from 'react-redux';
import {addCount, loadWeatherByCityName} from "../actions"
import Search from '../components/Search'

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {addCount, loadWeatherByCityName } = this.props;
        return (
            <div>
                <Search onSearch={loadWeatherByCityName}/>

                <div
                    onClick={() => {
                        loadWeatherByCityName("volosovo");
                        loadWeatherByCityName("london");
                    }}
                    style={{width: '50px', height: '100px', backgroundColor: 'red'}}>aaa
                </div>

                <div
                    onClick={() => {
                        addCount(2);
                    }}
                    style={{width: '50px', height: '100px', backgroundColor: 'green'}}>aaa
                </div>
                <div
                    onClick={() => {
                        console.log(this.props)
                    }}
                    style={{width: '50px', height: '100px', backgroundColor: 'yellow'}}>aaa
                </div>
            </div>

        );
    }
}

export default connect((state) => {
    return state;
}, {addCount,  loadWeatherByCityName})(Table);
