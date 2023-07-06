# `modules`
access and modify training module data

## `/api/modules/add` *POST* **Authenticated**
Add a new training module, only admins can do this

#### Encoded Variables 
* `title` **string** title descriptor of the module, maximum 255 characters 
* `content` **JSON** the json containing all the module data

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/modules/remove` *POST* **Authenticated**
Remove a training module, only admins can do this

#### Encoded Variables 
* `id` **int** id of the training module to be removed

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/modules/update` *POST* **Authenticated**
Update an existing module, only admins can do this.

#### Encoded Variables 
* `id` **int** id of the module to be updated
* `title` **string** title descriptor of the module, maximum 255 characters 
* `content` **JSON** the json containing all the module data

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/modules/list` *GET* **Authenticated**
list all the module titles with their ids 

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `id` **int**
	* `title` **string**

## `/api/modules/module/:id/` *GET* **Authenticated**
Get all the training module for a single module

#### Encoded Variables 
* `id` **int** id of the training module

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **object**
	* `id` **int**
	* `title` **string**
	* `content` **JSON**