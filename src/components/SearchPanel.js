import React from "react"
import {Search, List} from "./";
import {Button} from 'antd';
import styled from "styled-components"
import {pure} from 'recompose';

import {onlyUpdateForKeys} from 'recompose';

const SearchPanelContainer = styled.div`
         border-bottom: 3px solid #984040;
`;



class SearchPanel extends React.Component {



    render() {
        const {onSearch, placeholder,  children, onClean } = this.props;
        //console.log("render SearchPanel");

        return (
            <SearchPanelContainer>
                <Search
                    placeholder={placeholder}
                    onSearch={onSearch}
                    onClean={onClean}
                />
                {children}
            </SearchPanelContainer>
        )
    }
}


export default pure(SearchPanel);