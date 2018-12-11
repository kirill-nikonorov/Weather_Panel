import {fromJS, isCollection, Map} from "immutable";

const extractValueFromCollectionByPath = (sequenceOfKeys, collectable) => {
    let extractedValue = collectable;

    sequenceOfKeys.forEach(key => {
        if (isCollection(extractedValue) && extractedValue.has(key)) {
            extractedValue = extractedValue.get(key)
        }
    });

    return extractedValue;
};

const addressesOfAllElementsToCopy = [['ent'], ['ent', 'cities'], ['ent', 'cities', 'volosov']]
console.log(addressesOfAllElementsToCopy);

const origin = fromJS({
    pagin: {users: {kir: 'a'}},
    ent: {users: {kirill: "nikonorov"}, cities: {volosov: "Oleg", kemer: "NOY"}}
})

export const idont = () => {
    let map = Map();

    for (let i = 0; i < addressesOfAllElementsToCopy.length; i++) {
        console.log(i + "-----------");

        const addressesOfElement = addressesOfAllElementsToCopy[i];

        const parentPath = addressesOfElement.slice(0, -1);
        const keyOfChild = addressesOfElement.slice(-1)
        console.log("parentPath = ", parentPath)
        console.log("keyOfChild = ", keyOfChild);

        const parent = extractValueFromCollectionByPath(parentPath, origin);
        console.log("parent = ", parent);

        const neededChild = parent.filter((v, key) => key == keyOfChild);

        console.log("neededChild = ", neededChild);

        map = map.setIn(parentPath, neededChild)

        console.log("result = ", map)
    }
}
