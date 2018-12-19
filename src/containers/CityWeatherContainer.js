import React from 'react';
import {connect} from 'react-redux';
import {fromJS, toJS} from 'immutable'
import {pure} from "recompose"
import {CityWeatherCard} from '../components'

import {showInfoNotificationWithButton} from "../service"

import {
    pushCityToMonitored,
    deleteCityFromMonitored,

    addAndMonitorCities,
} from "../actions"




class CityWeatherContainer extends React.Component {
    toggleMonitoring = (id, isMonitored) => {
        const {
            pushCityToMonitored,
            deleteCityFromMonitored,
        } = this.props;


        if (isMonitored) deleteCityFromMonitored(id);
        else pushCityToMonitored(id)
    };

    toggleMonitoringWithToggleOffNotification = (id, isMonitored, city) => {
        const {
            pushCityToMonitored,
            deleteCityFromMonitored,
            addAndMonitorCities
        } = this.props;
        const name = city.get('name');

        const toggleOff = (id) => {
            deleteCityFromMonitored(id);
            showInfoNotificationWithButton(`Вы удалили ${name} из отслеживаемых ю Вернуть ?`, () => {
                addAndMonitorCities([city])
            })
        };

        if (isMonitored) toggleOff(id);
        else pushCityToMonitored(id)
    };


    render() {
        const {
            id,
            city,
            Component = CityWeatherCard,
            doToggleMonitoringWithToggleOffNotification = false,
            toggleMonitoring = doToggleMonitoringWithToggleOffNotification ? this.toggleMonitoringWithToggleOffNotification : this.toggleMonitoring,
            isMonitored
        } = this.props;

        console.log("Container rerendered")
        return (
            <Component
                toggleMonitoring={() => toggleMonitoring(id, isMonitored, city)}
                key={id}
                city={city.toJS()}
                isMonitored={isMonitored}
            />
        );
    }


}


const mapStateToProps = (state, ownProps) => {
    const {city, doToggleMonitoringWithToggleOffNotification, Component} = ownProps;

    const monitoredCitiesPagination = state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);

    const id = city.get('id');

    const isMonitored = monitoredCitiesPagination.has(+id);


    return {
        id,
        city,
        isMonitored,
        doToggleMonitoringWithToggleOffNotification,
        Component
    }
};

export default connect(mapStateToProps,
    {
        pushCityToMonitored,
        deleteCityFromMonitored,
        addAndMonitorCities,
    }
)(pure(CityWeatherContainer));

