//Express cria o servidor
const express = require("express")
const server = express()

const db = require("./db")



//Configurar arquivos estáticos (css, scripts, imagens)
server.use(express.static("public"))
server.use(express.urlencoded({extended:true}))


//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", { 
    express: server,
    noCache: true,
})

//criada a rota para o index.html e responde para o cliente
server.get("/", function(req, res) {
    db.all(`SELECT * FROM ideas`, function(err,rows) {
            if(err) {
                console.log(err)
                return res.send("Erro no banco de dados")
            }

            const reversedIdeas = [...rows].reverse()
            let lastIdeas = []
            for (let idea of reversedIdeas) {
                if(lastIdeas.length < 2) {
                    lastIdeas.push(idea)
                }    
            }
        
            return res.render("index.html", {ideas: lastIdeas})
    })
})

server.get("/ideias", function(req, res) {
    
        db.all(`SELECT * FROM ideas`, function(err,rows) {
            if(err) {
                console.log(err)
                return res.send("Erro no banco de dados")
            }
            
            
            const reversedIdeas = [...rows].reverse()
            return res.render("ideias.html", {ideas: reversedIdeas})
    })
})

server.post("/", function(req, res) {
    const query = `
        INSERT INTO ideas(
            image, 
            title, 
            category, 
            description, 
            link
        ) VALUES (?,?,?,?,?);
        `
        
     const values = [
        req.body.image,    
        req.body.title,    
        req.body.category,    
        req.body.description,    
        req.body.link,    
    ]
        
        db.run (query, values, function(err) {
            if(err) {
                console.log(err)
                return res.send("Erro no banco de dados")
            }

            return res.redirect("/ideias")
        console.log(this)
        })

        db.all(`SELECT * FROM ideas`, function(err,rows) {
        if(err) return console.log(err)

        console.log(rows)
        })
})

//liga o servidor na porta 3000
server.listen(3000)
