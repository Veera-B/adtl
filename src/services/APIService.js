import {state} from "fs"
import { checkServerIdentity } from "tls"

export const AddAdlForm = (date, name, zipcode, accountNumber, client, checkbox, checkbox1) =>{
    
    console.log('APISERVICE',
    date, name, zipcode, accountNumber, client, checkbox, checkbox1
    );
    
    
    return fetch("/addUser",{
         method : 'POST',
         headers: {
             'Content-Type':'application/json'
         },
         body: JSON.stringify({
             date:date,
             name:name,
             zipcode:zipcode,
             accountNumber:accountNumber,
             client:client,
             checkbox:checkbox,
             checkbox1:checkbox1,
         })

    }).then(response =>{ return response.json();})
    .then((res) =>{
        alert(res)
        return res;


    }).catch(function(error){
        return error;
    })
}