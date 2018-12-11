import React from 'react';
import {connect} from 'react-redux';
import {
    loadWeatherByCityName,
    loadCitiesByName,
    addCityToMonitored,
    removeCityFromMonitored,
    loadWeatherByCityId,
    turnOnForecastObserver,
    loadWeatherForSeveralCitiesByIds,
    refreshForecastForCitiesIfNeeded

} from "../actions"
import {Search, CityWeatherCard, CityWeatherWidget, Rubish} from '../components'
import {fromJS, toJS, Map, isCollection} from 'immutable'
import DevTools from './DevTools';
import {copyAccordingToEtalonObjectConcrete} from "../utils"
import {converseTypeAccordingToEtalonObjectConcrete} from "../utils"

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

    toggleMonitoring = (id) => {
        const {

            monitoredCitiesPagination,
            addCityToMonitored,
            removeCityFromMonitored
        } = this.props;
        if (monitoredCitiesPagination.has(id)) removeCityFromMonitored(id)
        else addCityToMonitored(id)

    };

    renderCities = (Component, cities) => {
        const {addCityToMonitored, removeCityFromMonitored} = this.props;
        const citiesCards = Object.values(cities.toJS()).reduce((citiesCardsArr, city) => {
                const {id} = city;
                citiesCardsArr.push(
                    <CityWeatherCard
                        toggleMonitoring={() => this.toggleMonitoring(id)}
                        key={id} city={city}/>);
                return citiesCardsArr;
            }, []
        );

        return (
            <div>
                {citiesCards}
            </div>
        )
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
            loadWeatherForSeveralCitiesByIds
        } = this.props;
        const citiesNames = cities && cities.reduce((namesString, cityData) => {
            return namesString + cityData.get('name')
        }, "");


        //idont()
        //copyAccordingToEtalonObjectConcrete()
        converseTypeAccordingToEtalonObjectConcrete();

        return (
            <div>
                {/*<div style={{border: '1px solid red'}}>
                    <Search onSearch={this.handleCitySearchByName}
                            placeholder="input city name"
                    />
                    {this.renderCities(CityWeatherCard, foundCities)}
                </div>


                <div
                    onClick={() => {
                        loadWeatherByCityName("volosovo");
                        loadWeatherByCityName("london");
                    }}
                    style={{width: '200px', height: '50px', backgroundColor: 'red'}}>
                    подкачать погоду по имени города{citiesNames}
                </div>

                <div
                    onClick={() => {
                        loadCitiesByName("volosovo")
                    }}
                    style={{width: '200px', height: '50px', backgroundColor: 'green'}}> скачать города подходящие под
                    имя
                </div>


                <div
                    onClick={() => {
                        console.log(state)
                    }}
                    style={{width: '200px', height: '50px', backgroundColor: 'yellow'}}>aaa
                </div>
                <div>
                    {this.renderCities(CityWeatherWidget, monitoredCities)}
                </div>
                <DevTools/>*/}
            </div>

        );
    }

    componentDidMount() {
        //  const {turnOnForecastObserver, monitoredCities, refreshForecastForCitiesIfNeeded} = this.props;
        //  refreshForecastForCitiesIfNeeded(monitoredCities.toJS());
        //  turnOnForecastObserver();

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
        turnOnForecastObserver,
        loadWeatherForSeveralCitiesByIds,
        refreshForecastForCitiesIfNeeded
    }
)(Table);


/*
const ComponentsArr = es.reduce((ComponentsArr, e) => {
        ComponentsArr.push(<Component e={e}/>);
        return ComponentsArr;
    }, []
);*/
