import React from 'react';
import {shouldUpdate} from 'recompose';

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
    componentWillMount() {
   //     console.log(this.props.name + " componentWillMount")
    }

    componentWillUpdate() {
        console.log(this.props.name + " componentWillUpdate")


    }

    render() {
        const {items, renderItem} = this.props;
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