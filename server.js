const express = require("express")
const server = express()

// habilitar body do formulário
server.use(express.urlencoded({ extended:true}))
// configurar o servidor para aprensentar os arquivos estáticos

server.use(express.static('public'))


// configurar conexão com o banco de dados

const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres', 
    password: '81216329',
    host: 'localhost',
    port: 5432,
    database: 'doe'
}) 

// nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, 
})

// lista de doadores 


// renderizando o arquivo
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function(err, result){
        if (err) return res.send("erro de banco de dados.")

        const donors = result.rows
        return res.render("index.html", { donors })
    })
       
    })
    // send


server.post("/", function(req, res) {
    //pegar dados do formulário. 
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name =="" || email =="" || blood =="") {
        return res.send('Todos campos são obrigatórios!')
    }

    
    // coloca valores dentro do banco de dados - push
    const query = `INSERT INTO donors ("name", "email", "blood") 
    VALUES ('${name}', '${email}', '${blood}')`
    //const values = [name, email, blood]
   
    db.query(query, function(err){
        if(err) return res.send("erro no banco de dados.")
        return res.redirect("/")
    })
    
})

// ligar o servidor e permitir o acesso. 
server.listen(3000), function () {
    console.log("iniciei o servidor")
}

