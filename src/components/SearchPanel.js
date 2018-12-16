import React from "react"
import {Search} from "./"
import {Input, Icon, Button} from 'antd';


class SearchPanel extends React.Component {
    constructor(props) {
        super(props);
    }

    renderCleanSearchButton = () => {
        const {cleanSearchResults} = this.props;
        return <Button onClick={() => cleanSearchResults()}
                       icon="close"
                       type="danger"/>
    };


    render() {
        const {onSearch, placeholder, foundCities} = this.props;
        const isSearchSuccess = foundCities.length > 0;
        return (
            <div>
                <Search
                    placeholder={placeholder}
                    onSearch={onSearch}
                    addonAfter={isSearchSuccess ? this.renderCleanSearchButton() : ""}
                />
                <div>
                    {foundCities}
                </div>
            </div>
        )
    }
}

export default SearchPanel;