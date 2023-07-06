document.getElementById("location").style.display="none";
document.getElementById("coreregform").style.display="none";
document.getElementById("seasonalregform").style.display="none";
document.getElementById("seasonalregformwarn").style.display="none";
document.getElementById("trainingmodules").style.display="none";
document.getElementById("adminwarning").style.display="none";
document.getElementById("admin").style.display="none";
document.getElementById("donorregform").style.display="none";
document.getElementById("familyregform").style.display="none";
document.getElementById("donortrainingmodules").style.display="none";
document.getElementById("familytrainingmodules").style.display="none";
document.getElementById("seasonaltrainingmodules").style.display="none";
document.getElementById("corequiz").style.display="none";
document.getElementById("seasonalquiz").style.display="none";
document.getElementById("donorquiz").style.display="none";
document.getElementById("familyquiz").style.display="none";
document.getElementById("submitted").style.display="none";

window.addEventListener("load", async function(event) {
	//get list of centres
	try{
		let response = await fetch("./api/centres/list/",
			{
				method: "GET",
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;

			for(let i = 0; i < bodyJSON.data.length; i++){
				var data = dataJSON[i];
				//display each centre on a button
				document.getElementById("centres").innerHTML += "<a class=\"list-group-item list-group-item-action\" id=\"list-home-list\" data-toggle=\"list\" onclick=\"centrelocation("+data.id+");\"  role=\"tab\" aria-controls=\"home\">"+data.name+"</a>";
			}
		} else {
			throw new Error("Problem getting centres"+ response.code);

		}

	} catch (error) {
		document.getElementById("centres").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get centres.</div>";
	}
});

//functions for validation
function invalid(element){
	document.getElementById(element).style.outline = "2px solid #ff0000";
}

function reset(ids){
	for(var i = 0; i < ids.length; i++){
		document.getElementById(ids[i]).style.outline = "0px solid #ff0000";
	}

}
function checkTextboxes(element){
	var textVal= document.getElementById(element).value; // for textboxes
	var valid = true;
	if(textVal == ""){
		invalid(element);
		valid = false;
	}
	return valid;
}

function checkCheckboxes(){
	var boxes = [];
	var valid = true;
	for(var i = 1; i < 4; i++){
		boxes[i] = document.getElementById("check"+i);
		if (!boxes[i].checked){
			invalid("check"+i);
			valid = false;
		}
	}
	return valid;
}

function checkDriveBoxes(){
	var valid = true;
	var drive = document.getElementById("drivinglicense").checked;
	var vehicle = document.getElementById("vehicle").checked;
	if (vehicle && !drive){
		invalid("drivinglicense");
		invalid("vehicle");
		valid = false;
	}
	return valid;
}

//function called when user selects user type
let formtype = "core";
function volunteertype(type){
	if (type == "seasonal"){
		formtype = "seasonal";
	}
	if (type == "Donor"){
		formtype = "donor";
	}
	if (type == "Family"){
		formtype = "family";
	}
	if (type == "core"){
		formtype = "core";
	}
}

//dynamically update seasonal dates
async function centrelocation(id){
	window.centreId = id;
}
window.seasonaldates = 0;

async function getdates(){
	let centreId = window.centreId;
	document.getElementById("interested").innerHTML = "";
	//GET list of centres
	try{
		let response = await fetch("./api/centres/date/list/"+centreId+"/",
			{
				method: "GET",
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			if(bodyJSON.data.length == 0){
				document.getElementById("seasonalregformwarn").style.display="block";
				document.getElementById("seasonalregform2").style.display="none";
			} else {
				document.getElementById("seasonalregformwarn").style.display="none";
				document.getElementById("seasonalregform2").style.display="block";
				for(let i = 0; i < bodyJSON.data.length; i++){
					var data = dataJSON[i];
					window.seasonaldates += 1;
					document.getElementById("interested").innerHTML += "<div class=\"form-check\"><input class=\"form-check-input\" type=\"checkbox\" value=\"\" id=\"interested" +i+ "\"\"><label class=\"form-check-label\" id='interested" +i+ "id' for=\"defaultCheck1\">"+data.id+" - "+data.date+" - "+data.description+"</label></div><p></p>";
				}
			}
		} else {
			throw new Error("Problem getting dates"+ response.code);

		}

	} catch (error) {
		alert("Unable to get dates for this centre.");
		document.getElementById("seasonalregformwarn").style.display="block";
		document.getElementById("seasonalregform2").style.display="none";
	}
}


async function submitcore(){ // Function to submit the core form

	var check = true;
	var inputBoxes = ["fname", "lname", "address","city","postcode","number","email","occupation","nokname","nokcontact", "skills","previouswork","roles","whyvolunteer", "DOB"];
	var everythingelse = ["check1", "check2", "check3", "drivinglicense","vehicle"];

	reset(inputBoxes.concat(everythingelse));
	for(var i = 0; i < inputBoxes.length; i++){
		check *= checkTextboxes(inputBoxes[i]);
	}
	check *= checkCheckboxes();
	check *= checkDriveBoxes();
	if (check) {
		let data = {
			"fname": document.getElementById("fname").value,
			"lname":document.getElementById("lname").value,
			"email":document.getElementById("email").value,
			"phoneNo":document.getElementById("number").value,
			"address":document.getElementById("address").value,
			"city":document.getElementById("city").value,
			"postcode":document.getElementById("postcode").value,
			"DOB":document.getElementById("DOB").value,
			"kinName":document.getElementById("nokname").value,
			"kinPhone":document.getElementById("nokcontact").value,
			"isCore": true,
			"centreId":window.centreId,
			"unstructuredData":JSON.stringify({
				"Occupation": document.getElementById("occupation").value,
				"Skills": document.getElementById("skills").value,
				"Previous Work": document.getElementById("previouswork").value,
				"Driving Licence": document.getElementById("drivinglicense").checked,
				"Use Vehicle": document.getElementById("vehicle").checked,
				"Preferred Roles": document.getElementById("roles").value,
				"Why Volunteer": document.getElementById("whyvolunteer").value
			})
		};

		//add user to db

		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/users/create/full",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem adding users "+ response.data);
			}
		} catch (error) {
			console.log(error);
			alert("Unable to add data. Please make sure your data is correct and try again later.");
		}

		//assign user to training module

		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/enroll/Core",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem assigning users "+ response.data);
			}else{
				document.getElementById("coreregform").style.display="none";
				document.getElementById("trainingmodules").style.display="block";
			}
		} catch (error) {
			console.log(error);
			alert("Unable to assign user. Please try again later");
		}

		//get training module id
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/list",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem getting modules "+ response.data);
			}else{
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				let trainingid = (dataJSON.trainingId);

				//get training modules
				try{
					let token = await auth0.getTokenSilently();
					let response = await fetch("/api/modules/module/"+trainingid+"/",
						{
							method: "GET",
							headers: {
								"Content-Type":"application/json",
								"Authorization": `Bearer ${token}`
							}
						});
					if(!response.ok){
						throw new Error("Problem getting module content "+ response.data);
					}else{
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						let dataJSON = bodyJSON.data;
						let content = JSON.parse(dataJSON.content);
						for(let i = 0; i < content.length; i++){
							let data = (content[i]);
							if (data.type == "header"){
								document.getElementById("coreheader").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
							else if (data.type == "video"){
								document.getElementById("corevideo").innerHTML += "<div class=\"embed-responsive embed-responsive-16by9\"><iframe style = \"border: 1rem solid #D6D6D6;\"class=\"embed-responsive-item\" src=\""+data.data+"\" allowfullscreen class=\"rounded-0\"></iframe></span></div>";
							}
							else if (data.type == "text"){
								document.getElementById("coretext").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
						}

					}
				} catch (error) {
					console.log(error);
					alert("Unable to get training modules. Please try again later");
				}

			}
		} catch (error) {
			console.log(error);
			alert("Unable to get training modules. Please try again later");
		}
	}
	else {
		alert("Please fill all required fields.");
	}
}

