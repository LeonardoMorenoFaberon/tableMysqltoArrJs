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
const inputTable = document.getElementById('tablename')
const elementoTextArea = document.getElementById('textArea_DescTablaDeMysql');
const array = document.getElementById('array');
const sentenciaSql = document.getElementById('sentencia_sql');
const elementoResultadoArray = document.getElementById('resultadoArray');
// const cadenaTexto =  elementoTextAr
elementoTextArea.value = `introduce esta tabla salida de cmd mysql para crear tu arr de campos 




MariaDB [apirestyt]> desc pacientes;
+-----------------+--------------+------+-----+---------+----------------+
| Field           | Type         | Null | Key | Default | Extra          |
+-----------------+--------------+------+-----+---------+----------------+
| PacienteId      | int(11)      | NO   | PRI | NULL    | auto_increment |
| DNI             | varchar(45)  | YES  |     | NULL    |                |
| Nombre          | varchar(150) | YES  |     | NULL    |                |
| Direccion       | varchar(45)  | YES  |     | NULL    |                |
| CodigoPostal    | varchar(45)  | YES  |     | NULL    |                |
| Telefono        | varchar(45)  | YES  |     | NULL    |                |
| Genero          | varchar(45)  | YES  |     | NULL    |                |
| FechaNacimiento | date         | YES  |     | NULL    |                |
| Correo          | varchar(45)  | YES  |     | NULL    |                |
+-----------------+--------------+------+-----+---------+----------------+
`
   
let arr_of_filds;
let tableFilds;
let table = "";
// //-----------------------------------------------------------------
// function getTableName(stringDeCmdDesc){
//         let charStart = stringDeCmdDesc.indexOf('desc')  + 'desc '.length ;
//         let charEnd   = stringDeCmdDesc.indexOf(';')
//       return stringDeCmdDesc.substring( charStart , charEnd) 
//                      }
// //-----------------------------------------------------------------
const conditions = (arr)=>{
    startIf =  'if(';

    arr.forEach( (element, index ) => {  
        let elemento =  element.toLowerCase();
        if(index>0){
            startIf += index < arr_of_filds.length-1 ? 
                  `!isset($datos['${elemento}']) ||` :
                  `!isset($datos['${elemento}']) `     
        }
                } );
    return startIf += '){';
}

//-----------------------------------------------------------------
function functionSelectCountFilas(arr_of_filds){
    strAcumulado = `"SELECT COUNT(*) FROM ${table} WHERE `;
    arr_of_filds.forEach( 
        (element , index) =>{
            let elemento = element.toLowerCase();
            strAcumulado+= index< arr_of_filds.length-1?
                `${elemento} = '$this->${elemento}' AND `:
                `${elemento} = '$this->${elemento}'`;
        }
    )
    strAcumulado+=`";`
    return strAcumulado;
}
//-------------------------------------------------------------------

function nameTabeForWriteFunctions(table){ return table.charAt(0).toUpperCase() + table.slice(1) }
//-----------------------------------------------------------------

buttonEjecutar.addEventListener( 'click' ,  correr );
    
    //   consultaSelect( getArr_Of_Filds(cadenaTexto), 'usuarios2') 

