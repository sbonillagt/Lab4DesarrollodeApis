var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var method_override = require('method-override')

var app = express();

//mongoose.connect('mongodb://localhost/primera');

//mongoose.connect('mongodb://localhost/primera', {
//    useMongoClient: true,
//    /* other options */
//  });
mongoose.Promise = global.Promise;
var promise = mongoose.connect('mongodb://localhost/primera', {
    
    useMongoClient: true,
    /* other options */ 
  });
  

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(method_override("_method"));

//Definir el schema de nuestros productos
var productosSchema =
{
    nombre: String,
    descripcion: String,
    ingredientes: String,
    tipoMasa: String,
    tamano: String,
    cantidad: Number,
    extraQueso: String
};

var Product = mongoose.model("Product", productosSchema);

app.set("view engine","jade");
app.use(express.static("public"));

app.get("/index", function(req,res){
    /*
    var data ={
        nombre: "Mi Primera pizza",
        descripcion: "la primera",
        ingredientes: "Tomate",
        tipoMasa:"gorda",
        tamano: "mediana",
        cantidad: 10,
        extraQueso: "NO"
    }
    var product = new Product(data);

    product.save(function(err){
        console.log(product);
    });
    */
    res.render("index");
});

app.post("/pizzeria",function(req,res){
    var data ={
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        ingredientes: req.body.ingredientes,
        tipoMasa:req.body.tipoMasa,
        tamano: req.body.tamanoPizza,
        cantidad: req.body.cantidad,
        extraQueso: req.body.extraQueso
    }

    var product = new Product(data);

    product.save(function(err){
        console.log(product);
        res.render("pizzeria/nuevo")
    });

});

app.get("/nuevo",function(req,res){
    res.render("pizzeria/nuevo")
});

/*
app.get("/pizzeria/basedatos",function(req,res){
    res.render("pizzeria/basedatos")
});
*/

app.get("/basedatos",function(req,res){

    Product.find(function(error,documento){
		if(error){ console.log(error); }
		res.render("pizzeria/basedatos",{ products: documento })
	});

});

app.get("/pizzeria/editar/:id",function(req,res){
    var id_producto = req.params.id;

    Product.findOne({"_id": id_producto},function(error,producto){
        console.log(producto);
        res.render("pizzeria/editar",{product: producto});

    });
});

app.put("/pizzeria/:id", function(req,res){
    var data ={
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        ingredientes: req.body.ingredientes,
        tipoMasa:req.body.tipoMasa,
        tamano: req.body.tamanoPizza,
        cantidad: req.body.cantidad,
        extraQueso: req.body.extraQueso
    }
    Product.update({"_id": req.params.id},data,function(product){
        res.redirect("/basedatos");
    });
});

app.get("/pizzeria/eliminar/:id", function(req,res){
    var id = req.params.id;

    Product.findOne({"_id":id},function(err,producto){
        res.render("pizzeria/eliminar",{producto: producto});
    });
});

app.delete("/pizzeria/:id", function(req,res){
    var id = req.params.id;
    Product.remove({"_id":id},function(err){
        if(err){console.log(err)}
        res.redirect("/basedatos");
    });
});

app.listen(8080);