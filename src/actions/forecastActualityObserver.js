import {loadWeatherByCityId} from "./";

const observerCheckRateInMilliSeconds = 60000;
const forecastActualityInSeconds = 600;

export const turnOnForecastObserver = () => (dispatch, getState) => {
    console.log("Observer = ", getState());

    setInterval(() => {
        const {
            pagination: {monitoredCitiesPagination, foundByActualSearchRequestCitiesPagination},
            entities: {cities}
        } = getState().toJS();

        const trackedCitiesIds =[ ...new Set([...monitoredCitiesPagination, ...foundByActualSearchRequestCitiesPagination])];
        const trackedCities = trackedCitiesIds.map((id) => cities[id]);

        if (trackedCitiesIds.length === 0) return;

        console.log(trackedCitiesIds);

        trackedCities.forEach(({dt, id}) => {
            if (Date.now() / 1000 - dt > forecastActualityInSeconds) dispatch(loadWeatherByCityId(id));
        });

    }, observerCheckRateInMilliSeconds)
};

