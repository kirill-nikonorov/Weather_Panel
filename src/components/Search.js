import React from 'react';

import {Input, Button} from 'antd';
import {func, string} from 'prop-types';

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
        this.state = {providedValue: '', ownValue: ''};
    }

    handleChange = e => {
        this.setState({ownValue: e.target.value});
    };

    handleSubmit = () => {
        const {onSearch} = this.props;
        onSearch(this.state.ownValue);
    };

    emitEmpty = () => {
        const {onClean} = this.props;

        this.input.focus();
        this.setState({ownValue: ''});
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
        const {placeholder} = this.props;
        //console.log("SEARCH rerendererd");

        return (
            <div>
                <AntSearch
                    placeholder={placeholder}
                    value={this.state.ownValue}
                    onChange={this.handleChange}
                    onSearch={this.handleSubmit}
                    enterButton
                    size="large"
                    suffix={this.state.ownValue.length > 0 ? this.renderCleanSearchButton() : ''}
                    ref={input => (this.input = input)}
                />
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps);
        const {value: providedValue} = nextProps;
        if (providedValue !== this.state.providedValue)
            this.setState({providedValue: providedValue, ownValue: providedValue});
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState !== this.state;
    }
}

export default Search;
