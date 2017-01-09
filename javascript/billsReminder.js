/*
*	Author	: Nana Baah
*   Project : Rent and Energy Reminder
*   Date    : 7-Nov-2016
*/

var RentController = {
	list : [],
	getDate : function() {
		return new Date();
	},
	idealPaymentDate : function (date, day, nextMonth) {
		date = date || this.getDate();
		return new Date(date.getFullYear(), date.getMonth() + nextMonth, day);
	},
	monthlyPayment : function() {
		var lastDay = 0;
		var eachDate = this.idealPaymentDate.bind(this, this.getDate(), lastDay);

		for (let month = 0; month < 12; month++) {
			this.list.push(this.validatePaymentDate(eachDate, month + 1));
		}
	},
	validatePaymentDate : function (validDate, month, firstDay, secondDay) {  
		var sunday = firstDay || -2;
		var saturday = secondDay || -1;
		var actualDay = validDate(month).getDay(); 
		var actualDate = validDate(month).getDate();

		if(actualDay === 0) {
			return actualDate + sunday;
		} else if (actualDay === 6) {
			return actualDate + saturday;
		} else {
			return actualDate;
		}
		return 0;
	}
};

// Link 'EnergyController' to delegate to 'RentController'
var EnergyController = Object.create(RentController);

EnergyController.list = [];
EnergyController.monthlyPayment = function() {
	var tenthDay = 10;
	var eachDate = this.idealPaymentDate.bind(this, this.getDate(), tenthDay);

	for (let month = 0; month < 12; month++) {
		this.list.push(this.validatePaymentDate(eachDate, month, 2, 3));
	}
}

var prepareCSV = (function () {
	var data = [];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	RentController.monthlyPayment();
	EnergyController.monthlyPayment();

	for(let i = 0; i < 12; i++) {
		var currentMonth = (new Date().getMonth() + i)  % 12;
		data.push({ 
			"Month" : months[currentMonth], 
			"Pay Rent" : RentController.list[i], 
			"Pay Energy" : EnergyController.list[i]
		});
	}

	var csvData = new Array();
	csvData.push('"Month","Pay Rent","Pay Energy"');
	data.forEach(function(item, index, array) {
	  csvData.push('"' + item.Month + '","' + item["Pay Rent"] + "th"  + '","' + item["Pay Energy"] + "th" + '"');
	});

	// download stuff
	var fileName = "data.csv";
	var buffer = csvData.join("\n");
	var blob = new Blob([buffer], {
	  "type": "text/csv;charset=utf8;"			
	});
	var link = document.createElement("a");

    if(link.download !== undefined) { 
		// Browsers that support HTML5 download attribute
		link.setAttribute("href", window.URL.createObjectURL(blob));
		link.setAttribute("download", fileName);
	}
	else {
		// it needs to implement server side export
		link.setAttribute("href", "http://www.example.com/export");
	}
	link.innerHTML = "Export to CSV";
	document.body.appendChild(link);
})();

