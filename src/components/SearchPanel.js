import React from "react"
import {Search} from "./"
import {Input} from 'antd';


class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onSearch, placeholder, foundCities} = this.props;
        return (
            <div>
                <Search
                    placeholder={placeholder}
                    onSearch={onSearch}
                />
                <div>
                    {foundCities}
                </div>
            </div>
        )
    }
}

export default SearchPanel;