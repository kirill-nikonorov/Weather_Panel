import React from "react"

import {Input} from 'antd';

const Search = Input.Search;


class CityCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        //   console.log(this.props)
        const {
            city: {name, coord, weather: {description = ""}, main: {temp = ""}},
            toggleMonitoring
        } = this.props;
        return (
            <div
                style={{height: '70px', backgroundColor: 'white', border: '1px solid black'}}>
                {name} {temp}
                <div onClick={toggleMonitoring} style={{
                    height: '20px',
                    width: "20px",
                    backgroundColor: 'white',
                    border: '1px solid black'
                }}> на Виджет
                </div>
            </div>
        )
    }
}

export default CityCard;