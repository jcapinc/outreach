module.exports = function(app){
	app.use(createProxyMiddleware("/api",{target:"http://localhost:9001"})); /// @TODO: make me configurable
}