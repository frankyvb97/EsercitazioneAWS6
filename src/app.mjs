export const lambdaHandler = async (event, context) => {
    try {
        console.log(event);
        console.log(context);
    } catch (err) {
        console.log(err);
        return err;
    }
};