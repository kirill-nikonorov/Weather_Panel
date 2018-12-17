import React from 'react';
import {connect} from 'react-redux';
import {
    fetchWeatherByCityName,
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
        const {searchedCitiesByNamePagination, searchedName, fetchCitiesByName, cities} = this.props;

        const searchedCitiesIds = searchedCitiesByNamePagination.get(searchedName);
        if (searchedCitiesIds) this.ensureForecastExistenceForEveryCityId(searchedCitiesIds);
        else if (searchedName) fetchCitiesByName(searchedName);
    };

    ensureForecastExistenceForEveryCityId(searchedCitiesIds) {
        const {cities, fetchWeatherByCityId} = this.props;

        searchedCitiesIds.forEach(id => {
                const city = cities.get(`${id}`);
                if (!city) fetchWeatherByCityId(id);
            }
        )
    }

    componentDidMount() {
        const {turnOnStoreForecastActualityObserver, monitoredCities, refreshForecastForCitiesIfNeeded} = this.props;
        refreshForecastForCitiesIfNeeded(monitoredCities);
        turnOnStoreForecastActualityObserver();

    }

    componentWillUnMount() {
        turnOffStoreForecastActualityObserver();
    }

    shouldComponentUpdate(nextState) {
        /*  const monitoredChangeableKeys = ["cities", 'foundCities',
              "monitoredCities", "monitoredCitiesPagination"];

          const should = monitoredChangeableKeys.some((name) => {
              const changed = !is(nextState[name], this.props[name])
              console.log("changed name= ", name, nextState[name], this.props[name]);
              return changed;
          });

          /!*        const {cities: nextCities, foundCities: nextFoundCities} = nextState;
                  const {cities} = this.props;*!/

          console.log("ОБновелине Root = ", nextState);
          //   console.log("nextCities = ", nextCities);
          console.log("should = ", should);
          console.log("____________________");

          // const shoulda = !cities.equals(nextCities);*/
        return true;
    }
}


const mapStateToProps = (state) => {

    const cities = state.get('entities').get('cities') || fromJS({});
    const pagination = state.get('pagination');
    const monitoredCitiesPagination = state.get('pagination').get('monitoredCitiesPagination') || fromJS([]);
    const monitoredCities = Set([...cities.filter(city => monitoredCitiesPagination.has(city.get(`id`))).values()]);

    const searchedName = state.get('searchedName');
    const searchedCitiesByNamePagination = pagination.get('searchedCitiesByNamePagination');
    const foundCitiesIds = searchedCitiesByNamePagination.get(searchedName) || Set([]);
    const foundCities = Set([...cities.filter(city => foundCitiesIds.has(city.get(`id`))).values()]);

    return {
        cities,
        foundCities,
        monitoredCities,
        monitoredCitiesPagination,
        searchedCitiesByNamePagination,
        searchedName,
        state
    };
};

export default connect(mapStateToProps,
    {
        fetchWeatherByCityName,
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
)(Table);
