import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (event) => {
    const command = new UpdateCommand({});

    const response = await docClient.send(command);
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