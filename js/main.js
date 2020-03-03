

	//.domain(['WeWork', 'Regus', 'Spaces', 'Knotel', 'RocketSpace', 'HQ Global Workplaces'])
     //		.range(['#e30613', '#17a2b8', '#28a745', '#6610f2', '#ffc107', '#ed700a'])
     	


 	var value 



 	var currentValue = 10

 	var sizeValue

 	//Set values for time range slider
    var inputValue = null;
    var years = ["1993","1994","1995","1996","1997","1998","1999","2000","2001","2002","2003","2004","2005","2006","2007","2008","2009", "2010","2011","2012","2013","2014","2015","2016","2017","2018","2019"];

    //Set values for lease-size range slider
    var sizeInputValue = 0;
    var leaseSizes = ["0","10000","20000","30000","40000", "50000","60000","70000","80000","90000","100000","110000","120000","130000","140000","140000","150000",
    				 "160000","170000","180000","190000","200000","210000","220000","230000","240000","250000","260000","270000","280000","290000","300000"];

    var currentMap = d3.map();

    d3.queue()
    .defer(d3.csv, "data/statesProj.json", function(d) { 
        //console.log('s')
    })
    .defer(d3.csv, "data/coworkingTenants_4.json", function(d) { 
        //console.log('h')
    })

    .defer(d3.csv, "data/coworkingTenants_9.json", function(d) { 
        //console.log('h')
    })
    .defer(d3.csv, "data/SFCounty_proj.json", function(c) { 
       // console.log('c')
    })
    .defer(d3.csv, "data/SanFrancisco_CoWorkingTenants.json", function(cw) { 
       // console.log('cw')
    })
 	.await(ready);

 	function ready(error) {

 		var SFData = SFCoworking.features
     		//console.log(SFData)

     	var NationalData = coworkingTenantsNational.features
     		//console.log(NationalData)

 		var width = 2070;
		var height = 600;

		var SFwidth = 1070;
		var SFheight = 600;

		// Create SVG
		var svg = d3.select( ".container" )
    		.insert( "svg", "#map" )
    		.attr("preserveAspectRatio", "xMinYMin meet")
			.attr("viewBox", "0 0 960 600")
   		 	//.attr("class", 'col-md-8 indexText')
   		 	// .attr("transform", "translate(-200,-80)")

     	//Create SVG
	

		// Append empty placeholder g element to the SVG
		// g will contain geometry elements
		var g = svg.append( "g" );
	
 		//projection
 	 	var albersProjection = d3.geoAlbers()
    		.scale( 1200)
    		.rotate ( [98.5795,] )
    		.center( [0, 39.8283] )

    	//GeoPath
  		var geoPath = d3.geoPath()
    		.projection( albersProjection );

    	var geoPath2 = d3.geoPath()
    		.projection( albersProjection );


    	g.selectAll( "path" )
    		.data( statesProj.features )
    		.enter()
    		.insert( "path" )
    		.attr( "fill", '#343a40' )
    		.attr( "opacity", 1 )
    		.attr( "stroke", "#696969" )
   			// .attr("transform", "translate(-200,-80)")
    		.attr( "border-radius", '50%' )
    		.attr( "stroke-width", .4 )
    		.attr( "d", geoPath2 )
    		.attr("class","states");
        	

    	var points = svg.append( "g" );

   		var radiusNational = d3.scaleLinear()
      		.domain([20000, 40000, 60000, 80000, 100000]) 
     		 .range([8, 12]);

    	var b = points.selectAll("path")
    		.data( coworkingTenantsNational.features )
    		.enter()
    		.append( "path" )
    		.attr( "fill", '#e30613' )
    		.attr( "fill-opacity", initialdateMatch )
    		//.attr( "stroke", "#696969" )
    		//.attr("transform", "translate(-200,-80)")
    		.attr( "border-radius", '50%' )
    		.attr( "stroke-width", ".35" )
    		.attr("d", geoPath.pointRadius(function(d) { return radiusNational(d.properties.Lease_Size); }))
        	.attr("class","tenants")
        	
        	/*
var defs = svg.append("defs");

//Filter for the outside glow
var filter = defs.append("filter")
    .attr("id","glow");
filter.append("feGaussianBlur")
    .attr("stdDeviation","3.5")
    .attr("result","coloredBlur");
var feMerge = filter.append("feMerge");
feMerge.append("feMergeNode")
    .attr("in","coloredBlur");
feMerge.append("feMergeNode")
    .attr("in","SourceGraphic");

    //Apply to your element(s)
d3.selectAll(".tenants")
    .style("filter", "url(#glow)");
*/
function pulse() {
			var circle = svg.select(".tenants");
			(function repeat() {
				circle = circle.transition()
					.duration(2000)
					.attr("stroke-width", 20)
					.attr("r", 10)
					.transition()
					.duration(2000)
					.attr('stroke-width', 0.5)
					.attr("r", 200)
					.ease('sine')
					.each("end", repeat);
			})();
		}


     	var county2014Div = d3.select("body").append("div")   
    		.attr("class", "county2014Tooltip")               
    		.style("opacity", 0)
    	//.style("left", (d3.event.pageX) + "px")     
    	//.style("top", (d3.event.pageY - 28) + "px");

   		var myTimer;
		d3.select("#play-button").on("click", function() {
 		clearInterval (myTimer);
		myTimer = setInterval (function() {
    	var b= d3.select("#timeslide");
      	var t = (+b.property("value") + 1) % (+b.property("max") + 1);
     	if (t == 0) { t = +b.property("min"); }
     	b.property("value", t);
     	update (t);
   		}, 400);
		});


		d3.select("#stop").on("click", function() {
			clearInterval (myTimer);
		});
    
    	d3.select("#timeslide").on("input", function() {    	
    		//console.log(value)
        	update(+this.value);   
    	});


    function update(value) {

   		console.log(value)
    	document.getElementById("range").innerHTML=years[value];
    	inputValue = years[value];
    	//console.log(inputValue)
    
    	d3.selectAll(".tenants")
        	.attr("fill-opacity", dateMatch);
	}


    function dateMatch(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);
  	
    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expiration);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);

    	if (yearInt <= inputValueInt && yearExpirationInt >= inputValueInt) {
    		      	
       	 return ".4";
    	} else {
        	return "0";
    	};
	}

	function initialdateMatch(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expiration);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);

    	if (yearInt <= 1993 ) {
    		//console.log('match!'+ year)
        	
       	 return ".4";
    	} else {
        	return "0";
    	};
	}

	

		}


	d3.queue()
    .defer(d3.csv, "data/coworkingTenants_4.json", function(cw) { 
       
    })
 	.await(readyLeaflet);


 	// Build Leaflet Map
    function readyLeaflet(error) {

 		var radius = d3.scaleLinear()
    		.domain([20000, 40000, 60000, 80000, 100000]) //568158 37691912
      		.range([8, 10, 12, 14, 16]);


    	var type = d3.scaleOrdinal()
      		.domain(['WeWork', 'Regus', 'Spaces', 'Knotel', 'RocketSpace', 'HQ Global Workplaces'])
     		.range(['#e30613', '#17a2b8', '#28a745', '#6610f2', '#ffc107', '#ed700a'])
     		 .unknown("white");


 		//Read in coworking data
 		var SFData = nationalCoworkingTenantsLeaflet.features
     		

 		//Build Leaflet Map
        L.mapbox.accessToken = 'pk.eyJ1Ijoic3RhcnJtb3NzMSIsImEiOiJjaXFheXZ6ejkwMzdyZmxtNmUzcWFlbnNjIn0.IoKwNIJXoLuMHPuUXsXeug';
        var mapboxUrl = 'https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
            //var accessToken = 'pk.eyJ1Ijoic3RhcnJtb3NzMSIsImEiOiJjam13ZHlxbXgwdncwM3FvMnJjeGVubjI5In0.-ridMV6bkkyNhbPfMJhVzw';
        var map = L.map('map').setView([40.7359101, -73.9904268], 13);
        		mapLink = 
            '<a href="https://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
   			'https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=' + L.mapbox.accessToken, {
       			tileSize: 512,
        		zoomOffset: -1,
        		attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    	}).addTo(map);
     	
        setTimeout(function(){ map.invalidateSize()}, 400);
   		var svgLayer = L.svg()
			svgLayer.addTo(map);
			
		var svgMap = d3.select("#map").select("svg");
			var mapG = svgMap.select('g');



		var LeafletDiv = d3.select("body").append("div")   
    		.attr("class", "county2014Tooltip")               
    		.style("opacity", 0)
    	//.style("left", (d3.event.pageX) + "px")     
    	//.style("top", (d3.event.pageY - 28) + "px");
			
		d3.json("data/coworkingTenants_9.json", function(SFData) {
        	var SFData = nationalCoworkingTenantsLeaflet.features
        	})

		//var coords = SFData.geometry.coordinates;
		//console.log(coords)

		var tenantNamesArray = []
		var agencyBrokerNamesArray = []
		SFData.forEach(function(d) {
			var coords = d.geometry.coordinates
			//console.log(coords)
			d.latLong = new L.LatLng(coords[1],
									coords[0]);
			var tenantNames = d.properties.Tenant
			
			tenantNamesArray.push(tenantNames)

			var agencyBrokerNames = d.properties.Agency_Bro
			
			agencyBrokerNamesArray.push(agencyBrokerNames)
			
			
			//console.log(tenantNames)
			return tenantNames;

			
			
			
			//console.log(tenantNames)
			//console.log(agencyBrokerNames)
			return agencyBrokerNames
		
		})


