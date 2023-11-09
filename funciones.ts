// funciones.ts

// Importa los módulos y tipos necesarios
import { Response, Request } from "npm:express@4.18.2";
import {ConcesionarioModel, ClienteModel, CocheModel } from "./models.ts";
import { Coche } from "./models.ts";

// Crear concesionarios
export async function crearConcesionarios(req: Request, res: Response) {
  try {
    // datos de los concesionarios me daba problemas body params y req
    const concesionariosParaCrear = [
      { nombre: "red", ubicacion: "red1" },
      { nombre: "blue", ubicacion: "blue1" },
      { nombre: "grey", ubicacion: "grey1" },
    ];

    const concesionariosCreados = [];

    for (const concesionarioData of concesionariosParaCrear) {
      const { nombre, ubicacion } = concesionarioData;

      const nuevoConcesionario = new ConcesionarioModel({
        nombre,
        ubicacion,
        coches: [],
      });

      await nuevoConcesionario.save();
      concesionariosCreados.push(nuevoConcesionario);
    }

    res.status(200).json( "Concesionarios creados con éxito");
  } catch (error) {
    res.status(500).json("Error al crear concesionarios");
  }
}
// Crear clientes
export async function crearClientes(req: Request, res: Response) {
  try {
    // datos de los clientes a crear, me daba problemas body params y req
    const clientesParaCrear = [
      { nombre: "david", dinero: 20000 },
      { nombre: "fernando", dinero: 30000 },
      { nombre: "guillermo", dinero: 40000 },
      { nombre: "catalina", dinero: 25000 },
      { nombre: "maria", dinero: 35000 },
      { nombre: "paloma", dinero: 10000 },
    ];

    const clientesCreados = [];

    for (const clienteData of clientesParaCrear) {
      const { nombre, dinero } = clienteData;

      const nuevoCliente = new ClienteModel({
        nombre,
        dinero,
        coches: [],
      });

      await nuevoCliente.save();
      clientesCreados.push(nuevoCliente);
    }

    res.status(200).json("Clientes creados con éxito");
  } catch (error) {
    res.status(500).json("Error al crear clientes");
  }
}
// Crear coches
export async function crearCoche(req: Request, res: Response) {
  try {
    // Datos del coche a crear, me daba problemas body req.params 
    const cocheData = { marca: "Ford", modelo: "Focus", año: 2023, precio: 25000 };

    const nuevoCoche = new CocheModel(cocheData);

    await nuevoCoche.save();

    res.status(200).json("Coche creado con éxito");
  } catch (error) {
    res.status(500).json("Error al crear coche");
  }
}

