import { jogoSchema } from "../schemas/jogos.Schema.js";

export function jogosValidation(req,res,next){

    const validation = jogoSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(422).send(errors);
    }
    next()
}