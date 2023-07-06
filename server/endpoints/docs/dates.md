# `dates`
Centres can add dates they need volunteers for. The same dates can have multiple jobs distinguished by their descriptions. Volunteers can then commit (signup to attend) to the dates listed for the centre they volunteer at.  

## `/api/centres/date/list/:centreId/` *GET*
List all the dates a centre requires volunteers for

#### Encoded Variables 
* `centreId` **int** centre to get the dates for

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `id` **int** date id.
	* `centreId` **int** centre id.
	* `date` **string** date in format "DD/MM/YYYY".
	* `decription` **string** description of what volunteers are doing
	* `isSeasonal` **boolean** if the date is for seasonal volunteers or not


## `/api/dates/seasonal/available` *GET*
Check if there are seasonal dates created in the future for seasonal volunteers to signup to.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **boolean** true if there are seasonal dates in the future, false if not


## `/api/centres/date/listusers/:dateId/` *GET* **Authenticated**
List all the users commited to a specific date

#### Encoded Variables 
* `dateId` **int** date you want to see users for

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `userId` **string** id of user.
	* `fname` **string** user's first name.
	* `lname` **string** user's last name.



## `/api/centres/date/add` *POST* **Authenticated**
Managers of a centre can remove dates

#### Encoded Variables *JSON*
* `dateId` **int** id of the date to remove.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** error or success message.


## `/api/centres/date/remove` *POST* **Authenticated**
Managers of a centre can add dates they need volunteers for

#### Encoded Variables *JSON*



## `/api/users/date/commit` *POST* **Authenticated**
Signup to a date using the dateId.

#### Encoded Variables *JSON*
* `dateId` **int** date to commit to.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** error or success message.


## `/api/users/date/uncommit` *POST* **Authenticated**
Remove yourself from the register.

#### Encoded Variables *JSON*
* `dateId` **int** date to uncommit to.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** error or success message.


## `/api/users/date/list` *GET* **Authenticated**
Get a list of all the dates a user is commited to

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `dateId` **int** date's id.
	* `date` **string** date formatted as DD/MM/YYYY.
	* `description` **string** description of what the volunteer will do on that date.
	* `attended` **boolean** true if they attended, false if not, null if not set.