function correr(){
    
    const boolArray        = array.checked;
    const boolSentenciaSql = sentenciaSql.checked;
    const cadenaTexto      =  elementoTextArea.value;
          table            =  getTableName(elementoTextArea.value);  //inputTable.value;;
          inputTable.value = table;
          arr_of_filds     =  getArr_Of_Filds(cadenaTexto);
          let codigoPHP    =  generarCodigoPHP(arr_of_filds);
          console.log(codigoPHP);

    elementoResultadoArray.innerText = 'el arr de Campos de tu tabla es : \n\n';      
    elementoResultadoArray.innerText = elementoResultadoArray.innerText +  arr_of_filds;
    elementoResultadoArray.innerText+= '\n\n' + codigoPHP;
    elementoResultadoArray.innerText+= '\n\n' + generateInsertQuery(arr_of_filds);

    elementoResultadoArray.innerText+= jsonizar(arr_of_filds);
    
    // const query = generateInsertQuery(columns);
    // console.log(query);
}
//------------------------------------------------
function functionUpdateTable(arr_of_filds){
    
    let strAcumulador = `"UPDATE  $this->table SET \n`;
    arr_of_filds.forEach( (element, index)=>{
        elemento = element.toLowerCase()
        strAcumulador += index < arr_of_filds.length -1 ? 
            `${elemento} = '$this->${elemento}' ,
            `:
            `${elemento} = '$this->${elemento}' 
            `
    } )
    
    return strAcumulador + `WHERE ${arr_of_filds[0]} = '$this->${arr_of_filds[0].toLowerCase()}'; "`;    

}
//------------------------------------------------
function camposConAndParaCondiciones(){ 
 /*
 ============================================================================================================
   devuelve este formato:
   citaid = $this->citaid AND pacienteid = $this->pacienteid AND fecha = $this->fecha AND horainicio = $this->horainicio AND horafin = $this->horafin AND estado = $this->estado AND motivo = $this->motivo '
 =============================================================================================================   */
  acumularDatosAnd = ''
  arr_of_filds.forEach( (element , index)=>{ 
      if(index > 0){
        acumularDatosAnd += (index < arr_of_filds.length -1 )? 
        `${element.toLowerCase()} = '$this->${element.toLowerCase()}' AND ` : 
        `${element.toLowerCase()} = '$this->${element.toLowerCase()}' `;      
      }
  }   ) //forEach()
    return acumularDatosAnd
  } //camposConAndParaCondiciones()
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
function jsonizar(arrCampos){
    retornable = "\n\n\n\n//-------------------------------\n";
    // str_campos = "PacienteId,DNI,Nombre,Direccion,CodigoPostal,Telefono,Genero,FechaNacimiento,Correo";
    // str_campos = str_campos.toLowerCase();
    // arrCampos  = str_campos.split(",");
    arrCampos.forEach( (el) => {
        retornable+=  `${el.toLowerCase()} : "" ,  \n`      
    } )
    
    retornable += "//-------------------------------\n";
    return retornable;
}
//------------------------------------------------
function generarCodigoPHP(datos , boolIncludeFirst = true) {
    let codigoPHP = "";
    datos.forEach((dato, index) => {
        if(boolIncludeFirst){  
                codigoPHP += `if (isset($datos['${dato.toLowerCase()}'])) { $this->${dato.toLowerCase()} = $datos['${dato.toLowerCase()}']; }\n`;
        }else{
              if( index > 0 ){
                codigoPHP += `if (isset($datos['${dato.toLowerCase()}'])) { $this->${dato.toLowerCase()} = $datos['${dato.toLowerCase()}']; }\n`;
              } 
        }

    });
    return codigoPHP;
}

//------------------------------------------------
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//------------------------------------------------
function generateInsertQuery(columns) {
   
   tableFilds = {};
   columns.forEach(elemento => {  tableFilds[elemento] = '$this->' + elemento     });

   console.log(tableFilds);
      
   const tableVariable = '$this->table';

   let concatenado = "";
   columns.forEach( (elemento , index) => {concatenado+=  index < columns.length-1 ? elemento + " , " : elemento} );
   const insertPart = `INSERT INTO ${tableVariable} ( ${concatenado} )`;

   let concatVariables = "";
   Object.keys(tableFilds).forEach( (key , index) =>{ concatVariables += index < Object.keys(tableFilds).length-1   ?    "'"+tableFilds[key].toLowerCase()+"'" + " , "   :   "'"+tableFilds[key].toLowerCase()+"'" } )
   
   const valuesPart = `${ concatVariables }`;
   
   
   
   return `"${insertPart}\n  VALUES  \n(${valuesPart});"`;
}//generateInsertQuery ......................................................

// Crear variable tableFilds según las especificaciones


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
//-----------------------------------------------------------------
function getTableName(stringDeCmdDesc){
  let charStart = stringDeCmdDesc.indexOf('desc')  + 'desc '.length ;
  let charEnd   = stringDeCmdDesc.indexOf(';')
return stringDeCmdDesc.substring( charStart , charEnd) 
               }
//-----------------------------------------------------------------

