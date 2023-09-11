import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    console.log(event);
    console.log(event.body);
    let response;
    try {
        console.log("Avvio addProduct");
        response = await addProduct(JSON.parse(event.body));
        console.log(response);
        const status = addStatus(response, "Error" + response);
        console.log(status);
        return status;
    } catch (error) {
        console.log("Errore addProduct");
        response = addStatus(404, "Error 404");
        //console.log(response);
        return response;
    }
};

async function addProduct(product) {
    const productRow = {
        TableName: "ProductsDB",
        Key: {
            PK: product.PK,
            SK: product.SK,
        },
        UpdateExpression: "set Marca = :marca, Taglia = :taglia, Prezzo = :prezzo",
        ExpressionAttributeValues: {
            ":marca": product.marca,
            ":taglia": product.taglia,
            ":prezzo": product.prezzo,
        },
        ReturnValues: "ALL_NEW",
    }
    try {
        console.log(productRow);
        console.log("Aggiunta riga");
        const newCommand = UpdateCommand(productRow);
        console.log("Prima fase aggiunta completata");
        console.log(newCommand);
        const response = await documentClient.send(newCommand);
        console.log("Seconda fase aggiunta completata");
        const status = addStatus(200, "OK");
        console.log(response);
        //console.log(status);
        return response;
    } catch (error) {
        const response = addStatus(500, "Error 500");
        //console.log(response);
        return response;
    }
}

function addStatus(number, status) {
    return {
        statusCode: number,
        headers: {
            'Content-Type': 'application/json,'
        },
        body: JSON.stringify(status)
    }
}