require('dotenv').config();
require('colors');

const { leerInput, inquirerMenu, pausa, listadoOpcionCiudades } = require("./helpers/inquirer");
const Busquedas = require('./models/busquedas');

// VARIABLES DE PROCESO INCLUYEN A LAS VARIABLES DE ENTORNO 
// const apiKeyMapbox=process.env.MAPBOX_KEY;
// console.log({apiKeyMapbox});
// console.log(process.env.OPENWEATHER_KEY);

const main = async ()=>{

let opt;
const busquedas = new Busquedas();


do{

opt= await inquirerMenu();

switch(opt){
    case 1:
        // Hacer el input para que el cliente coloque el nombre de la ciudad
        const lugar = await leerInput('Indique la ciudad');
        
        // Hacer la peticion con el nombre de la ciudad y obtener varias opciones que coiniciden con la busqueda
        const ciudades = await busquedas.peticionCiudad(lugar);
        // console.log(ciudades);
        
        // Mostrar opciones de ciudades que coinciden con la busqueda y seleccionar opcion (retorna el id)
        const id = await listadoOpcionCiudades(ciudades);
        // console.log({id});
        if (id==='0') continue; // cuando se le da salir, para que no genere un error y continue funcionando el ciclo

        const ciudadSel = ciudades.find(city=> city.id === id);
        // console.log(ciudadSel);
        const {name, lat, lon } = ciudadSel;

        // guardar el lugar seleccionado
        busquedas.agregarHistorial(name);


        // Hacer la peticiom de las condicioned del clima para el lugar seleccionado
        const clima = await busquedas.climaLugar(lat, lon);
        // console.log(clima);

        // Mostrar resultados
        // console.clear();
        console.log('\nInformación de la ciudad\n');
        console.log('Ciudad: ', name);
        console.log('Lat: ', lat);
        console.log('Lon: ', lon);
        console.log('Temp:', clima.temp);
        console.log('Temp. max:', clima.tmax);
        console.log('Temp. min:', clima.tmin);
        console.log('Estado del clima: ', clima.est.toUpperCase());

       
        break;
    case 2:
        // console.log('Historial');
        let conta =0;
        busquedas.historialCapitalizado.forEach(city =>{
            conta++
            console.log(`${conta}. ${city}`);
        })

        break;
    }
    if (opt!==0){
        await pausa();
    }

}while(opt!==0);
}

main();
