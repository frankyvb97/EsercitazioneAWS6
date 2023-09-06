import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    const command = new UpdateCommand({
        TableName: "ProductsDB",
        Key: {
            PK: "1",
            SK: "ProductDetails",
        },
        UpdateExpression: "set Marca = :marca, Taglia = :taglia, Prezzo = :prezzo",
        ExpressionAttributeValues: {
            ":marca": "Asics",
            ":taglia": "XL",
            ":prezzo": 5.9,
        },
        ReturnValues: "ALL_NEW",
    });

    const response = await documentClient.send(command);
    console.log(response);
    return response;
};

// Esempio di UpdateCommand
// const command = new UpdateCommand({
//     TableName: "Dogs",
//     Key: {
//         Breed: "Labrador",
//     },
//     UpdateExpression: "set Color = :color",
//     ExpressionAttributeValues: {
//         ":color": "black",
//     },
//     ReturnValues: "ALL_NEW",
// });