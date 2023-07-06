// ====== Admin =================================================================================
async function loadadmin(){
	document.getElementById("adminwarning").style.display="none";
	document.getElementById("admin").style.display="block";
	checkadmin();
	getmanagercentres();
	refresh();
}
window.isAdmin = false;
window.centrename = "";
async function checkadmin(){
	//Check is user is admin
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/admins/check",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			if (bodyJSON.data == true){
				window.isAdmin = true;
				document.getElementById("super").style.display="block";
				listmanagers();
				getcentres();
			} else {
				document.getElementById("super").style.display="none";
			}
		} else {
			throw new Error("Problem checking permissions"+ response.code);
		}
	} catch (error) {
		document.getElementById("super").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to check permissions. Some options might be unavailable.</div>";
	}
}

async function listmanagers(){
	window.idarray = [];
	document.getElementById("editManagers").innerHTML = "";
	//Find managers for each centre
	try{
		let token = await auth0.getTokenSilently();
		//list all centres
		let response = await fetch("/api/centres/list",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			for(let i = 0; i < bodyJSON.data.length; i++){
				var data = dataJSON[i];
				document.getElementById("editManagers").innerHTML += "<p><b>"+data.name+"</p>";
				//Find managers for each centre
				try{
					let response = await fetch("/api/mangers/list/mangers/"+data.id+"/",
						{
							method: "GET",
							headers: {
								"Authorization": `Bearer ${token}`
							},
						});
					if(response.ok){
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						let dataJSON = bodyJSON.data;
						if (bodyJSON.data.length == 0){
							document.getElementById("editManagers").innerHTML += "<li>This centre has no managers</li>";
							document.getElementById("editManagers").innerHTML += "<p></p>";
						}
						else{
							let options = "";
							for(let i = 0; i < bodyJSON.data.length; i++){
								var data2 = dataJSON[i];
								options += "<option>"+(i+1)+" - "+data2.fName+" "+data2.lName+"</option>";
								window.idarray.push([data2.userId, data.id]);
							}
							document.getElementById("editManagers").innerHTML += "<select id = 'remove"+data.id+"'class=\"form-control\">"+options+"</select>";
							document.getElementById("editManagers").innerHTML += "<p></p>";
							document.getElementById("editManagers").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick=\"deletemanager("+data.id+")\" id=\"removebutton"+data.id+"\">Remove</button>";

							document.getElementById("editManagers").innerHTML += "<p></p>";
						}
					} else {
						throw new Error("Unable to get managers"+ response.code);
					}
				} catch (error) {
					document.getElementById("editManagers").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to retrieve managers.</div>";
				}
			}
		} else {
			throw new Error("Unable to find centres"+ response.code);
		}
	} catch (error) {
		document.getElementById("editManagers").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to retrieve managers.</div>";
	}
}

