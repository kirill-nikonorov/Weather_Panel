import React from "react"
import styled from 'styled-components'

import {Input} from 'antd';

const AntSearch = Input.Search;


class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const {onSearch, placeholder, addonAfter} = this.props;

        return (
            <div>
                <AntSearch
                    placeholder={placeholder}

                    onSearch={onSearch}
                    enterButton
                    size="large"
                    addonAfter={addonAfter}

                />
            </div>
        )
    }
}

export default Search;