//submit seasonal form
async function submitseasonal(){
	var check = true;
	var inputBoxes = ["s-fname","s-lname","s-address","s-city","s-postcode","s-number","s-email"];
	reset(inputBoxes);


	for(var i = 0; i < inputBoxes.length; i++){
		check *= checkTextboxes(inputBoxes[i]);
	}
	if (check) {
		let data = {
			"fname": document.getElementById("s-fname").value,
			"lname":document.getElementById("s-lname").value,
			"email":document.getElementById("s-email").value,
			"phoneNo":document.getElementById("s-number").value,
			"address":document.getElementById("s-address").value,
			"city":document.getElementById("s-city").value,
			"postcode":document.getElementById("s-postcode").value,
			"isCore": false,
			"centreId":window.centreId,
			"unstructuredData":JSON.stringify({
				"DBS": document.getElementById("DBS").checked,
				"NOTRetainData": document.getElementById("retain_data").checked,
			})
		};

		//add user to db
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/users/create/full",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem adding users "+ response.data);
			}
		} catch (error) {
			console.log(error);
			alert("Unable to add data. Please make sure your data is correct and try again later.");
		}

		for(var j = 0; j < window.seasonaldates; j++){
			if (document.getElementById("interested"+j).checked == true){
				//add committed dates
				try{
					let dateId = (document.getElementById("interested"+j+"id").textContent).split(" ")[0];
					let token = await auth0.getTokenSilently();
					let response = await fetch("./api/users/date/commit",
						{
							method: "POST",
							headers: {
								"Content-Type":"application/json",
								"Authorization": `Bearer ${token}`
							},
							body: JSON.stringify({"dateId": dateId}),
						});
					if(!response.ok){
						throw new Error("Problem adding date "+ response.data);
					}
				} catch (error) {
					console.log(error);
					alert("Unable to commit to date. Please try again later");
				}
			}
		}

		//assign user to training module

		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/enroll/Seasonal",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem assigning users "+ response.data);
			}else{
				document.getElementById("seasonalregform").style.display="none";
				document.getElementById("seasonaltrainingmodules").style.display="block";
			}
		} catch (error) {
			console.log(error);
			alert("Unable to assign user. Please try again later");
		}


		//get training module id
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/list",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem getting modules "+ response.data);
			}else{
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				let trainingid = (dataJSON.trainingId);

				//get training modules
				try{
					let token = await auth0.getTokenSilently();
					let response = await fetch("/api/modules/module/"+trainingid+"/",
						{
							method: "GET",
							headers: {
								"Content-Type":"application/json",
								"Authorization": `Bearer ${token}`
							}
						});
					if(!response.ok){
						throw new Error("Problem getting module content "+ response.data);
					}else{
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						let dataJSON = bodyJSON.data;
						let content = JSON.parse(dataJSON.content);
						for(let i = 0; i < content.length; i++){
							let data = (content[i]);
							if (data.type == "header"){
								document.getElementById("seasonalheader").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
							else if (data.type == "video"){
								document.getElementById("seasonalvideo").innerHTML += "<div class=\"embed-responsive embed-responsive-16by9\"><iframe style = \"border: 1rem solid #D6D6D6;\"class=\"embed-responsive-item\" src=\""+data.data+"\" allowfullscreen class=\"rounded-0\"></iframe></span></div>";
							}
							else if (data.type == "text"){
								document.getElementById("seasonaltext").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
						}

					}
				} catch (error) {
					console.log(error);
					alert("Unable to get training modules. Please try again later");
				}

			}
		} catch (error) {
			console.log(error);
			alert("Unable to get training modules. Please try again later");
		}
	} else {
		alert("Please fill all required fields.");
	}
}

