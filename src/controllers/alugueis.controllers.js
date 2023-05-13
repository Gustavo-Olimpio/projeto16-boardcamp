import { db } from "../database.connection.js";
import dayjs from "dayjs";

export async function getAlugueis(req, res) {
    const array = []
    try {
        const alugueis = await db.query(`SELECT rentals.*,games.name AS gamename,customers.name AS customersname FROM rentals JOIN games ON rentals."gameId"=games.id JOIN customers ON rentals."customerId"=customers.id`)
        for (let i = 0; i < alugueis.rowCount; i++) {
            let aluguel = alugueis.rows[i]
            let objeto = {
                id: aluguel.id,
                customerId: aluguel.customerId,
                gameId: aluguel.gameId,
                rentDate: aluguel.rentDate,
                daysRented: aluguel.daysRented,
                returnDate: aluguel.returnDate,
                originalPrice: aluguel.originalPrice,
                delayFee: aluguel.delayFee,
                customer: {
                    id: aluguel.customerId,
                    name: aluguel.customersname
                },
                game: {
                    id: aluguel.gameId,
                    name: aluguel.gamename
                }
            }
            array.push(objeto)
        }
        res.status(200).send(array)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function postAlugueis(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const rentDate = dayjs().format('YYYY-MM-DD')
    try {
        const clienteExiste = await db.query(`SELECT * FROM customers WHERE id=${customerId};`)
        if (!clienteExiste.rows[0]) return res.status(400).send("Cliente nao identificado")
        const jogo = await db.query(`SELECT * FROM games WHERE id=${gameId};`)
        if (!jogo.rows[0]) return res.status(400).send("Jogo nao identificado")
        const alugueis = await db.query(`SELECT * FROM rentals WHERE "gameId"=${gameId};`)
        if (alugueis.rowCount + 1 > jogo.rows[0].stockTotal) return res.status(400).send("Desculpe, este jogo esta fora de estoque")
        const originalPrice = daysRented * jogo.rows[0].pricePerDay
        await db.query(`INSERT INTO rentals ("customerId","gameId","rentDate","daysRented","originalPrice") VALUES ('${customerId}','${gameId}','${rentDate}','${daysRented}','${originalPrice}');`)
        res.sendStatus(201)
    } catch (err) {
        return res.status(500).send(err.message);
    }
}

export async function postFinalizarAlugueis(req, res) {
    const { id } = req.params
    const returnDate = dayjs().format('YYYY-MM-DD')
    try {
        const alugueis = await db.query(`SELECT * FROM rentals WHERE id=${id};`)
        if (!alugueis.rows[0]) return res.status(404).send("Aluguel nao encontrado")
        if (alugueis.rows[0].delayFee !== null) return res.status(400).send("Aluguel finalizado")
        let delayFee = (((new Date(returnDate) - new Date(alugueis.rows[0].rentDate)) / (1000 * 60 * 60 * 24)).toFixed(0)) * (alugueis.rows[0].originalPrice / alugueis.rows[0].daysRented) - alugueis.rows[0].originalPrice
        if (delayFee <= 0) {
            delayFee = 0
        }
        console.log(delayFee)
        await db.query(`UPDATE rentals SET "returnDate"='${returnDate}',"delayFee"=${delayFee} WHERE id=${id}`)
        res.status(200).send(alugueis.rows[0])
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
export async function deleteAlugueis(req, res) {
    const { id } = req.params
    try {
        const alugueis = await db.query(`SELECT * FROM rentals WHERE id=${id};`)
        if (!alugueis.rows[0]) return res.status(404).send("Aluguel nao encontrado")
        if (alugueis.rows[0].returnDate == null) return res.status(400).send("Aluguel nao finalizado")
        await db.query(`DELETE FROM rentals WHERE id=${id};`)
        return res.status(200).send("OK")
    } catch (err) {
        return res.status(500).send(err.message);
    }
}