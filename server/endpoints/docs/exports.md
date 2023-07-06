# `exports`
Export data to csv file. Managers have limited access to user data, only those who attend the centre they manage. Admins has access to all user data.


## `/api/exports/managers` *GET* **Authenticated**
Export a list of managers and the centres they manage.

#### Response *CSV*
A CSV file with the data.
or an error response


## `/api/exports/users` *GET* **Authenticated**
Export a list all users the manager or admin has access to.

#### Response *CSV*
A CSV file with the data.
or an error response


## `/api/exports/:dateId/register` *GET* **Authenticated**
Export a register of all the users signed up to a date.

#### Encoded Variables 
* `dateId` **int** dateId you want to get a register for.

#### Response *CSV*
A CSV file with the data.
or an error response


## `/api/exports/dates` *GET* **Authenticated**
Export a list of all the dates centres require people.

#### Response *CSV*
A CSV file with the data.
or an error response