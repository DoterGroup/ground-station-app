// All logic and stuff
$(function(){
	var socket = io.connect('localhost:8080');

	socket.on('comm', function (data) {
		console.log(data);
	});

	socket.on('setData', function (data) {
		console.log(data);

      	var tempChartData = {
	      	labels: data.labels,
	      	datasets: [
	      	{
	          label: "Temperature",
	          fillColor: "rgba(243, 156, 18, 0.2)",
	          strokeColor: "rgba(210, 214, 222, 1)",
	          pointColor: "rgba(243, 156, 18, 1)",
	          pointStrokeColor: "#c1c7d1",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(220,220,220,1)",
	          data: data.temp
	        }
	      	]
      	};

      	var humidityChartData = {
	      	labels: data.labels2,
	      	datasets: [
	      	{
	          label: "Temperature",
	          fillColor: "rgba(0, 192, 239, 0.2)",
	          strokeColor: "rgba(0, 192, 239, 1)",
	          pointColor: "rgba(0, 192, 239, 1)",
	          pointStrokeColor: "#fff",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(151,187,205,1)",
	          data: data.humidity
	        }
	      	]
      	};

      	var pressureChartData = {
	      	labels: data.labels3,
	      	datasets: [
	      	{
	          label: "Temperature",
	          fillColor: "rgba(210, 214, 222, 1)",
	          strokeColor: "rgba(210, 214, 222, 1)",
	          pointColor: "rgba(210, 214, 222, 1)",
	          pointStrokeColor: "#c1c7d1",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(220,220,220,1)",
	          data: data.pressure
	        }
	      	]
      	};

      	var coChartData = {
	      	labels: data.labels4,
	      	datasets: [
	      	{
	          label: "CarbonMonoxide",
	          fillColor: "rgba(210, 214, 222, 1)",
	          strokeColor: "rgba(210, 214, 222, 1)",
	          pointColor: "rgba(210, 214, 222, 1)",
	          pointStrokeColor: "#c1c7d1",
	          pointHighlightFill: "#fff",
	          pointHighlightStroke: "rgba(220,220,220,1)",
	          data: data.co
	        }
	      	]
      	};

		var areaChartOptions = {
			//Boolean - If we should show the scale at all
			showScale: true,
			//Boolean - Whether grid lines are shown across the chart
			scaleShowGridLines: false,
			//String - Colour of the grid lines
			scaleGridLineColor: "rgba(0,0,0,.05)",
			//Number - Width of the grid lines
			scaleGridLineWidth: 1,
			//Boolean - Whether to show horizontal lines (except X axis)
			scaleShowHorizontalLines: true,
			//Boolean - Whether to show vertical lines (except Y axis)
			scaleShowVerticalLines: true,
			//Boolean - Whether the line is curved between points
			bezierCurve: true,
			//Number - Tension of the bezier curve between points
			bezierCurveTension: 0.3,
			//Boolean - Whether to show a dot for each point
			pointDot: false,
			//Number - Radius of each point dot in pixels
			pointDotRadius: 4,
			//Number - Pixel width of point dot stroke
			pointDotStrokeWidth: 1,
			//Number - amount extra to add to the radius to cater for hit detection outside the drawn point
			pointHitDetectionRadius: 20,
			//Boolean - Whether to show a stroke for datasets
			datasetStroke: true,
			//Number - Pixel width of dataset stroke
			datasetStrokeWidth: 2,
			//Boolean - Whether to fill the dataset with a color
			datasetFill: true,
			//String - A legend template
			legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
			//Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
			maintainAspectRatio: true,
			//Boolean - whether to make the chart responsive to window resizing
			responsive: true,

			pointDot: true,
			scaleLabel: "<%=value%>*",
			animation : false

		};


	    //--------------
	    //- AREA CHART -
	    //--------------
		var areaChartCanvas = $("#areaChart").get(0).getContext("2d");
		var areaChart = new Chart(areaChartCanvas);
		areaChart.Line(tempChartData, areaChartOptions);


	    //-------------
	    //- LINE CHART -
	    //--------------
		var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
		var lineChart = new Chart(lineChartCanvas);
		var lineChartOptions = areaChartOptions;
		lineChartOptions.datasetFill = false;
		lineChartOptions.scaleLabel = "<%=value%>%";
		lineChart.Line(humidityChartData, lineChartOptions);

		//-------------
	    //- LINE CHART -
	    //--------------
		var pressureChartCanvas = $("#pressureChart").get(0).getContext("2d");
		var pressureChart = new Chart(pressureChartCanvas);
		lineChartOptions.scaleLabel = "<%=value%>hPa";
		pressureChart.Line(pressureChartData, lineChartOptions);

		//-------------
	    //- LINE CHART -
	    //--------------
		var coChartCanvas = $("#coChart").get(0).getContext("2d");
		var coChart = new Chart(coChartCanvas);
		lineChartOptions.scaleLabel = "<%=value%>";
		coChart.Line(coChartData, lineChartOptions);


	    //----------------
	    //- Drone Status -
	    //----------------

		$("#flight_mode").html(data.mode);
		$("#drone_status").html(data.status);
		$("#drone_batt").html(data.batt + '%');
		$("#drone_altitude").html(data.alt);
		$("#drone_speed").html(data.speed);

		$("#drone_batt_progress").css( "width", data.batt + '%');

		var min_left = (data.batt * 20) / 100;

		$("#drone_batt_min").html(min_left + ' minutes left.');

		// GPS
		geo_lng = data.long;
		geo_lat = data.lat;

		var myLatLng = {lat: geo_lat, lng: geo_lng};
	  
		var newLatLng = new google.maps.LatLng(geo_lat, geo_lng);
    	marker.setPosition(newLatLng);

    	map.setCenter(marker.getPosition());
    });//-- socket on data

    $( ".set-mode" ).click(function() {
	  $.ajax({
	      type: "POST",
	      url: "/mode/" + this.dataset.id,
	      success: function(data){
	        // console.log(data);
	      },
	      error: function(data){
	        console.log('Error:');
	        console.log(data);
	      },
	      dataType: 'JSON'
	  });
	});

});

function initMap() {
	geo_lat = 34.397; //data.lat.toString();
	geo_lng = -90.644; //data.long.toString();
  var myLatLng = {lat: geo_lat, lng: geo_lng};

  map = new google.maps.Map(document.getElementById('dashboard_map'), {
    zoom: 17,
    center: myLatLng
  });

  var image = 'img/uav.png';

  marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    icon: image,
    title: 'Hello Drone!'
  });
}

var map, marker, geo_lat, geo_lng;
