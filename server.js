const express = require("express")
const server = express()

server.get("/", function(req, res) {
    return res.send("Resposta do servidor")
})

server.listen(3000)
