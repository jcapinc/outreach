import express from "express";
import { connect } from "./database";
import login from './login';
import state from './state';

const app = express();
app.use(express.json());
const port = 9001;
connect().then(db => {
	login(app, db);
	app.listen(port);
	console.log("Listening on port " + port.toString());
}).catch(err => {
	return console.log(err);
});
