var college;
var waketime;
var bedtime;
var date = new Date();
var dataPoint; 
var dataPoints = [];

function collectSleepData(college){
	document.getElementById("firstSlide").style.left = "-500px";
	$('.sleepEntry').animate({
		left: '0px'
	}, 200);
	$('#sleepButton').click(function(){
		bedtime = document.getElementById("bedtime").value;
		waketime = document.getElementById("waketime").value;
		if(bedtime && waketime){
			date.setTime(date.getTime() - 24 * 60 * 60 * 1000); //Subtracting one day's worth of milliseconds. 
			var day = date.getDate();
			var month = date.getMonth();
			var year = date.getFullYear();
			if(day < 10){
				day = '0' + day;
			}
			if(month < 10){
				month = '0' + month;
			}
			date = year + ':' + month + ':' + day;
			dataPoint = {
				'college' : college, 
				'bedtime' : bedtime, 
				'waketime' : waketime,
				'date' : date
			}
			sendToServer(college, bedtime, waketime, date);
			dataPoints.push(dataPoint);
			chrome.storage.sync.set({'dataPoints' : dataPoints}, function(){
				$('.sleepEntry').animate({
					top: '-250px'
				}, 200);
				$('.thanks').animate({
					top: '0px'
				}, 200);
				$('#outsideLink').click(function(){
					chrome.storage.sync.clear(function(){
						console.log("Wipe complete.");
					});
				});
			});	
		}
	});	
}

function sendToServer(college, bedtime, waketime, date){
	$.ajax({
		type: "POST",
		url: "http://172.27.30.126/node/insert",
		data: JSON.stringify({
			"college" : college,
			"bedtime" : bedtime, 
			"waketime" : waketime, 
			"date" : date
		}),
		dataType: "json"
	});
}

$(document).ready(function(){
	chrome.storage.sync.get(function(items){
		if(items['college']){
			document.getElementById('welcomeMessage').innerHTML = 'Welcome back!';
			collectSleepData(items['college']);
		}
		else{
			$('#collegeButton').click(function(){
				college = document.getElementById("selectCollege").value;
				if(college){
					chrome.storage.sync.set({'college': college}, function(){
						document.getElementById('welcomeMessage').innerHTML = 'Welcome!';
						$('.collegeEntry').animate({
							left: '-500px'
						}, 200);
						collectSleepData(college);
					});
				}	
			});
		}
	});
})





