const copyOnlyCommonKeys = (map, obj) => {
    const keys = obj && Object.keys(obj);

    if (!keys || keys.length === 0) {
        return map;
    }

    let filteredMap = map.filter((value, key) => {
        return keys.includes(`${key}`);
    });

    filteredMap.forEach((value, key) => {
        const filterResult = copyOnlyCommonKeys(value, obj[key]);
        filteredMap = filteredMap.setIn([key], filterResult);
    });

    return filteredMap;
};

export const copyImmutableMapAccordingToEtalonObject = (map, etalon) => {
    let mutableMap = map.asMutable();
    return copyOnlyCommonKeys(mutableMap, etalon).asImmutable();
};
