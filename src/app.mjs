import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "eu-west-1" });
const documentClient = DynamoDBDocumentClient.from(client);

//export const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({region: "eu-west-1"}));

export const lambdaHandler = async (event) => {
    let response;
    try {
        response = await addProduct(JSON.parse(event.body));
        console.log(response);
        return response;
    } catch (error) {
        response = addStatus(404, "Error 404");
        console.log(response);
        return response;
    }
};

async function addProduct(product) {
    let productRow;
    try {
        productRow = new UpdateCommand({
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
        });
        console.log(productRow);
        const response = await documentClient.send(productRow);
        const status = addStatus(200, "OK");
        console.log(response);
        console.log(status);
        return status;
    } catch (error) {
        const response = addStatus(500, "Error 500");
        console.log(response);
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