async function editUserSearch(){

	//search for user Details
	try{
		let token = await auth0.getTokenSilently();
		let name = document.getElementById("UserSearchInput").value;
		let response = await fetch("/api/admins/user/search/"+name+"/",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			document.getElementById("editUsersSearch").innerHTML = "<p></p>";
			if (bodyJSON.data.length == 0){
				document.getElementById("editUsersSearch").innerHTML = "<p>No Results Found</p>";
			}
			for(let i = 0; i < bodyJSON.data.length; i++){
				let data = dataJSON[i];
				//check if user is manager
				window.isManager = false;
				try{
					let response = await fetch("/api/managers/list/centres/"+data.id,
						{
							method: "GET",
							headers: {
								"Authorization": `Bearer ${token}`
							},
						});
					if(response.ok){
						let body = await response.text();
						let bodyJSON = JSON.parse(body);
						if (bodyJSON.data.length > 0){
							window.isManager = true;
						}
					} else {
						throw new Error("Unable to check is user is manager"+ response.code);
					}
				} catch (error) {
					document.getElementById("editUsersSearch").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to check if user is manager.</div>";
				}
				let unstructured = JSON.parse(data.unstructured);
				if (window.isManager == true){
					document.getElementById("editUsersSearch").innerHTML += "<p><b>"+data.fName + " " + data.lName+ " - Manager" +"</p>";
				} else {
					document.getElementById("editUsersSearch").innerHTML += "<p><b>"+data.fName + " " + data.lName+"</p>";
				}
				document.getElementById("editUsersSearch").innerHTML += "<li>Email: " + data.email+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>Phone Number: " + data.phoneNo+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>Address: " + data.address+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>City: " + data.city+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>Postcode: " + data.postcode+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>DOB: " + data.DOB+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>Next of Kin: " + data.kinName+"</li>";
				document.getElementById("editUsersSearch").innerHTML += "<li>Next of Kin Contact Details: " + data.kinPhoneNo+"</li>";
				for (let i in unstructured){
					document.getElementById("editUsersSearch").innerHTML += "<li>"+i+": " + unstructured[i]+"</li>";
				}

				document.getElementById("editUsersSearch").innerHTML += "<p></p>";
				if (window.isAdmin == true){
					document.getElementById("editUsersSearch").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" style=\"margin:5px;\"  onclick=removeuser('"+data.id+"')  id=\"remove"+"\">Remove "+data.email+"</button>";
					document.getElementById("editUsersSearch").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" style=\"margin:5px;\" onclick=viewid('"+data.id+"')  id=\"remove"+"\">View User ID</button>";
					document.getElementById("editUsersSearch").innerHTML += "<p></p>";
					document.getElementById("editUsersSearch").innerHTML += "<div id='viewid"+data.id+"'</div>";
					document.getElementById("editUsersSearch").innerHTML += "<p></p>";
				}

			}

		} else {
			throw new Error("Problem getting user info"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("editUsersSearch").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to get user information.</div>";
	}
}

function viewid(id){
	document.getElementById("viewid"+id).innerHTML = "<p><b>User ID:</b> "+id+"</p>";
}
async function removeuser(id){
	var confirm = window.confirm("Are you sure you want to delete this user's information?");
	if (confirm == true){
		try{
			let token = await auth0.getTokenSilently();
			let data = {
				"userId":id,
			};
			let response = await fetch("./api/admins/users/delete",
				{
					method: "POST",
					headers: {
						"Content-Type":"application/json",

						"Authorization": `Bearer ${token}`
					},
					body: JSON.stringify(data)
				});
			if(!response.ok){
				throw new Error("Problem removing user"+ response.code);
			}
			else{
				document.getElementById("editUsersSearch").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Successfully Removed User.</div>";
			}
		} catch (error) {
			document.getElementById("editUsersSearch").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to remove user.</div>";
		}
	}
}

async function addmanagers(){
	document.getElementById("addManagers").innerHTML = "";
	let centreIds = window.centreIds;
	let locationoptions = "";
	let useroptions = "";
	let centreName = "";
	for(let i = 0; i < centreIds.length; i++){
		try{
			let response = await fetch("/api/centres/details/"+centreIds[i]+"/",
				{
					method: "GET",
				});
			if(response.ok){
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				centreName = dataJSON.name;
			}
			if(!response.ok){
				throw new Error("Problem getting centre name"+ response.code);
			}
		} catch (error) {
			console.log(error);
		}
		locationoptions += "<option>"+centreIds[i]+ " - " +centreName+ "</option>";
	}




	document.getElementById("addManagers").innerHTML += "<p><b>Location</p>";
	document.getElementById("addManagers").innerHTML += "<select class=\"form-control\" id=\"AddManagerLocation\">"+locationoptions+"</select>";
	document.getElementById("addManagers").innerHTML += "<p></p>";
	document.getElementById("addManagers").innerHTML += "<p><b>User</p>";
	document.getElementById("addManagers").innerHTML += "<input type='text' class=\"form-control\" id=\"UsernametoAdd\"></input><p></p><button type=\"button\" class=\"btn btn-dark\" onclick=\"searchAddManager()\"id=\"searchAddManagerbtn"+"\">Search</button>";
	document.getElementById("addManagers").innerHTML += "<p></p>";

}

async function searchAddManager(){
	document.getElementById("addManagersSearch").innerHTML = "";
	let name = document.getElementById("UsernametoAdd").value;
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/admins/user/search/"+name+"/",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			if (bodyJSON.data.length == 0){
				document.getElementById("addManagersSearch").innerHTML = "<p>No Results Found</p>";
			}
			document.getElementById("addManagersSearch").innerHTML += "";
			for(let i = 0; i < bodyJSON.data.length; i++){
				let data = dataJSON[i];
				document.getElementById("addManagersSearch").innerHTML += "<li>"+data.fName + " " + data.lName +" - " + data.email+"</li>";
				document.getElementById("addManagersSearch").innerHTML += "<p></p>";
				document.getElementById("addManagersSearch").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" onclick=addManagerConfirm('"+data.id+"',"+(document.getElementById("AddManagerLocation").value).split(" ")[0]+")  id=\"addmanager"+"\">Add "+data.email+"</button>";
				document.getElementById("addManagersSearch").innerHTML += "<p></p>";
			}

		}
		if(!response.ok){
			throw new Error("Problem getting name"+ response.code);
		}
	} catch (error) {
		console.log(error);
		document.getElementById("addManagersSearch").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to find user.</div>";
	}

}