//console.log(tenantNamesArray)
	//console.log(agencyBrokerNamesArray)	
		/*
		function tenantNamesArrayRemove(array){

			return array.filter(function(ele){
				console.log(ele)
				return ele !== 'WeWork' || ele !== "Regus"
			})

		}
*/
		//tenantNamesArrayRemove(tenantNamesArray)

		function removeItem(array){
    for(var i = array.length; i--;){
	if (array[i] === "WeWork" || 
		array[i] === 'Regus'|| 
		array[i] === 'weWork'|| 
		array[i] === 'Spaces'|| 
		array[i] === 'RocketSpace'|| 
		array[i] === 'HQ Global Workplaces'|| 
		array[i] === 'Knotel') array.splice(i, 1);
}
return array
}


removeItem(tenantNamesArray);
//console.log(tenantNamesArray)

		// Remove agency broker names already in the list for 'other' category

		function removeAgencyBrokerItem(array){
    for(var i = array.length; i--;){
	if (array[i] === "Avison Young" || 
		array[i] === 'CBRE'|| 
		array[i] === 'Colliers International'|| 
		array[i] === 'Cushman & Wakefield'|| 
		array[i] === 'JLL'|| 
		array[i] === 'Newmark Knight Frank'|| 
		array[i] === 'Tishman Speyer'|| 
		array[i] === 'Transwestern'|| 
		array[i] === 'Lincoln Property Company') array.splice(i, 1);
}
return array
}