//function to submit donor form
async function submitdonor(){

	var check = true;
	var inputBoxes = ["d-fname","d-lname","d-address","d-city","d-postcode","d-number","d-email"];

	//validation goes here
	for(var i = 0; i < inputBoxes.length; i++){
		check *= checkTextboxes(inputBoxes[i]);
	}

	if(check){


		let data = {
			"fname": document.getElementById("d-fname").value,
			"lname":document.getElementById("d-lname").value,
			"email":document.getElementById("d-email").value,
			"phoneNo":document.getElementById("d-number").value,
			"address":document.getElementById("d-address").value,
			"city":document.getElementById("d-city").value,
			"postcode":document.getElementById("d-postcode").value,
			"isCore": false,
			"centreId":window.centreId,
			"unstructuredData":JSON.stringify({
				"Type": "Donor",
			})
		};

		//add user to db
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/users/create/full",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem adding users "+ response.data);
			}
		} catch (error) {
			console.log(error);
			alert("Unable to add data. Please make sure your data is correct and try again later.");
		}

		//assign user to training module

		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/enroll/Donor",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem assigning users "+ response.data);
			}else{
				document.getElementById("donorregform").style.display="none";
				document.getElementById("donortrainingmodules").style.display="block";
			}
		} catch (error) {
			console.log(error);
			alert("Unable to assign user. Please try again later");
		}



		//get training module id
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/list",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem getting modules "+ response.data);
			}else{
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				let trainingid = (dataJSON.trainingId);

				//get training modules
				try{
					let token = await auth0.getTokenSilently();
					let response = await fetch("/api/modules/module/"+trainingid+"/",
						{
							method: "GET",
							headers: {
								"Content-Type":"application/json",
								"Authorization": `Bearer ${token}`
							}
						});
					if(!response.ok){
						throw new Error("Problem getting module content "+ response.data);
					}else{
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						let dataJSON = bodyJSON.data;
						let content = JSON.parse(dataJSON.content);
						for(let i = 0; i < content.length; i++){
							let data = (content[i]);
							if (data.type == "header"){
								document.getElementById("donorheader").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
							else if (data.type == "video"){
								document.getElementById("donorvideo").innerHTML += "<div class=\"embed-responsive embed-responsive-16by9\"><iframe style = \"border: 1rem solid #D6D6D6;\"class=\"embed-responsive-item\" src=\""+data.data+"\" allowfullscreen class=\"rounded-0\"></iframe></span></div>";
							}
							else if (data.type == "text"){
								document.getElementById("donortext").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
						}

					}
				} catch (error) {
					console.log(error);
					alert("Unable to get training modules. Please try again later");
				}

			}
		} catch (error) {
			console.log(error);
			alert("Unable to get training modules. Please try again later");
		}
	}else{
		alert("Please fill all required fields.");
	}
}


