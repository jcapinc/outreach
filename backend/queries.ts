import { Database } from './database';
import { IResolverObject } from 'graphql-tools';

export default function GetQueries(db: Database): IResolverObject {
  return {
		getUser: (_, {guid} : {guid: string}) => {
			const sql = "SELECT guid, username, email, firstname, lastname FROM users WHERE guid=?";
			return new Promise(function(res, rej){
				db.get(sql, [guid], function(err, record){
					if(err) rej(err);
					res(record)
				});
			});
		},
		getFlockFuzzy: (_,{search}: {search: string}) => {
			const query = `SELECT firstname, lastname, guid FROM sheep WHERE firstname LIKE ? OR lastname LIKE ? ` +
				`OR firstname || ' ' || lastname LIKE ? LIMIT 100`;
			const s = `%${search}%`;
			return new Promise(function(res,rej){
				db.all(query, [s,s,s], (err, rows) => {
					if(err) rej(err);
					res(rows);
				});
			})
		},
		getPrayerRequests: () => {
			const query = `SELECT * FROM prayer_requests WHERE topic !=''`;
			return new Promise(function(res,rej){
				db.all(query,(err, rows) => {
					if(err) rej(err);
					res(rows);
				});
			});
		}
	};
}
