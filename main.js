// Import built-in Node.js package path.
const path = require('path');

/**
 * Import the ServiceNowConnector class from local Node.js module connector.js
 *   and assign it to constant ServiceNowConnector.
 * When importing local modules, IAP requires an absolute file reference.
 * Built-in module path's join method constructs the absolute filename.
 */
const ServiceNowConnector = require(path.join(__dirname, '/connector.js'));

/**
 * Import built-in Node.js package events' EventEmitter class and
 * assign it to constant EventEmitter. We will create a child class
 * from this class.
 */
const EventEmitter = require('events').EventEmitter;

/**
 * The ServiceNowAdapter class.
 *
 * @summary ServiceNow Change Request Adapter
 * @description This class contains IAP adapter properties and methods that IAP
 *   brokers and products can execute. This class inherits the EventEmitter
 *   class.
 */
class ServiceNowAdapter extends EventEmitter {

  /**
   * Here we document the ServiceNowAdapter class' callback. It must follow IAP's
   *   data-first convention.
   * @callback ServiceNowAdapter~requestCallback
   * @param {(object|string)} responseData - The entire REST API response.
   * @param {error} [errorMessage] - An error thrown by REST API call.
   */

  /**
   * Here we document the adapter properties.
   * @typedef {object} ServiceNowAdapter~adapterProperties - Adapter
   *   instance's properties object.
   * @property {string} url - ServiceNow instance URL.
   * @property {object} auth - ServiceNow instance credentials.
   * @property {string} auth.username - Login username.
   * @property {string} auth.password - Login password.
   * @property {string} serviceNowTable - The change request table name.
   */

  /**
   * @memberof ServiceNowAdapter
   * @constructs
   *
   * @description Instantiates a new instance of the Itential ServiceNow Adapter.
   * @param {string} id - Adapter instance's ID.
   * @param {ServiceNowAdapter~adapterProperties} adapterProperties - Adapter instance's properties object.
   */
  constructor(id, adapterProperties) {
    // Call super or parent class' constructor.
    super();
    // Copy arguments' values to object properties.
    this.id = id;
    this.props = adapterProperties;
    // Instantiate an object from the connector.js module and assign it to an object property.
    this.connector = new ServiceNowConnector({
      url: this.props.url,
      username: this.props.auth.username,
      password: this.props.auth.password,
      serviceNowTable: this.props.serviceNowTable
    });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method connect
   * @summary Connect to ServiceNow
   * @description Complete a single healthcheck and emit ONLINE or OFFLINE.
   *   IAP calls this method after instantiating an object from the class.
   *   There is no need for parameters because all connection details
   *   were passed to the object's constructor and assigned to object property this.props.
   */
  connect() {
    // As a best practice, Itential recommends isolating the health check action
    // in its own method.
    this.healthcheck();
  }


/**
 * @memberof ServiceNowAdapter
 * @method healthcheck
 * @summary Check ServiceNow Health
 * @description Verifies external system is available and healthy.
 *   Calls method emitOnline if external system is available.
 *
 * @param {ServiceNowAdapter~requestCallback} [callback] - The optional callback
 *   that handles the response.
 */
healthcheck(callback) {

 log.info ("Healthcheck Run");
 this.postRecord((result, error) => {

// this.getRecord((result, error) => {
   /**
    * For this lab, complete the if else conditional
    * statements that check if an error exists
    * or the instance was hibernating. You must write
    * the blocks for each branch.
    */
   if (error) {
     /**
      * Write this block.
      * If an error was returned, we need to emit OFFLINE.
      * Log the returned error using IAP's global log object
      * at an error severity. In the log message, record
      * this.id so an administrator will know which ServiceNow
      * adapter instance wrote the log message in case more
      * than one instance is configured.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing the error seen as an argument
      * for the callback's errorMessage parameter.
      */
      this.emitOffline();
      log.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);

   } else {
     /**
      * Write this block.
      * If no runtime problems were detected, emit ONLINE.
      * Log an appropriate message using IAP's global log object
      * at a debug severity.
      * If an optional IAP callback function was passed to
      * healthcheck(), execute it passing this function's result
      * parameter as an argument for the callback function's
      * responseData parameter.
      */

      this.emitOnline();
//      log.debug(`\nResponse returned from GET request:\n${JSON.stringify(data)}`);

   }

// If the callback parameter was specified then perform the callback call.   
   if (typeof callback === 'undefined') {;}
   else {callback(result,error);}
 });
// log.setlevel(lvl);
}




