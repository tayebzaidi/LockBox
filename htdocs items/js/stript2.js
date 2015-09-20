function getDatesAndAll(callback) {
	console.log("Sending request all");
	$.ajax({
		type:"POST",
		url:"/lockbox/node",
		data: JSON.stringify({
			'function': "raw",
			'startDate': "2015-08-01",
			'endDate' : "2015-09-31"
		}), 
		dataType: "json",
		success : function(data) { getDatesAndAllSuccess(data, callback); }
	});
}

function getDatesAndAllSuccess(data, callback) {
	if(!(typeof(data) === "object" || typeof(data) === "Object")) {
		data = JSON.parse(data);
	}
	transformation = transformToArray2(data);
	console.log(transformation);
	callback(transformation['dates'], transformation['sleptamount']);
}

function transformToArray2(data) {
	var dates = [];
	var sleptamount = [];
	for(var i=0; i<data.rows.length; i = i + 1) {
		dates.push(data.rows[i]['date_before_bed'].split('T')[0]);
		
		bedtime = data.rows[i]['bedtime'];
		waketime = data.rows[i]['waketime'];
		slepttime = getTimeSlept(bedtime, waketime);
		
		sleptamount.push(hourFromTimeString(slepttime) +  timeStringToMinutes(sleptTime) / 60);
	}
	return {'dates':dates,'sleptamount':bedtimes};
}


function generateChart() {
	getDatesAndAverageHoursArrays(generateChartCallback);
}
function generateChartCallback(dates, hours) {
	c3.generate({
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
				categories: dates
			}
		},
		legend: {
			show: false
		}
	});
}




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