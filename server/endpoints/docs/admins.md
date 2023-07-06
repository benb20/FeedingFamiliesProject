# `admins`
endpoints for the admins of the system. Allows for access and control of data that should not be given to most people.

## `/api/admins/check` *GET* **Authenticated**
checks if the user is an admin.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **boolean** true if the user is an admin, false if not


## `/api/admins/users/delete` *GET* **Authenticated**
Delete a user account

#### Encoded Variables 
* `userId` **string** id of the user to be deleted

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or failure message.



## `/api/admins/user/search/:name` *GET* **Authenticated**
Search for a user by name, managers can only search users in centres they manage.

#### Encoded Variables 
* `name` **string** name of the user you want to get the details for.

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


## `/api/admins/manager/set` *POST* **Authenticated**
Set a user as a manager of a centre

#### Encoded Variables 
* `id` **string** id of the user you want to make a manager.
* `centreId` **int** id of the centre you want to make them a manager of.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/manager/remove` *POST* **Authenticated**
Remove a user as a manager of a centre

#### Encoded Variables 
* `id` **string** id of the user you want to remove as manager.
* `centreId` **int** id of the centre you want to remove them a manager of.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/centres/create` *POST* **Authenticated**
Create a new centre

#### Encoded Variables 
* `name` **string** name of the centre.
* `address` **string** street address of the centre.
* `city` **string**
* `postcode` **string**
* `phoneNo` **string** contact phone number.
* `email` **string** contact email.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.

## `/api/admins/centres/update` *POST* **Authenticated**
Update centre details

#### Encoded Variables
* `centreId` **int** id of the centre to update.
* `name` **string** name of the centre.
* `address` **string** street address of the centre.
* `city` **string**
* `postcode` **string**
* `phoneNo` **string** contact phone number.
* `email` **string** contact email.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/centres/update/contact` *POST* **Authenticated**
Update the contact information of the centre.

#### Encoded Variables 
* `centreId` **int** id of the centre to remove.
* `phoneNo` **string** contact phone number.
* `email` **string** contact email.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/centres/remove` *POST* **Authenticated**
Delete a centre, only can be done if no users are assigned to that centre

#### Encoded Variables 
* `centreId` **int** id of the centre to remove.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.