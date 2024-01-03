const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const sequelize = require("./context/database");
const Pokemones = require("./models/Pokemones");
const Regiones = require("./models/Regiones");
const Tipos = require("./models/Tipos");

const errorController = require("./controllers/ErrorController");

const app = express();

const compareHelpers = require("./util/helpers/hbs/compare")

app.engine(
    "hbs",
    engine({
      layoutsDir: "views/layouts",
      defaultLayout: "main-layout",
      extname: "hbs",
      helpers:{
        equalValue: compareHelpers.EqualValue,
      }
    })
  );

app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

const pokemonesRouter = require("./routes/pokemones");
const regionesRouter = require("./routes/regiones");
const tiposRouter = require("./routes/tipos");

app.use(pokemonesRouter);
app.use(regionesRouter);
app.use(tiposRouter);


app.use(errorController.Get404);

Pokemones.belongsTo(Regiones,{constraint: true,onDelete:"CASCADE"});
Regiones.hasMany(Pokemones);

Pokemones.belongsTo(Tipos,{constraint: true,onDelete:"CASCADE"});
Tipos.hasMany(Pokemones);


sequelize.sync()
.then((result) => {
    app.listen(5001);
})
.catch((err) => {
    console.log(err);
});




