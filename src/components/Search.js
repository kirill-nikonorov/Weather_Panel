import React from 'react';

import {Input, Button} from 'antd';
import {func, string} from 'prop-types';
import {onlyUpdateForKeys} from 'recompose';

const AntSearch = Input.Search;

class Search extends React.Component {
    static propTypes = {
        placeholder: string.isRequired,
        value: string,
        onClean: func.isRequired,
        onSearch: func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {value: ''};
    }

    handleChange = e => {
        this.setState({value: e.target.value});
    };

    handleSubmit = () => {
        const {onSearch} = this.props;
        onSearch(this.state.value);
    };

    emitEmpty = () => {
        const {onClean} = this.props;

        this.input.focus();
        this.setState({value: ''});
        onClean();
    };

    renderCleanSearchButton = () => {
        return (
            <Button
                onClick={this.emitEmpty}
                icon="close"
                type="danger"
                style={{marginRight: '5px'}}
            />
        );
    };

    render() {
        const {placeholder, value} = this.props;
        //console.log("SEARCH rerendererd");

        return (
            <div>
                <AntSearch
                    placeholder={placeholder}
                    value={this.state.value}
                    onChange={this.handleChange}
                    onSearch={this.handleSubmit}
                    enterButton
                    size="large"
                    suffix={this.state.value.length > 0 ? this.renderCleanSearchButton() : ''}
                    ref={input => (this.input = input)}
                />
            </div>
        );
    }
}

export default Search;
