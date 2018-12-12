import {fromJS, Iterable} from "immutable"
import {STRUCTURE_PATHS_WITH_TYPES_CONVERTERS} from "../constants/StoreStructure"

const {isKeyed} = Iterable;

const areArraysEqual = (arr1, arr2) => {
    return JSON.stringify(arr1) === JSON.stringify(arr2)
};

const reviver = (key, value, path) => {
    let finalType = undefined;
    STRUCTURE_PATHS_WITH_TYPES_CONVERTERS.forEach((convertToType, pathNeededInTypeConversion) => {

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

