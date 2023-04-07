const axios = require("axios");
const env = process.env;

// Get API key and contract ID from environment variables
const API_KEY = env.API_KEY;
const CONTRACT_ID = env.CONTRACT_ID;

exports.handler = async (event) => {
  console.info("Event:", JSON.stringify(event));

  // Check that the API key and contract ID are set
  if (!API_KEY || !CONTRACT_ID) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Missing API key or contract ID",
      }),
    };
  }

  // Get request data from the front-end
  const functionName = event.headers["x-function-name"];
  const eventData = event.body ? JSON.parse(event.body) : {};

  console.info("Function name:", functionName);

  // Call the selected API function
  switch (functionName) {
    case "getItem":
      return await getItem(eventData);
    case "listMemoriesByItemId":
      return await listMemoriesByItemId(eventData);
    case "downloadFile":
      return await downloadFile(eventData);
    default:
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid API function name",
        }),
      };
  }
};

const sendRequest = async (data, endpoint, operation) => {
  const config = {
    method: "post",
    url: `https://api.realitems.io/${endpoint}`,
    headers: {
      "x-api-key": API_KEY,
      "content-type": "application/json",
    },
    data,
  };

  try {
    const response = await axios(config);
    const responseData = response.data.data[operation];

    console.log(`${operation} response:`, responseData);

    return {
      statusCode: 200,
      body: responseData,
    };
  } catch (error) {
    console.error(`${operation} error:`, error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};

const missingVariablesResponse = {
  statusCode: 400,
  body: JSON.stringify({
    message: "Missing required variables",
  }),
};

// ** Get item
const getItem = async (eventData) => {
  // Check if required variables are present
  if (!eventData.itemId) return missingVariablesResponse;

  const data = JSON.stringify({
    query: `query getItem ($itemId: String!) {
      getItem (itemId: $itemId) {
          body {
              itemId
              batchId
              metadata
              metadataHash
              contractAddress
              mintTransaction {
                  status
                  hash
                  itemIndex
              }
          }
          status {
              success
              message
          }
      }
  }`,
    variables: { itemId: eventData.itemId },
  });

  return await sendRequest(data, "items", "getItem");
};

// ** List memories
const listMemoriesByItemId = async (eventData) => {
  // Check if required variables are present
  if (!eventData.itemId) return missingVariablesResponse;

  const data = JSON.stringify({
    query: `query listMemoriesByItemId ($itemId: String!) {
      listMemoriesByItemId (itemId: $itemId) {
          body {
              memoryId
              metadata
              mintTransaction {
                  status
              }
          }
          status {
              success
              message
          }
      }
  }`,
    variables: { itemId: eventData.itemId },
  });

  return await sendRequest(data, "memories", "listMemoriesByItemId");
};

// ** Download file
const downloadFile = async (eventData) => {
  // Check if required variables are present
  if (!eventData.assetId) return missingVariablesResponse;

  const config = {
    method: "post",
    url: "https://api.realitems.io/file/download",
    headers: {
      assetId: eventData.assetId,
      "x-api-key": API_KEY,
      format: "bytearray",
    },
  };

  try {
    const response = await axios(config);
    const responseData = {
      file: response.data,
      filename: response.headers["filename"],
    };

    console.log("downloadFile response:", responseData);

    return {
      statusCode: 200,
      body: responseData,
    };
  } catch (error) {
    console.error("downloadFile error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: error.message,
      }),
    };
  }
};
