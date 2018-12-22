export const API_KEY = 'b6907d289e10d714a6e88b30761fae22';
export const BASE_URL = 'https://openweathermap.org/data/2.5';
export const ASSETS_URL = 'https://openweathermap.org';

export const IMAGES_ENDPOINT = 'images';
export const SECOND_IMAGES_ENDPOINT = 'img';
export const WEATHER_MAP_ENDPOINT = 'weathermap';
export const CITY_ENDPOINT = 'city';
export const FIND_ENDPOINT = 'find';
export const WEATHER_ENDPOINT = 'weather';
export const GROUP = 'group';

export const COUNTRY_FLAG_URL_ENDPOINT = 'flags';
export const WEATHER_ICON_URL_ENDPOINT = 'w';

export const adjustUrl = (url, ...endpoints) => {
    const fullUrl = endpoints.reduce((urlPart, endpoint) => {
        return urlPart + '/' + endpoint;
    }, url);
    return params => embedParams(fullUrl, params);
};

const embedParams = (url, params) => {
    let paramsPart = '';
    if (params && typeof params === 'object')
        paramsPart = Object.keys(params).reduce((paramsPart, param, index, arr) => {
            return `${paramsPart}${param}=${params[param]}${arr.length > index ? '&' : ''}`;
        }, '?');
    return `${url}${paramsPart}`;
};

export const getFlagIconUrl = countryCode =>
    `${adjustUrl(ASSETS_URL, IMAGES_ENDPOINT, COUNTRY_FLAG_URL_ENDPOINT, countryCode)()}.png`;
export const getWeatherIconUrl = iconId =>
    `${adjustUrl(ASSETS_URL, SECOND_IMAGES_ENDPOINT, WEATHER_ICON_URL_ENDPOINT, iconId)()}.png`;
export const getCityOnMapUrl = (lat, lon) => {
    return adjustUrl(ASSETS_URL, WEATHER_MAP_ENDPOINT)({zoom: 12, lat: lat, lon: lon});
};
export const getCityForecastUrl = id => {
    return adjustUrl(ASSETS_URL, CITY_ENDPOINT, id)();
};
