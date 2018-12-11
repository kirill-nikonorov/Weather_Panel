import {TYPE_CONVERSION_FUNCTIONS} from './TypeConversionFunctions'

const {toSet} = TYPE_CONVERSION_FUNCTIONS;


const structurePathsWithTypesConverters = new Map();
structurePathsWithTypesConverters.set(['pagination', "monitoredCitiesPagination"], toSet);

export {structurePathsWithTypesConverters};

export const TYPE_STRUCTURE_OF_STORE_FOR_FROMJS_CONVERSION = {
    pagination: {
        monitoredCitiesPagination: {toSet}
    }
};

export const PROTOTYPE_OF_PERSISTED_PART_OF_STORE = {
    entities: {cities: {}},
    pagination: {monitoredCitiesPagination: {}}
};