import React from 'react';
import {pure} from 'recompose';
import {func, instanceOf, string} from 'prop-types';
import Immutable from 'immutable';
import styled from 'styled-components';

const CentredHeader = styled.h3`
    text-align: center;
`;

class List extends React.Component {
    static propTypes = {
        items: instanceOf(Immutable.Set).isRequired,
        renderItem: func.isRequired,
        headerString: string
    };

    render() {
        const {items, renderItem, headerString} = this.props;

        //console.log("items = ", items);
        return (
            <div>
                {items.size > 0 ? <CentredHeader>{headerString}</CentredHeader> : ''}
                {[...items.map(renderItem).values()]}
            </div>
        );
    }
}

export default pure(List);
