function getDatesAndAll(callback) {
	console.log("cat");
	console.log("Sending request all");
	$.ajax({
		type:"POST",
		url:"/lockbox/node",
		data: JSON.stringify({
			'function': "raw",
			'college':"Macalester College",
			'startDate': "2015-08-01",
			'endDate' : "2015-09-31"
		}), 
		dataType: "json",
		success : function(data) { getDatesAndAllSuccess(data, callback); }
	});
}

function getDatesAndAllSuccess(data, callback) {
	console.log(data);
	if(!(typeof(data) === "object" || typeof(data) === "Object")) {
		data = JSON.parse(data);
	}
	transformation = transformToArray2(data);
	console.log(transformation);
	callback(transformation['dates'], transformation['hours']);
}

function transformToArray2(data) {
	var dates = [];
	var sleptamount = [];
	for(var i=0; i<data.rows.length; i = i + 1) {
		dates.push(data.rows[i]['date_before_bed'].split('T')[0]);
		
		bedtime = data.rows[i]['bedtime'];
		waketime = data.rows[i]['waketime'];
		var slepttime = getTimeSlept(bedtime, waketime);
		
		sleptamount.push(hourFromTimeString(slepttime) +  (minutesFromTimeString(slepttime) / 60));
	}
	return {'dates':dates,'hours':sleptamount};
}


function generateChart() {
	console.log("DOG");
	getDatesAndAll(generateChartCallback);
}
function generateChartCallback(dates, hours) {
	console.log(hours);
	c3.generate({
		size: {
			height: 500,
			width: 1200
		},
		bindto: '#chart',
		data: {
			columns: [
				hours
			],
			type: 'scatter'
		},
		axis: {
			x: {
				type: 'category',
				categories: dates,
				tick: {
					format: function (x) { return ''; }
				}
			}
		},
		legend: {
			show: false
		}
	});
}

generateChart();


function dateTimeToDateString(dateTime) {
	return "" + dateTime.getFullYear() + "-" + (dateTime.getMonth() + 1) + "-" + dateTime.getDate();
}
function dateTimeToTimeString(dateTime) {
	return "" + dateTime.getHours() + ":" + dateTime.getMinutes() + ":" + dateTime.getSeconds();
}

function dateTimeToMinutes(dateTime) {
	return dateTime.getHours() * 60 + dateTime.getMinutes();
}

function timeStringToMinutes(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[0]) * 60 +  parseInt(tokens[1]);
}

function hourFromTimeString(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[0]);
}

function minutesFromTimeString(timeString) {
	var tokens = timeString.split(':');
	return parseInt(tokens[1]);
}

function createTimeString(hours, minutes, seconds) {
	return "" + hours + ":" + minutes + ":" + seconds;
}

//Just get the hours and minutes for SQL query
function getTimeSlept(bedtime, waketime) {
	var bedMinutes = timeStringToMinutes(bedtime);
	if(hourFromTimeString(bedtime) < 13)
		bedMinutes += 1440;
		
	var wakeMinutes = timeStringToMinutes(waketime) + 1440;

	var sleptHoursDecimal = (wakeMinutes - bedMinutes) / 60;
	var sleptHours = Math.floor(sleptHoursDecimal);
	var sleptMinutes = (sleptHoursDecimal - sleptHours) * 60;
	return createTimeString(sleptHours, sleptMinutes, 0);
}