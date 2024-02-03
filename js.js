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

buttonEjecutar.addEventListener( 'click' ,  correr );
    
    //   consultaSelect( getArr_Of_Filds(cadenaTexto), 'usuarios2') 

function correr(){
    
    const boolArray        = array.checked;
    const boolSentenciaSql = sentenciaSql.checked;
    const cadenaTexto      =  elementoTextArea.value;
          arr_of_filds     = getArr_Of_Filds(cadenaTexto);
    elementoResultadoArray.innerText = 'el arr de Campos de tu tabla es : \n\n';      
    elementoResultadoArray.innerText = elementoResultadoArray.innerText +  arr_of_filds;
    console.log(  consultaSelect( arr_of_filds , 'usuarios2') 
                // getArr_Of_Filds(cadenaTexto)
                // cadenaTexto
    );
}

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


// k = ;

function consultaSelect( arrFilds , tableName){
    let retornable = '';
    arrFilds.forEach( (element)=>{
         retornable = retornable===''? retornable + ` ${element} ` : retornable + `, ${element} `;    
    } );
    
    return `SELECT ${retornable} FROM ${tableName};`
}