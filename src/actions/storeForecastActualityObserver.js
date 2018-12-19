import {fetchWeatherByCityId} from "./";
import {deleteCities} from './citiy'
import {fromJS, Set} from 'immutable'

const observerCheckRateInMilliSeconds = 30000;
const forecastActualityInSeconds = 600;

export const refreshForecastForCitiesIfNeeded = cities => dispatch => {
    console.log("cities in Refresh = ", cities);
    cities.forEach(city => {
        const dt = city.get('dt');
        const id = city.get('id');

        console.log(Date.now() / 1000 - dt);
        if (Date.now() / 1000 - dt > forecastActualityInSeconds) dispatch(fetchWeatherByCityId(id));
    });
};

const deleteCitiesIfExpired = cities => dispatch => {

    console.log("+++");
    const expireForecastCities = cities.filter(city => {
        const dt = city.get('dt');
        console.log(Date.now() / 1000 - dt);
        return Date.now() / 1000 - dt > forecastActualityInSeconds;
    });

    console.log("expired Cities = ", expireForecastCities)
    if (expireForecastCities.size > 0)
        dispatch(deleteCities([...expireForecastCities.keys()]));
};

const adjustStoreForecastAccordingToActualityRequirements = (dispatch, getState) => {
    console.log("_____");
    const state = getState();
    const searchedName = state.get("searchedName");
    const cities = state.get("entities").get("cities");

    const pagination = state.get("pagination");
    const monitoredCitiesPagination = pagination.get("monitoredCitiesPagination");
    const foundCitiesByNamePagination = pagination.get("foundCitiesByNamePagination");
    const actuallySearchedCities = foundCitiesByNamePagination.get(searchedName) || fromJS([]);
    const actuallySearchedCitiesIds = actuallySearchedCities.get("ids") || fromJS([]);

    const monitoredCitiesIds = monitoredCitiesPagination.concat(actuallySearchedCitiesIds);

    const monitoredCities = Set([...cities.filter(city => monitoredCitiesPagination.has(city.get(`id`))).values()])

    const notMonitoredCities = cities.filterNot((value, id) => monitoredCitiesIds.includes(+id));

    if (monitoredCities.size > 0) dispatch(refreshForecastForCitiesIfNeeded(monitoredCities));


    if (notMonitoredCities.size > 0) dispatch(deleteCitiesIfExpired(notMonitoredCities))
    console.log("_____")

};


let timer;
export const turnOnStoreForecastActualityObserver = () => (dispatch, getState) => {
    if (timer) clearTimeout(timer);
    console.log("Observer enabled ");

    timer = setInterval(() => {
        adjustStoreForecastAccordingToActualityRequirements(dispatch, getState)
    }, observerCheckRateInMilliSeconds)
};
export const turnOffStoreForecastActualityObserver = () => {
    clearTimeout(timer);
};

