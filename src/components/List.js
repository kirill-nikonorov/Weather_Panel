import React from 'react';
import {shouldUpdate} from 'recompose';
import { func, instanceOf} from "prop-types";
import Immutable from "immutable";



/*const List = ({items, renderItem , name}) => {

    console.log(name + " = rerender")

        return (
            <div>
                {[...items.map(renderItem).values()]}
            </div>
        )
    }
;*/
class List extends React.Component {
    static propTypes = {
        items: instanceOf(Immutable.Set).isRequired,
        renderItem: func.isRequired
    };
    componentWillMount() {
   //     console.log(this.props.name + " componentWillMount")
    }

    componentWillUpdate() {
        console.log(this.props.name + " componentWillUpdate")


    }

    render() {
        const {items, renderItem} = this.props;
        //console.log("items = ", items);
        return (
            <div>
                {[...items.map(renderItem).values()]}
            </div>
        )

    }
}


const checkPropsChange = (props, nextProps) => {

    console.log("поменялся ?  = " + nextProps.name + " = ", nextProps.items !== props.items);
    return (nextProps.items !== props.items);
};

export default shouldUpdate(checkPropsChange)(List);