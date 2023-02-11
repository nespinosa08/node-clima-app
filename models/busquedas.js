const fs = require('node:fs');

const axios = require('axios');



class Busquedas{
    
    historial= [];
    path = './db/database.json'
    
    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map(letra=>letra[0].toUpperCase() + letra.substring(1) );
            return palabras.join(' ');
        })
        

    }
    
    get paramsMapbox(){
        return {
            'limit': 5,
            'language': 'es',
            'access_token': process.env.MAPBOX_KEY                   
        }
    }
    
    async peticionCiudad (lugar=''){
        try{
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params : this.paramsMapbox
            })

            const resp = await  intance.get();
            // console.log(resp.data.features);

            // Para extraer solo la informacion necesaria: Retornar un objeto con: id, lugar y coordenadas.
            // Para retornar un objeto literal del callback del map, iniciar con ( 
                // {
                // objeto
                // } 
                // )
            return resp.data.features.map(lugar=>(
                {
                    id: lugar.id,
                    name: lugar.place_name,
                    lon: lugar.center[0],
                    lat: lugar.center[1]
                }
            ))
            
        }catch (err){
            console.log('paso por el error');
            console.log(err);
        }
        
        // peticion http
        
        console.log('lugarcito',lugar);
        
    }
    
    // get paramsOpenweather(){
    //     return {
    //         'appid': process.env.OPENWEATHER_KEY,
    //         'lat': `${lat}`,
    //         'lon': `${lon}`,
    //         'units': 'metric',
    //         'lang': 'es'
    //     }


    // }

    async climaLugar(lat, lon){
        try{
            const intance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                // params: this.paramsOpenweather
                params: {
                    'appid': process.env.OPENWEATHER_KEY,
                    'lat': `${lat}`,
                    'lon': `${lon}`,
                    'units': 'metric',
                    'lang': 'es'
                }
            })
            const resp = await intance.get();
            // console.log(resp.data.main);
            
            return {
                temp : resp.data.main.temp,
                tmin : resp.data.main.temp_min,
                tmax : resp.data.main.temp_max,
                est  : resp.data.weather[0].description
            }

        }catch (err){
            console.log(err);
        }
    }

    agregarHistorial(lugar=''){
   
     

        // para evitar duplicados
        if ( this.historial.includes(lugar.toLowerCase())){
            return;
        }
        this.historial = this.historial.splice(0,4);
        this.historial.unshift(lugar.toLowerCase());

        this.guardarDB();
    }

    guardarDB(){
        const payload ={
            historial : this.historial
            // se puede incluir mas propiedadaes para grabar
        }

        fs.writeFileSync(this.path, JSON.stringify(payload));
    }

    leerDB(){
        if (!fs.existsSync(this.path)) return // Si no exite e archivo, no hay nada que leer

        const info = fs.readFileSync(this.path, {encoding: 'utf-8'} );
        const data = JSON.parse(info);
        this.historial = data.historial;
    }


}

module.exports= Busquedas;