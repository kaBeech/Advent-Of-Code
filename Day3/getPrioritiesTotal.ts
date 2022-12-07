import { convertMultiLineStringToArray } from "../tools/convertMultiLineStringToArray.ts"

const prioritiesLegend = "_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
let total = 0;


const getPrioritiesTotal = async (input: any) => {
    if (typeof(input) === "string") {
        input = await convertMultiLineStringToArray(input) as any[];
    }

    total = 0;

    return total
}

export { getPrioritiesTotal }