removeAgencyBrokerItem(agencyBrokerNamesArray)
//console.log(agencyBrokerNamesArray)

// Test Check for false WeWork
function weWorkCheck(arr){
   
    for(let item in tenantObject) {
        tenantObject[item].forEach(function(each){
            if(each.Status == status) { // you cmpare to the wrong target
                // do something
               // console.log(tenantObject[item])
                 tenantArray.push(tenantObject[item]);
            }
        });
    }

}

		//console.log(tenantNamesArray)

		var feature = mapG.selectAll("circle")
    		.data(SFData)
    		.enter().append("circle")
   		 	.style("stroke", "white")
   		 	//.style("fill", "gray")
   		 	//.style("stroke-opacity", .7)
    		//.style("fill-opacity", .6)
    		.attr("opacity", '.7')
    		.style("fill", function(d) { return type(d.properties.Tenant)})
   			.attr("r", function(d) { return radius(d.properties.Lease_Size)})
   			.attr("class", 'features')
   			.attr("id", 'foo')
   			.attr("classed", initialClassMatch)
   			.attr("pointer-events", initialClassMatch)
   			//console.log(feature)
			
		function drawAndUpdateCircles() {
    		feature.attr("transform",
        		function(d) {
            		var layerPoint = map.latLngToLayerPoint(d.latLong);
            		return "translate("+ layerPoint.x +","+ layerPoint.y +")";
        		}
    		)
		}

		drawAndUpdateCircles();
			map.on("moveend", drawAndUpdateCircles);
			//this does not work - elistener won't trigger on mouse events?
			


		var myTimer;
		d3.select("#play-button-leaflet").on("click", function() {
		clearInterval (myTimer);
		myTimer = setInterval (function() {
    	var b= d3.select("#timeslide-leaflet");
      	var t = (+b.property("value") + 1) % (+b.property("max") + 1);
      	if (t == 0) { t = +b.property("min"); }
      		b.property("value", t);
      		update (t);
    		}, 400);
		});

		d3.select("#stop-leaflet").on("click", function() {
			clearInterval (myTimer);
		})

		var val 

	 	d3.select("#timeslide-leaflet").on("input", function() {    	
        	update(+this.value, currentValue);   
        	return val
    	});

    	d3.select("#sizeSlide-leaflet").on("input", function() {    	
        	sizeUpdate(+this.value); 

        	currentValue = (+this.value)
        	//console.log(currentValue)
        	return currentValue
        	//console.log(value)

    	});

