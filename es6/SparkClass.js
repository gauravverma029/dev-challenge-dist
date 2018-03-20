/**
 * @SparkClass.js 
 * Author :-  Gaurav Verma UI Developer 
 * Using For Collecting Data and Updating Table and Chart Managing.
 *
 */

class Spark {

    constructor(client) {
        this.client = client;  /* initializing Socket Class*/
        this.colletedItems = {}; /* Empty Object for getting all points*/
    }

    updatedData(sparkResponse){ /*  client subscribe and getting data from web socket*/
       this.client.subscribe("/fx/prices", function(message){ 
           sparkResponse(message);
       });
    }

    tableElement(LoadData,ElementId,Sparkline){ /* checking new data on base condition updating tables and chart*/
      let findElement = LoadData.name+'-name';
      let elementStatus = document.querySelector("."+findElement);
      if(elementStatus == null){
        this.createNewElement(LoadData,ElementId);
      }else{
        this.updateElementData(LoadData,ElementId);
       }

      this.colletedItemsUpdate(LoadData); 
      this.chartUpdated(LoadData,Sparkline);
    }

    createNewElement(LoadData,ElementId){  /* Creating new row in table */
       let currentTable = document.getElementById(ElementId); 
       let row = currentTable.insertRow(0);
       let i = 0;
       for (let x in LoadData) {
          let cell = row.insertCell(i);
          cell.innerHTML = `<span class=${LoadData['name']}-${x}>${LoadData[x]}</span>`;
          i++;
       }

       let cell = row.insertCell(i);
       cell.innerHTML = `<span id=${LoadData['name']}-chart></span>`;
     }

    updateElementData(LoadData,ElementId){ /* Updating rows in table */
       let i=0;
       var elems = document.querySelectorAll("span");
       [].forEach.call(elems, function(el) {
         el.classList.remove("red");
       });
       for (let x in LoadData) {
          let  dynamicElement = LoadData.name+'-'+x;
          let nextValue = LoadData[x];
          let prevValue = document.querySelector("."+dynamicElement).innerText;
          if(nextValue != prevValue){
             document.querySelector("."+dynamicElement).innerText = nextValue;
             document.querySelector("."+dynamicElement).className += " red";
          }

          i++;
       }
    }
    
    colletedItemsUpdate(LoadData){ /* collection all points and updating chart in basis of 30 second timing */
      let colletedItems = this.colletedItems;
      let name = LoadData.name;
      let calculatedValue = (LoadData.bestBid + LoadData.bestAsk)/2;
      if(!colletedItems.hasOwnProperty(name)){
        colletedItems[name] = {};
        colletedItems[name]['points'] = [calculatedValue];
        colletedItems[name]['currentTimeStamp'] = Date.now() / 1000 | 0;
      }else{
        let currentTimeStamp = Date.now() / 1000 | 0;
        let fineTimeStampDiff = currentTimeStamp - colletedItems[name]['currentTimeStamp'];
        if(fineTimeStampDiff == 30 ){
          colletedItems[name]['points'].shift();
          colletedItems[name]['currentTimeStamp'] = currentTimeStamp;
        }

        colletedItems[name]['points'].push(calculatedValue);
      }
    }

    chartUpdated(LoadData,Sparkline){ /* Sparkling Chart Updation */
        let colletedItems = this.colletedItems;
        let name = LoadData.name;
        let charElement = name+'-chart';
        let sparkline1 = new Sparkline(document.getElementById(charElement));
        let points = colletedItems[name]['points']
        sparkline1.draw(points);
    }

};

module.exports = Spark; /* Export Spark Module */
