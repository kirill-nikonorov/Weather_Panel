import {fetchWeatherByCityId} from './';
import {deleteCities} from './citiy';
import {fromJS, Set} from 'immutable';

const observerCheckRateInMilliSeconds = 60000;
const forecastActualityInSeconds = 600;

export const refreshForecastForCitiesIfNeeded = cities => dispatch => {
    console.log('cities in Refresh = ', cities);
    cities.forEach(city => {
        const dt = city.get('dt');
        const id = city.get('id');

        console.log(Date.now() / 1000 - dt);
        if (Date.now() / 1000 - dt > forecastActualityInSeconds) dispatch(fetchWeatherByCityId(id));
    });
};

const deleteCitiesIfExpired = cities => dispatch => {
    console.log('+++');
    const expiredForecastCities = cities.filter(city => {
        const dt = city.get('dt');
        console.log(Date.now() / 1000 - dt);
        return Date.now() / 1000 - dt > forecastActualityInSeconds;
    });

    console.log('expired Cities = ', expiredForecastCities);
    if (expiredForecastCities.size > 0) dispatch(deleteCities([...expiredForecastCities.keys()]));
};

const adjustStoreForecastAccordingToActualityRequirements = (dispatch, getState) => {
    console.log('_____');
    const state = getState();
    const searchedName = state.get('searchedName');
    const cities = state.get('entities').get('cities');

    const pagination = state.get('pagination');
    const monitoredCitiesIds = pagination.get('monitoredCitiesIds');
    const foundCitiesByName = pagination.get('foundCitiesByName');
    const actuallySearchedCities = foundCitiesByName.get(searchedName) || fromJS({});
    const actuallySearchedCitiesIds = actuallySearchedCities.get('ids') || fromJS([]);

    const citiesIdsNeededInFreshForecast = monitoredCitiesIds.concat(actuallySearchedCitiesIds);

    const citiesNeededInFreshForecast = Set([
        ...cities.filter(city => citiesIdsNeededInFreshForecast.has(city.get(`id`))).values()
    ]);

    const otherCities = cities.filterNot((value, id) =>
        citiesIdsNeededInFreshForecast.includes(+id)
    );

    if (citiesNeededInFreshForecast.size > 0)
        dispatch(refreshForecastForCitiesIfNeeded(citiesNeededInFreshForecast));

    if (otherCities.size > 0) dispatch(deleteCitiesIfExpired(otherCities));
    console.log('_____');
};

let timer;
export const turnOnStoreForecastActualityObserver = () => (dispatch, getState) => {
    if (timer) clearTimeout(timer);
    console.log('Observer enabled ');

    timer = setInterval(() => {
        adjustStoreForecastAccordingToActualityRequirements(dispatch, getState);
    }, observerCheckRateInMilliSeconds);
};
export const turnOffStoreForecastActualityObserver = () => {
    clearTimeout(timer);
};
