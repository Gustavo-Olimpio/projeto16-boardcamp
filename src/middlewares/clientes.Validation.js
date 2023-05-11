import { clienteSchema } from "../schemas/clientes.Schema.js";

export function clientesValidation(req,res,next){

    const validation = clienteSchema.validate(req.body, { abortEarly: false });

    if (validation.error) {
        const errors = validation.error.details.map((detail) => detail.message);
        return res.status(400).send(errors);
    }
    next()
}