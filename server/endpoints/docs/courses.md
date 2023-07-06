# `courses`
Get user courses and modify them.

## `/api/courses/list` *GET* **Authenticated**
List all the training modules a user is enrolled in.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `trainingId` **int** id of the training module.
	* `score` **int** score achieved.


## `/api/managers/courses/list/:userId/` *GET* **Authenticated**
List all the training modules a user is enrolled in.

#### Encoded Variables 
* `userId` **string** id of the user to get their course.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `trainingId` **int** id of the training module.
	* `score` **int** score achieved.


## `/api/courses/score/set` *POST* **Authenticated**
Set the score achieved on a module

#### Encoded Variables 
* `moduleId` **int** id of the training module.
* `score` **int** score achieved.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/managers/courses/score/set` *POST* **Authenticated**
Set the score achieved on a module

#### Encoded Variables
* `userId` **string** id of the user.
* `moduleId` **int** id of the training module.
* `score` **int** score achieved.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/managers/courses/add` *POST* **Authenticated**
Add a training module to a user's course

#### Encoded Variables
* `userId` **string** id of the user to set score on.
* `moduleId` **int** id of the training module you want to add.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/managers/courses/remove` *POST* **Authenticated**
Remove a training module from a user's course

#### Encoded Variables
* `userId` **string** id of the user to set score on.
* `moduleId` **int** id of the training module you want to add.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/courselist/:title/` *GET* **Authenticated**
Get a list of training modules on a course.

#### Encoded Variables
* `title` **string** title of the list of training modules

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **ints** array of training modules on a course.


## `/api/courselist/list/modules/:title` *GET* **Authenticated**
Get a list of the titles of the modules in a course list.

#### Encoded Variables
* `title` **string** title of the list of training modules

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **objects**
	* `id` **int** id of the module.
	* `title` **string** title of the module.


## `/api/courselist/list/titles` *GET* **Authenticated**
Get a list of training modules on a course.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** array of course list titles


## `/api/admins/courselist/create` *POST* **Authenticated**
Create a list of training modules to form a course.

#### Encoded Variables
* `title` **string** id of the list of training modules
* `content` **ints** array of training module ids to form the course.

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/courselist/delete` *POST* **Authenticated**
Remove a list of training modules.

#### Encoded Variables
* `title` **string** title of the list of training modules

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/courselist/add/module` *POST* **Authenticated**
Add a module to a course list

#### Encoded Variables
* `title` **string** title of the list to add to.
* `module` **int** module id to be added

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.


## `/api/admins/courselist/remove/module` *POST* **Authenticated**
Remove a module from a course list

#### Encoded Variables
* `title` **string** title of the list to remove module from.
* `module` **int** module id to be removed

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.



## `/api/courses/enroll/:courseListId` *GET* **Authenticated**
Enroll a user on a set of training modules set in the course list

#### Encoded Variables
* `courseListId` **int** id of the course list

#### Response *JSON*
* `status` **number** the status code of the response.
* `data` **string** success or error message.