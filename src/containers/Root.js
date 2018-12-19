import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components'
import {fromJS, Map, Set, is} from 'immutable'
import {pure} from "recompose"

import {showInfoNotificationWithButton} from "../service"

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
import {
    monitoredCitiesSelector,
    foundCitiesPaginationNamePartSelector,
    foundCitiesSelector, searchedNameSelector
} from "../lib/reselect/Root/selectors";

import CityWeatherContainer from "./CityWeatherContainer"

import {SearchPanel, CityWeatherCard, CityWeatherWidget, List} from '../components'
import DevTools from './DevTools';


const DevButtons = ({installSearchedName, state}) => (
    <div>
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
    </div>
);

const AppContainer = styled.div`
    min-height: 100vh;
    background-color: #B5B5B5;
    
    max-width: 900px;
    margin: 0 ;
    
`;

const SearchStatus = styled.div`
    margin: 5px auto;
`;


class Table extends React.Component {
    constructor(props) {
        super(props);
    }

    handleCitySearchByName = (name) => {
        const {installSearchedName} = this.props;
        installSearchedName(name);
    };


    renderCity = (city, doToggleMonitoringWithToggleOffNotification, Component) => {
        //console.log("city = ", city);
        const id = city.get('id');

        const result = (
            < CityWeatherContainer
                city={city}
                doToggleMonitoringWithToggleOffNotification={doToggleMonitoringWithToggleOffNotification}
                Component={Component}
                key={id}
            />
        );

        return result;
    };

    render() {
        const {
            state,
            monitoredCities,
            cleanSearchedName,
            foundCities,
            installSearchedName,
            isFoundCitiesPaginationNamePartFetching,
            hasFoundCitiesPaginationNamePartMore,
            searchedName,
        } = this.props;



        const isFound = searchedName !== ""
            && foundCities.size === 0
            && !isFoundCitiesPaginationNamePartFetching
            && !hasFoundCitiesPaginationNamePartMore;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        return (
            <AppContainer>
                <SearchPanel
                    onSearch={this.handleCitySearchByName}
                    placeholder="input city name"
                    foundCities={foundCities}
                    onClean={cleanSearchedName}>
                    {isFoundCitiesPaginationNamePartFetching ? <SearchStatus>Loading</SearchStatus> :
                        isFound ? <SearchStatus>NotFound</SearchStatus> : (""

                        )
                    }
                    <List
                        name="searched"

                        items={foundCities}
                        renderItem={city => this.renderCity(city)}
                    />
                </SearchPanel>

                <DevButtons
                    installSearchedName={installSearchedName}
                    state={state}
                />
                <List
                    name="monitored"

                    items={monitoredCities}
                    renderItem={(city) => this.renderCity(city, true)}
                />
                <DevTools/>
            </AppContainer>
        );
    }

    componentDidUpdate() {
        const {
            foundCities,
            isFoundCitiesPaginationNamePartFetching,
            hasFoundCitiesPaginationNamePartMore,
            fetchCitiesByName,
            searchedName,
            foundCitiesPaginationNamePartIds
        } = this.props;

        const shouldFetch = (foundCities.size < foundCitiesPaginationNamePartIds.size
            || hasFoundCitiesPaginationNamePartMore)
            && !isFoundCitiesPaginationNamePartFetching;
        if (shouldFetch) fetchCitiesByName(searchedName);
    };

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

    const pagination = state.get('pagination');
    const monitoredCitiesPagination = state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);
    const foundCitiesByNamePagination = pagination.get('foundCitiesByNamePagination');

    const foundCitiesPaginationNamePart = foundCitiesPaginationNamePartSelector(state);

    const isFoundCitiesPaginationNamePartFetching = typeof
        foundCitiesPaginationNamePart.get('isFetching') === 'undefined' ? false : foundCitiesPaginationNamePart.get('isFetching');
    const hasFoundCitiesPaginationNamePartMore = typeof
        foundCitiesPaginationNamePart.get('hasMore') === 'undefined' ? true : foundCitiesPaginationNamePart.get('hasMore');
    const foundCitiesPaginationNamePartIds = foundCitiesPaginationNamePart.get('ids') || Set([])


    return {
        foundCities: foundCitiesSelector(state),
        monitoredCities: monitoredCitiesSelector(state),
        isFoundCitiesPaginationNamePartFetching,
        hasFoundCitiesPaginationNamePartMore,
        foundCitiesPaginationNamePartIds,
        foundCitiesByNamePagination,
        monitoredCitiesPagination,
        searchedName: searchedNameSelector(state),
        state
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

