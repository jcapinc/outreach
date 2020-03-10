import express from "express";
import { connect, getSchema } from "./database";
import login from './login';


const app = express();
app.use(express.json());

const port = 9001;
connect().then(db => {
	login(app, db);
	return getSchema(db)
}).then(apollo => apollo.applyMiddleware({app})).then(() => {
	const ret = app.listen(port);
	console.log("Listening on port " + port.toString());
	return ret;
}).catch(err => {
	return console.log(err);
});
