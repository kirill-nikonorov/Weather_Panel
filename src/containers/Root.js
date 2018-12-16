import React from 'react';
import {connect} from 'react-redux';
import {
    fetchWeatherByCityName,
    fetchCitiesByName,
    pushCityToMonitored,
    deleteCityFromMonitored,
    fetchWeatherByCityId,
    turnOnStoreForecastActualityObserver,
    fetchWeatherForSeveralCitiesByIds,
    refreshForecastForCitiesIfNeeded,
    turnOffStoreForecastActualityObserver,
    addAndMonitorCities,
    cleanSearchResults
} from "../actions"

import {SearchPanel, CityWeatherCard, CityWeatherWidget, Rubish} from '../components'
import {fromJS, toJS, Map, isCollection} from 'immutable'
import DevTools from './DevTools';
import styled from 'styled-components'
import {converseObjectChildTypesAccordingToEtalonObjectConcrete} from "../utils"
import {showInfoNotificationWithButton} from "../service"


const AppContainer = styled.div`
    min-height: 100vh;
    background-color: #B5B5B5;
    
    max-width: 900px;
    margin: 0 auto;
    
`;

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCitySearchByName = (value) => {
        const {fetchCitiesByName} = this.props;

        if (value.length < 1) return;
        // console.log(value);
        fetchCitiesByName(value);

    };

    toggleMonitoring = (city, isMonitored, doToggleOffMonitoredWithNotification) => {
        const {
            pushCityToMonitored,
            deleteCityFromMonitored,
            addAndMonitorCities
        } = this.props;
        const {id, name} = city;

        const toggleOff = doToggleOffMonitoredWithNotification ? (id) => {
            deleteCityFromMonitored(id);
            showInfoNotificationWithButton(`Вы удалили ${name} из отслеживаемых ю Вернуть ?`, () => {
                addAndMonitorCities([city])
            })
        } : deleteCityFromMonitored;

        if (isMonitored) toggleOff(id);
        else pushCityToMonitored(id)
    };

    renderCities = (Component, cities, doToggleOffMonitoredWithNotification) => {
        const {monitoredCitiesPagination} = this.props;

        const citiesCards = Object.values(cities.toJS()).reduce((citiesCardsArr, city) => {
                const {id} = city;
                const isMonitored = monitoredCitiesPagination.has(id);

                citiesCardsArr.push(
                    <Component
                        toggleMonitoring={() => this.toggleMonitoring(city, isMonitored, doToggleOffMonitoredWithNotification)}
                        isMonitored={isMonitored}
                        key={id} city={city}/>);
                return citiesCardsArr;
            }, []
        );

        return citiesCards


    };

    render() {
        const {
            cities,
            state,
            foundCities,
            monitoredCities,
            fetchCitiesByName,
            fetchWeatherByCityId,
            cleanSearchResults
        } = this.props;
        const citiesNames = cities && cities.reduce((namesString, cityData) => {
            return namesString + cityData.get('name')
        }, "");

        const renderedFoundCities = this.renderCities(CityWeatherCard, foundCities);

        return (
            <AppContainer>
                <SearchPanel onSearch={this.handleCitySearchByName}
                             placeholder="input city name"
                             foundCities={renderedFoundCities}
                             cleanSearchResults={cleanSearchResults}
                />
                <div
                    onClick={() => {
                        fetchCitiesByName("volosovo")
                    }}
                    style={{width: '130px', height: '25px', backgroundColor: 'green'}}> найти Волосово
                </div>
                <div
                    onClick={() => {
                        fetchWeatherByCityId(472357)
                    }}
                    style={{width: '130px', height: '50px', backgroundColor: 'white'}}> грузить погоду по id Волосово
                </div>


                <div
                    onClick={() => {
                        console.log(state)
                    }}
                    style={{width: '130px', height: '25px', backgroundColor: 'yellow'}}>store
                </div>
                <div>
                    {this.renderCities(CityWeatherCard, monitoredCities, true)}
                </div>
                <DevTools/>
            </AppContainer>

        );
    }

    componentDidMount() {
        const {turnOnStoreForecastActualityObserver, monitoredCities, refreshForecastForCitiesIfNeeded} = this.props;
        refreshForecastForCitiesIfNeeded(monitoredCities);
        turnOnStoreForecastActualityObserver();

    }

    componentWillUnMount() {
        turnOffStoreForecastActualityObserver();
    }
}


const mapStateToProps = (state) => {

    const cities = state.get('entities').get('cities') || fromJS({});
    const foundCitiesPagination = state.get('pagination').get('foundByActualSearchRequestCitiesPagination') || fromJS([]);
    const monitoredCitiesPagination = state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);
    const foundCities = foundCitiesPagination.map(id => cities.get(`${id}`))
    const monitoredCities = monitoredCitiesPagination.map(id => cities.get(`${id}`))

    //console.log("foundCities = ", foundCities);
    return {cities, foundCities, monitoredCities, state, monitoredCitiesPagination};
};

export default connect(mapStateToProps,
    {
        fetchWeatherByCityName,
        fetchCitiesByName,
        pushCityToMonitored,
        deleteCityFromMonitored,
        fetchWeatherByCityId,
        turnOnStoreForecastActualityObserver,
        fetchWeatherForSeveralCitiesByIds,
        refreshForecastForCitiesIfNeeded,
        cleanSearchResults,
        addAndMonitorCities
    }
)(Table);
