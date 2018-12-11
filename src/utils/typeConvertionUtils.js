import {fromJS, Iterable, is} from "immutable"
import {structurePathsWithTypesConverters} from "../constants/StoreStructure"
import {TYPE_STRUCTURE_OF_STORE_FOR_FROMJS_CONVERSION} from "../constants/StoreStructure"

const {isKeyed} = Iterable;

const areArraysEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
};

const reviver = (key, value, path) => {
    let finalType = undefined;
    structurePathsWithTypesConverters.forEach((convertToType, pathNeededInTypeConversion) => {

        if (areArraysEqual(pathNeededInTypeConversion, path)) {
            finalType = convertToType(value)
        }
    });

    if (finalType) return finalType;
    else return isKeyed(value) ? value.toMap() : value.toList()
};

export const convertStateToImmutableAccordingToNeededStructure = (obj) => {
    return fromJS(obj, reviver)
};


////////////////////////////////


export const TYPE_CONVERSION_FUNCTIONS = {
    toSet: (col) => col.toSet()
};

const {toSet} = TYPE_CONVERSION_FUNCTIONS;

export const etalon = {

    arr: {2: toSet, 0: toSet}
};

let origin = fromJS({
    pagination: {monitoredCitiesPagination: ['a', "b"]},
    arr: [{"arrObj01": "value01", "arrObj02": "value02"},
        {"arrObj11": "value11", "arrObj12": "value12"},
        {"arrObj21": "value20", "arrObj22": "value22"}],
    entities: {users: {kirill: "nikonorov"}, cities: {volosov: "Oleg", kemer: "NOY"}},

});

const converseIdenticalKeys = (map, obj, parentKeyName) => {

    if (typeof obj === "function") {
        console.log("Найденна функция ");

        console.log("parentKeyName = ", parentKeyName);
        console.log("obj = ", obj);
        console.log("keys = ", keys);

        return obj(map)
    }
    const keys = obj && Object.keys(obj);

    console.log("parentKeyName = ", parentKeyName);
    console.log("obj = ", obj);
    console.log("keys = ", keys);

    if (!keys || keys.length === 0) {
        console.log("выход за неимением ключей , возврат map = ", map);
        console.log("-----------");

        return fromJS(map);
    }

    /*    map = map.filter((v, key) => {
            console.log("FILTER , Key = ", key);
            return keys.includes(`${key}`)
        });*/


    map.forEach((value, key) => {
        console.log("----------- , key = ", key, " value = ", value)

        const conversedResult = converseIdenticalKeys(value, obj[key], key);
        console.log("conversedResult = ", conversedResult);

        map = map.setIn([key], conversedResult);

        console.log("Итог внедрения, map = ", map)
    });

    console.log("-----------");

    return map;
};

export const converseTypeAccordingToEtalonObject = (map, etalon) => {
    let mutableMap = map.asMutable();
    return converseIdenticalKeys(mutableMap, etalon).asImmutable()
};
export const converseTypeAccordingToEtalonObjectConcrete = () => {
    // let map = Map();
    let map = origin;
    map = origin.asMutable();
    map = converseTypeAccordingToEtalonObject(map, etalon)
    console.log(map);
};
