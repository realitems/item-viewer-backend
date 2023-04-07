# Item Viewer back-end

This is the back-end for the Item Viewer demo application. It is a Lambda function that takes requests from the front-end, calls the Real Item API using an API key, and returns the results to the front-end.

## Usage

This project was built using AWS SAM. If you don't use SAM, or you just want to see the code, you can find it in [here](https://github.com/realitems/item-viewer-backend/blob/dev/lambdas/proxy/index.js) `(/lambdas/proxy/index.js)`.

#### AWS SAM

If using SAM, set your S3 bucket in `samconfig.toml` and run the following commands to deploy:

```bash
sam build
sam deploy
```

#### Debugging

To debug using VSCode, you can use the `launch.json` file in the `.vscode` folder. You need to have the [AWS Toolkit](https://marketplace.visualstudio.com/items?itemName=AmazonWebServices.aws-toolkit-vscode) extension installed for VSCode. In the `launch.json` file, make sure to set the `API_KEY` and `CONTRACT_ID` environment variables.

In `launch.json`, you can change the `payload.path` value to test different functions.

**Warning: Do not commit your API key.**

## Notes

If you are deploying to AWS:

- It is recommended to use Secrets Manager to store your API key.
- Make sure to implement some type of authentication for the Lambda function URL.
