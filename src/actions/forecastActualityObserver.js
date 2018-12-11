import {loadWeatherByCityId} from "./";

const observerCheckRateInMilliSeconds = 60000;
const forecastActualityInSeconds = 600;

export const refreshForecastForCitiesIfNeeded = (cities) => dispatch => {
    console.log(cities);
    cities.forEach(({dt, id}) => {
        console.log(Date.now() / 1000 - dt)
        if (Date.now() / 1000 - dt > forecastActualityInSeconds) dispatch(loadWeatherByCityId(id));
    });
};

export const turnOnForecastObserver = () => (dispatch, getState) => {
    console.log("Observer enabled ");

    setInterval(() => {
        console.log("aaaa");
        const {
            pagination: {monitoredCitiesPagination, foundByActualSearchRequestCitiesPagination},
            entities: {cities}
        } = getState().toJS();

        const trackedCitiesIds = [...new Set([...monitoredCitiesPagination, ...foundByActualSearchRequestCitiesPagination])];
        const trackedCities = trackedCitiesIds.map((id) => cities[id]);

        if (trackedCitiesIds.length === 0) return;

        dispatch(refreshForecastForCitiesIfNeeded(trackedCities))

    }, observerCheckRateInMilliSeconds)
};

