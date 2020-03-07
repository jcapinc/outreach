import express from "express";
import expressJWT from "express-jwt";
import jwt from "jsonwebtoken";

const secret = "temporary-make-me-configurable";
const app = express();
app.use(expressJWT({secret}).unless({path:["/api/login"]}));
app.post("/api/login",function(req,res){
	const [username,password] = [req.params.username || "", req.params.password || ""];
	if(username.length === 0 || password.length === 0){
		res.status(401).send(JSON.stringify({error: ""}));
		return;
	}
	if(username === "jcapinc" && password === "hercules1"){
		res.send(jwt.sign({
			username: "jcapinc",
			id:"1"
		}, secret));
		return;
	}
	res.send(401).send(JSON.stringify({error: "incorrect username or password"}));
});
app.listen(9001)