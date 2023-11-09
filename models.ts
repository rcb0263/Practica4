// models.ts
import { Document, Schema, Model, model } from "npm:mongoose@7.6.3";

// Define el modelo de datos para los coches
export interface Coche {
  marca: string;
  modelo: string;
  año: number;
  precio: number;
}

// Define el modelo de datos para los concesionarios
export interface Concesionario {
  nombre: string;
  ubicacion: string;
  coches: Coche[];
}

// Define el modelo de datos para los clientes
export interface Cliente {
  nombre: string;
  dinero: number;
  coches: Coche[];
}

// Importa los modelos de Mongoose
export const CocheModel: Model<Coche & Document> = model<Coche & Document>("Coche", new Schema<Coche & Document>({
  marca: String,
  modelo: String,
  año: Number,
  precio: Number,
}));

export const ConcesionarioModel: Model<Concesionario & Document> = model<Concesionario & Document>("Concesionario", new Schema<Concesionario & Document>({
  nombre: String,
  ubicacion: String,
  coches: [{ type: Schema.Types.ObjectId, ref: "Coche" }],
}));

export const ClienteModel: Model<Cliente & Document> = model<Cliente & Document>("Cliente", new Schema<Cliente & Document>({
  nombre: String,
  dinero: Number,
  coches: [{ type: Schema.Types.ObjectId, ref: "Coche" }], 
}));