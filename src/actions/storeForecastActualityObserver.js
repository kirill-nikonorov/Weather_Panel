import {fetchWeatherByCityId} from "./";
import {Set} from 'immutable'
import {deleteCities} from './citiy'

const observerCheckRateInMilliSeconds = 5000;
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

    const expireForecastCities = cities.filter(city => {
        const dt = city.get('dt');

        return Date.now() / 1000 - dt > forecastActualityInSeconds;
    });

    console.log("expired Cities = ", expireForecastCities)
    if (expireForecastCities.size > 0)
        dispatch(deleteCities([...expireForecastCities.keys()]));
};

const adjustStoreForecastAccordingToActualityRequirements = (dispatch, getState) => {
    const pagination = getState().get("pagination");
    const monitoredCitiesPagination = pagination.get("monitoredCitiesPagination");
    const foundByActualSearchRequestCitiesPagination = pagination.get("foundByActualSearchRequestCitiesPagination");
    const cities = getState().get("entities").get("cities");

    const monitoredCitiesIds = monitoredCitiesPagination.concat(foundByActualSearchRequestCitiesPagination);

    const monitoredCities = monitoredCitiesIds.map(id => cities.get(`${id}`));
    const notMonitoredCities = cities.filterNot((value, id) => monitoredCitiesIds.includes(+id));

    if (monitoredCities.size > 0) dispatch(refreshForecastForCitiesIfNeeded(monitoredCities));

    if (notMonitoredCities.size > 0) dispatch(deleteCitiesIfExpired(notMonitoredCities))
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

