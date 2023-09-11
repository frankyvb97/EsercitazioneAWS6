import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    try {
        let response = await addProduct(JSON.parse(event.body));
        const status = addStatus(response);
        return status;
    } catch (error) {
        const status = addStatus(404);
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
    try {
        const newCommand = new UpdateCommand(params);
        const response = await documentClient.send(newCommand);
        return response.$metadata.httpStatusCode;
    } catch (error) {
        return 400;
    }
}

function addStatus(number) {
    return {
        statusCode: number,
        headers: {
            'Content-Type': 'application/json,'
        },
        body: "Error " + number
    }
}