//function to submit familt form
async function submitfamily(){

	var check = true;
	var inputBoxes = ["f-fname","f-lname","f-address","f-city","f-postcode","f-number","f-email"];

	//validation
	for(var i = 0; i < inputBoxes.length; i++){
		check *= checkTextboxes(inputBoxes[i]);
	}
	if(check){

		let data = {
			"fname": document.getElementById("f-fname").value,
			"lname":document.getElementById("f-lname").value,
			"email":document.getElementById("f-email").value,
			"phoneNo":document.getElementById("f-number").value,
			"address":document.getElementById("f-address").value,
			"city":document.getElementById("f-city").value,
			"postcode":document.getElementById("f-postcode").value,
			"isCore": false,
			"centreId":window.centreId,
			"unstructuredData":JSON.stringify({
				"Type": "Family",
			})
		};

		//add user to db
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/users/create/full",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem adding users "+ response.data);
			}
		} catch (error) {
			console.log(error);
			alert("Unable to add data. Please make sure your data is correct and try again later.");
		}

		//assign user to training module

		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/enroll/Family",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem assigning users "+ response.data);
			}else{
				document.getElementById("familyregform").style.display="none";
				document.getElementById("familytrainingmodules").style.display="block";
			}
		} catch (error) {
			console.log(error);
			alert("Unable to assign user. Please try again later");
		}


		//get training module id
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/courses/list",
				{
					method: "GET",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem getting modules "+ response.data);
			}else{
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				let trainingid = (dataJSON.trainingId);

				//get training modules
				try{
					let token = await auth0.getTokenSilently();
					let response = await fetch("/api/modules/module/"+trainingid+"/",
						{
							method: "GET",
							headers: {
								"Content-Type":"application/json",
								"Authorization": `Bearer ${token}`
							}
						});
					if(!response.ok){
						throw new Error("Problem getting module content "+ response.data);
					}else{
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						let dataJSON = bodyJSON.data;
						let content = JSON.parse(dataJSON.content);
						for(let i = 0; i < content.length; i++){
							let data = (content[i]);
							if (data.type == "header"){
								document.getElementById("familyheader").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
							else if (data.type == "video"){
								document.getElementById("familyvideo").innerHTML += "<div class=\"embed-responsive embed-responsive-16by9\"><iframe style = \"border: 1rem solid #D6D6D6;\"class=\"embed-responsive-item\" src=\""+data.data+"\" allowfullscreen class=\"rounded-0\"></iframe></span></div>";
							}
							else if (data.type == "text"){
								document.getElementById("familytext").innerHTML += "<p align = center><i>"+data.data+"</i></p>";
							}
						}

					}
				} catch (error) {
					console.log(error);
					alert("Unable to get training modules. Please try again later");
				}

			}
		} catch (error) {
			console.log(error);
			alert("Unable to get training modules. Please try again later");
		}
	}else{
		alert("Please fill all required fields.");
	}
}

