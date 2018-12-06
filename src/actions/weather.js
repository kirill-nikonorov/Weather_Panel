import {CALL_API} from "../middlewares/api"
import {fetchWeatherForCityByName} from "../lib/reduxActions/actions"
import {Schemas} from "../constants/Schemas";

const fetchWeatherByCityName = (cityName) => ({
    [CALL_API]: {
        endpoint: "weather",
        queryParams: {q: cityName},
        type: fetchWeatherForCityByName,
        schema: Schemas.CITY
    },
    cityName
});

export const loadWeatherByCityName = (cityName) => {
    return (fetchWeatherByCityName(cityName));
};
