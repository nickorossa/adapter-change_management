// Update this constant with your ServiceNow credentials
const options = {
  url: 'https://dev95384.service-now.com',
  username: 'admin',
  password: 's3rviceNow!',
  serviceNowTable: 'change_request'
};

// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js.
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, './connector.js'));

// Use JSDoc to create a JSDoc data type for an IAP callback.
// Call the new type iapCallback.
// Notice iapCallback is a data-first callback.

/**
 * @callback iapCallback
 * @description A [callback function]{@link
 *   https://developer.mozilla.org/en-US/docs/Glossary/Callback_function}
 *   is a function passed into another function as an argument, which is
 *   then invoked inside the outer function to complete some kind of
 *   routine or action.
 *
 * @param {*} responseData - When no errors are caught, return data as a
 *   single argument to callback function.
 * @param {error} [errorMessage] - If an error is caught, return error
 *   message in optional second argument to callback function.
 */





/**
 * @function mainOnObject
 * @description Instantiates an object from the imported ServiceNowConnector class
 *   and tests the object's get and post methods.
 */
function mainOnObject() {
  // Instantiate an object from class ServiceNowConnector.
  const connector = new ServiceNowConnector(options);
  // Test the object's get and post methods.
  // You must write the arguments for get and post.

  connector.get((data,error)=>{
    if (error) {
      console.error(`\nmain==>Error returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nmain==>Response returned from GET request:\n${JSON.stringify(data)}`)
  });

  connector.post((data,error)=>{
    if (error) {
      console.error(`\nmain==>Error returned from GET request:\n${JSON.stringify(error)}`);
    }
    console.log(`\nmain==>Response returned from GET request:\n${JSON.stringify(data)}`)
  });

}

// Call mainOnObject to run it.
mainOnObject();