//show relevant form
function locationnext(){
	if (window.centreId == undefined){
		alert("Please choose a location.");
	} else {
		document.getElementById("location").style.display="none";

		if (formtype == "core"){
			let form = document.getElementById("coreregform");
			form.style.display="block";
			//Autofill
			auth0.getUser()
				.then(user => {
					form.querySelector("#fname").value = user.given_name;
					form.querySelector("#lname").value = user.family_name;
					form.querySelector("#email").value = user.email;
				});
		}
		else if (formtype == "seasonal"){
			document.getElementById("seasonalregform").style.display="block";
			getdates();
		}


		else if (formtype == "family"){
			document.getElementById("familyregform").style.display="block";
		}
		else if (formtype == "donor"){
			document.getElementById("donorregform").style.display="block";
		}

	}
}


function backtoselection(){
	var loc = document.getElementById("location");
	loc.style.display="block";
	document.getElementById("coreregform").style.display="none";
	document.getElementById("seasonalregform").style.display="none";
	document.getElementById("donorregform").style.display="none";
	document.getElementById("familyregform").style.display="none";
}

function donorquiz(){
	document.getElementById("donortrainingmodules").style.display="none";
	document.getElementById("donorquiz").style.display="block";
}

function familyquiz(){
	document.getElementById("familytrainingmodules").style.display="none";
	document.getElementById("familyquiz").style.display="block";
}

function corequiz(){
	document.getElementById("trainingmodules").style.display="none";
	document.getElementById("corequiz").style.display="block";

}

function seasonalquiz(){
	document.getElementById("seasonaltrainingmodules").style.display="none";
	document.getElementById("seasonalquiz").style.display="block";
}

function backtodonortraining(){
	document.getElementById("donortrainingmodules").style.display="block";
	document.getElementById("donorquiz").style.display="none";
}

function backtofamilytraining(){
	document.getElementById("familytrainingmodules").style.display="block";
	document.getElementById("familyquiz").style.display="none";
}

function backtoseasonaltraining(){
	document.getElementById("seasonaltrainingmodules").style.display="block";
	document.getElementById("seasonalquiz").style.display="none";
}

function backtocoretraining(){
	document.getElementById("trainingmodules").style.display="block";
	document.getElementById("corequiz").style.display="none";
}

function finalpage(){
	document.getElementById("corequiz").style.display="none";
	document.getElementById("seasonalquiz").style.display="none";
	document.getElementById("donorquiz").style.display="none";
	document.getElementById("familyquiz").style.display="none";
	document.getElementById("submitted").style.display="block";
	setScore();
}

//set user view and remove committed dates

