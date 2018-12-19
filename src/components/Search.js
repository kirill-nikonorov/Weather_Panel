import React from "react"
import styled from 'styled-components'

import {Input, Button} from 'antd';

const AntSearch = Input.Search;


class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ""}
    }

    handleChange = (e) => {
        this.setState({value: e.target.value})
    };

    handleSubmit = () => {
        const {onSearch} = this.props;
        onSearch(this.state.value)
    };

    emitEmpty = () => {
        const {onClean} = this.props;

        this.input.focus();
        this.setState({value: ''});
        onClean();
    };

    renderCleanSearchButton = () => {
        return <Button onClick={this.emitEmpty}
                       icon="close"
                       type="danger"
                       style={{marginRight: "5px"}}
        />
    };

    render() {
        const {placeholder, value} = this.props;


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
                    ref={input => this.input = input}
                />
            </div>
        )
    }
}

export default Search;