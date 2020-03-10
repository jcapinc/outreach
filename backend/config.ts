import {config} from 'dotenv';
import {resolve} from 'path';
import {stat} from 'fs';
import {promisify} from 'util';

const envpath = resolve(__dirname, '.env');

promisify(stat)(envpath).catch(function(err){
	console.log(`file '${envpath}' must exist and must match the IConfig interface`);
	process.exit(1);
});

const {error, parsed:conf} = config({path: envpath});

if(error){
	console.log("Problem parsing config: " + error.message);
	process.exit(1);
}

export interface IConfig{
	secret: string;
}

export default function getConfig(): IConfig{
	return conf as unknown as IConfig; // 😈 this is evil and I regret nothing 😈
}