async function viewseasonaldates(){
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/users/date/list",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			document.getElementById("editUserDetails").innerHTML = "<p></p>";
			let data= bodyJSON.data;
			if (data.length == 0){
				document.getElementById("editUserDetails").innerHTML += "<p>You have not signed up for any seasonal dates.</p>";
			} else {
				for (let i = 0; i < data.length; i++){
					let tempdata = data[i];
					document.getElementById("editUserDetails").innerHTML += "<p>Select 'Uncommit' if you can no longer make a date.</p>";
					document.getElementById("editUserDetails").innerHTML += "<li>"+tempdata.date+" - "+tempdata.description+"</li>";
					document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='removedatepersonal("+tempdata.dateId+")'  id=\"remove"+"\">Uncommit</button>";
					document.getElementById("editUserDetails").innerHTML += "<p></p>";
				}
			}

		}

		else {
			throw new Error("Problem getting user info"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to get user information.</div>";
	}
}
//let user edit their details
async function usereditdetails(){
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/users/info",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let data= bodyJSON.data;
			document.getElementById("editUserDetails").innerHTML = "<p></p>";
			document.getElementById("editUserDetails").innerHTML += "<label>First Name</label><input type='text' class='form-control' value='"+data.fName+"' id='editfName'>";
			document.getElementById("editUserDetails").innerHTML += "<label>Last Name</label><input type='text' class='form-control' value='"+data.lName+"' id='editlName'><br>";
			document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='updatenamepersonal()' >Update Name</button><br><br>";
			document.getElementById("editUserDetails").innerHTML += "<label>Email</label><input type='text' class='form-control' value='"+data.email+"' id='editemail'><br>";
			document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='updateemailpersonal()' >Update Email</button><br><br>";
			document.getElementById("editUserDetails").innerHTML += "<label>Phone Number</label><input type='text' class='form-control' value='"+data.phoneNo+"' id='editphone'><br>";
			document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='updatephonepersonal()' >Update Phone Number</button><br><br>";
			document.getElementById("editUserDetails").innerHTML += "<label>Address</label><input type='text' class='form-control' value='"+data.address+"' id='editaddress'>";
			document.getElementById("editUserDetails").innerHTML += "<label>City</label><input type='text' class='form-control' value='"+data.city+"' id='editcity'>";
			document.getElementById("editUserDetails").innerHTML += "<label>Postcode</label><input type='text' class='form-control' value='"+data.postcode+"' id='editpostcode'><br>";
			document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='updateaddresspersonal()' >Update Address</button>";
			document.getElementById("editUserDetails").innerHTML += "<p></p>";
			document.getElementById("editUserDetails").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick='removeuserpersonal()'  id=\"remove"+"\">Delete all Data</button>";
			document.getElementById("editUserDetails").innerHTML += "<p></p>";
		}

		else {
			throw new Error("Problem getting user info"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to get user information.</div>";
	}
}

async function updatenamepersonal(){
	let data = {
		"fname": document.getElementById("editfName").value,
		"lname":document.getElementById("editlName").value,
	};

	//update name
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("./api/users/update/name",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem adding users "+ response.data);
		}else{
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-success\" role=\"alert\">Successfully updated data.</div>";
		}
	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get edit information. Please try again later.</div>";
	}
}

async function updateemailpersonal(){
	let data = {
		"email": document.getElementById("editemail").value,
	};

	//update email
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("./api/users/update/email",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem adding users "+ response.data);
		}else{
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-success\" role=\"alert\">Successfully updated data.</div>";
		}
	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get edit information. Please try again later.</div>";
	}
}

async function updatephonepersonal(){
	let data = {
		"phoneNo": document.getElementById("editphone").value,
	};

	//update phone number
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("./api/users/update/phoneNo",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem adding users "+ response.data);
		}else{
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-success\" role=\"alert\">Successfully updated data.</div>";
		}
	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get edit information. Please try again later.</div>";
	}
}

async function updateaddresspersonal(){
	let data = {
		"address": document.getElementById("editaddress").value,
		"city":document.getElementById("editcity").value,
		"postcode":document.getElementById("editpostcode").value,
	};

	//update address
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("./api/users/update/address",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem adding users "+ response.data);
		}else{
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-success\" role=\"alert\">Successfully updated data.</div>";
		}
	} catch (error) {
		console.log(error);
		document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get edit information. Please try again later.</div>";
	}
}

async function removeuserpersonal(){
	var confirm = window.confirm("Are you sure you want to delete your information?");
	if (confirm == true){
		//delete users data
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("./api/user/delete",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					}
				});
			if(!response.ok){
				throw new Error("Problem adding users "+ response.data);
			}else{
				alert("Successfully Deleted User. Logging Out.");
				auth0.logout({
					returnTo: window.location.origin
				});
			}
		} catch (error) {
			console.log(error);
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get delete user. Please make sure you are not committed to any seasonal dates.</div>";
		}}
}

