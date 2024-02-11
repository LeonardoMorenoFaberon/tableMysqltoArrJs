// const cadenaTexto = `
// +-----------+--------------+------+-----+---------+-------+
// | id        | int(8)       | NO   |     | 0       |       |
// | dni       | varchar(8)   | NO   |     | NULL    |       |
// | nombre1   | varchar(255) | NO   |     | NULL    |       |
// | nombre2   | varchar(255) | YES  |     | NULL    |       |
// | APELLIDO1 | varchar(255) | NO   |     | NULL    |       |
// | APELLIDO2 | varchar(255) | NO   |     | NULL    |       |
// | correo    | varchar(100) | NO   |     | NULL    |       |
// | password  | blob         | NO   |     | NULL    |       |
// | estado    | tinyint(1)   | YES  |     | NULL    |       |
// `;
const buttonEjecutar = document.getElementById('botonEjecutar');
const elementoTextArea = document.getElementById('textArea_DescTablaDeMysql');
const array = document.getElementById('array');
const sentenciaSql = document.getElementById('sentencia_sql');
const elementoResultadoArray = document.getElementById('resultadoArray');
// const cadenaTexto =  elementoTextAr
elementoTextArea.value = `introduce esta tabla salida de cmd mysql para crear tu arr de campos 


| Field     | Type         | Null | Key | Default | Extra |
+-----------+--------------+------+-----+---------+-------+
| id        | int(8)       | NO   |     | 0       |       |
| dni       | varchar(8)   | NO   |     | NULL    |       |
| nombre1   | varchar(255) | NO   |     | NULL    |       |
| nombre2   | varchar(255) | YES  |     | NULL    |       |
| APELLIDO1 | varchar(255) | NO   |     | NULL    |       |
| APELLIDO2 | varchar(255) | NO   |     | NULL    |       |
| correo    | varchar(100) | NO   |     | NULL    |       |
| password  | blob         | NO   |     | NULL    |       |
| estado    | tinyint(1)   | YES  |     | NULL    |       |`
   
let arr_of_filds;
let properties;

buttonEjecutar.addEventListener( 'click' ,  correr );
    
    //   consultaSelect( getArr_Of_Filds(cadenaTexto), 'usuarios2') 

function correr(){
    
    const boolArray        = array.checked;
    const boolSentenciaSql = sentenciaSql.checked;
    const cadenaTexto      =  elementoTextArea.value;
          arr_of_filds     = getArr_Of_Filds(cadenaTexto);
          let codigoPHP = generarCodigoPHP(arr_of_filds);
          console.log(codigoPHP);


    elementoResultadoArray.innerText = 'el arr de Campos de tu tabla es : \n\n';      
    elementoResultadoArray.innerText = elementoResultadoArray.innerText +  arr_of_filds;
    elementoResultadoArray.innerText+= '\n\n' + codigoPHP;
    elementoResultadoArray.innerText+= '\n\n' + generateInsertQuery(arr_of_filds);
    
    // const query = generateInsertQuery(columns);
    // console.log(query);
}
//------------------------------------------------
function getArr_Of_Filds(cadenaTexto){
    let arrPartido = cadenaTexto.split('\n|');
    let arrQuerido = [];
    arrPartido.forEach( (element)=>{
        
        let palabraDeTurno = element.substr( 0 , element.indexOf('|') ).trim();
        
        if (palabraDeTurno !== '' && palabraDeTurno!=='Field'){
            arrQuerido.push(  palabraDeTurno ) 
           }
                                    } ) ;
  return arrQuerido;
}
//------------------------------------------------
function generarCodigoPHP(datos) {
    let codigoPHP = "";
    datos.forEach(dato => {
        codigoPHP += `if (isset($datos['${dato.toLowerCase()}'])) { $this->${capitalizeFirstLetter(dato)} = $datos['${dato.toLowerCase()}']; }\n`;
    });
    return codigoPHP;
}

//------------------------------------------------
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//------------------------------------------------
function generateInsertQuery(columns) {
   
   properties = {};
   columns.forEach(elemento => {  properties[elemento] = '$this->' + elemento     });

   console.log(properties);
      
   const tableVariable = '$this->table';

   let concatenado = "";
   columns.forEach( (elemento , index) => {concatenado+=  index < columns.length-1 ? elemento + " , " : elemento} );
   const insertPart = `INSERT INTO ${tableVariable} ( ${concatenado} )`;

   let concatVariables = "";
   Object.keys(properties).forEach( (key , index) =>{ concatVariables += index < Object.keys(properties).length-1   ?    "'"+properties[key]+"'" + " , "   :   "'"+properties[key]+"'" } )
   
   const valuesPart = `${ concatVariables }`;
   
   
   
   return `${insertPart}\n  VALUES  \n(${valuesPart});`;
}//generateInsertQuery ......................................................

// Crear variable properties según las especificaciones


// Ejemplo de uso
// const columns = ['PacienteId', 'DNI', 'Nombre', 'Direccion', 'CodigoPostal', 'Telefono', 'Genero', 'FechaNacimiento', 'Correo'];
// const tableVariable = '$this->table';
// k = ;

function consultaSelect( arrFilds , tableName){
    let retornable = '';
    arrFilds.forEach( (element)=>{
         retornable = retornable===''? retornable + ` ${element} ` : retornable + `, ${element} `;    
    } );
    
    return `SELECT ${retornable} FROM ${tableName};`
}
