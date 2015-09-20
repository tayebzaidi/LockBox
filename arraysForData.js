function getDatesAndAverageHoursArrays(callback) {
	console.log("Sending request");
	$.ajax({
		type: "POST",
		url: "/lockbox/node",
		data: JSON.stringify({'function': 'averageSleep',
			'college': "Macalester College",
			'startDate': "2014-01-01",
			'endDate': "2014-01-07"
		}),
		dataType: "json",
		success: function(data) { getDatesAndAverageHoursArraysSuccess(data, type); }
	});
}
function getDatesAndAverageHoursArraysSuccess(data, callback) {
	if(!(typeof(data) === "object" || typeof(data) === "Object")) {
		data = JSON.parse(data);
	}
	transformation = transformToArray(data);
	callback(transformation[0], transformation[1]);
}
function transformToArray(data) {
	var dates = [];
	var averageHours = [];
	for(var i=0; i<data.rows.length; i = i + 1) {
		dates.push(data.rows[i]['date_before_bed'].split('T')[0]);
		var timeSplit = data.rows[i]['average_sleep'].split(':');
		averageHours.push(parseInt(timeSplit[0]) + parseInt(timeSplit(1)) / 60);
	}
	return {'dates':dates,'averageHours':averageHours};
}