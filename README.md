# Backend NodeJS Template with Typescript
This template can be used as a boiler plate for building a backend nodejs application with typescript.


## Features:
  - Inbuilt account management. So you don't need to do every time you start building your backend project
  - User registration and verification by email

## Getting Started
### Prerequisites

 - NodeJS, NPM, PNPM (https://pnpm.io/installation)
 - A MongoDB server, local or remote.

### Installing

  - Clone the repo and check out the code
  - Run 
    ```
    $ pnpm install 
    $ pnpm dev
    ```
  - Set following environment variables in a .env file in the root directory
    ``` 
    #jwt secret
    JWT_SECRET_KEY = <some string> ex: 'mytoughandhardjwtsecret'
        
    #email credentials
    EMAIL = <e-mail address, from which you will be sending the account verification emails to new users> ex:"test@gmail.com"
    PASSWORD = <app passowrd which you can get from google account dashboard> 
       
    #Database server connection URI
    MONGODB_URL = 'mongodb://<user_name>:<password>@xxxxx.test.com:xxxxx/<db_name>'

  - Run ``$ pnpm dev`` to start back end on port 3080

## Available Routes

### User Authentication


- Register new user with email

```
Method: POST
Type: public
Route:
/v1/api/signup
payload: name && email && password && confirmPassword (subject to change)
```

- Login user with email

```
Method: POST
Type: public
Route:
/v1/api/login
payload: email, password
```

- Send Email Verification link

```
Method: POST
Type: private
Route:
/v1/api/sendverificationlink
payload: none
```

- Verify email address
```
Method: PUT
Type: public
Route:
/v1/api/verifyemail
payload: token
```

- Get profile information (Dashboard)

```
Method: GET
Type: private
Route:
/v1/api/dashboard
```

- Edit Profile

```
Method: PUT
Type: private
Route:
/v1/api/editprofile
payload : newName || newPwd || confirmNewPwd (subject to change)

```

- Reset Password

```
Method: POST
Type: public
Route:
/v1/api/sendresetpwdlink
payload : email

```

- Send Reset Password Link

```
Method: PUT
Type: public
Route:
/v1/api/resetpwd
payload : token && newpwd && cnewpwd

```

## Deployment
To deploy on Render, create an account and set up environment variables. Then run ``pnpm i`` under build command and ``pnpm dev`` under start command.


## Contributing

Please create an issue and start working a feature/ bug you prefer :rocket:.

## License

This project is licensed under GNU GENERAL PUBLIC LICENSE.
