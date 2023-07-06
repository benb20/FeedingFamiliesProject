# Feeding Families Project

This project is a collaboration with Feeding Families, a UK organization for our Summative project at Durham University. We have created a volunteering portal with the aim of helping new users who want to be active in hamper donation/general involvement. It includes a backend server implemented in Node.js and a set of endpoints to manage centers, courses, users, and more. The project utilizes MySQL as the database.

## Requirements

To run this project, you need to have the following installed:

- Node.js
- MySQL

## Installation

1. Clone the project repository:

   ```bash
   git clone <repository_url>
   ```

2. Navigate to the project directory:

   ```bash
   cd <project_directory>
   ```

3. Install the project dependencies:

   ```bash
   npm install
   ```

4. Set up the MySQL database:
   
   - Create a new MySQL database.
   - Import the `database.sql` file located in the `server/db` directory into the newly created database.

5. Configure the application:

   - In the `server/config.json` file, update the database connection details according to your MySQL setup.

6. Configure authentication:

   - In the `client/auth_config.json` file, update the `domain` and `audience` values with the appropriate values for your authentication provider.

7. Start the application:

   ```bash
   npm start
   ```

   The server should now be running on the specified port or the default port.

## Usage

- Access the application by opening a web browser and navigating to `http://localhost:<port>`.

## Project Structure

The project consists of the following files and directories:

- `app.js`: Entry point of the application that configures the Express server, sets up static file serving, defines middleware, establishes database connections, and registers endpoints.
- `server`: Directory containing server-side code.
   - `config.json`: Configuration file with server-related settings.
   - `db`: Directory containing database-related code and scripts.
      - `create.js`: Script to set up the database structure.
      - `connection.js`: File providing the database connection.
   - `endpoints`: Directory containing endpoint handlers for different resources.
      - `admins.js`: Endpoint handlers for managing admins.
      - `centres.js`: Endpoint handlers for managing centres.
      - `courses.js`: Endpoint handlers for managing courses.
      - `dates.js`: Endpoint handlers for managing dates.
      - `exports.js`: Endpoint handlers for exporting data.
      - `managers.js`: Endpoint handlers for managing managers.
      - `modules.js`: Endpoint handlers for managing modules.
      - `users.js`: Endpoint handlers for managing users.
- `client`: Directory containing client-side code and static files.
   - `auth_config.json`: Configuration file with authentication-related settings.
   - Other client-side files (HTML, CSS, JavaScript, etc.)

## API Endpoints

The following API endpoints are available:

- `/admins`: Admins management.
- `/centres`: Centres management.
- `/courses`: Courses management.
- `/dates`: Dates management.
- `/exports`: Data export.
- `/managers`: Managers management.
- `/modules`: Modules management.
- `/users`: Users management.

Please refer to the code in the `server/endpoints` directory for the specific endpoint implementations.

## Error Handling

The application includes basic error handling. If an error occurs, it will be logged and an appropriate response will be sent back to the client.

## Authentication and Authorization

The application uses JWT (JSON Web Tokens) for authentication and authorization. The `checkJwt` middleware is applied to the protected routes to ensure only authenticated users can access them. The configuration for JWT can be found in the `client/auth_config.json` file.

