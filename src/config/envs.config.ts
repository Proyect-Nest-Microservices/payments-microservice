import 'dotenv/config'
import * as joi from 'joi';


interface EnvVars{
    PORT: number;
    STRIPE_SECRET: string;
    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required(),
    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
}).unknown(true)

const {error, value} = envsSchema.validate(process.env)

if (error) {
    throw new Error(`Config validation Error ${error.message}`)
}

const envsVars: EnvVars = value;


export const envs = {
    PORT: envsVars.PORT,
    STRIPE_SECRET: envsVars.STRIPE_SECRET,
    STRIPE_SUCCESS_URL: envsVars.STRIPE_SUCCESS_URL,
    STRIPE_CANCEL_URL: envsVars.STRIPE_CANCEL_URL,
    STRIPE_ENDPOINT_SECRET: envsVars.STRIPE_ENDPOINT_SECRET
}
