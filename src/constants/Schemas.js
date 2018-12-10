import {schema} from "normalizr"

const citySchema = new schema.Entity('cities')

export const Schemas = {
    CITY: citySchema,
    CITIES: [citySchema]
};