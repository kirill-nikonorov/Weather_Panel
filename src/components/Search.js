import React from "react"

import {Input} from 'antd';

const Search = Input.Search;


class CitySearch extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {onSearch, placeholder} = this.props;
        return (
            <div>
                <Search
                    placeholder={placeholder}

                    onSearch={onSearch}
                    enterButton
                    size="large"
                />
            </div>
        )
    }
}

export default CitySearch;