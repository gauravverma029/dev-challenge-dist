/**
 * @myEs6code.js 
 * Author :-  Gaurav Verma UI Developer 
*
*/
const Spark = require('./SparkClass.js'); /*Calling class for Managing Application using ES6*/
global.DEBUG = false
const url = "ws://localhost:8011/stomp" 
const client = Stomp.client(url)
var SparkData = new Spark(client); /* initialization of spark class*/


client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

function connectCallback() {
	 SparkData.updatedData(sparkResponse);
}

function sparkResponse(message){
	let ElementId = 'dynamic-sprak';
	let Messagebody = JSON.parse(message.body);
    SparkData.tableElement(Messagebody,ElementId,Sparkline);
}

client.connect({}, connectCallback, function(error) {
		alert(error.headers.message)
});




