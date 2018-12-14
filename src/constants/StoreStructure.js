import {TYPE_CONVERSION_FUNCTIONS} from './TypeConversionFunctions'
const {toSet} = TYPE_CONVERSION_FUNCTIONS;

const STRUCTURE_PATHS_WITH_TYPES_CONVERTERS = new Map();
STRUCTURE_PATHS_WITH_TYPES_CONVERTERS.set(['pagination', "monitoredCitiesPagination"], toSet);





export {STRUCTURE_PATHS_WITH_TYPES_CONVERTERS};

export const PROTOTYPE_OF_PERSISTED_PART_OF_STORE = {
    entities: {cities: {}},
    pagination: {monitoredCitiesPagination: {}}
};