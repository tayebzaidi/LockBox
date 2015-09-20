var date = new Date();
var notificationOptions = {
	type: "basic", 
	title: "Post Reminder", 
	message: "You haven't submitted your Sleepbox info for today yet.",
	iconUrl: "notification.png"
}

chrome.storage.sync.get(function(items){
	var tempArray = items['dataPoints'];
	var lastPost = tempArray[length];
	lastPost = lastPost['date'];
	var lastDate = lastPost.substring(lastPost[length-2], lastPost[length]);
	if(lastDate != date.getDate()){
		chrome.notifications.create(notificationOptions);
	}
	else{
		chrome.notifications.clear();
	}
})

