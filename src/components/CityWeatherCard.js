import React from "react"

import {Switch} from 'antd';
import styled from "styled-components"
import {getCityForecastUrl, getCityOnMapUrl, getFlagIconUrl, getWeatherIconUrl} from "../constants/Api";
import Immutable from "immutable";
import {bool, func, number, object, shape, string, instanceOf } from 'prop-types';


const Bolder = styled.span`
        font-weight: bold;
`;

const BaselineAlignedImage = styled.img`
        display: inline-block;
       vertical-align: baseline;
`;

const CityWeatherCardContainer = styled.div`
     display: flex;
     align-items:center;
     min-height: 70px;
     border: 1px solid black;
     border-radius: 10px ;
     background-color: white;
     padding: 5px;
    `;

const Block = styled.div`
        display: flex;
        justify-content: space-between;
        flex-wrap :wrap;
        flex : 1;
    }
`;

const CityLink = ({name, countryCode, cityId}) => {
    return <a style={{
        fontWeight: 'bold',
        color: '#FF9200'
    }} href={getCityForecastUrl(cityId)}>{name},{countryCode}</a>
};


const CountryFlagIcon = ({countryCode}) => {
    return <BaselineAlignedImage src={getFlagIconUrl(countryCode.toLowerCase())}/>
};

const GreyRoundBorderLabel = styled.div`
      display: inline-block;
      color: white;
      background-color: grey;
      border: 10px solid grey ;
      border-top: 0px;
      border-bottom: 0px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9em;
      text-align: center;
      
`;
const TemperatureBox = ({temp}) => {
    return <GreyRoundBorderLabel>
        {Math.round(temp)}
        <sup>o</sup>K
    </GreyRoundBorderLabel>
};


const CommonInfoBlock = ({name, countryCode, weatherDescription, cityId}) => {
    return (
        <div>
            <CityLink name={name} countryCode={countryCode} cityId={cityId}/>{` `}
            <CountryFlagIcon countryCode={countryCode}/>{` `}
            <Bolder>{weatherDescription}</Bolder>
        </div>)
};

const PreciseWeatherInfoBlock = ({temp, temp_min, temp_max, windSpeed, clouds: {all}, pressure}) => {
    return (
        <div>
            <TemperatureBox temp={temp}/>{` `}
            temperature from {temp_max} to {temp_min} °С, wind {windSpeed} m/s. clouds {all} %, {pressure} hpa
        </div>)
};
const GeoCoordBlock = ({coord: {lat, lon}}) => {
    return (
        <div>
            Geo coords : <a href={getCityOnMapUrl(lat, lon)}>[{lat}, {lon}]</a>
        </div>
    )
};


const WeatherIcon = ({iconId}) => (
    <BaselineAlignedImage src={getWeatherIconUrl(iconId)}/>
);


class CityWeatherCard extends React.Component {

    static propTypes = {
        city: object.isRequired,
        isMonitored: bool.isRequired,
    };

    constructor(props) {
        super(props);
    }

    handleToggleMonitoring = () => {
        const {toggleMonitoring} = this.props;
        toggleMonitoring();
    };

    renderSwitch() {
        const {isMonitored} = this.props;
        return (
            <div>
                {isMonitored ? "Отслеживается" : "Отслеживать ?"} <Switch checked={isMonitored}
                                                                          onChange={this.handleToggleMonitoring}/>
            </div>
        )
    }

    render() {
        const {
            city: {
                name, weather: [{description, icon}], coord,
                main: {temp, temp_min, temp_max, pressure}, sys: {country},
                wind: {speed}, clouds, id,
            }
        } = this.props;

        return (
            <CityWeatherCardContainer>
                <WeatherIcon iconId={icon}/>
                <Block>
                    <div>
                        <CommonInfoBlock
                            name={name}
                            countryCode={country}
                            weatherDescription={description}
                            cityId={id}
                        />
                        <PreciseWeatherInfoBlock temp={temp}
                                                 temp_min={temp_min}
                                                 temp_max={temp_max}
                                                 widnSpeed={speed}
                                                 clouds={clouds}
                                                 pressure={pressure}
                        />
                        <GeoCoordBlock coord={coord}/>
                    </div>
                    {this.renderSwitch()}
                </Block>
            </CityWeatherCardContainer>
        )
    }
}

export default CityWeatherCard;