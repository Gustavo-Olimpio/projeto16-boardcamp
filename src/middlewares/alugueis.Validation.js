import { aluguelSchema } from "../schemas/alugueis.Schema.js";

export function alugueisValidation(req,res,next){

    const validation = aluguelSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }
    next()
}

