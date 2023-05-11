import { Router } from "express";
import { jogosValidation } from "../middlewares/jogos.Validation.js";
import { postJogos , getJogos } from "../controllers/jogos.controllers.js";
import { clientesValidation } from "../middlewares/clientes.Validation.js";
import { getClientes, postClientes, putClientes } from "../controllers/clientes.controllers.js";
import { getAlugueis, postAlugueis, postFinalizarAlugueis,deleteAlugueis } from "../controllers/alugueis.controllers.js";
import { alugueisValidation} from "../middlewares/alugueis.Validation.js";


const router=Router();
router.post('/games', jogosValidation,postJogos);
router.get('/games',getJogos );

router.post('/customers',clientesValidation,postClientes);
router.get('/customers', getClientes);
router.get('/customers/:id', getClientes);
router.put('/customers/:id', clientesValidation, putClientes );

router.get('/rentals',getAlugueis)
router.post('/rentals',alugueisValidation,postAlugueis)
router.post('/rentals/:id/return',postFinalizarAlugueis)
router.delete('/rentals/:id',deleteAlugueis)




export default router