# `managers`
Get information about the mangers.

## `/api/managers/list/centres` *GET* **Authenticated**
List all the centres a user manages

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **int[]** the centre Ids that the user is a manager of.

## `/api/managers/list/centres/:userId` *GET* **Authenticated**
List all the centres a user manages

#### Encoded Variables
* `userId` **string** the user id you want info for

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **int[]** the centre Ids that the user is a manager of.

## `/api/managers/list/mangers/:centreId/` *GET* **Authenticated**
List all the managers that manger a centre

#### Encoded Variables
* `centreId` **int** centre to list the managers of.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `userId` **string** id of a manager.
	* `fname` **string** first name of the manager.
	* `lname` **string** last name of the manager.


## `/api/managers/user/info/:userId/` *GET* **Authenticated**
As a manager, view a user's information. Restricted to only seeing users' information that are in a centre you manage, admins has access to all users.

#### Encoded Variables
* `userId` **string** the user id you want info for

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **object**
	* `id` **string**
	* `fName` **string** first name.
	* `lName` **string** last name.
	* `email` **string**
	* `phoneNo` **string** phone number.
	* `address` **string** house number and street.
	* `city` **string**
	* `postcode` **string**
	* `DOB` **string** date of birth in the format DD/MM/YYYY.
	* `kinName` **string** name of next of kin.
	* `kinPhone` **string** phone number of next of kin.
	* `isCore` **boolean** true if the user is a core volunteer.
	* `centreId` **int** centre id the user is assigned to
	* `unstructuredData` **json** all the extra data collected in a json or another unstructured data format.


## `/api/managers/user/change/centre` *POST* **Authenticated**
Assign a user to a new centre

#### Encoded Variables
* `userId` **string** id of the user to change centre
* `centreId` **int** centre id of the centre the user is being assigned to.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.