tenantArray2 = ['WeWork', 'Regus']

var tenantObject2 = {}


function tenantStatus2(statement, position){

tenantObject2 = {
  "Tenants": [{
   "Name": "WeWork",
   "Status": statement
  }, {
   "Name": "Regus",
   "Status": statement
   }
]
 }

    tenantArray = [];
    for(let item in tenantObject2) {
        tenantObject2[item].forEach(function(each){
            each.Status === statement
        });
    }
  //  console.log(tenantObject2)
    return tenantObject2

}

tenantStatus2(false)
//console.log(tenantObject2)


    	//Build tenant array
var tenantObject = {
  "Tenants": [{
   "Name": "WeWork",
   "Status": true
  }, {
   "Name": "Regus",
   "Status": true
   }, {
   "Name": "Spaces",
   "Status": true
   }, {
   "Name": "Knotel",
   "Status": true
   }, {
   "Name": "RocketSpace",
   "Status": true
   }, {
   "Name": "HQ Global Workplaces",
   "Status": true
   }, {
   "Name": "Other",
   "Status": true
   }, {
   "Name": "Select All",
   "Status": true
   }

]
 }

 var agencyBrokerObject = {
  "AgencyBrokers": [{
   "Name": "Avison Young",
   "Status": true
  }, {
   "Name": "CBRE",
   "Status": true
   }, {
   "Name": "Colliers International",
   "Status": true
   }, {
   "Name": "Cushman & Wakefield",
   "Status": true
   }, {
   "Name": "JLL",
   "Status": true
   }, {
   "Name": "Newmark Knight Frank",
   "Status": true
   }, {
   "Name": "Lincoln Property Company",
   "Status": true
   }, {
   "Name": "Tishman Speyer",
   "Status": true
   }, {
   "Name": "Transwestern",
   "Status": true
   }, {
   "Name": "Other",
   "Status": true
   }
   , {
   "Name": "Select All",
   "Status": true
   }

]
 }

 //console.log(tenantObject)

function tenantStatus(status){
    tenantArray = [];
    for(let item in tenantObject) {
        tenantObject[item].forEach(function(each){
            if(each.Status == status) { // you cmpare to the wrong target
                // do something
               // console.log(tenantObject[item])
                 tenantArray.push(tenantObject[item]);
            }
        });
    }

}

function agencyBrokerStatus(status){
    agencyBrokerArray = [];
    for(let item in agencyBrokerObject) {
       agencyBrokerObject[item].forEach(function(each){
            if(each.Status == status) { // you cmpare to the wrong target
                // do something
               // console.log(tenantObject[item])
                 agencyBrokerArray.push(agencyBrokerObject[item]);
            }
        });
    }

}

tenantStatus(true)
agencyBrokerStatus(true)


