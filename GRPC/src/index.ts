import path from 'path'
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const packagedDefination = protoLoader.loadSync(path.join(__dirname,'a.proto'));

const protoPerson = grpc.loadPackageDefinition(packagedDefination);

const Person = [
    {
        name: 'John Doe',
        age: 19,
    },
    {
        name: 'Jane Doe',
        age: 21,
    }
]

//@ts-ignore
function addPerson(call, callBack){
    // console.log(call);
    let person = {
        name: call.request.name,
        age: call.request.age
    }
    Person.push(person);
    console.log(person, Person) ;
    //null for no error, is there is error, pass instead of null.
    //return the person object as response
    callBack(null, person);
}
//@ts-ignore
function getPersonByName(call, callback){
    // console.log(call);
    let name = call.request.name;
    let person = Person.find(p => p.name === name);
    console.log(person);
    if(person){
        callback(null, person);
    }
    else{
        callback(
            Error('Person not found')
        , null);
    }
}

const server = new grpc.Server();

server.addService((protoPerson.AddressBookService as grpc.ServiceClientConstructor).service, { addPerson: addPerson, getPersonByName: getPersonByName });

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if(err){
        console.error(err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});