var college;
var waketime;
var bedtime;
var date = new Date();

function collectSleepData(){
	document.getElementById('welcomeMessage').innerHTML = 'Welcome back!';
	$('.sleepEntry').animate({
		left: '0px'
	}, 200);
	$('#sleepButton').click(function(){
		bedtime = document.getElementById("bedtime").value;
		waketime = document.getElementById("waketime").value;
		if(bedtime && waketime){
			var day = date.getDate();
			var month = date.getMonth() + 1;
			var year = date.getFullYear();
			if(day < 10){
				day = '0' + day;
			}
			if(month < 10){
				month = '0' + month;
			}
			date = year + ':' + month + ':' + day;
			console.log(date);
			chrome.storage.sync.set({'bedtime': bedtime, 'waketime': waketime}, function(){
				$('.sleepEntry').animate({
					top: '-250px'
				}, 200);
				$('.thanks').animate({
					top: '0px'
				}, 200);
			});	
		}
	});	
}

$(document).ready(function(){
	chrome.storage.sync.get(function(items){
		if(items['college']){
			collectSleepData();
		}
		else{
			$('#collegeButton').click(function(){
				college = document.getElementById("selectCollege").innerHTML;
				if(college){
					chrome.storage.sync.set({'college': college}, function(){
						document.getElementById('welcomeMessage').value = 'Welcome!';
						$('.collegeEntry').animate({
							left: '-500px'
						}, 200);
						collectSleepData();
					});
				}	
			});
		}
	});
})





