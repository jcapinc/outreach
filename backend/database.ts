import sqlite3 from 'sqlite3';
import path from 'path';
import util from 'util';
import fs from 'fs';
import { IResolvers } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-express';

const readFile = util.promisify(fs.readFile);

export interface IConnectionOptions {
	dbpath: fs.PathLike;
	schemapath: fs.PathLike;
	log: (string) => void
}

export { Database } from 'sqlite3';

const defaultConnectionOptions: IConnectionOptions = {
	dbpath: path.join(__dirname, "..","build","database.sqlite3"),
	schemapath: path.join(__dirname, "schema"),
	log: console.log
};

export async function connect(userOptions: Partial<IConnectionOptions> = defaultConnectionOptions){
	const options = Object.assign(defaultConnectionOptions, userOptions);
	const dbdir = path.dirname(options.dbpath.toString());
	await new Promise(res => fs.stat(dbdir, async (err, stat) => {
		if(err) fs.mkdir(dbdir, res);
		if(!stat.isDirectory()){
			if(stat.isFile()) await util.promisify(fs.unlink)(dbdir);
			fs.mkdir(dbdir, res);
		}
		else res();
	}));

	const db = await new Promise<sqlite3.Database>((res,rej) => {
		const db = new sqlite3.Database(options.dbpath.toString(), err => {
			if(err) rej(err);
			res(db);
		});
	});
	const schemas = await util.promisify(fs.readdir)(options.schemapath);
	const query = "SELECT name FROM sqlite_master WHERE type='table';";
	const extentTables = await new Promise<string[]>((res,rej) => db.all(query, function(err, rows){
		if(err) rej(err);
		res(rows.map(record => record.name));
	}));

	for (let i = 0; i < schemas.length; i++) {
		if(schemas[i].indexOf(".sql") === -1) continue;
		const tablename = schemas[i].replace(".sql","");
		if(tablename[0] === ".") continue;
		if(extentTables.indexOf(tablename) === -1){
			options.log(`Creating table ${tablename}`);
			const schema = (await readFile(path.join(options.schemapath.toString(),schemas[i]))).toString();
			db.exec(schema, (err) => {
				if(err) options.log(err);
			});
		}
	}

	return db;
}

export interface IGetSchemaOptions{
	schemaPath: fs.PathLike;
}

const defaultSchemaOptions: IGetSchemaOptions = {
	schemaPath: path.join(__dirname, "schema.graphql")
};

export const GetSchemaRoot = (db: sqlite3.Database): IResolvers => ({
	Query: {
		getUser: (_, {guid} : {guid: string}) => {
			const sql = "SELECT guid, username, email, firstname, lastname FROM users WHERE guid=?";
			return new Promise(function(res, rej){
				db.get(sql, [guid], function(err, record){
					if(err) rej(err);
					res(record)
				});
			});
		}
	}
});

export const getSchema = async (
	db: sqlite3.Database,
	userOptions: Partial<IGetSchemaOptions> = {}
) => {
	const options = Object.assign(defaultSchemaOptions, userOptions) as IGetSchemaOptions;
	const rawSchema = await readFile(options.schemaPath);
	return new ApolloServer({
		typeDefs: rawSchema.toString(),
		resolvers: GetSchemaRoot(db),
		playground: {endpoint:"/graphiql"}
	});
};