async function addManagerConfirm(id, location){
	try{
		let token = await auth0.getTokenSilently();
		let data = {
			"id":id,
			"centreId": location,

		};
		let response = await fetch("./api/admins/manager/set",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",

					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(response.ok){
			document.getElementById("addManagersSearch").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Successfully added manager.</div>";
			listmanagers();
		}
		if(!response.ok){
			throw new Error("Problem adding manager"+ response.code);
		}
	} catch (error) {
		console.log(error);
		document.getElementById("addManagersSearch").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to add manager.</div>";
	}

}

async function getmanagercentres(){
	window.centreIds = [];
	//GET list of centres that the manager mangages
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/managers/list/centres",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			for(let i = 0; i < bodyJSON.data.length; i++){
				window.centreIds.push(dataJSON[i]);
			}
			addmanagers();
			let options = "";
			let centrename = "";
			for(let i = 0; i < window.centreIds.length; i++){
				try{
					let response = await fetch("/api/centres/details/"+window.centreIds[i]+"/",
						{
							method: "GET",
						});
					if(response.ok){
						let body2 = await response.text();
						let body2JSON = JSON.parse(body2);
						let data2JSON = body2JSON.data;
						centrename = data2JSON.name;
					}
					if(!response.ok){
						throw new Error("Problem getting centre name"+ response.code);
					}
				} catch (error) {
					console.log(error);
				}
				options += "<option>"+window.centreIds[i]+" - "+centrename+"</option>";
			}
			document.getElementById("SelectLocations").innerHTML = "<label>Location</label><select class=\"form-control\" id=\"CentreLocation\">"+options+"</select>";
		} else {
			throw new Error("Problem getting centres"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("existing_dates").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get centres.</div>";
	}
	getadmindates();
}

async function getcentres(){
	//GET list of centres
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/centres/list",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let options = "";
			let data = "";
			let body = await response.text();
			let bodyJSON = JSON.parse(body);
			let dataJSON = bodyJSON.data;
			for(let i = 0; i < bodyJSON.data.length; i++){
				data = dataJSON[i];
				options += "<option>"+data.id + " - " + data.name+"</option>";
			}

			document.getElementById("updatecentres").innerHTML = "<label>Name</label><select id = 'updatecentrename' class=\"form-control\">"+options+"</select>";
			document.getElementById("updatecentres").innerHTML += "<p></p>";
			document.getElementById("updatecentres").innerHTML += "<button id=\"viewdetails\" onclick='viewdetails()' type=\"button\" style=\"margin:5px;\" class=\"btn btn-dark\">View Centre</button>";
			document.getElementById("updatecentres").innerHTML += "<p></p>";

		} else {
			throw new Error("Problem getting centres"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("updatecentres").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get centres.</div>";
	}
}

