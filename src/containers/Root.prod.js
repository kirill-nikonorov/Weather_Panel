import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {pure} from 'recompose';

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
} from '../actions';
import {
    monitoredCitiesSelector,
    foundCitiesPaginationNamePartSelector,
    foundCitiesSelector,
    searchedNameSelector
} from '../lib/reselect/Root/selectors';

import CityWeatherContainer from './CityWeatherContainer';

import {List} from '../components';
import DevTools from './DevTools';

import {bool, func, number, object, shape, string, instanceOf} from 'prop-types';

import Immutable from 'immutable';
import Search from '../components/Search';

const {fromJS, Set} = Immutable;

const AppContainer = styled.div`
    min-height: 100vh;
    background-color: #b5b5b5;
    max-width: 900px;
    margin: 0 auto;
`;

const SearchStatus = styled.div`
    margin: 5px auto;
`;

const SearchPanelContainer = styled.div`
    border-bottom: 3px solid #984040;
`;

class Root extends React.Component {
    static propTypes = {
        foundCities: instanceOf(Immutable.Set).isRequired,
        monitoredCities: instanceOf(Immutable.Set).isRequired,
        isFoundCitiesPaginationNamePartFetching: bool.isRequired,
        hasFoundCitiesPaginationNamePartMore: bool.isRequired,
        foundCitiesPaginationNamePartIds: instanceOf(Immutable.Set).isRequired,
        foundCitiesByNamePagination: instanceOf(Immutable.Map).isRequired,
        monitoredCitiesPagination: instanceOf(Immutable.Set).isRequired,
        searchedName: string.isRequired,
        fetchCitiesByName: func.isRequired,
        pushCityToMonitored: func.isRequired,
        deleteCityFromMonitored: func.isRequired,
        turnOnStoreForecastActualityObserver: func.isRequired,
        fetchWeatherByCityId: func.isRequired,
        refreshForecastForCitiesIfNeeded: func.isRequired,
        cleanSearchedName: func.isRequired,
        addAndMonitorCities: func.isRequired,
        installSearchedName: func.isRequired
    };

    constructor(props) {
        super(props);
    }

    handleCitySearchByName = name => {
        const {installSearchedName} = this.props;
        installSearchedName(name);
    };

    renderCity = (city, doToggleMonitoringWithToggleOffNotification, Component) => {
        // console.log("city = ", city);
        const id = city.get('id');

        const result = (
            <CityWeatherContainer
                city={city}
                doToggleMonitoringWithToggleOffNotification={
                    doToggleMonitoringWithToggleOffNotification
                }
                Component={Component}
                key={id}
            />
        );

        return result;
    };

    render() {
        const {
            monitoredCities,
            cleanSearchedName,
            foundCities,
            isFoundCitiesPaginationNamePartFetching,
            hasFoundCitiesPaginationNamePartMore,
            searchedName
        } = this.props;

        const isFound =
            searchedName !== '' &&
            foundCities.size === 0 &&
            !isFoundCitiesPaginationNamePartFetching &&
            !hasFoundCitiesPaginationNamePartMore;
        const searchStatus = isFoundCitiesPaginationNamePartFetching ? (
            <SearchStatus>Loading</SearchStatus>
        ) : isFound ? (
            <SearchStatus>NotFound</SearchStatus>
        ) : (
            ''
        );
        return (
            <AppContainer>
                <SearchPanelContainer>
                    <Search
                        value={searchedName}
                        placeholder="input city name"
                        onSearch={this.handleCitySearchByName}
                        onClean={cleanSearchedName}
                    />
                    {searchStatus}
                    <List
                        headerString={"Найденные :"}

                        items={foundCities}
                        renderItem={city => this.renderCity(city)}
                    />
                </SearchPanelContainer>
                {/* <DevButtons installSearchedName={installSearchedName} state={state} />*/}

                <List
                    headerString={"Отслеживаемые :"}
                    items={monitoredCities}
                    renderItem={city => this.renderCity(city, true)}
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

        const shouldFetch =
            (foundCities.size < foundCitiesPaginationNamePartIds.size ||
                hasFoundCitiesPaginationNamePartMore) &&
            !isFoundCitiesPaginationNamePartFetching;
        if (shouldFetch) fetchCitiesByName(searchedName);
    }

    componentDidMount() {
        const {
            turnOnStoreForecastActualityObserver,
            monitoredCities,
            refreshForecastForCitiesIfNeeded
        } = this.props;
        refreshForecastForCitiesIfNeeded(monitoredCities);
        turnOnStoreForecastActualityObserver();
    }

    componentWillUnmount() {
        turnOffStoreForecastActualityObserver();
    }
}

const mapStateToProps = state => {
    const pagination = state.get('pagination');
    const monitoredCitiesPagination =
        state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);
    const foundCitiesByNamePagination = pagination.get('foundCitiesByNamePagination');

    const foundCitiesPaginationNamePart = foundCitiesPaginationNamePartSelector(state);

    const isFoundCitiesPaginationNamePartFetching =
        typeof foundCitiesPaginationNamePart.get('isFetching') === 'undefined'
            ? false
            : foundCitiesPaginationNamePart.get('isFetching');
    const hasFoundCitiesPaginationNamePartMore =
        typeof foundCitiesPaginationNamePart.get('hasMore') === 'undefined'
            ? true
            : foundCitiesPaginationNamePart.get('hasMore');
    const foundCitiesPaginationNamePartIds = foundCitiesPaginationNamePart.get('ids') || Set([]);

    return {
        foundCities: foundCitiesSelector(state),
        monitoredCities: monitoredCitiesSelector(state),
        isFoundCitiesPaginationNamePartFetching,
        hasFoundCitiesPaginationNamePartMore,
        foundCitiesPaginationNamePartIds,
        foundCitiesByNamePagination,
        monitoredCitiesPagination,
        searchedName: searchedNameSelector(state)
    };
};

export default connect(
    mapStateToProps,
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
)(pure(Root));
