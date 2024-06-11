import { z } from "zod"

export const decimalSchema = z.preprocess((arg) => {
    if (typeof arg === "string") {
        const matched = arg.match(/^\d+(\.\d\d)?$/);
        if (matched) return parseFloat(arg);
    }
    return arg;
}, z.number());
export type ZodDecimal = z.infer<typeof decimalSchema>;