import {fromJS, Map} from "immutable";
import {PROTOTYPE_OF_PERSISTING_PART_OF_STORE} from "../constants/StoreStructure"


const objWithKeysNeededToBeCopied = {
    entities: {cities: {volosov: {}}},
    arr: {1: {}},
    pagination: {users: {kir: {}}}
};

let origin = fromJS({
    pagination: {users: {kir: 'a', nikon: "b"}},
    arr: [{"arrObj11": "value11", "arrObj12": "value12"},
        {"arrObj21": "value21", "arrObj22": "value22"},
        {"arrObj31": "value30", "arrObj32": "value32"}],
    entities: {users: {kirill: "nikonorov"}, cities: {volosov: "Oleg", kemer: "NOY"}}
});

const copyOnlyCommonKeys = (map, obj) => {
    const keys = obj && Object.keys(obj);

    //console.log("parentKeyName = ", parentKeyName);
    //console.log("obj = ", obj);
    //console.log("keys = ", keys);

    if (!keys || keys.length === 0) {
        //console.log("выход за неимением ключей , возврат map = ", map);
        //console.log("-----------");

        return map;
    }

    map = map.filter((value, key) => {
        //console.log("FILTER , Key = ", key);
        return keys.includes(`${key}`)
    });

    //console.log("after Filter Map = ", map);

    map.forEach((value, key) => {
        //console.log("----------- , key = ", key, " value = ", value)

        const filterResult = copyOnlyCommonKeys(value, obj[key], key);
        //console.log("filterResult = ", filterResult);

        map = map.setIn([key], filterResult);

        //console.log("Итог внедрения, map = ", map)
    });

    //console.log("-----------");

    return map;
};

export const copyImmutableMapAccordingToEtalonObject = (map, etalon) => {
    let mutableMap = map.asMutable();
    return copyOnlyCommonKeys(mutableMap, etalon).asImmutable()
};
export const copyAccordingToEtalonObjectConcrete = () => {
    // let map = Map();
    let map = origin;
    map = origin.asMutable();
    map = copyImmutableMapAccordingToEtalonObject(map, PROTOTYPE_OF_PERSISTING_PART_OF_STORE)
    console.log(map);
};
