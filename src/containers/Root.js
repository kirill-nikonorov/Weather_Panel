import React from 'react';
import {connect} from 'react-redux';
import {
    loadWeatherByCityName,
    loadCitiesByName,
    addCityToMonitored,
    removeCityFromMonitored,
    loadWeatherByCityId,
    turnOnStoreForecastActualityObserver,
    loadWeatherForSeveralCitiesByIds,
    refreshForecastForCitiesIfNeeded,
    turnOffStoreForecastActualityObserver,
    insertAndMonitorCities
} from "../actions"
import {
    cleanSearchResults
} from '../lib/reduxActions/actions'
import {SearchPanel, CityWeatherCard, CityWeatherWidget, Rubish} from '../components'
import {fromJS, toJS, Map, isCollection} from 'immutable'
import DevTools from './DevTools';
import styled from 'styled-components'
import {converseObjectChildTypesAccordingToEtalonObjectConcrete} from "../utils"
import {showInfoNotificationWithButton} from "../service"


const AppContainer = styled.div`
    min-height: 100vh;
    background-color: #9E7D7D;
    
    max-width: 1100px;
    margin: 0 auto;
    
`;

class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCitySearchByName = (value) => {
        const {loadCitiesByName} = this.props;

        if (value.length < 1) return;
        // console.log(value);
        loadCitiesByName(value);

    };

    toggleMonitoring = (city, isMonitored, doToggleOffMonitoredWithNotification) => {
        const {
            addCityToMonitored,
            removeCityFromMonitored,
            insertCities
        } = this.props;
        const {id, name} = city;

        const toggleOf = doToggleOffMonitoredWithNotification ? (id) => {
            removeCityFromMonitored(id);
            showInfoNotificationWithButton(`Вы удалили ${name} из отслеживаемых ю Вернуть ?`, () => {
                insertCities([city])
            })
        } : removeCityFromMonitored;

        if (isMonitored) toggleOf(id);
        else addCityToMonitored(id)
    };

    renderCities = (Component, cities, doToggleOffMonitoredWithNotification) => {
        const {monitoredCitiesPagination, addCityToMonitored, removeCityFromMonitored} = this.props;

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
            loadWeatherByCityName,
            loadCitiesByName,
            loadWeatherByCityId,
            loadWeatherForSeveralCitiesByIds,
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
                        loadCitiesByName("volosovo")
                    }}
                    style={{width: '130px', height: '25px', backgroundColor: 'green'}}> найти Волосово
                </div>
                <div
                    onClick={() => {
                        loadWeatherByCityId(472357)
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
        const {turnOnForecastObserver, monitoredCities, refreshForecastForCitiesIfNeeded} = this.props;
        refreshForecastForCitiesIfNeeded(monitoredCities);
        turnOnForecastObserver();

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
        loadWeatherByCityName,
        loadCitiesByName,
        addCityToMonitored,
        removeCityFromMonitored,
        loadWeatherByCityId,
        turnOnForecastObserver: turnOnStoreForecastActualityObserver,
        loadWeatherForSeveralCitiesByIds,
        refreshForecastForCitiesIfNeeded,
        cleanSearchResults,
        insertCities: insertAndMonitorCities
    }
)(Table);


/*
const ComponentsArr = es.reduce((ComponentsArr, e) => {
        ComponentsArr.push(<Component e={e}/>);
        return ComponentsArr;
    }, []
);*/
