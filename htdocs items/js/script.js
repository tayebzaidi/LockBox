function getDatesAndAverageHoursArrays(callback) {
	console.log("Sending request");
	$.ajax({
		type: "POST",
		url: "/lockbox/node",
		data: JSON.stringify({'function': 'averageSleep',
			'college': "Macalester College",
			'startDate': "2015-08-01",
			'endDate' : "2015-09-31"
		}),
		dataType: "json",
		success: function(data) { getDatesAndAverageHoursArraysSuccess(data, callback); }
	});
}
function getDatesAndAverageHoursArraysSuccess(data, callback) {
	if(!(typeof(data) === "object" || typeof(data) === "Object")) {
		data = JSON.parse(data);
	}
	transformation = transformToArray(data);
	console.log(transformation);
	callback(transformation['dates'], transformation['averageHours']);
}
function transformToArray(data) {
	var dates = [];
	var averageHours = [];
	for(var i=0; i<data.rows.length; i = i + 1) {
		dates.push(data.rows[i]['date_before_bed'].split('T')[0]);
		var timeSplit = data.rows[i]['average_sleep'].split(':');
		averageHours.push(parseInt(timeSplit[0]) + parseInt(timeSplit[1]) / 60);
	}
	return {'dates':dates,'averageHours':averageHours};
}

function generateChart() {
	getDatesAndAverageHoursArrays(generateChartCallback);
}
function generateChartCallback(dates, hours) {
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
			type: 'spline'
		},
		axis: {
			x: {
				type: 'category',
				categories: dates
			}
		},
		legend: {
			show: false
		},
	});
}

generateChart();