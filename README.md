AVISO: he tenido problemas con Request, especificamente request.param/s esto hace que no me haya funcionado y he tenido que forzarlo, puedes quitar la parte forzada y quitar los // delante de la declaracion de parametros con ello.
Otro problema es que no me dice que tenga un coche en la base de datos en el concesionario cuando busco por modelo y/o año y me dice que esta vacio, pero cuando me voy a mirar los datos de la base de datos me aparece que he metido algo en la base de datos, el id de ese algo es el mismo que el del coche

.env: MONGO_URL= url de base de datos mongodb
metodos.ts: creacion de interfaces y modelos
funciones.ts: 
    Cada una de las funciones necesarias:
        Función para crear coches
        Función para crear concesionarios
        Función para crear clientes
        Funcion para llamar a la suiguiente funicion
        Fucnion Para eliminar un coche segun modelo y año
        Función para enviar coches a un concesionario
        Función para vender coches a un cliente
        Función para ver los coches de un concesionario
        Función para ver los coches de un cliente
        Función para eliminar coches de un concesionario
        Función para eliminar coches de un cliente
        Función para traspasar un coche de un cliente a otro
        Función para añadir dinero a un cliente
main.ts: conexion a la base de datos, y creacion de la api y sus metodos
