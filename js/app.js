 (function(){

 	var storedArray=[];
	var installedApps = {
     listing: []
    };
    localStorage.setItem("installedApps", JSON.stringify(installedApps));

 	function doAjaxRequest(url, methodType){

		return new Promise(function(resolve, reject) {

			var xhr = new XMLHttpRequest();
			xhr.open(methodType, url, true);
			xhr.send();
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){
					if (xhr.status === 200){
						console.log('xhr done successfully');
						var resp = xhr.responseText;
						var respJson = JSON.parse(resp);
						resolve(respJson);
					}
					else {
						reject(xhr.status);
						console.log('xhr failed');
					}
				}
				else {
					console.log('xhr processing going on');
				}	
			};

			console.log('request sent succesfully');

		});
	}
	 
    function populateData(){  

       var url = 'https://jsonplaceholder.typicode.com/posts';

       doAjaxRequest(url, 'GET')      
      .then(renderData);    


    }
    
    function renderData(data) {

          storedArray = data;

           var listingDom = data.reduce(function(listingStr,value,index){
            listingStr += `<div class="row">
                          <div class="col-sm-12">
                             <h2>BOX ${index}</h2>
                             <p>${value.body}</p>
                             <div class="alignRight">
                                <button type="button"  data-identifier="${index}" data-installed-status="0" class="btn btn-primary">Install</button>
                                 <button type="button" id="desc"  data-showDesc="${index}" class="btn btn-secondary" data-toggle="modal">Description</button>
                             </div>
                          </div>
                        </div>`;

            return listingStr;            
      },"");

       document.getElementById('listApp').innerHTML = listingDom;

       var btnElements = document.querySelectorAll('.btn-primary');
       var descElements = document.querySelectorAll('.btn-secondary');

       btnElements.forEach(function(value){
          value.addEventListener("click", installApp); 
       });

       descElements.forEach(function(value){
          value.addEventListener("click", displayInfo); 
       });       

    }

    function displayInstalledApps() { 

        var getStoredAppIds = JSON.parse(localStorage.getItem('installedApps')).listing;
        var listingDom = "No App Installed";
         
        if(getStoredAppIds.length !== 0) {

          listingDom = getStoredAppIds.reduce(function(listingStr,value,index){
	            listingStr += `<div class="row">
	                          <div class="col-sm-12">
	                             <h2>BOX ${value}</h2>
	                             <p>${storedArray[value].body}</p>
	                             <div class="alignRight">
	                               <button type="button" id="desc"  data-showDesc="${value}" class="btn btn-secondary installed" data-toggle="modal">Description</button>
	                             </div>
	                          </div>
	                        </div>`;

	            return listingStr;            
     		 },"");	


        } 

 
       
       document.getElementById('installedApp').innerHTML = listingDom;

       if(document.querySelectorAll('.installed').length !== 0) {
	       	var descElements = document.querySelectorAll('.installed');
		       descElements.forEach(function(value){
		          value.addEventListener("click", displayInfo); 
		       });

       }    

    }
  

   function installApp(e){   

     var insertID = e.target.dataset.identifier;
     var statusVal = Boolean(Number(e.target.dataset.installedStatus));
     var installedAppIDs = [];
     var currentInstalledAppsState = JSON.parse(localStorage.getItem('installedApps')).listing;

     if(statusVal === false ){

     	currentInstalledAppsState.push(insertID);
     	e.target.innerHTML = "Uninstall"; 
     	e.target.dataset.installedStatus = "1";
     	var installedApps = {
	     listing: currentInstalledAppsState
	    };
        localStorage.setItem("installedApps", JSON.stringify(installedApps));

     } else { 

         e.target.innerHTML = "Install"; 
         e.target.dataset.installedStatus = "0";

        var installedOnlyApps = currentInstalledAppsState.filter(outUninstalledApps); 

         function outUninstalledApps(value){
            return value !==  insertID;        
         }

     	var filteredApps = {
	     listing: installedOnlyApps
	    };

        localStorage.setItem("installedApps", JSON.stringify(filteredApps));

     }     	

  }   



   function displayInfo(e){

      var displayID = e.target.dataset.showdesc;
     
      $('#modal-title').text(`Box ${displayID}`);
      $('#modal-body').html(storedArray[displayID].body);
      $('#myModal').modal('show'); 
   }

   populateData();
   
   document.getElementById('profile-tab').addEventListener("click", displayInstalledApps); 
  
})();