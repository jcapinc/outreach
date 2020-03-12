import { IPrayerRequest } from '../ModelTypes';
import { Database } from "./database";
import uniqid from 'uniqid';
import { IResolverObject } from 'graphql-tools';

export default function GetMutations(db: Database): IResolverObject{
	return {
		createPrayerRequest: async function(){
			const results: IPrayerRequest | undefined = await new Promise(function(resolve){
				const query = "SELECT * FROM prayer_requests WHERE topic=''";
				db.get(query, function(err, row){
					if(err) resolve(undefined);
					resolve(row);
				});
			});
			if(results !== undefined) return results;
			const id: string = uniqid();
			new Promise(function(resolve, reject){
				const query = "INSERT INTO prayer_requests (guid, topic, body) VALUES (?,'','')";
				db.run(query, [id], resolve);
			});
			return {
				guid: id,
				topic: '',
				body: ''
			}
		}
	}
}