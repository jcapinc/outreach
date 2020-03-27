import { Express, RequestHandler } from 'express';
import { Database } from './database';
import expressJWT from "express-jwt";
import jwt from "jsonwebtoken";
import md5 from 'md5';
import { IUserRecord } from "../ModelTypes";

const secret = "temporary-make-me-configurable";

export interface LoginOptions{}

const defaultLoginOptions: LoginOptions = {};

export default function login(
	app: Express, 
	db: Database, 
	userOptions: Partial<LoginOptions> = {}
): () => RequestHandler {
	const options:LoginOptions = Object.assign({}, defaultLoginOptions, userOptions) as LoginOptions;
	app.post("/api/login", async function(req,res){
		try{
			const {username, password} = req.body;
			if(username.length === 0 || password.length === 0) {
				res.status(401).send(JSON.stringify({error: "Username or password was empty"}));
				return;
			}
			const sql = "SELECT username, guid FROM users WHERE username=? AND password=?";
			const record: IUserRecord | undefined = await new Promise<IUserRecord | undefined>((resolve, reject) => {
				db.get(sql, [username, md5(password)], function(err, row){
					if(err) reject(err);
					resolve(row);
				});
			});
			if(record === undefined) throw "Username or Password is Incorrect";
			res.send({jwt: jwt.sign(record, secret)});
			return;
		} catch(exception) {
			res.status(401).send(JSON.stringify({error: exception.toString()}));
			return;
		}
	});
	return () => expressJWT({secret});
}