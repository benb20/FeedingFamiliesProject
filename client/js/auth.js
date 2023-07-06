let auth0 = null;
let userId = null;

const fetchAuthConfig = () => fetch("/auth_config.json");

const configureClient = async () => {
	const response = await fetchAuthConfig();
	const config = await response.json();

	auth0 = await createAuth0Client({
		domain: config.domain,
		client_id: config.clientId,
		audience: config.audience
	});
};

window.onload = async () => {
	await configureClient();

	updateUI();

	const isAuthenticated = await auth0.isAuthenticated();

	if (isAuthenticated) {
		// show the gated content
		return;
	}

	// NEW - check for the code and state parameters
	const query = window.location.search;
	if (query.includes("code=") && query.includes("state=")) {

		// Process the login state
		await auth0.handleRedirectCallback();

		updateUI();

		// Use replaceState to redirect the user away and remove the querystring parameters
		window.history.replaceState({}, document.title, "/");
	}
};

const updateUI = async () => {
	const isAuthenticated = await auth0.isAuthenticated();

	if (isAuthenticated) {
		check_manager();
		document.getElementById("loginscreen").style.display="none";
		document.getElementById("gated-content").classList.remove("hidden");
		let token = await auth0.getTokenSilently();
		let user = await auth0.getUser();



	} else {
		document.getElementById("gated-content").classList.add("hidden");
	}
};

const login = async () => {
	if(!auth0) {
		await configureClient();
	}
	if(auth0) {
		await auth0.loginWithRedirect({
			redirect_uri: window.location.origin
		});
	} else {
		console.log("Error connecting with auth0, try refreshing")
	}
};

const logout = () => {
	auth0.logout({
		returnTo: window.location.origin
	});
};

async function check_manager() {
	let token = await auth0.getTokenSilently();
	let user = await auth0.getUser();

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
				document.getElementById("adminwarning").style.display="block";
			} else {
				//check if user is manager
				try{
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
						if (bodyJSON.data.length > 0){
							document.getElementById("adminwarning").style.display="block";
						}
						else{
							//if user already exists
							try{
								let response = await fetch("/api/users/info",
									{
										method: "GET",
										headers: {
											"Authorization": `Bearer ${token}`
										},
									});
								if(response.ok){
									document.getElementById("submitted").style.display="block";
								}
								else {
									//display main menu
									document.getElementById("location").style.display="block";
									//check if there are seasonal dates
									try{
										let response = await fetch("/api/dates/seasonal/available",
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
											if (data2JSON == false){
												document.getElementById("choosetype").innerHTML = "<a class=\"list-group-item list-group-item-action active\" id=\"core\" data-toggle=\"list\" onclick=\"volunteertype('core');\" role=\"tab\">Core Volunteer</a>";
			                                    document.getElementById("choosetype").innerHTML += "<a class=\"list-group-item list-group-item-action\" id=\"donor\" data-toggle=\"list\" onclick=\"volunteertype('Donor');\" role=\"tab\">Donor</a>";
												document.getElementById("choosetype").innerHTML += "<a class=\"list-group-item list-group-item-action\" id=\"family\" data-toggle=\"list\" onclick=\"volunteertype('Family');\" role=\"tab\">Family</a>";


											}
										} else {
											throw new Error("Cannot check for dates"+ response.code);
										}
									} catch (error) {
										console.log(error);
										document.getElementById("location").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to check for seasonal dates.</div>";
									}
								}
							} catch (error) {
								console.log(error);
								document.getElementById("location").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to verify user.</div>";
							}
						}


					} else {
						throw new Error("Cannot verify user"+ response.code);
					}
				} catch (error) {
					console.log(error);
					document.getElementById("location").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to verify user.</div>";
				}
			}
		} else {
			throw new Error("Problem checking permissions"+ response.code);
		}
	} catch (error) {
		document.getElementById("super").innerHTML += "<div class=\"alert alert-danger\" role=\"alert\">Unable to check permissions. Some options might be unavailable.</div>";
	}
}
