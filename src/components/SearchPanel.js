import React from 'react';
import {Search, List} from './';
import styled from 'styled-components';
import {pure} from 'recompose';
import {bool, func, instanceOf, string , element} from "prop-types";


const SearchPanelContainer = styled.div`
    border-bottom: 3px solid #984040;
`;

class SearchPanel extends React.Component {

    static propTypes = {
        placeholder: string,
        children: element,
        onSearch: func.isRequired,
        onClean: func.isRequired
    };

    render() {
        const {onSearch, placeholder, children, onClean} = this.props;
        //console.log("render SearchPanel");

        return (
            <SearchPanelContainer>
                <Search placeholder={placeholder} onSearch={onSearch} onClean={onClean}/>
                {children}
            </SearchPanelContainer>
        );
    }
}

export default pure(SearchPanel);
