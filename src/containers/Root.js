import React from 'react';
import {connect} from 'react-redux';
import {
    fetchCitiesByName,
    pushCityToMonitored,
    deleteCityFromMonitored,
    fetchWeatherByCityId,
    turnOnStoreForecastActualityObserver,
    refreshForecastForCitiesIfNeeded,
    turnOffStoreForecastActualityObserver,
    addAndMonitorCities,
    cleanSearchedName,
    installSearchedName
} from "../actions"

import {SearchPanel, CityWeatherCard, CityWeatherWidget, Rubish} from '../components'
import {fromJS, toJS, Map, Set, is} from 'immutable'
import DevTools from './DevTools';
import styled from 'styled-components'
import {showInfoNotificationWithButton} from "../service"
import {createSelector} from "reselect"
import {pure} from "recompose"


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

    handleCitySearchByName = (name) => {
        const {installSearchedName} = this.props;
        installSearchedName(name);
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

        // console.log(cities);
        // console.log(Object.values(cities.toJS()));

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
            state,
            monitoredCities,
            fetchWeatherByCityId,
            cleanSearchedName,
            foundCities,
            installSearchedName
        } = this.props;


        const renderedFoundCities = this.renderCities(CityWeatherCard, foundCities);

        return (
            <AppContainer>
                <SearchPanel onSearch={this.handleCitySearchByName}
                             placeholder="input city name"
                             foundCities={renderedFoundCities}
                             cleanSearchedName={cleanSearchedName}
                />
                <div
                    onClick={() => {
                        installSearchedName("volosovo")
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

    componentDidUpdate() {
        const {
            foundCities,
            isFoundCitiesPaginationNamePartFetching,
            isFoundCitiesPaginationNamePartHasMore,
            fetchCitiesByName,
            searchedName,
            foundCitiesPaginationNamePartIds
        } = this.props;
        /*
        foundCities: foundCitiesSelector(state),
        monitoredCities: monitoredCitiesSelector(state),
        isFoundCitiesPaginationNamePartFetching,
        isFoundCitiesPaginationNamePartHasMore,
        isFoundCitiesPaginationNamePartIds,
        foundCitiesByNamePagination,*/

        console.log(this.props)

        const shouldFetch = (foundCities.size < foundCitiesPaginationNamePartIds.size
            || isFoundCitiesPaginationNamePartHasMore)
            && !isFoundCitiesPaginationNamePartFetching;
        if (shouldFetch) fetchCitiesByName(searchedName);
        console.log(shouldFetch)
    };

    componentDidMount() {
        const {turnOnStoreForecastActualityObserver, monitoredCities, refreshForecastForCitiesIfNeeded} = this.props;
        // refreshForecastForCitiesIfNeeded(monitoredCities);
        // turnOnStoreForecastActualityObserver();

    }

    componentWillUnMount() {
        // turnOffStoreForecastActualityObserver();
    }

    shouldComponentUpdate(nextState) {
        //console.log("should : monitoredCities = ", nextState.monitoredCities !== this.props.monitoredCities);
        //console.log("should : foundCities = ", nextState.foundCities !== this.props.foundCities);

        return true;
    }
}

const citiesSelector = state => state.get("entities").get('cities') || fromJS([]);
const monitoredCitiesPaginationSelector = state => state.get("pagination").get('monitoredCitiesPagination') || Set([]);
const foundCitiesByNamePaginationSelector = state => state.get("pagination").get('foundCitiesByNamePagination') || Set([]);
const searchedNameSelector = state => state.get("searchedName") || '';

const foundCitiesPaginationNamePartSelector = createSelector(
    [
        foundCitiesByNamePaginationSelector,
        searchedNameSelector
    ],
    (foundCitiesByNamePagination, searchedName) => foundCitiesByNamePagination.get(searchedName) || fromJS({})
);

const foundCitiesIdsByNameSelector = createSelector(
    foundCitiesPaginationNamePartSelector,
    (foundCitiesPaginationNamePart) => foundCitiesPaginationNamePart.get('ids') || Set([])
);

const foundCitiesSelector = createSelector(
    [citiesSelector, foundCitiesIdsByNameSelector],
    (cities, foundCitiesIdsByName) => cities.filter(city => {
        const id = city.get('id');
        return foundCitiesIdsByName.includes(+id)
    })
);



const monitoredCitiesSelector = createSelector(
    [
        citiesSelector,
        monitoredCitiesPaginationSelector
    ],
    (cities, monitoredCitiesPagination) => Set([...cities.filter(city => monitoredCitiesPagination.has(city.get(`id`))).values()])
);


const mapStateToProps = (state) => {

    const pagination = state.get('pagination');
    const monitoredCitiesPagination = state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);

    const searchedName = state.get('searchedName');
    const foundCitiesByNamePagination = pagination.get('foundCitiesByNamePagination');

    const foundCitiesPaginationNamePart = foundCitiesPaginationNamePartSelector(state);

    //создать селекторы
    const isFoundCitiesPaginationNamePartFetching = typeof
        foundCitiesPaginationNamePart.get('isFetching') === 'undefined' ? false : foundCitiesPaginationNamePart.get('isFetching');
    const isFoundCitiesPaginationNamePartHasMore = typeof
        foundCitiesPaginationNamePart.get('hasMore') === 'undefined' ? true : foundCitiesPaginationNamePart.get('hasMore');
    const foundCitiesPaginationNamePartIds = foundCitiesPaginationNamePart.get('ids') || Set([])
    //

    return {
        foundCities: foundCitiesSelector(state),
        monitoredCities: monitoredCitiesSelector(state),
        isFoundCitiesPaginationNamePartFetching,
        isFoundCitiesPaginationNamePartHasMore,
        foundCitiesPaginationNamePartIds,
        foundCitiesByNamePagination,

        monitoredCitiesPagination,
        searchedName,
    }
};

export default connect(mapStateToProps,
    {
        fetchCitiesByName,
        pushCityToMonitored,
        deleteCityFromMonitored,
        turnOnStoreForecastActualityObserver,
        fetchWeatherByCityId,
        refreshForecastForCitiesIfNeeded,
        cleanSearchedName,
        addAndMonitorCities,
        installSearchedName
    }
)(pure(Table));

