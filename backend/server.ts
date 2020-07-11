import express from "express";
import { connect } from "./database";
import login from './login';
import state from './state';
import path from 'path';

console.log('cwd',process.cwd());
const app = express();
app.use(express.json());
app.use("/",express.static(path.resolve(__dirname,"..")));

const port = 9001;
connect().then(db => {
	const secure = login(app, db);
	state(app, secure);
	app.get("/*", (_, res) => {
		res.sendFile(path.resolve(path.join(__dirname, '..','index.html')));
	});
	app.listen(port);
	console.log("Listening on port " + port.toString());
}).catch(err => {
	return console.log(err);
});