async function viewdetails(){
	try{
		let token = await auth0.getTokenSilently();
		let id = (document.getElementById("updatecentrename").value).split(" ")[0];
		let response = await fetch("/api/centres/details/"+id,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body2 = await response.text();
			let body2JSON = JSON.parse(body2);
			let data2JSON = body2JSON.data;
			document.getElementById("viewcentredetails").innerHTML = "<label>Name</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.name+"' id='centreName'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<label>Address</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.address+"' id='centreAddress'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<label>City</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.city+"' id='centreCity'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<label>Postcode</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.postcode+"' id='centrePostcode'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<label>Phone Number</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.phoneNumber+"' id='centrePhone'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<label>Email</label>";
			document.getElementById("viewcentredetails").innerHTML += "<input type='text' class='form-control' value='"+data2JSON.email+"' id='centreEmail'>";
			document.getElementById("viewcentredetails").innerHTML += "<p></p>";
			document.getElementById("viewcentredetails").innerHTML += "<button onclick='updateCentre("+id+")' type='button' style='margin:5px;' class='btn btn-dark'>Update</button>";
			document.getElementById("viewcentredetails").innerHTML += "<button onclick='deleteCentre("+id+")' type='button' style='margin:5px;' class='btn btn-dark'>Remove</button>";
			getcentres();
		} else {
			throw new Error("Problem getting centre info"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("viewcentredetails").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get centre information.</div>";
	}
}



async function updateCentre(id){
	try{
		let token = await auth0.getTokenSilently();
		let data = {
			"centreId":id,
			"name": document.getElementById("centreName").value,
			"address": document.getElementById("centreAddress").value,
			"city": document.getElementById("centreCity").value,
			"postcode": document.getElementById("centrePostcode").value,
			"phoneNo": document.getElementById("centrePhone").value,
			"email": document.getElementById("centreEmail").value
		};
		let response = await fetch("./api/admins/centres/update",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",

					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(response.ok){
			document.getElementById("viewcentredetails").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Successfully updated centre.</div>";
			getcentres();
		}
		if(!response.ok){
			throw new Error("Problem removing date"+ response.code);
		}
	} catch (error) {
		console.log(error);
		document.getElementById("viewcentredetails").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to update.</div>";
	}

}

async function deleteCentre(id){
	try{
		let token = await auth0.getTokenSilently();
		let data = {
			"centreId":id,
		};
		let response = await fetch("./api/admins/centres/remove",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",

					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(response.ok){
			document.getElementById("viewcentredetails").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Successfully deleted centre.</div>";
			getcentres();
		}
		if(!response.ok){
			throw new Error("Problem removing date"+ response.code);
		}
	} catch (error) {
		document.getElementById("viewcentredetails").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to remove centre. There may be users assigned to this centre.</div>";
	}

}

async function getadmindates(){
	document.getElementById("existing_dates").innerHTML = "";
	//GET list of dates
	for(let i = 0; i < window.centreIds.length; i++){
		let centreId = window.centreIds[i];
		try{
			let response = await fetch("./api/centres/date/list/"+centreId+"/",
				{
					method: "GET",
				});
			if(response.ok){
				let body = await response.text();
				let bodyJSON = JSON.parse(body);
				let dataJSON = bodyJSON.data;
				for(let i = 0; i < bodyJSON.data.length; i++){
					let centrename = "";
					var data = dataJSON[i];
					try{
						let response = await fetch("/api/centres/details/"+data.centreId+"/",
							{
								method: "GET",
							});
						if(response.ok){
							let body2 = await response.text();
							let body2JSON = JSON.parse(body2);
							let data2JSON = body2JSON.data;
							centrename = data2JSON.name;
						}
						if(!response.ok){
							throw new Error("Problem getting centre name"+ response.code);
						}
					} catch (error) {
						console.log(error);
					}

					document.getElementById("existing_dates").innerHTML += "<p><b>"+data.date+" - "+data.description+", Location = "+centrename+", Capacity = "+data.capacity+"</p>";
					//get volunteers signed up for each date
					try{

						let token = await auth0.getTokenSilently();
						let response = await fetch("/api/centres/date/listusers/"+data.id+"/",
							{
								method: "GET",
								headers: {
									"Authorization": `Bearer ${token}`
								},
							});
						if(response.ok){
							let body2 = await response.text();
							let body2JSON = JSON.parse(body2);
							let data2JSON = body2JSON.data;
							document.getElementById("existing_dates").innerHTML += "<li><b>Volunteers:</li>";
							for(let i = 0; i < body2JSON.data.length; i++){
								var data2 = data2JSON[i];
								document.getElementById("existing_dates").innerHTML += "<li>"+data2.fname+" "+data2.lname+"</li>";
							}
							if (body2JSON.data.length == 0){
								document.getElementById("existing_dates").innerHTML += "<li>There are no volunteers for this date</li>";
							}
							document.getElementById("existing_dates").innerHTML += "<p></p>";

						} else {
							throw new Error("Problem getting dates"+ response.code);

						}

					} catch (error) {
						console.log(error);
						document.getElementById("existing_dates").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get volunteers signed up for this date.</div>";
					}
					document.getElementById("existing_dates").innerHTML += "<button type=\"button\" class=\"btn btn-dark\" style=\"margin:5px;\" onclick=\"deletedate("+data.id+")\" id=\"remove\">Remove Date</button>";
					document.getElementById("existing_dates").innerHTML += "<button id=\"exportregister\" onclick=\"exportregister("+data.id+")\" type=\"button\" style=\"margin:5px;\" class=\"btn btn-dark\">Export Register</button>";
					document.getElementById("existing_dates").innerHTML += "<p></p>";
				}
			} else {
				throw new Error("Problem getting dates"+ response.code);

			}

		} catch (error) {
			console.log(error);
			document.getElementById("existing_dates").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to get existing seasonal dates for your locations.</div>";
		}
	}
}


document.getElementById("add").addEventListener("click", async function(event){
	try{
		let date = document.getElementById("Date").value;
		date = date.replace("-", "/");
		date = date.replace("-", "/");
		let capacity = document.getElementById("Capacity").value;
		let description = document.getElementById("Description").value;
		let centreId = document.getElementById("CentreLocation").value.split(" ")[0];
		let token = await auth0.getTokenSilently();
		let isSeasonal = true;
		let data = {
			"date":date,
			"centreId":centreId,
			"description":description,
			"capacity":capacity,
			"isSeasonal":isSeasonal
		};
		let response = await fetch("./api/centres/date/add",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem adding dates"+ response.code);
		}else{
			document.getElementById("add_error").innerHTML = "";
		}
	} catch (error) {
		console.log(error);
		document.getElementById("add_error").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to add new seasonal dates.</div>";
	}
	getadmindates();
});

async function deletedate(id){
	try{
		let token = await auth0.getTokenSilently();
		let data = {
			"dateId":id
		};
		let response = await fetch("./api/centres/date/remove",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem removing date"+ response.code);
		}
	} catch (error) {
		console.log(error);
		document.getElementById("add_error").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to remove existing date.</div>";
	}
	getadmindates();
}

async function deletemanager(centre){
	let tempidarray = [];
	for (var i = 0; i < window.idarray.length; i++) {
		if ((window.idarray[i][1]) == centre){
			tempidarray.push(window.idarray[i][0]);
		}
	}
	let id = tempidarray[((document.getElementById("remove"+centre).value).split(" ")[0])-1];
	try{
		let token = await auth0.getTokenSilently();
		let data = {
			"id":id,
			"centreId":centre
		};
		let response = await fetch("./api/admins/manager/remove",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",

					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(!response.ok){
			throw new Error("Problem removing date"+ response.code);
		}
	} catch (error) {
		document.getElementById("editManagers").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to remove existing date.</div>";
	}
	document.getElementById("editManagers").innerHTML = "";
	listmanagers();
}

document.getElementById("addCentre").addEventListener("click", async function(event){
	try{
		let name = document.getElementById("addcentreName").value;
		let address = document.getElementById("addcentreAddress").value;
		let city = document.getElementById("addcentreCity").value;
		let postcode = document.getElementById("addcentrePostcode").value;
		let email = document.getElementById("addcentreEmail").value;
		let phoneNo = document.getElementById("addcentrePhone").value;
		let token = await auth0.getTokenSilently();

		let data = {
			"name":name,
			"address":address,
			"city":city,
			"postcode":postcode,
			"phoneNo":phoneNo,
			"email":email
		};
		let response = await fetch("/api/admins/centres/create",
			{
				method: "POST",
				headers: {
					"Content-Type":"application/json",
					"Authorization": `Bearer ${token}`
				},
				body: JSON.stringify(data)
			});
		if(response.ok){
			document.getElementById("addCentreError").innerHTML = "<div class=\"alert alert-success\" role=\"alert\">Successfully added Centre.</div>";
			//then update list of centres
			document.getElementById("editManagers").innerHTML = "";
			listmanagers();
			getmanagercentres();
			getcentres();
		}
		if(!response.ok){
			throw new Error("Problem adding dates"+ response.code);
		}
	} catch (error) {
		console.log(error);
		document.getElementById("addCentreError").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to add centre.</div>";
	}
});

async function exportmanagers(){
	//export managers
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/exports/managers",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			var a = document.createElement("a");
			a.href = "data:text/csv;charset=utf-8," + encodeURI(body);
			a.download = "managers.csv";
			a.click();

		} else {
			throw new Error("Unable to export"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("export").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to export data.</div>";
	}
}

async function exportusers(){
	//export users
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/exports/users",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			var a = document.createElement("a");
			a.href = "data:text/csv;charset=utf-8," + encodeURI(body);
			a.download = "users.csv";
			a.click();

		} else {
			throw new Error("Unable to export"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("export").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to export data.</div>";
	}
}

async function exportdates(){
	//export dates
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/exports/dates",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			var a = document.createElement("a");
			a.href = "data:text/csv;charset=utf-8," + encodeURI(body);
			a.download = "dates.csv";
			a.click();

		} else {
			throw new Error("Unable to export"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("export").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to export data.</div>";
	}
}

async function exportregister(id){
	//export registers
	try{
		let token = await auth0.getTokenSilently();
		let response = await fetch("/api/exports/"+id+"/register",
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${token}`
				},
			});
		if(response.ok){
			let body = await response.text();
			var a = document.createElement("a");
			a.href = "data:text/csv;charset=utf-8," + encodeURI(body);
			a.download = "register.csv";
			a.click();

		} else {
			throw new Error("Unable to export"+ response.code);

		}

	} catch (error) {
		console.log(error);
		document.getElementById("add_error").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to export data.</div>";
	}
}

let token = "";
async function refresh() {
	token = await auth0.getTokenSilently();
	refreshModules();
	refreshCourses();
}

//easy request function
function request(uri, method, token, body=null) {
	return new Promise((resolve, reject) => {
		if(body != null) {
			body = JSON.stringify(body);
		}
		fetch(uri, {
			method: method,
			body: body,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
			}
		})
			.then(response => response.json())
			.then(body => {
				if(body.status != 200) {
					if(body.status == 401) document.getElementById("hasAccess").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">You do not have permission to edit training modules.</div>";
					else {
						document.getElementById("hasAccess").innerHTML = "<div class=\"alert alert-danger\" role=\"alert\">Unable to edit training modules - "+body.data+"</div>";
					}
					reject(body);
					Promise.resolve();
				} else {
					resolve(body);
				}
			})
			.catch(err => {
				reject(err);
			});
	});
}

/////////////////////////////////////////////////
/*                  Modules                    */
/////////////////////////////////////////////////

function refreshModules() {
	displayModules()
		.then(() => {
			modulesAddEventListeners();
		});
}

function modulesAddEventListeners() {
	document.getElementById("moduleAdd").addEventListener("click", modulesAddEvent);

	let els = document.getElementsByClassName("moduledelete");
	for (let i = els.length - 1; i >= 0; i--) {
		els[i].addEventListener("click", moduleDeleteEvent);
	}

	els = document.getElementsByClassName("moduleedit");
	for (let i = els.length - 1; i >= 0; i--) {
		els[i].addEventListener("click", moduleEditEvent);
	}
}

function displayModules() {
	let html = document.getElementById("listModules");
	html.innerHTML = "";
	return request("/api/modules/list", "GET", token)
		.then(data => {
			data = data.data;
			for(let i = 0; i < data.length; i += 1) {
				html.innerHTML += "<p class='module' name='"+data[i].id+"'>"+data[i].id+" - "+data[i].title
			+" <button class='moduledelete' name='"+data[i].id+"'>Delete</button>"
			+" <button class='moduleedit' name='"+data[i].id+"'>Edit</button>"
			+"</p>";
			}
		});
}

function moduleDeleteEvent() {
	let id = this.name;
	request("/api/modules/remove", "POST", token, {
		id: id
	})
		.then(() => {
			this.parentElement.remove();
		});
}


function modulesAddEvent() {
	document.getElementById("main").style.display = "none";

	let html = document.getElementById("moduleCreater");

	html.innerHTML += "<p><b>Module Creater</p>";
	html.innerHTML += "Title: <input type=\"text\" id=\"moduleTitle\" />";

	html.innerHTML += "<div id=\"moduleForm\"></div>";

	let str = "<br /><b>Add module componemt</b> <br />"
		+ "<select id=\"moduleFormSelect\"\">"
		+ "<option value=\"header\">Header</option>"
		+ "<option value=\"video\">Video</option>"
		+ "<option value=\"text\">Text</option>"
		+ "</select>"
		+ "<button id=\"moduleFormAdd\">Add</button>";

	html.innerHTML += str;

	html.innerHTML += "<br /><br /><button id='moduleFormCreate'>Create Module</button>";
	html.innerHTML += "<button id='moduleFormExit'>Exit</button>";
	document.getElementById("moduleFormAdd").addEventListener("click", moduleFormAddEvent);
	document.getElementById("moduleFormCreate").addEventListener("click", moduleFormCreateEvent);
	document.getElementById("moduleFormExit").addEventListener("click", moduleFormExitEvent);

}


function moduleFormAddEvent() {
	let html = document.getElementById("moduleForm");

	let type = document.getElementById("moduleFormSelect").value;

	let order;
	let orderBox;
	if(html.lastChild) {
		orderBox = html.lastChild.querySelectorAll(".order");
		order = parseInt(orderBox[0].value) +1;
	} else {
		order = 0;
	}


	let str = "<p>";
	str += "<input type=\"number\" class=\"order\" style=\"width: 45px;\" value=\""+order+"\" />";
	str += type + ": ";
	if(type == "text") {
		str += "<textarea class=\"input\" data=\""+type+"\" id=\"token\" cols=\"30\" rows=\"3\"></textarea>";
	} else {
		str += "<input type=\"text\" class=\"input\" data=\""+type+"\"/>";
	}

	str += "<button class='moduleDeleteButton'>Delete</button>";

	str += "</p>";

	html.innerHTML += str;
	html.lastChild.querySelectorAll(".input")[0].addEventListener("keyup", moduleFormSave);

	let deletes = document.getElementsByClassName("moduleDeleteButton");
	for (var i = deletes.length - 1; i >= 0; i--) {
		deletes[i].addEventListener("click", moduleDeleteButtonEvent);
	}
}

function moduleFormSave() {
	if(this.tagName == "TEXTAREA") {
		this.innerHTML = this.value;
	}else {
		this.setAttribute("value", this.value);
	}
}

function moduleFormToJson() {
	if(document.getElementById("moduleTitle").value == "") {
		return alert("Need a title");
	}

	let html = document.getElementById("moduleForm");
	let inputs = html.querySelectorAll("p");

	let moduleInfo = [];
	for (var i = inputs.length - 1; i >= 0; i--) {
		let type = inputs[i].querySelectorAll(".input")[0].getAttribute("data");
		let value = inputs[i].querySelectorAll(".input")[0].value;
		let order = inputs[i].querySelectorAll(".order")[0].value;

		moduleInfo.push([order, type, value]);
	}
	moduleInfo.sort((a, b) => {
		if (a[0] === b[0]) {
			return 0;
		}
		else {
			return (a[0] < b[0]) ? -1 : 1;
		}
	});

	let json = [];
	for (let i = 0; i < moduleInfo.length; i += 1) {
		json.push({
			type: moduleInfo[i][1],
			data: moduleInfo[i][2],
		});
	}

	return json;
}

function moduleFormCreateEvent() {
	let json = moduleFormToJson();

	request("/api/modules/add", "POST", token, {
		title: document.getElementById("moduleTitle").value,
		content: JSON.stringify(json)
	})
		.then(() => {
			document.getElementById("moduleCreater").innerHTML = "";
			document.getElementById("main").style.display = "block";
			refreshModules();
		});
}

function moduleFormUpdateEvent() {
	let json = moduleFormToJson();

	request("/api/modules/update", "POST", token, {
		id: this.getAttribute("name"),
		title: document.getElementById("moduleTitle").value,
		content: JSON.stringify(json)
	})
		.then(() => {
			document.getElementById("moduleCreater").innerHTML = "";
			document.getElementById("main").style.display = "block";
			refreshModules();
		});
}

function moduleEditEvent() {
	modulesAddEvent();
	let completeButton = document.getElementById("moduleFormCreate");
	completeButton.innerHTML = "Update Module";
	completeButton.setAttribute("name", this.getAttribute("name"));
	completeButton.removeEventListener("click", moduleFormCreateEvent);
	completeButton.addEventListener("click", moduleFormUpdateEvent);

	request("/api/modules/module/"+this.getAttribute("name"), "GET", token)
		.then(data => {
			data = data.data;
			document.getElementById("moduleTitle").value = data.title;
			let json = JSON.parse(data.content);

			let html = document.getElementById("moduleForm");

			for(let i = 0; i < json.length; i += 1) {
				let str = "<p>";
				str += "<input type=\"number\" class=\"order\" style=\"width: 45px;\" value=\""+i+"\" />";
				str += json[i].type + ": ";
				if(json[i].type == "text") {
					str += "<textarea class=\"input\" data=\""+json[i].type+"\" id=\"token\" cols=\"30\" rows=\"3\">"+json[i].data+"</textarea>";
				} else {
					str += "<input type=\"text\" class=\"input\" data=\""+json[i].type+"\" value='"+json[i].data+"'/>";
				}

				html.innerHTML += str;
				html.lastChild.querySelectorAll(".input")[0].addEventListener("keyup", moduleFormSave);
			}
		});
}

function moduleDeleteButtonEvent() {
	this.parentElement.remove();
}

function moduleFormExitEvent() {
	document.getElementById("moduleCreater").innerHTML = "";
	document.getElementById("main").style.display = "block";
}


/////////////////////////////////////////////////
/*               Course List                   */
/////////////////////////////////////////////////


function refreshCourses() {
	return new Promise((resolve) => {
		displayCourses()
			.then(() => {
				courseAddEventListeners();
				resolve();
			});
	});

}

function courseAddEventListeners() {
	let expands = document.getElementsByClassName("courseExpand");
	for (let i = expands.length - 1; i >= 0; i--) {
		expands[i].addEventListener("click", courseExpandEvent);
	}

	let deletes = document.getElementsByClassName("courseDelete");
	for (let i = deletes.length - 1; i >= 0; i--) {
		deletes[i].addEventListener("click", courseDeleteEvent);
	}
}


function displayCourses() {
	let html = document.getElementById("listCourses");
	html.innerHTML = "";

	document.getElementById("coursesAdd").addEventListener("click", courseAddCourseEvent);

	return request("/api/courselist/list/titles", "GET", token)
		.then(data => {
			data = data.data;
			for (var i = data.length - 1; i >= 0; i--) {
				html.innerHTML += "<p class='course' name='"+data[i]+"'>"+data[i]
			+" <button class='courseExpand' name='"+data[i]+"'>Expand</button>"
			+" <button class='courseDelete' name='"+data[i]+"'>Delete</button> </p>";
			}
		});
}


function courseExpandEvent() {
	let html = this.parentElement;
	let id = html.getAttribute("name");
	request("/api/courselist/list/modules/" + id, "GET", token)
		.then(data => {
			data = data.data;
			for (var i = data.length - 1; i >= 0; i--) {
				html.innerHTML += "<li>"+data[i].title
			+" <button class='courseRemove' name='"+id+","+data[i].id+"'>Remove</button></li>";
			}

			return request("/api/modules/list", "GET", token);
		})
		.then(data => {
			data = data.data;
			let str = "";
			str += "<select class='courseAddSelect' name='"+id+"'>";
			for (var i = data.length - 1; i >= 0; i--) {
				str += "<option value='"+data[i].id+"'>"+data[i].title+"</option>";
			}

			str += "</select>";
			html.innerHTML += str;

			html.innerHTML += "<button class='courseAdd' name='"+id+"'>Add</button>";
		})
		.then(() => {
			let removes = document.getElementsByClassName("courseRemove");
			for (let i = removes.length - 1; i >= 0; i--) {
				removes[i].addEventListener("click", courseRemoveEvent);
			}

			let adds = document.getElementsByClassName("courseAdd");
			for (let i = adds.length - 1; i >= 0; i--) {
				adds[i].addEventListener("click", courseAddEvent);
			}
		});
}

function courseDeleteEvent() {
	let id = this.name;

	request("/api/admins/courselist/delete", "POST", token, {
		title: id
	})
		.then(() => {
			refreshCourses();
		});
}

function courseRemoveEvent() {
	let v = this.name.split(",");
	let title = v[0];
	let module = v[1];

	request("/api/admins/courselist/remove/module", "POST", token, {
		title:title,
		module: module
	})
		.then(() => {
			this.parentElement.remove();
		});
}

function courseAddEvent() {
	let id = this.name;
	let module = this.previousSibling.value;
	request("/api/admins/courselist/add/module", "POST", token, {
		title: id,
		module: module
	})
		.then(() => refreshCourses());
}

function courseAddCourseEvent() {
	let input = document.getElementById("courseAddInput");
	let title = input.value;
	if(title.indexOf(",") != -1) {
		return alert("cannot have ',' in title");
	}

	let html = document.getElementById("listCourses");

	html.innerHTML += "<p class='course' name='"+title+"'>"+title
	+" <button class='courseExpand' name='"+title+"'>expand</button>"
	+" <button class='courseDelete' name='"+title+"'>delete</button> </p>";


	courseAddEventListeners();
}



refresh();
