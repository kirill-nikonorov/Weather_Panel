import React from "react"

class Search extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = () => {


    };

    handleChange = (e) => {
     //   console.log("handleChange = ", e.target.value);
    };

    render() {
        const {onSearch} = this.props;
        return (
            <div>
                <input type={'text'} onChange={this.handleChange}/>
                <button onClick={this.handleSubmit}>Ok</button>
            </div>
        )
    }
}

export default Search;