import { db } from "../database.connection.js";


export async function postJogos(req, res) {
    const {name,image,stockTotal,pricePerDay} = req.body
    try{
        const verificaNome = await db.query(`SELECT * FROM games WHERE name='${name}'`)
        if (verificaNome.rowCount > 0) return res.status(409).send("Jogo ja cadastrado")
        await db.query(`INSERT INTO games (name,image,"stockTotal","pricePerDay") VALUES ('${name}','${image}',${stockTotal},${pricePerDay});`)
        res.sendStatus(201)
        } catch (err) {
        return res.status(500).send(err.message);
        }
}

export async function getJogos(req, res) {
    try{
        const games = await db.query(`SELECT * FROM games;`)
        res.status(200).send(games.rows)
        } catch (err) {
        return res.status(500).send(err.message);
        }
}