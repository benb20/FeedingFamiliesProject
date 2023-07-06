# `users`
Endpoints for users to create and manger their accounts

## `/api/users/create/basic` *POST* **Authenticated**
Create a simple entry in the database with minimal data

#### Encoded Variables 
* `isCore` **boolean** true if the volunteer is a core volunteer
* `centreId` **int** id of the centre they are assigned to

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/create/full` *POST* **Authenticated**
Create a user entry with all the information.

#### Encoded Variables 
* `fname` **string** first name.
* `lname` **string** last name.
* `email` **string**
* `phoneNo` **string** phone number.
* `address` **string** house number and street name.
* `city` **string**
* `postcode` **string**
* `DOB` **string** date of birth formatted DD/MM/YYYY.
* `kinName` **string** name of their next of kin.
* `kinPhone` **string** phone number of their next of kin.
* `isCore` **boolean** true if the volunteer is a core volunteer
* `centreId` **int** id of the centre they are assigned to
* `unstructuredData` **json** a json of all the extra bits of data that need to be collected.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/users/delete` *POST* **Authenticated**
Delete your user account

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/update/name` *POST* **Authenticated**
Update a users name.

#### Encoded Variables
* `fname` **string** first name.
* `lname` **string** last name.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/update/email` *POST* **Authenticated**
Update a users email.

#### Encoded Variables
* `email` **string**

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/update/phoneNo` *POST* **Authenticated**
Update a users phone number.

#### Encoded Variables
* `phoneNo` **string** phone number.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/update/address` *POST* **Authenticated**
Update a users address.

#### Encoded Variables
* `address` **string** house number and street name.
* `city` **string**
* `postcode` **string**

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/users/update/nextofkin` *POST* **Authenticated**
Update a users next of kin.

#### Encoded Variables
* `kinName` **string** name of their next of kin.
* `kinPhone` **string** phone number of their next of kin.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/update/data` *POST* **Authenticated**
Update the extra data collected in an unstructured format such as json

#### Encoded Variables
* `unstructuredData` **json** a json of all the extra bits of data that need to be collected.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/users/info` *GET* **Authenticated**
Get all the current information held on the user

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