import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    const error = createStatus(200, "OK");
    console.log(error);

    const command = addProduct(event);
    const response = await documentClient.send(command);
    console.log(response);
    return response;
};

function addProduct(product) {
    const command = new UpdateCommand({
        TableName: "ProductsDB",
        Key: {
            PK: product.PK, //body.PK
            SK: product.SK, //body.SK
        },
        UpdateExpression: "set Marca = :marca, Taglia = :taglia, Prezzo = :prezzo", //body.attribute
        ExpressionAttributeValues: {
            ":marca": product.marca,
            ":taglia": product.taglia,
            ":prezzo": product.prezzo,
        },
        ReturnValues: "ALL_NEW",
    });
    return command;
}

function createStatus(number, status) {
    return val = [number, status];
}