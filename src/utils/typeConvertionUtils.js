import {fromJS, Iterable, Set, Map, isImmutable} from "immutable"
import * as immutable from "immutable"
import {structurePathsWithTypesConverters} from "../constants/StoreStructure"
import {TYPE_STRUCTURE_OF_STORE_FOR_FROMJS_CONVERSION} from "../constants/StoreStructure"

console.log("immutable = ", immutable);
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

   // console.log(path);

    if (finalType) return finalType;
    else return isKeyed(value) ? value.toMap() : value.toList()
};

export const convertStateToImmutableAccordingToNeededStructure = (obj) => {
    return fromJS(obj, reviver)
};


////////////////////////////////


export const TYPE_CONVERSION_FUNCTIONS = {
    toSet: (col) => Set(col)
};

const {toSet} = TYPE_CONVERSION_FUNCTIONS;


/*let origin = {
    arr: [{"arrObj01": "value01", "arrObj02": "value02"},
        {"arrObj11": "value11", "arrObj12": "value12"},
        {"arrObj21": "value20", "arrObj22": "value22"}],
};*/


/*let origin = {
    pagination: {monitoredCitiesPagination: ['a', "b"]},
    arr: [{"arrObj01": "value01", "arrObj02": "value02"},
        {"arrObj11": "value11", "arrObj12": "value12"},
        {"arrObj21": "value20", "arrObj22": "value22"}],
    entities: {users: {kirill: "nikonorov"}, cities: {volosov: "Oleg", kemer: "NOY"}},
};*/
let originWithSet = {
    pagination: {monitoredCitiesPagination: Set(['a', "b"])},
    arr: [{"arrObj01": "value01", "arrObj02": "value02"},
        {"arrObj11": "value11", "arrObj12": "value12"},
        {"arrObj21": "value20", "arrObj22": "value22"}],
    entities: {users: {kirill: "nikonorov"}, cities: {volosov: "Oleg", kemer: "NOY"}},
};


const {isSet} = Set;

const matchConstructor = (obj) => {
    if (isSet(obj)) return (obj) => Set(obj);
    return (obj) => fromJS(obj)
};


class EtalonWrapper {
    constructor(etalonObj) {
        this.etalonObj = etalonObj;
        this.isImmutable = isImmutable(etalonObj)
    }

    keys() {
        const {etalonObj, isImmutable} = this;
        if (isImmutable) return [...etalonObj.keys()];
        return Object.keys(etalonObj)
    }

    get(key) {
        const {etalonObj, isImmutable} = this;
        if (isImmutable) return etalonObj.get(key);
        return etalonObj[key]
    }


    changeTypeToEtalonTypeIfNeeded(obj) {
        return matchConstructor(this.etalonObj)(obj)
    }
}

export const etalon = {
    1: {arrObj02: Set()}
};

let origin = [
    {arr01: ["value01", "value02"]}, {arrObj02: ["value11", {hidden: ['a', 'b']}]}
];


const converseIdenticalKeys = (obj, etalon, parentKeyName) => {

    const etalonWrapper = new EtalonWrapper(etalon);

    const keys = etalon && etalonWrapper.keys();

    console.log("parentKeyName = ", parentKeyName);
    console.log("etalon = ", etalon);
    console.log("keys = ", keys);

    if (!keys || keys.length === 0) {
        console.log("выход за неимением ключей , возврат obj = ", fromJS(obj));
        console.log("-----------");

        return etalonWrapper.changeTypeToEtalonTypeIfNeeded(obj);
    }


    Object.keys(obj).forEach((key) => {
        const value = obj[key];
        console.log("----------- , key = ", key, " value = ", value);

        const conversedResult = converseIdenticalKeys(value, etalonWrapper.get(key), key);
        console.log("conversedResult = ", conversedResult);

        obj[key] = conversedResult;

        console.log("Итог внедрения, obj = ", obj)
    });

    console.log("-----------");

    return etalonWrapper.changeTypeToEtalonTypeIfNeeded(obj);
};

export const converseObjectTypeAccordingToEtalonObject = (obj, etalon) => {
    return fromJS(converseIdenticalKeys(obj, etalon))
};


export const converseObjectChildTypesAccordingToEtalonObjectConcrete = () => {
    /*        const set = Set([1, 2, 3]);
        console.log(...set.keys());

             set.keys().forEach((key) => {
                 console.log(key)
             });
    */


    //const wrapper = new EtalonWrapper(Set([5, 3, 4,]));
    //console.log(wrapper);
    //console.log(wrapper.keys());

    //console.log(wrapper.changeTypeToEtalonTypeIfNeeded(origin));


    origin = converseObjectTypeAccordingToEtalonObject(origin, etalon)
    console.log(origin);
};
