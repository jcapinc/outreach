import express from "express";
import expressJWT from "express-jwt";
import jwt from "jsonwebtoken";
import { connect, getSchema } from "./database";


const secret = "temporary-make-me-configurable";
const app = express();
app.use(expressJWT({secret}).unless({path:["/api/login"]}));
app.use(express.json());

app.post("/api/login", function(req,res){
	try{
		const {username, password} = req.body;
		if(username.length === 0 || password.length === 0) {
			res.status(401).send(JSON.stringify({error: "Username or password was empty"}));
			return;
		}
		if(username === "jcapinc" && password === "hercules1"){
			res.send(JSON.stringify({
				jwt: jwt.sign({username: "jcapinc",id:"1"}, secret)
			}));
			return;
		}
	} catch(exception){
		res.status(401).send(JSON.stringify({error: exception.toString()}));
	}
	res.status(401).send(JSON.stringify({error: "incorrect username or password"}));
});

app.get("/api/status", function(_,res){
	res.send(JSON.stringify({loggedin:true}));
});

app.post("/login",(_,res) => {
	res.status(400).send("WRONG.");
});

(async () => {
	const db = await connect();
	app.use('/graphql', await getSchema(db));

	const port = 9001;
	app.listen(port);
	console.log("listening on port 9001");
})()
