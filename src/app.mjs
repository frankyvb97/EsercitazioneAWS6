import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    let status;
    try {
        let response = await addProduct(JSON.parse(event.body));
        //gestire error type
        status = response;
    } catch (error) {
        // console.log(error);
        // console.log(error.name);
        // console.log(error.message);
        // console.log(error.stack);
        if (error.name == 'Error') {
            status = 400;
        }
        else {
            status = 404;
        }
    } finally {
        console.log(status);
        status = addStatus(status);
        return status;
    }
};

async function addProduct(product) {
    const params = {
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
    const newCommand = new UpdateCommand(params);
    console.log(await documentClient.send(newCommand));
    const response = await documentClient.send(newCommand);
    console.log(response);
    return response.$metadata.httpStatusCode;
}

function addStatus(number) {
    return {
        statusCode: number,
        headers: {
            'Content-Type': 'application/json,'
        }
    }
}