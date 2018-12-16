import React from "react"
import {Search} from "./";
import {Button} from 'antd';
import styled from "styled-components"

const SearchPanelContainer = styled.div`

         border-bottom: 3px solid #984040;

`;


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
            <SearchPanelContainer>
                <Search
                    placeholder={placeholder}
                    onSearch={onSearch}
                    addonAfter={isSearchSuccess ? this.renderCleanSearchButton() : ""}
                />
                <div>
                    {foundCities}
                </div>

            </SearchPanelContainer>
        )
    }
}

export default SearchPanel;