import {fromJS, Map} from "immutable";
import {PROTOTYPE_OF_PERSISTED_PART_OF_STORE} from "../constants/StoreStructure"


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

const copyIdenticalKeys = (map, obj, parentKeyName) => {
    const keys = obj && Object.keys(obj);

    //console.log("parentKeyName = ", parentKeyName);
    //console.log("obj = ", obj);
    //console.log("keys = ", keys);

    if (!keys || keys.length === 0) {
        //console.log("выход за неимением ключей , возврат map = ", map);
        //console.log("-----------");

        return map;
    }

    map = map.filter((v, key) => {
        //console.log("FILTER , Key = ", key);
        return keys.includes(`${key}`)
    });

    //console.log("after Filter Map = ", map);

    map.forEach((value, key) => {
        //console.log("----------- , key = ", key, " value = ", value)

        const filterResult = copyIdenticalKeys(value, obj[key], key);
        //console.log("filterResult = ", filterResult);

        map = map.setIn([key], filterResult);

        //console.log("Итог внедрения, map = ", map)
    });

    //console.log("-----------");

    return map;
};

export const copyAccordingToEtalonObject = (map, etalon) => {
    let mutableMap = map.asMutable();
    return copyIdenticalKeys(mutableMap, etalon).asImmutable()
};
export const copyAccordingToEtalonObjectConcrete = () => {
    // let map = Map();
    let map = origin;
    map = origin.asMutable();
    map = copyAccordingToEtalonObject(map, PROTOTYPE_OF_PERSISTED_PART_OF_STORE)
    console.log(map);
};
