import { db } from "../database.connection.js";
import dayjs from "dayjs";

export async function postClientes(req, res) {
    const {name,phone,cpf,birthday} = req.body
    console.log(dayjs(birthday).format('YYYY-MM-DD'))
    try{
        const verificaCpf = await db.query(`SELECT * FROM customers WHERE cpf='${cpf}'`)
        if (verificaCpf.rowCount > 0) return res.status(409).send("Desculpe, esse CPF ja foi cadastrado")
        await db.query(`INSERT INTO customers (name,phone,cpf,birthday) VALUES ('${name}','${phone}','${cpf}','${dayjs(birthday).format('YYYY-MM-DD')}');`)
        res.sendStatus(201)
        } catch (err) {
        return res.status(500).send(err.message);
        }
}

export async function getClientes(req, res) {
    try{
        if (!req.params.id){
                const clientes = await db.query(`SELECT * FROM customers;`)
                res.status(200).send(clientes.rows)
        } else {
                const clientes = await db.query(`SELECT * FROM customers WHERE id=${req.params.id};`)
                if (!clientes.rows[0]) return res.status(404).send("Nao existe cliente com esse ID") 
                res.status(200).send(clientes.rows[0]) 
        }
        } catch (err) {
        return res.status(500).send(err.message);
        }
}

export async function putClientes(req, res) {
    const {id} = req.params
    const {name,phone,cpf,birthday} = req.body
    try{
        const verificaCpf = await db.query(`SELECT * FROM customers WHERE cpf='${cpf}' AND id!=${id}`)
        if (verificaCpf.rowCount > 0) return res.status(409).send("Desculpe, esse CPF ja foi cadastrado")
        await db.query(`UPDATE customers SET name='${name}',phone='${phone}',cpf='${cpf}',birthday='${birthday}' WHERE id=${id}`)
        res.status(200).send('OK')     
    } catch (err) {
        return res.status(500).send(err.message);
        }
}