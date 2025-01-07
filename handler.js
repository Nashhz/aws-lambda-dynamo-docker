// handler.js
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Table name from environment variable
const TABLE_NAME = process.env.TABLE_NAME;

module.exports.createToDo = async (event) => {
  const { title, description } = JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    Item: {
      id: Date.now().toString(),  // Use a timestamp as unique ID
      title: title,
      description: description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'ToDo item created successfully!', item: params.Item }),
    };
  } catch (err) {
    console.error("Error creating ToDo item", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not create ToDo item' }),
    };
  }
};

module.exports.getToDos = async () => {
    const params = {
      TableName: TABLE_NAME,
    };
  
    try {
      console.log("Fetching items from DynamoDB table:", TABLE_NAME);
      const data = await dynamoDB.scan(params).promise();
      console.log("Fetched data:", data);
      return {
        statusCode: 200,
        body: JSON.stringify({ todos: data.Items }),
      };
    } catch (err) {
      console.error("Error fetching ToDo items:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Could not fetch ToDo items", error: err.message }),
      };
    }
  };
  

module.exports.updateToDo = async (event) => {
  const { id, title, description } = JSON.parse(event.body);

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set title = :t, description = :d, updatedAt = :u',
    ExpressionAttributeValues: {
      ':t': title,
      ':d': description,
      ':u': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    const data = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'ToDo item updated successfully!', item: data.Attributes }),
    };
  } catch (err) {
    console.error("Error updating ToDo item", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not update ToDo item' }),
    };
  }
};

module.exports.deleteToDo = async (event) => {
  const { id } = event.pathParameters;

  const params = {
    TableName: TABLE_NAME,
    Key: { id },
  };

  try {
    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'ToDo item deleted successfully!' }),
    };
  } catch (err) {
    console.error("Error deleting ToDo item", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Could not delete ToDo item' }),
    };
  }
};