//=============================================================
function makeControlerTable(){

    // let table = inputTable.value;
    let strAcumulado =`<?php
    require_once "./clases/conexion.php";
    require_once "./clases/respuestas.class.php";
    
    
    `;
    let acumulado ="";
    strAcumulado += `class ${table} extends conexion{ \n`;
    strAcumulado += `private $table = "${table}"; \n`;
    // arrCampos_citas =  "CitaId,PacienteId,Fecha,HoraInicio,HoraFIn,Estado,Motivo".split(',')
    arr_of_filds.forEach( (elemento)=> { strAcumulado +=  `private $${elemento.toLowerCase()}  = "" ; \n` }  );
    arr_of_filds.forEach(
        (elemento , index)=>{ acumulado += index < arr_of_filds.length -1? elemento + ', ' : elemento + ' ' }
                            ); 
    strAcumulado+= ` private $token              ="";
      //------------------------------------------------------ 
      public function lista${nameTabeForWriteFunctions(table)}($pagina = 1 , $sqlAlternativo =  null)    {
          // si tubieras 3000 ${table} demoraria mucho en cargar entonceds los tramos de 100 en 100
          $inicio     =   0 ; 
          $cantidad   = 100 ;
          if($pagina > 1){\n
              $inicio = (  $cantidad * ($pagina - 1)  ) + 1 ;
              $cantidad = $cantidad * $pagina;
          }\n

          $query = $sqlAlternativo == null ? 
              "SELECT ${acumulado} FROM " . $this->table  .  " limit $inicio ,  $cantidad" : 
              $sqlAlternativo; 
          
          // print_r($query);
          $datos = parent::obtenerDatos($query);
          return ($datos);
      }\n
      //------------------------------------------------------
            
      public function obtener${nameTabeForWriteFunctions(table)}($id){
         $query =  "SELECT * FROM  $this->table   WHERE ${arr_of_filds[0]} = '$id'";   
         return parent::obtenerDatos($query); 
       }
      //------------------------------------------------------
      public function post($json){
        $_respuestas = new respuestas;
        $datos = json_decode($json , true );
        // aca validamos el token.............................
        // o existe o no existe el token  , si existe validar , si no existe error de no autorizacion 401 no autorizado 
        if(!isset($datos['token'])){ // si no existe token
          return $_respuestas->error_401();
        }else{        //si existe el token
          // necesitamos dos funciones que vamos a crear buscarToken()
          $this->token = $datos['token'];
          $arrayToken = $this->buscarToken();
          // var_dump($arrayToken);
          if($arrayToken){
                  // validemos que los datos que nos envian contienen los campos requeridos para  un insert
                  // en la tabla pacientes dni , nombre y correo son campos impresindibles para esta tabla. 
                  ${conditions(arr_of_filds)}
                      // 
                    return $_respuestas->error_400();        
                  }else{
                      //si estas aca ya podrian estar completos los datos y los insertaremos:
                      //si ha venido un password lo encriptamos
                      if (isset($datos['password'])){$datos['password']= parent::encriptar($datos['password']);}
                     
                      ${generarCodigoPHP(arr_of_filds , false)}  


                      
                      $rowFound = $this->rowFound() ; 
                    
                        if( ! $rowFound ){
                          // en caso que no hay registro lo insertamos.
                          $newRowid = $this->insertar${table.replace(/[ls]/gi, '')}();
                          if($newRowid){
                              $respuesta = $_respuestas->response;
                              $respuesta["result"]= array( 
                                                        "${arr_of_filds[0]}" => $newRowid
                                                          );
                              return $respuesta;                            
                          }else{
                              return $_respuestas->error_500();
                          }
                      }else{
                        // en caso que ya existe el registro :
                          $respuesta = $_respuestas->error_204();
                          return $respuesta;
                      }
                  }//  if  $arrToken existe
          }else{
            return $_respuestas->error_401("El token que se envio es invalido o ha caducado");
          }
        }

        //....................................................
    }//post($json)
    //------------------------------------------------------
    public function rowFound(){
       $sqlContarFilasSiRepetidas = "SELECT COUNT(*)  FROM $this->table WHERE   ${camposConAndParaCondiciones()};";

       $arrCuantosRepetidos = $this->lista${nameTabeForWriteFunctions(table)}(1 , $sqlContarFilasSiRepetidas) ;
       $exiteFila = ( $arrCuantosRepetidos[0]['COUNT(*)'] == 0  )? false : true ;
       return $exiteFila;
    }
    //------------------------------------------------------
    public function insertar${ table.replace(/[ls]/gi, '') }(){  //capitalizeFirstLetter( table.replace(/[ls]/gi, '') )
        
        $queryResetAutoIncrement = $this->resetarAuto_increment();
        parent::nonQueryId($queryResetAutoIncrement , $this->table);
  
        //este codigo debes hacerlo con tu  herramienta de github. 
        $query = ${generateInsertQuery(arr_of_filds)};
  
        $resp = parent::nonQueryId($query , $this->table);
      if($resp){
        return $resp;
      }else{
        return 0;
      }
    }
    //------------------------------------------------------ 
    public function put($json){
        $_respuestas = new respuestas;
        $datos = json_decode($json , true );
  
        
        // aca validamos el token.............................
        // o existe o no existe el token  , si existe validar , si no existe error de no autorizacion 401 no autorizado 
        if(!isset($datos['token'])){ // si no existe token
          return $_respuestas->error_401();
        }else{        //si existe el token
          // necesitamos dos funciones que vamos a crear buscarToken()
          $this->token = $datos['token'];
          $arrayToken = $this->buscarToken();
          // var_dump($arrayToken);
          if($arrayToken){
            // validemos que los datos que nos envian contienen los campos requeridos para  un insert
            // en la tabla pacientes dni , nombre y correo son campos impresindibles para esta tabla. 
            if(  !isset($datos['${arr_of_filds[0].toLowerCase()}'] ) ||  !is_numeric( $datos['${arr_of_filds[0].toLowerCase()}']) ){
                // 
                return $_respuestas->error_400("No haz proporcionado el ID de la cita que quieres modificar");   //Datos enviados incompletos o con formato incorrecto
            }else{
                //si estas aca ya podrian estar completos los datos y los insertaremos:
                //si ha venido un password lo encriptamos
                if (isset($datos['password'])){$datos['password']= parent::encriptar($datos['password']);}
                
                ${generarCodigoPHP(arr_of_filds)}

                $numRowsAfected = $this->modificar${nameTabeForWriteFunctions(table)}();
                
                // echo $numRowsAfected;
                if( $numRowsAfected >=1  ){
                    $respuesta = $_respuestas->response;
                    $respuesta["result"]= array( 
                                                "Campos_campos_afectados" => $numRowsAfected
                                                );
                    return $respuesta;                            
                }else{
                    // si no se hizo modificacion por que los datos del servidor son los mismos que haz recibido.
                    $real = false;
                    if(!$real){
                      return $_respuestas->error_500("Error interno del Servidor , realmente no haz metido datos nuevos a la tabla  $this->table por ese motivo no no se ha hecho nada");
      
                    }else{
                      $respuesta =  $_respuestas->error_204("todos los datos enviados yala en la BBDD asi q fijate que tipeas!!!");
                      return $respuesta;
                    }
                }
            }
          }else{
            return $_respuestas->error_401("El token que se envio es invalido o ha caducado");
          }
        }
  
        //....................................................


    }//put()
            //------------------------------------------------------
      public function modificar${nameTabeForWriteFunctions(table)}(){
          //este codigo debes hacerlo con tu  herramienta de github. 

        $query = ${functionUpdateTable(arr_of_filds)};
          //nonQueryId solo es para guardar.
          $numRowsAfected = parent::nonQuery($query , $this->table);
          if($numRowsAfected >= 1){  //nonQuery devuelve el numero de filas afectadas osea 1 o mayor.
            return $numRowsAfected; //devuelve numero >=1
          }else{
            // return $numRowsAfected;  //devuelve 0
           
            $queryIfYaHay = ${functionSelectCountFilas(arr_of_filds)};

              $numRowsWhitThisInfo = parent::nonQuery($queryIfYaHay , $this->table);
              if($numRowsWhitThisInfo!=0){
                   //los datos que quiere meter ya estan identicos en su fila asi q no hay nada que hacer en la BBDD.
              } ;
          }
      }//modificar
      //------------------------------------------------------
      public function delete($json){
        $_respuestas = new respuestas;
        $datos = json_decode($json , true );
    
          // aca validamos el token.............................
          // o existe o no existe el token  , si existe validar , si no existe error de no autorizacion 401 no autorizado 
          if(!isset($datos['token'])){ // si no existe token
            return $_respuestas->error_401();
          }else{        //si existe el token
            // necesitamos dos funciones que vamos a crear buscarToken()
            $this->token = $datos['token'];
            $arrayToken = $this->buscarToken();
            // var_dump($arrayToken);
            if($arrayToken){
                  // validemos que los datos que nos envian contienen los campos requeridos para  un insert
                  // en la tabla pacientes dni , nombre y correo son campos impresindibles para esta tabla. 
                  if(  !isset($datos['${arr_of_filds[0].toLowerCase()}']) ){
                    return $_respuestas->error_400();   //Datos enviados incompletos o con formato incorrecto     
                  }else{
                      //en este punto o devuevuelve un 1 si ejecuto el delte o devuevelve un 0 s no pudo borrar.
                      $this->${arr_of_filds[0].toLowerCase()}   = $datos['${arr_of_filds[0].toLowerCase()}'];        
                      $numRowsAfected = $this->eliminar${nameTabeForWriteFunctions(table)}();
              
                      if( $numRowsAfected >= 1 ){
                          $respuesta = $_respuestas->response;
                          $respuesta["result"]= array( 
                                                      "Campos_${table}_afectados" => $numRowsAfected
                                                      );
                          return $respuesta;                            
                      }else{
                          // si $numRowsAfected = 0 ,  no se hizo eliminacion por que ese id no existe.
                          $real = false;
                          if(!$real){
                            return $_respuestas->error_500("Error interno del Servidor , dicho id en la tabla $this->table no existe!!");
              
                          }else{
                            return $_respuestas->error_204("todos los datos enviados ya existen en la BBDD asi q fijate que tipeas!!!");
                            
                          }
                      }
                  }
            }else{
              return $_respuestas->error_401("El token que se envio es invalido o ha caducado");
            }
          }
    
          //....................................................
      }//delete
      //------------------------------------------------------
      

  private function eliminar${nameTabeForWriteFunctions(table)}(){
    $query ="DELETE FROM $this->table  WHERE ${arr_of_filds[0].toLowerCase()} = '$this->${arr_of_filds[0].toLowerCase()}'";

    $resp = parent::nonQuery($query , $this->table);
    if($resp>=1){ //nonQuery devuelve el num de filas afectadas.
      return $resp;
    }else{
      return 0; // no se deleteo ninguna fila
    } 
  }//elminar${nameTabeForWriteFunctions(table)}().
  //------------------------------------------------------
  function resetarAuto_increment(){
      // este codigo hace mediante una sola consulta al servidor la tarea de buscar el max id de la tabla y la guarda para concatenar el dato con el alter table auto_increment

      $query = "SELECT MAX(${arr_of_filds[0].toLowerCase()}) + 1 INTO @max_id FROM $this->table ;
      SET @query = CONCAT('ALTER TABLE ${table} AUTO_INCREMENT = ', @max_id);
      PREPARE stmt FROM @query;
      EXECUTE stmt;
      DEALLOCATE PREPARE stmt;
      SET @max_id = NULL;";

      return $query;
  }//resetarAuto_increment()
  //------------------------------------------------------
   private function buscarToken(){
    $query = "SELECT tokenid , usuarioid , estado FROM usuarios_token WHERE token = '$this->token' AND  estado = 'Activo'";
    // echo "/n en la linea: ".__LINE__. " " .$query .";
    $resp = parent::obtenerDatos($query);
    if($resp){
      return $resp;
    }else{
      return 0;
    }
  }//buscarToken()
  //------------------------------------------------------
  private function actualizarToken($tokenId){
    $date = date("Y m d H:i");
    $query = "UPDATE usuarios_token SET Fecha = '$date'  WHERE TokenId = '$tokenId'";
    $resp = parent::nonQuery($query);  
    if($resp>=1){ 
      return $resp;
    }else{
      //devolvio 0
      return 0;
    }
  }  


}
      `

    // console.log(strAcumulado);
    return strAcumulado;
}


//=============================================================
