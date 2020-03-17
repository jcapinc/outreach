import { UserAppState } from '../ModelTypes';
import { UserRecord } from './login';
import { resolve } from 'path';
import { Database } from 'sqlite3';
import { Express, Request } from 'express';
import { decode } from 'jsonwebtoken';
import { promisify } from 'util';
import { Diff, diff, applyChange } from 'deep-diff';
import fs from 'fs';


const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

async function exists(path: fs.PathLike){
	try {
		const results = await stat(path);
		if(results.isFile()) return true;
		if(results.isDirectory()) return true;
		return false
	} catch(_) {
		return false;
	}
}

export interface StateOptions{
	directory: string;
}

const defaultStateOptions = {
	directory: resolve(__dirname,"..","build","records")
}

export type IJWTPayload = Pick<UserRecord,"username" | "guid"> & {iat: number};

const defaultState: UserAppState = {
	requests: []
};

const getUserPathGen = (options: StateOptions) => (request: Request): string => {
	const decoded = decode(request.headers.authorization.split(" ")[1]) as IJWTPayload;
	return resolve(options.directory, `${decoded.guid}.json`)
}

export default function state(app: Express, userOptions: Partial<StateOptions> = {}) {
	const options = {...userOptions, ...defaultStateOptions};
	const getUserPath = getUserPathGen(options);
	exists(options.directory).then(exists => exists ? null : fs.mkdir(options.directory,() => null));

	app.get("/state", async function(request,response) {
		const userPath = getUserPath(request);
		if (!(await exists(userPath))) {
			await writeFile(userPath, JSON.stringify(defaultState));
			return response.send(defaultState);
		} 
		return response.send(JSON.parse((await readFile(userPath)).toString()));
	});

	app.post("/state", async function(request,response){
		const userPath = getUserPath(request);
		if(!(await exists(userPath))) await writeFile(userPath, JSON.stringify(defaultState));
		const results = JSON.parse((await readFile(userPath)).toString()) as UserAppState;
		const changes = request.body as Diff<UserAppState>[];
		changes.map(diff => applyChange(results, undefined, diff));
		await writeFile(userPath, JSON.stringify(results));
		response.send({message:"success"});
	});

	app.get("/state/diff", async function(request,response){
		const userPath = getUserPath(request);
		if(!(await exists(userPath))) await writeFile(userPath, JSON.stringify(defaultState));
		const results = JSON.parse((await readFile(userPath)).toString()) as UserAppState;
		const compare = request.body as UserAppState[];
		response.send(diff(results,compare));
	});
}