const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const uri = " mongodb + srv : // pepe : jPj6tKBQI1pTMWXJ @ cluster0.cwvjj.mongodb.net / pwitt ? retryWrites = true & w = mayoría ";


async function conectar() {
    try{
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("Conectado a la base de datos metodo: mongoodb - async-await");
    }
    catch(e){
        console.log(e);
    }
};


conectar();


const LibroSchema = new mongoose.Schema ({
        nombre: String,
        autor: String,
        genero:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "generos"
        },
        prestado: String
    });

const LibroModel = mongoose.model("libros", LibroSchema);


const GeneroSchema = new mongoose.Schema ({
    nombre: String,
    deleted: String
});

const GeneroModel = mongoose.model("generos", GeneroSchema);

//Metodos para generos.

app.post("/genero", async (req, res)=>{
    try{
        let nombre = req.body.nombre;
        if(nombre == undefined){
            throw new Error("Hay un error en el nombre");
        }
        if(nombre == ''){
            throw new Error("Error: el nombre esta vacío");
        }
        
        let nombreRepetido = null;
        nombreRepetido =  await GeneroModel.find({nombre: nombre});
        if(nombreRepetido.length > 0){
            throw new Error("Ese genero ya existe");
        }
        let genero = {
            nombre:  nombre,
            deleted: 0
        }
        await GeneroModel.create(genero);
        res.status(200).send("Se cargo correctamente el genero: "+genero);
    }
    catch(e){
        console.log(e);
        res.status(422).send({ message: "El genero ya se encuentra cargado"});
    }
});


app.get("/genero/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        let answer = null;        
        answer = await GeneroModel.findById(id);
        res.status(200).send(answer);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


app.get("/genero", async (req, res)=>{
    try{
        let answer = null;
        answer = await GeneroModel.find({deleted: 0});
        res.status(200).send(answer);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});



app.delete("/genero/:id", async (req, res)=>{
    try{
        let id = req.params.id;
        await GeneroModel.findByIdAndDelete(id);
        res.status(200).send({message: "El genero se borro correctamente"});
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


app.put("/genero/:id", async (req, res)=>{
    try{
        let nombre = req.body.nombre;
        let id = req.params.id;
        if(nombre == undefined){
            throw new Error("Hay un error en el nombre");
        }
        if(nombre == ''){
            throw new Error("Error: el nombre esta vacío");
        }

        let nombreRepetido = null;
        nombreRepetido =  await GeneroModel.find({nombre: nombre});
        if(nombreRepetido.length > 0){
            throw new Error("Ese genero ya existe");
        }

        let librosCargados = null;
        librosCargados = await LibroModel.find({"genero": id});
        if(librosCargados.length > 0){
            throw new Error("Error: no se puede modificar");
        }
        let generoModificado = {
            nombre: nombre
        }
        await GeneroModel.findByIdAndUpdate(id, generoModificado);
        res.status(200).send(generoModificado);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});


// Metodos para Libros


app.post("/libro", async (req, res) =>{
    try{
        let nombre = req.body.nombre;
        let autor = req.body.autor;
        let genero = req.body.genero;
        let prestado = "";

    if(nombre === undefined){
        throw new Error({ message: "El nombre no está cargado" });
    }

    if(nombre ==''){
        throw new Error({ message: "Error: nombre vacío" });
    }

    if(autor === undefined){
        throw new Error({ message: "El autor no esta cargado" });
    }

    if(autor ==''){
        throw new Error({ message: "Error: autor vacío" });
    }

    if(genero === undefined){
        throw new Error({ message: "El nombre no está cargado" });
    }

    if(genero ==''){
        throw new Error({ message: "Error: género vacío" });
    }

    

    let libro = {
        nombre: nombre,
        autor: autor,
        genero: genero,
        prestado: prestado,
    }

    let libroGuardado = await LibroModel.create(libro);
                
                
    res.status(200).send("El libro "+libroGuardado+" se guardo correctamente");

    }
    
    catch(e){
        res.status(422).send("Error: "+e);
    }
});


app.get("/libro", async (req, res)=>{
    try{
        let listadoLibros = await LibroModel.find();

        res.status(200).send(listadoLibros);
    }
    catch(e){
        console.log(e);

        res.status(422).send({error: e});
    }
   
}); 

app.get("/libro/:id", async(req, res)=>{
    try{
    let libro = await LibroModel.findById(req.params.id)

    res.status(200).send(libro);
    }
    catch(e){
        res.status(422).send({error: e});
    }        

});



app.delete("/libro/:id", async (req, res) => {
    try{
        let id = req.params.id;
        await LibroModel.findByIdAndDelete(id);
        res.status(200).send({message: "El libro se ha borrado correctamente"});
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});

app.put("/libro/:id", async (req, res) => {
    try{
        
        let nombre = req.body.nombre;
        let autor = req.body.autor;
        let genero = req.body.genero;
        let prestado = req.body.prestado;
        
        if(nombre === undefined){
            throw new Error({ message: "El nombre no está cargado" });
        }
    
        if(nombre ==''){
            throw new Error({ message: "Error: nombre vacío" });
        }
    
        if(autor === undefined){
            throw new Error({ message: "El autor no esta cargado" });
        }
    
        if(autor ==''){
            throw new Error({ message: "Error: autor vacío" });
        }
    
        if(genero === undefined){
            throw new Error({ message: "El nombre no está cargado" });
        }
    
        if(genero ==''){
            throw new Error({ message: "Error: género vacío" });
        }
    

        if(prestado === undefined){
            throw new Error({ message: "Prestado no está cargado" });
        }
    
        if(prestado ==''){
            throw new Error({ message: "Error: prestado vacío"});
        }
        let libro =
                {
                    nombre: nombre,
                    autor: autor,
                    genero: genero,
                    prestado: prestado,
        }
        let libroPrestado = await LibroModel.findByIdAndUpdate(req.params.id, libro);
        
        res.status(200).send(libroPrestado);
    }
    catch(e){
        console.log(e);
        res.status(422).send({error: e});
    }
});









app.listen(3000, ()=>{
    console.log("Servidor escuchando en el puerto 3000");
});