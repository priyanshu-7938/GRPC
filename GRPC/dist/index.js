"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const grpc = __importStar(require("@grpc/grpc-js"));
const protoLoader = __importStar(require("@grpc/proto-loader"));
const packagedDefination = protoLoader.loadSync(path_1.default.join(__dirname, 'a.proto'));
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
];
//@ts-ignore
function addPerson(call, callBack) {
    // console.log(call);
    let person = {
        name: call.request.name,
        age: call.request.age
    };
    Person.push(person);
    console.log(person, Person);
    //null for no error, is there is error, pass instead of null.
    //return the person object as response
    callBack(null, person);
}
//@ts-ignore
function getPersonByName(call, callback) {
    // console.log(call);
    let name = call.request.name;
    let person = Person.find(p => p.name === name);
    console.log(person);
    if (person) {
        callback(null, person);
    }
    else {
        callback(Error('Person not found'), null);
    }
}
const server = new grpc.Server();
server.addService(protoPerson.AddressBookService.service, { addPerson: addPerson, getPersonByName: getPersonByName });
server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(`Server is running on port ${port}`);
    server.start();
});
