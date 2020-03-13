import { IPrayerRequest } from '../ModelTypes';
import { Database } from "./database";
import uniqid from 'uniqid';
import { IResolverObject } from 'graphql-tools';


async function getNewPrayerRequest(db:Database){
	const results: IPrayerRequest | undefined = await new Promise(function(resolve){
		const query = "SELECT * FROM prayer_requests WHERE topic=''";
		db.get(query, function(err, row){
			if(err) resolve(undefined);
			resolve(row);
		});
	});
	if(results !== undefined) return results.guid;
	const id: string = uniqid();
	new Promise(function(resolve){
		const query = "INSERT INTO prayer_requests (guid, topic, body) VALUES (?,'','')";
		db.run(query, [id], resolve);
	});
	return id;
}

export default function GetMutations(db: Database): IResolverObject{
	return {
		createPrayerRequest: async function(){
			return {
				guid: await getNewPrayerRequest(db),
				topic: '',
				body: ''
			}
		},
		updatePrayerRequest: async function(_, {fields}: {fields: IPrayerRequest}){
			if(fields.guid === "") fields.guid = await getNewPrayerRequest(db);
			await new Promise(function(resolve,reject){
				const query = "UPDATE prayer_requests SET topic=?, body=? WHERE guid=?";
				const values = [fields.topic,fields.body,fields.guid];
				console.log(values.reduce((query, value) => query.replace("?",value), query));
				db.run(query,values, function(err){
					if(err) reject(err);
					resolve();
				});
			});
			return await new Promise(function(resolve,reject){
				const query = "SELECT * from prayer_requests WHERE guid=?";
				db.get(query,[fields.guid], function(err,row: IPrayerRequest){
					if(err){
						reject(err);
						return;
					}
					resolve(row);
				});
			});
		}
	}
}