export async function elimCoche(req: Request, res: Response) {
  try {
   // const { modelo, año } = req.params;
    const modelo="Focus"
    const año=2023
    eliminarCoche(req, res, modelo,año)

  } catch (error) {
    res.status(500).json("Error al eliminar coche");
  }
}
//eliminar coche
export async function eliminarCoche(req: Request, res: Response, modelo:string, año:number) {
  try {
    // Buscar y eliminar el coche
    const cocheEliminado = await CocheModel.findOneAndDelete({ modelo, año });

    if (cocheEliminado) {
    } else {
      res.status(404).json("Coche no encontrado");
    }
  } catch (error) {
    res.status(500).json("Error al eliminar coche");
  }
}
// Enviar coches a un concesionario
export async function EnviarCoche(req: Request, res: Response) {
  try {
    const modelo = "Focus2";
    const año = 2023;
    const cocheExistente = await CocheModel.findOne({ modelo, año });

    if (cocheExistente) {
      const concesionario = await ConcesionarioModel.findOne({ ubicacion: "red1" }).populate("coches");

      if (!concesionario) {
        res.status(400).json("No hay concesionario con ubicación red1");
      } else if (concesionario.coches.length >= 10) {
        res.status(400).json("No hay espacio en el concesionario red1");
      } else {
        concesionario.coches.push(cocheExistente);
        await concesionario.save();

        await eliminarCoche(req, res, modelo, año);

        // Devuelve toda la información del coche enviado
        res.status(200).json({
          message: "Coche enviado a concesionario red1 con éxito",
          coche: {
            marca: cocheExistente.marca,
            modelo: cocheExistente.modelo,
            año: cocheExistente.año,
            precio: cocheExistente.precio,
          },
        });
      }
    } else {
      res.status(400).json("No se ha encontrado un coche con ese modelo y año");
    }
  } catch (error) {
    res.status(500).json("Error al buscar y enviar coche");
  }
}
// Vender coches a un cliente
export async function venderCocheACliente(req: Request, res: Response) {
  try {
    // me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    const nombre = "fernando";
    const ubicacion = "red1";
    const modelo = "Focus";
    const año = 2023;

    const cliente = await ClienteModel.findOne({ nombre }).populate("coches");

    if (!cliente) {
      res.status(400).json("No se ha encontrado un cliente con ese nombre");
      return;
    }

    const concesionario = await ConcesionarioModel.findOne({ ubicacion }).populate("coches");

    if (!concesionario) {
      res.status(400).json("No se ha encontrado un concesionario con esa ubicación");
      return;
    }

    const coche = concesionario.coches.find((c) => c.modelo === modelo && c.año === año);

    if (!coche) {
      res.status(400).json("No se ha encontrado un coche con ese modelo y año en el concesionario");
      return;
    }

    if (cliente.dinero >= coche.precio) {
      cliente.dinero -= coche.precio;
      cliente.coches.push(coche);
      concesionario.coches = concesionario.coches.filter((c: Coche) => !(c.modelo === modelo && c.año === año));
      await cliente.save();
      await concesionario.save();
      res.status(200).json( "Coche comprado con éxito", cliente, concesionario);
    } else {
      res.status(400).json("El cliente no tiene suficiente dinero para comprar el coche");
    }
  } catch (error) {
    res.status(500).json("Error al buscar y comprar coche");
  }
}
// Lista de coches de un concesionario
export async function ListaCochesConcesionario(req: Request, res: Response) {
  try {
    //const { ubicacion } = req.params;
    const ubicacion = "red1"
    const concesionario = await ConcesionarioModel.findOne({ ubicacion }).populate("coches");

    if (!concesionario) {
      res.status(404).json("Concesionario no encontrado");
      return;
    }

    if (concesionario.coches.length === 0) {
      res.status(200).json({ message: "Concesionario sin coches", data: [] });
      return;
    }

    // Obtén solo el primer coche del array
    const primerCoche = concesionario.coches[0];

    const cocheFormat = {
      marca: primerCoche.marca,
      modelo: primerCoche.modelo,
      año: primerCoche.año,
      precio: primerCoche.precio,
    };

    res.status(200).json({ message: "Primer coche del concesionario obtenido con éxito", data: cocheFormat });
  } catch (error) {
    res.status(500).json("Error al obtener la lista de coches del concesionario");
  }
}
// Lista de coches de un cliente
export async function listaCochesCliente(req: Request, res: Response) {
  try {
    //me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    //const nombreCliente = req.params.nombre;
    const nombreCliente = "fernando";

    
    const cliente = await ClienteModel.findOne({ nombre: nombreCliente }).populate("coches");

    if (!cliente) {
      res.status(400).json("No se ha encontrado un cliente con ese nombre");
      return;
    }

    res.status(200).json({ message: "Lista de coches del cliente encontrada con éxito", coches: cliente.coches });
  } catch (error) {
    res.status(500).json("Error al obtener la lista de coches del cliente");
  }
}
// Eliminar coches de un concesionario
export async function eliminarCocheConcesionario(req: Request, res: Response) {
  try {
    //me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    //const { ubicacion, modelo, año } = req.params;
    const ubicacion =  "red1"
    const modelo= "focus"
    const año= "2023"
    const concesionario = await ConcesionarioModel.findOne({ ubicacion }).populate("coches");

    if (!concesionario) {
      res.status(404).json("Concesionario no encontrado");
      return;
    }

    const indiceCoche = concesionario.coches.findIndex((coche: any) => coche.modelo === modelo && coche.año === parseInt(año));

    if (indiceCoche === -1) {
      res.status(404).json("Coche no encontrado en el concesionario");
      return;
    }
    concesionario.coches.splice(indiceCoche, 1);
    await concesionario.save();

    res.status(200).json("Coche eliminado con éxito del concesionario");
  } catch (error) {
    res.status(500).json("Error al eliminar coche del concesionario");
  }
}
// Eliminr coches de un cliente
export async function eliminarCocheCliente(req: Request, res: Response) {
  try {
    //me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    //const { nombre, modelo, año } = req.params;
    const nombre =  "fernando"
    const modelo= "focus"
    const año= "2023"
    
    const cliente = await ClienteModel.findOne({ nombre }).populate("coches");
    if (!cliente) {
      res.status(404).json("Cliente no encontrado");
      return;
    }
    const indiceCoche = cliente.coches.findIndex((coche: any) => coche.modelo === modelo && coche.año === parseInt(año));
    if (indiceCoche === -1) {
      res.status(404).json("Coche no encontrado en el cliente");
      return;
    }
    cliente.coches.splice(indiceCoche, 1);
    await cliente.save();
    res.status(200).json("Coche eliminado con éxito del cliente");
  } catch (error) {
    res.status(500).json("Error al eliminar coche del cliente");
  }
}
// Araspasar un coche de un cliente a otro
export async function traspasarCocheEntreClientes(req: Request, res: Response) {
  try {
    //me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    //const { from_nombre, to_nombre, modelo, año } = req.params;
    const from_nombre =  "fernando"
    const to_nombre =  "david"
    const modelo= "focus"
    const año= "2023"

    const fromCliente = await ClienteModel.findOne({ nombre: from_nombre }).populate("coches");
    const toCliente = await ClienteModel.findOne({ nombre: to_nombre });

    if (!fromCliente || !toCliente) {
      res.status(404).json("Cliente no encontrado");
      return;
    }
    const cocheIndex = fromCliente.coches.findIndex(
      (coche) => coche.modelo === modelo && coche.año === parseInt(año)
    );

    if (cocheIndex !== -1) {
      const cocheTraspasado = fromCliente.coches[cocheIndex];
      fromCliente.coches.splice(cocheIndex, 1);
      toCliente.coches.push(cocheTraspasado);

      await fromCliente.save();
      await toCliente.save();

      res.status(200).json("Coche traspasado con éxito de un cliente a otro");
    } else {
      res.status(404).json("Coche no encontrado en el cliente de origen");
    }
  } catch (error) {
    res.status(500).json("Error al traspasar coche entre clientes");
  }
}
// Añadir dinero a un cliente
export async function sumarDineroCliente(req: Request, res: Response) {
  try {
    //me a dado problemas el gestor de errores y no me los indica además de problemas de conxion a la base de datos
    //const { nombre, cantidad } = req.params;
    const nombre =  "fernando"
    const cantidad =  "20000"
    const cliente = await ClienteModel.findOne({ nombre });

    if (!cliente) {
      res.status(404).json("Cliente no encontrado");
      return;
    }

    cliente.dinero += parseInt(cantidad);

    await cliente.save();

    res.status(200).json(`Se ha sumado ${cantidad} al dinero del cliente ${nombre}`);
  } catch (error) {
    console.error("Error al sumar dinero al cliente:", error);
    res.status(500).json("Error al sumar dinero al cliente");
  }
}


