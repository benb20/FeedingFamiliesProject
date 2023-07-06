# `centres`
Get information a centre and its users

## `/api/centres/list` *GET*
List all centres

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `id` **int** centre id.
	* `name` **string** name of the centre.


## `/api/centres/listusers/:centreId/` *GET* **Authenticated**
List all the users assigned to that centre, only managers can see this information.

#### Encoded Variables 
* `centreId` **int** centre to list the users assign to.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `id` **string** user id.
	* `fname` **string** first name of the user.
	* `lname` **string** last name of the user.

## `/api/centres/details/:centreId/` *GET* 
Get the information about the centre

#### Encoded Variables 
* `centreId` **int**

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **object**
	* `id` **string** centre id.
	* `name` **string** name of centre.
	* `address` **string**
	* `city` **string**
	* `postcode` **string**
	* `phoneNumber` **string** phone number for contact.
	* `email` **string** email for contact.
