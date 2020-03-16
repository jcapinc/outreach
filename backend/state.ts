import { resolve } from 'path';
import { Database } from 'sqlite3';
import { Express } from 'express';

export interface StateOptions{
	directory: string;
}

const defaultStateOptions = {
	directory: resolve(__dirname,"..","build","records")
}

export default function state(db:Database, app: Express, options: StateOptions = defaultStateOptions){
	app.get("/state",function(request,response){
	});
}