  /**
   * @memberof ServiceNowAdapter
   * @method emitOffline
   * @summary Emit OFFLINE
   * @description Emits an OFFLINE event to IAP indicating the external
   *   system is not available.
   */
  emitOffline() {
    this.emitStatus('OFFLINE');
    log.warn('ServiceNow: Instance is unavailable.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitOnline
   * @summary Emit ONLINE
   * @description Emits an ONLINE event to IAP indicating external
   *   system is available.
   */
  emitOnline() {
    this.emitStatus('ONLINE');
    log.info('ServiceNow: Instance is available.');
  }

  /**
   * @memberof ServiceNowAdapter
   * @method emitStatus
   * @summary Emit an Event
   * @description Calls inherited emit method. IAP requires the event
   *   and an object identifying the adapter instance.
   *
   * @param {string} status - The event to emit.
   */
  emitStatus(status) {
    this.emit(status, { id: this.id });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method getRecord
   * @summary Get ServiceNow Record
   * @description Retrieves a record from ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  getRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's get() method.
     * Note how the object was instantiated in the constructor().
     * get() takes a callback function.
     */

     log.debug ("Running getRecord");
     this.connector.get( (results, error) => 
        {
            if (error) {
                log.error(`\nError returned from GET request:\n${JSON.stringify(error)}`);
            }
            log.debug ("*** Results variable is of type " + typeof(results));

            if (typeof(results) == 'object') {
                log.debug ("*** Body ***");

                if (results.hasOwnProperty('body')) {
                    log.debug ("***   Body Found   ***");
                    let bodyData = JSON.parse(results['body']);

                    log.debug ("Record Count = " + bodyData.result.length);

// for each record in the data, do the following
                    for (let i=0; i<bodyData.result.length;i++)
                    {
//                        log.debug ("*** Processing record index " +  i);
//                        log.debug ("*** Processing record key " + bodyData.result[i]['number'])

// create new object for limited data.
                        bodyData.result[i]['change_ticket_number'] = bodyData.result[i]['number'];
                        delete bodyData.result[i]['number'];

                        bodyData.result[i]['change_ticket_key'] = bodyData.result[i]['sys_id'];
                        delete bodyData.result[i]['sys_id'];

                        let objData = bodyData.result[i];

                        for (var prop in objData) {
// Since we only need a subset of keys/properties to remain, remove all others from object
                            if (prop == 'change_ticket_number') {;}
                            else if (prop == 'change_ticket_key') {;}
                            else if (prop == 'active') {;}
                            else if (prop == 'priority') {;}
                            else if (prop == 'description') {;}
                            else if (prop == 'work_start') {;}
                            else if (prop == 'work_end') {;}
                            else {
                                delete bodyData.result[i][prop]
                            }
                        }
                    }
// At this point we should have a modified array of objects in bodyData.
                    log.debug ("***********");
                    log.debug ("***  Modified Body Data - Should be a JSON String ***");
                    log.debug (bodyData);


// Set the body of the results to be the modified object data
                
                    log.debug ("***********");
                    log.debug ("*** Results Body Data ***");
                    log.debug(results.body);

                    log.debug ("results.body is typeof " + typeof(results.body))
                    log.debug ("bodyData is typeof " + typeof(bodyData))

                    results.body = JSON.stringify(bodyData);

//   Return the array of results which is essentially a single item array of a generic object matching the object
// properties of a change record.....?    No idea if this right as lab is ambiguous.

// If full response is required, change body data to results which should have modified body.....!
                    callback(bodyData, error);

                }
                else {
                   callback(results, error);
                }
            }
            else
            {
                callback(results, error);
            }
        });
  }

  /**
   * @memberof ServiceNowAdapter
   * @method postRecord
   * @summary Create ServiceNow Record
   * @description Creates a record in ServiceNow.
   *
   * @param {ServiceNowAdapter~requestCallback} callback - The callback that
   *   handles the response.
   */
  postRecord(callback) {
    /**
     * Write the body for this function.
     * The function is a wrapper for this.connector's post() method.
     * Note how the object was instantiated in the constructor().
     * post() takes a callback function.
     */
     log.info ("Running postRecord");

     this.connector.post( (results, error) => 
        {
            if (error) {
                log.error(`\nError returned from POST request:\n${JSON.stringify(error)}`);
            }
            log.info(`\nResponse returned from POST request:\n${JSON.stringify(results)}`);

            log.debug ("*** Results variable is of type " + typeof(results));


            if (typeof(results) == 'object') {
                log.debug ("*** Body ***");

                if (results.hasOwnProperty('body')) {
                    log.debug ("***   Body Found   ***");
                    let bodyData = JSON.parse(results['body']);

                    bodyData.result['change_ticket_number'] = bodyData.result['number'];
                    delete bodyData.result['number'];

                    bodyData.result['change_ticket_key'] = bodyData.result['sys_id'];
                    delete bodyData.result['sys_id'];

                    let objData = bodyData.result;

                    for (var prop in objData) {
// Since we only need a subset of keys/properties to remain, remove all others from object
                        if (prop == 'change_ticket_number') {;}
                        else if (prop == 'change_ticket_key') {;}
                        else if (prop == 'active') {;}
                        else if (prop == 'priority') {;}
                        else if (prop == 'description') {;}
                        else if (prop == 'work_start') {;}
                        else if (prop == 'work_end') {;}
                        else {
                            delete bodyData.result[prop]
                        }
                    }

                    
// At this point we should have a modified object in bodyData.
                    log.debug ("***********");
                    log.debug ("***  Modified Body Data - Should be a JSON String ***");
                    log.debug (bodyData);


// Set the body of the results to be the modified object data
                
                    log.debug ("***********");
                    log.debug ("*** Results Body Data ***");
                    log.debug(results.body);

                    log.debug ("results.body is typeof " + typeof(results.body))
                    log.debug ("bodyData is typeof " + typeof(bodyData))

                    results.body = JSON.stringify(bodyData);

// Return the result which is essentially a single item generic object matching the object
// properties of a change record.....?    No idea if this right as lab is ambiguous.

// If full response is required, change body data to results which should have modified body.....!
                    callback(bodyData, error);

                }
                else {
                   callback(results, error);
                }
            }
            else
            {
                callback(results, error);


            }
        });
  }
}

module.exports = ServiceNowAdapter;