//user can umcommit from a date.
async function removedatepersonal(id){
	var confirm = window.confirm("Are you sure you want to uncomitt from this date?");
	if (confirm == true){
		let data = {
			"dateId": id
		};
			//delete users data
		try{
			let token = await auth0.getTokenSilently();
			let response = await fetch("/api/users/date/uncommit",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",
						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem removing date "+ response.data);
			}else{
				document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-success\" role=\"alert\">Successfully removed date.</div>";
			}
		} catch (error) {
			console.log(error);
			document.getElementById("editUserDetails").innerHTML = "<br><br><div class=\"alert alert-danger\" role=\"alert\">Unable to get remove date. Please try again later.</div>";
		}
	}
}

//QUIZ JS

function getCheckedValue(radioName) {
	var radios = document.getElementsByName(radioName); // Get radio group by-name
	for (var y = 0; y < radios.length; y++)
		if (radios[y].checked) return radios[y].value; // return the checked value
}

function coregetScore() {
	var score = 0;
	for (var i = 0; i < coretot; i++)
		if (coreanswers[i].includes(getCheckedValue("corequestion" + i))) score += 1; // increment only
	return score;
}

function corereturnScore() {
	//if they get 100% they can continue on
	if (coregetScore() == 1){
		document.getElementById("myresults").innerHTML = "Congratulations! Your score is " + coregetScore() + "/" + coretot;
		finalpage();
	}

	if (coregetScore() < 1) {
		document.getElementById("myresults").innerHTML = "You require 100% to complete the quiz. Please try again.";
	}

}

function seasonalgetScore() {
	var score = 0;
	for (var i = 0; i < seasonaltot; i++)
		if (seasonalanswers[i].includes(getCheckedValue("seasonalquestion" + i))) score += 1; // increment only
	return score;
}

function seasonalreturnScore() {
	//if they get 100% they can continue on
	if (seasonalgetScore() == 1){
		document.getElementById("s-myresults").innerHTML = "Congratulations! Your score is " + seasonalgetScore() + "/" + seasonaltot;
		finalpage();
	}

	if (seasonalgetScore() < 1) {
		document.getElementById("s-myresults").innerHTML = "You require 100% to complete the quiz. Please try again.";
	}

}

function donorgetScore() {
	var score = 0;
	for (var i = 0; i < donortot; i++)
		if (donoranswers[i].includes(getCheckedValue("donorquestion" + i))) score += 1; // increment only
	return score;
}

function donorreturnScore() {
	//if they get 100% they can continue on
	if (donorgetScore() == 5){
		document.getElementById("d-myresults").innerHTML = "Congratulations! Your score is " + donorgetScore() + "/" + donortot;
		finalpage();
	}

	if (donorgetScore() < 5) {
		document.getElementById("d-myresults").innerHTML = "You require 100% to complete the quiz. Please try again.";
	}

}

function familygetScore() {
	var score = 0;
	for (var i = 0; i < familytot; i++)
		if (familyanswers[i].includes(getCheckedValue("familyquestion" + i))) score += 1; // increment only
	return score;
}

function familyreturnScore() {
	//if they get 100% they can continue on
	if (familygetScore() == 1){
		document.getElementById("f-myresults").innerHTML = "Congratulations! Your score is " + familygetScore() + "/" + familytot;
		finalpage();
	}

	if (familygetScore() < 1) {
		document.getElementById("f-myresults").innerHTML = "You require 100% to complete the quiz. Please try again.";
	}
}


async function setScore() {
	//get training module id
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("./api/courses/list",
			{
				method: "GET",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				}
			});
		if(!response.ok){
			throw new Error("Problem getting modules "+ response.data);
		}else{
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			let trainingid = (dataJSON.trainingId);

			//set score
			let data = {
				"moduleId": trainingid,
				"score": 100
			};

			try{
				let token = await auth0.getTokenSilently();
				let response = await fetch("/api/courses/score/set",
					{
						method: "POST",
						headers: {
							"Content-Type":"application/json",
							"Authorization": `Bearer ${token}`
						},
						body: JSON.stringify(data)
					});
				if(!response.ok){
					throw new Error("Problem adding score "+ response.data);
				}
			} catch (error) {
				console.log(error);
			}
		}
	} catch (error){
		console.log(error);
	}
}