//console.log(tenantArray)
//console.log(tenantObject.Tenants[0])

    	tenantArray = [];
    	agencyBrokerArray = []

    	//Tenant Checkboxes
    	d3.selectAll("#WeWorkCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
    			
  				var type = "WeWork"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

  				

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);


    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[0].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[0].Status = true
  				}

			});

    			var showOff = function () {
 					 //console.log(tenantObject.Tenants[0].Status);
				}

				setTimeout(showOff, 115000);
			

    	d3.selectAll("#RegusCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "Regus"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[1].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[1].Status = true
  				}
			});

    	d3.selectAll("#SpacesCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "Spaces"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[2].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[2].Status = true
  				}
			});


    	d3.selectAll("#KnotelCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "Knotel"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);
    			
    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[3].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[3].Status = true
  				}
    	
			});

    	d3.selectAll("#RocketSpaceCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "RocketSpace"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[4].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[4].Status = true
  				}
			});

    	d3.selectAll("#HQCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "HQ Global Workplaces"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant === type &&
    						agencyBrokerArray.some(function(entry) {
          					return d.properties.Agency_Bro === entry;
        					});			
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[5].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[5].Status = true
  				}
			});


    	d3.selectAll("#OtherTenantCheckbox").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "Transwestern"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { return d.properties.Tenant != 'WeWork' &&
    										 d.properties.Tenant != 'Regus' &&
    										 d.properties.Tenant != 'Spaces' &&
    										 d.properties.Tenant != 'Knotel' &&
    										 d.properties.Tenant != 'RocketSpace' &&
    										 d.properties.Tenant != 'HQ Global Workplaces' &&
    										 	agencyBrokerArray.some(function(entry) {
          										return d.properties.Agency_Bro === entry;
        										});	
    										  })
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  				
  					tenantObject.Tenants[6].Status = false
  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[6].Status = true
  					
  				}
			})

    	d3.selectAll("#tenantSelect-all").on("change", function() {

    			agencyBrokerStatusIterator ()
  				var type = "Transwestern"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { return d.properties.Tenant != null &&
    										 	agencyBrokerArray.some(function(entry) {
          										return d.properties.Agency_Bro === entry;
        										});	
    										 })
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

  				if (statusCheck == false) {
  					tenantObject.Tenants[7].Status = false
  					tenantObject.Tenants[0].Status = false
  					tenantObject.Tenants[1].Status = false
  					tenantObject.Tenants[2].Status = false
  					tenantObject.Tenants[3].Status = false
  					tenantObject.Tenants[4].Status = false
  					tenantObject.Tenants[5].Status = false
  					tenantObject.Tenants[6].Status = false

  					return tenantObject.Tenants
  					
  				} else {
  					tenantObject.Tenants[7].Status = true
  					tenantObject.Tenants[0].Status = true
  					tenantObject.Tenants[1].Status = true
  					tenantObject.Tenants[2].Status = true
  					tenantObject.Tenants[3].Status = true
  					tenantObject.Tenants[4].Status = true
  					tenantObject.Tenants[5].Status = true
  					tenantObject.Tenants[6].Status = true

  				}

				})

    	//Build tenantObject iterator function

    	function tenantStatusIterator () {
    	for(let item in tenantObject) {
					tenantArray = []
        			tenantObject[item].forEach(function(each){
            		if(each.Status == true) { // you cmpare to the wrong target
                		var name = each.Name
              			tenantArray.push(name);
            		} 
            		return name
        			});
   				 }
   				 //console.log(tenantArray)
   				
   				 
  				if (tenantObject.Tenants[6].Status == false) {
  					
  					

  					return tenantObject.Tenants
  					
  				} else {
  					for (let otherName in tenantNamesArray) {

  						//console.log(otherName)
  						tenantArray.push(tenantNamesArray[otherName])

  					}
  			
  					return tenantArray
  				}

    
   		}
   		tenantStatusIterator ()
  

   		function otherStatusIterator () {
    	for(let item in tenantObject) {
					tenantArray = []
        			tenantObject[item].forEach(function(each){
            		if(each.Status == true) { // you cmpare to the wrong target
                		var name = each.Name
              			tenantArray.push(name);
            		} 
            		return name
        			});
   				 }
   				 //console.log(tenantArray)
   		}


   		//Build Agency Broker Iterator Function

   		function agencyBrokerStatusIterator () {
   			
    	for(let item in agencyBrokerObject) {
					agencyBrokerArray = []
        			agencyBrokerObject[item].forEach(function(each){
            		if(each.Status == true) { // you cmpare to the wrong target
                		var name = each.Name
              			agencyBrokerArray.push(name);
              			//console.log(name)
            		} 
            		return name
        			});
   				 }
   				
   				 //console.log(tenantNamesArray[83])
   				// console.log(agencyBrokerObject.AgencyBrokers[9])
  				if (agencyBrokerObject.AgencyBrokers[9].Status == false) {
  					
  					//console.log("other agency broker is unchecked")

  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					for (let otherName in agencyBrokerNamesArray) {

  						
  						agencyBrokerArray.push(agencyBrokerNamesArray[otherName])

  					}
  					//console.log("other agency broker is checked")
  					return agencyBrokerArray
  				}

    
   		}

   		agencyBrokerStatusIterator()
   		

    	//Agency Checkboxes


		d3.selectAll("#JLLCheckbox").on("change", function() {
				//(console.log(tenantObject.Tenants))
				//console.log(agencyBrokerArray)
				tenantStatusIterator()
    			//console.log(tenantArray)

  				var type = "JLL"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});			
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[4].Status = false
  					//console.log(agencyBrokerObject.AgencyBrokers)
  						//console.log(agencyBrokerArray)
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					//console.log(agencyBrokerObject.AgencyBrokers)
  						//console.log(agencyBrokerArray)
  					agencyBrokerObject.AgencyBrokers[4].Status = true
  				}

				});
			//checkBox();
				
		d3.selectAll("#AvisonCheckbox").on("change", function() {

				tenantStatusIterator()

				
				//console.log(tenantArray)
  				var type = "Avison Young"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[0].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[0].Status = true
  				}

				});	

		d3.selectAll("#CBRECheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "CBRE"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[1].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[1].Status = true
  				}

				});

		d3.selectAll("#ColliersCheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "Colliers International"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) {
    			 return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[2].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[2].Status = true
  				}

				});

		d3.selectAll("#CushmanCheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "Cushman & Wakefield"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[3].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[3].Status = true
  				}

				})

		d3.selectAll("#NewmarkCheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "Newmark Knight Frank"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[5].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[5].Status = true
  				}

				})

		d3.selectAll("#LincolnCheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "Lincoln Property Company"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type &&
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[6].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[6].Status = true
  				}

				})

		d3.selectAll("#TishmanCheckbox").on("change", function() {

				tenantStatusIterator()
  				var type = "Tishman Speyer"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type && 
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry;
        					});
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[7].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[7].Status = true
  				}

				})

		d3.selectAll("#TranswesternCheckbox").on("change", function() {

				tenantStatusIterator()

  				var type = "Transwestern"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro === type 
    			})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[8].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[8].Status = true
  				}

				})

		d3.selectAll("#OtherCheckbox").on("change", function() {

			tenantStatusIterator()

  				var type = "Transwestern"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Agency_Bro != 'JLL' &&
    										 d.properties.Agency_Bro != 'Avison Young' &&
    										 d.properties.Agency_Bro != 'CBRE' &&
    										 d.properties.Agency_Bro != 'Colliers International' &&
    										 d.properties.Agency_Bro != 'Cushman & Wakefield' &&
    										 d.properties.Agency_Bro != 'Newmark Knight Frank' &&
    										 d.properties.Agency_Bro != 'Lincoln Property Company' &&
    										 d.properties.Agency_Bro != 'Lincoln Property Company' &&
    										 d.properties.Agency_Bro != 'Tishman Speyer' &&
    										 d.properties.Agency_Bro != 'Transwestern' &&

    										 tenantArray.some(function(entry) {
          									return d.properties.Tenant === entry;
        									});

    				})
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[9].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[9].Status = true
  				}

				})
