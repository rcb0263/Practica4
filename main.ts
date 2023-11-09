// main.ts
import mongoose from "npm:mongoose@7.6.3"
import express, { Request, Response} from "npm:express@4.17.1";
import {load} from "https://deno.land/std@0.204.0/dotenv/mod.ts"


//import { crearCoche, crearCliente, enviarCocheAConcesionario, venderCocheACliente, verCochesConcesionario, verCochesCliente, eliminarCocheConcesionario, eliminarCocheCliente, traspasarCoche, agregarDineroCliente, bloquearVentaConcesionario } from "./funciones.ts";
import {EnviarCoche, sumarDineroCliente, traspasarCocheEntreClientes, eliminarCocheCliente, eliminarCocheConcesionario, ListaCochesConcesionario,listaCochesCliente, crearClientes, crearCoche, crearConcesionarios, venderCocheACliente} from "./funciones.ts";

const env = await load();

const URL_MONGO = env.MONGO_URL

console.info(URL_MONGO)


try {
  console.info("Intentando conectar")
  await mongoose.connect(URL_MONGO)
  console.info("Conectado a mongoDB")
  const api = express();
  api.use(express.json());

  api
  .get("/concesionarios/crear", crearConcesionarios)
  .get("/clientes/crear", crearClientes)
  .get("/coche/crear", crearCoche)
  .get("/coche/enviar", EnviarCoche)
  .get("/coche/vender", venderCocheACliente)
  .get("/clientes/listacoches/:nombre", listaCochesCliente )
  .get("/concesionarios/listacoches/:ubicacion", ListaCochesConcesionario)
  .get("/concesionarios/:ubicacion/eliminar-coche/:modelo/:año", eliminarCocheConcesionario)
  .get("/clientes/:nombre/eliminar-coche/:modelo/:año", eliminarCocheCliente)
  .get("/clientes/traspasarcoche/:from_nombre/:to_nombre/:modelo/:año", traspasarCocheEntreClientes)
  .get("/clientes/sumardinero/:nombre/:cantidad", sumarDineroCliente)

  const port = 3000;
  api.listen(port, () => {
    console.log("Puerto listo");
  });
} catch (error) {
  console.error("No se ha podido conectar", error)
}