/*
function exefunction() {
    $("#agencyBrokerSelect-all").click(function () {
            var isChecked = $("#agencyBrokerSelect-all").is(":checked");
            if (isChecked) {
                console.log("CheckBox checked.");
                d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant != null && 
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry 
        					}) 
    										 })
    			.attr("display", display);
            } else {
                d3.selectAll(".features")
    			
    		
    										
    			.attr("display",'none');
            }
        });
}
exefunction()

*/
		d3.selectAll("#agencyBrokerSelect-all").on("change", function() {

				
				tenantStatusIterator()

  				var type = "Transwestern"
  				// I *think* "inline" is the default.
  				display = this.checked ? "inline" : "none";

  				

 				d3.selectAll(".features")
    			.filter(function(d) { 
    				return d.properties.Tenant != null && 
    						tenantArray.some(function(entry) {
          					return d.properties.Tenant === entry
        					}) 
    										 })
    			.attr("display", display);

    			statusCheck = this.checked ? true : false

    			if (statusCheck == false) {
  					agencyBrokerObject.AgencyBrokers[10].Status = false
  					agencyBrokerObject.AgencyBrokers[0].Status = false
  					agencyBrokerObject.AgencyBrokers[1].Status = false
  					agencyBrokerObject.AgencyBrokers[2].Status = false
  					agencyBrokerObject.AgencyBrokers[3].Status = false
  					agencyBrokerObject.AgencyBrokers[4].Status = false
  					agencyBrokerObject.AgencyBrokers[5].Status = false
  					agencyBrokerObject.AgencyBrokers[6].Status = false
  					agencyBrokerObject.AgencyBrokers[7].Status = false
  					agencyBrokerObject.AgencyBrokers[8].Status = false
  					agencyBrokerObject.AgencyBrokers[9].Status = false
  					
  					return agencyBrokerObject.AgencyBrokers
  					
  				} else {
  					agencyBrokerObject.AgencyBrokers[10].Status = true
  					agencyBrokerObject.AgencyBrokers[0].Status = true
  					agencyBrokerObject.AgencyBrokers[1].Status = true
  					agencyBrokerObject.AgencyBrokers[2].Status = true
  					agencyBrokerObject.AgencyBrokers[3].Status = true
  					agencyBrokerObject.AgencyBrokers[4].Status = true
  					agencyBrokerObject.AgencyBrokers[5].Status = true
  					agencyBrokerObject.AgencyBrokers[6].Status = true
  					agencyBrokerObject.AgencyBrokers[7].Status = true
  					agencyBrokerObject.AgencyBrokers[8].Status = true
  					agencyBrokerObject.AgencyBrokers[9].Status = true
  				}

				})

		function initialOpacity(value, currentValue) {

		}

		function update(value, currentValue) {
    		document.getElementById("range-leaflet").innerHTML=years[value]
    		inputValue = years[value];


    		var sizeInputValueInt = leaseSizes[currentValue];
    	


    		d3.selectAll(".features")
        		.attr("opacity", dateMatch)
        		.attr("pointer-events", ClassMatch)

        	d3.selectAll(".features")
        		.attr("opacity", leaseSizeMatch)
        		.attr("pointer-events", sizeClassMatch)

        	


	}

		function sizeUpdate(value) {
			var sizeNumber = leaseSizes[value] 
    		document.getElementById("sizeRange-leaflet").innerHTML=parseInt(sizeNumber).toLocaleString()
    		 + " Square Feet";
    		//leaseSizes[value]=sizeNumber
    		//document.getElementById("sizeRange-leaflet").innerHTML.parseInt()
    		//document.getElementById("sizeRange-leaflet").innerHTML.toLocaleString()
    		sizeInputValue = leaseSizes[value];
    		//console.log(sizeInputValue)

    		d3.selectAll(".features")
        		.attr("opacity", leaseSizeMatch)
        		.attr("pointer-events", sizeClassMatch)

    		//d3.selectAll(".features")
        	//	.attr("opacity", dateMatch)
        	//	.attr("pointer-events", ClassMatch)
	}

	 	function dateMatch(data, value) {

	 
    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);

    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);
    	//console.log(yearExpirationInt)

    	var leaseSize = (data.properties.Lease_Size);
    	

    	var sizeInputValueInt = parseInt(sizeInputValue);
    	//console.log(sizeInputValue)

    	if (leaseSize >= sizeInputValueInt && yearInt <= inputValueInt && yearExpirationInt >= inputValueInt ) {
    		//console.log('match!'+ year)
        	
       	 return ".2";
    	} else {
        	return "0";
    	};


	}





	function initialDateMatch(data, value) {
		d3.select("#timeslide-leaflet").on("input", function() {    	
        	update(+this.value, currentValue);   
  
    	});
	}

	function ClassMatch(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);
    	//console.log(yearInt, inputValueInt)

    	if (yearInt <= inputValueInt && yearExpirationInt >= inputValueInt) {
    		//console.log('match!'+ year)
        	
       	 return "all";
    	} else {
        	return "none";
    	};
	}


	function sizeClassMatch(data, value) {

		var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);

    	var leaseSize = (data.properties.Lease_Size);
    	

    	var sizeInputValueInt = parseInt(sizeInputValue);
    	//console.log(sizeInputValue)

    	



    	if (leaseSize >= sizeInputValueInt && yearInt <= inputValueInt && yearExpirationInt >= inputValueInt) {
    		//console.log('filtering working')
        	
       	 return "all";
    	} else {
        	return "none";
    	};
	}


	function initialClassMatch(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);
    	//console.log(yearInt)
    	if (yearInt = 1998 ) {
    		//console.log('match!'+ year)
        	
       	 return "all";
    	} else {
        	return "none";
    	};
	}

	function initialOpacity(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);
    	//console.log(yearInt)
    	return leaseSizeMatch
    }



	function initialLeaseSizeMatch(data, value) {

    	var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);



    	if (yearInt <= inputValueInt && yearExpirationInt >= inputValueInt) {
    		//console.log('match!'+ year)
        	
       	 return ".7";
    	} else {
        	return "0";
    	};
	}

	function leaseSizeMatch(data, value) {

		var date = (data.properties.Sign_Date);
    	var year = date.substring(0, 4);

    	var inputValueInt = parseInt(inputValue, 10);
    	var yearInt = parseInt(year, 10);

    	var dateExpiration = (data.properties.Expir_Date);
    	var yearExpiration = dateExpiration.substring(0, 4);
    	var yearExpirationInt = parseInt(yearExpiration, 10);

    	var leaseSize = (data.properties.Lease_Size);
    	

    	var sizeInputValueInt = parseInt(sizeInputValue);
    	//console.log(sizeInputValue)

    	



    	if (leaseSize >= sizeInputValueInt && yearInt <= inputValueInt && yearExpirationInt >= inputValueInt) {
    		//console.log('filtering working')
        	
       	 return ".7";
    	} else {
        	return "0";
    	};
	}


	d3.selectAll(".features")
					.on("mouseover", function(d) { 
						//console.log("visible")
					
						var value2014 = currentMap.get(d.properties.Tenant);     
          		 		LeafletDiv.transition()        
               			 .duration(200)      
                		.style("opacity", .9);

            			LeafletDiv .html('<br/>' + '<b>'+d.properties.Tenant+'</b>' + '<br/>'
            				+ "Address: " + d.properties.Address + '<br/>' 
            				+ "City: " + d.properties.City + '<br/>' 
            				+ "SF: " + d.properties.Lease_Size.toLocaleString() + '<br/>' 
            				+ "Sign Date: " + d.properties.Sign_Date.substring(0,4) + '<br/>'
            				+ "Expiration Date: " + d.properties.Expir_Date.substring(0,4) + '<br/>'
            				+ "Agency Broker: " + d.properties.Agency_Bro + '<br/>'
            				+ "Tenant Broker: " + d.properties.Tenant_Bro + '<br/>'
            			    + "Building Leasing: " + d.properties.Bldg_Leasi)
                		.style("left", (d3.event.pageX+ 15) + "px")     
               			.style("top", (d3.event.pageY - 150) + "px")
               			.style("text-align", 'left'); 
               		 d3.select(this).attr("class","countyHover");   
            	})

            	.on("mouseout", function(d) {       
            		LeafletDiv.transition()        
                	.duration(200)      
                	.style("opacity", 0);  
            		d3.select(this).attr("class","features"); 
            	});
			//this does work
			//d3.selectAll(".features").style("opacity", .1)





//Build 'Select All' Checkbox
	
	// Listen for click on toggle checkbox
d3.select("#agencyBrokerSelect-all")
  .on('click', function () {
    let that = this;
    d3.selectAll(".agencyBrokerCheck")
      .each(function () { this.checked = that.checked });
  });

d3.select("#tenantSelect-all")
  .on('click', function () {
    let that = this;
    d3.selectAll(".tenantcheck")
      .each(function () { this.checked = that.checked });
  });
	


}

		

