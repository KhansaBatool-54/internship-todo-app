##### **1. Authentication Module (Signup \& Login)**



###### ***SIGNUP(http://localhost:5000/api/auth/signup)***

&#x20;**Test Case 1.1: Successful User Signup \& Auto-Login**

**body** 

{

&#x20;   "name" : "Amna ",

&#x20;   "email" : "amna@mail.com",

&#x20;   "password" : "12345678"

}

**result**

{

&#x20;   "message": "User registered successfully",

&#x20;   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\*nPf90",

&#x20;   "user": {

&#x20;       "id": "6af35b1fe24d5adaa76df6ee",

&#x20;       "name": "Amna",

&#x20;       "email": "amna@mail.com"

&#x20;   }

}



**Test Case 1.2: Signup with Existing Email**

**body**

{

&#x20;   "name" : "Amna ",

&#x20;   "email" : "amna@mail.com",

&#x20;   "password" : "12345678"

}

**result**

{

&#x20;   "message": "Email is already registered"

}



**Test Case 1.3: Signup with Invalid Email Format**

body

{

&#x20;   "name" : "Amna ",

&#x20;   "email" : "amnamail.com",

&#x20;   "password" : "12345678"

}

result

{

&#x20;   "message": "Name, email and password are required"

}



**Test Case 1.4: Signup with Short Password**

body

{

&#x20;   "name" : "Amna ",

&#x20;   "email" : "amnaa@mail.com",

&#x20;   "password" : "1238"

}

result

{

&#x20;   "message": "Password must be at least 8 characters"

}





###### ***LOGIN(http://localhost:5000/api/auth/login)***

**Test Case 1.5: Successful Login**

{

&#x20;   "email" : "amna@mail.com",

&#x20;   "password" : "12345678"

}



{

&#x20;   "message": "Login successful",

&#x20;   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YWYzNWIxZmUyNGQ1YWRhYTc2ZGY2ZWUiLCJpYXQiOjE3OTQzMzM4ODcsImV4cCI6MTc5NDMzNzQ4N30.bqaDWbkg\_o-RLog-B4FXZSqRBh1AUkJIEsDTT3\_mKA4",

&#x20;   "user": {

&#x20;       "id": "6af35b1fe24d5adaa76df6ee",

&#x20;       "name": "Amna",

&#x20;       "email": "amna@mail.com"

&#x20;   }

}



Test Case 1.6: Login with Incorrect Password / Email

{

&#x20;   "email" : "amna@mail.com",

&#x20;   "password" : "123567878"

}

result

{

&#x20;   "message": "Invalid email or password"

}



\---------------------------------------------------------------------------------

##### &#x20;**2. Profile Module(http://localhost:5000/api/auth/profile)**



&#x20;**Test Case 2.1: Fetch User Profile**

Get

token attached

{

&#x20;   "message": "Profile fetched successfully",

&#x20;   "user": {

&#x20;       "\_id": "6af35b1fe24d5adaa76df6ee",

&#x20;       "name": "Amna",

&#x20;       "email": "amna@mail.com",

&#x20;       "createdAt": "2026-11-10T17:57:51.060Z",

&#x20;       "updatedAt": "2026-11-10T17:57:51.060Z",

&#x20;       "\_\_v": 0

&#x20;   }

}



**Test Case 2.2: Update Profile Name**

{

&#x20;   "name" : "Amna B"

}

response

{

&#x20;   "message": "Profile updated successfully",

&#x20;   "user": {

&#x20;       "id": "6af35b1fe24d5adaa76df6ee",

&#x20;       "name": "Amna B",

&#x20;       "email": "amna@mail.com"

&#x20;   }

}



&#x20;**Test Case 2.3: Update Profile with Empty Name**

{

&#x20;   "name" : ""

}

{

&#x20;   "message": "Name cannot be empty"

}



\--------------------------------------------------------------------



##### &#x20;3. Task Management Module(http://localhost:5000/api/tasks)



&#x20;**Test Case 3.1: Create Task with tokn attached (Successful)**

body

{

&#x20;   "title": "Learn Backend",

&#x20;   "description": "Iron Fe 56 annd Fe57!"

}

response

{

&#x20;   "message": "Task created successfully",

&#x20;   "task": {

&#x20;       "title": "Learn Backend",

&#x20;       "description": "Iron Fe 56 annd Fe57!",

&#x20;       "status": "todo",

&#x20;       "userId": "6af35b1fe24d5adaa76df6ee",

&#x20;       "deletedAt": null,

&#x20;       "\_id": "6af35f39e24d5adaa76df6ef",

&#x20;       "createdAt": "2026-11-10T18:15:21.603Z",

&#x20;       "\_\_v": 0

&#x20;   }

}



&#x20;**Test Case 3.1.2: Create Task without or wrong token attached** 

{

&#x20;   "title": "Learn  newBackend",

&#x20;   "description": "Iron Fe 56 annd Fe57!"

}

response

{

&#x20;   "message": "Invalid or expired token."

}



**Test Case 3.2: Create Task with Empty Title**

body

{

&#x20;   "title": "",

&#x20;   "description": "Iron Fe 56 annd Fe57!"

}

res

{

&#x20;   "message": "Title is required"

}





&#x20;**Test Case 3.3: Fetch All Tasks (User Isolation)**

get method
{

&#x20;   "message": "Tasks fetched successfully",

&#x20;   "tasks": \[]

}



&#x20;**Test Case 3.4: Update Task Status (Mark as Done)http://localhost:5000/api/tasks/6af35f39e24d5adaa76df6ef**

{

&#x20;   "status": "done"

}

res

{

&#x20;   "message": "Task status updated successfully",

&#x20;   "task": {

&#x20;       "\_id": "6af35f39e24d5adaa76df6ef",

&#x20;       "title": "Learn Backend",

&#x20;       "description": "Iron Fe 56 annd Fe57!",

&#x20;       "status": "done",

&#x20;       "userId": "6af35b1fe24d5adaa76df6ee",

&#x20;       "deletedAt": null,

&#x20;       "createdAt": "2026-11-10T18:15:21.603Z",

&#x20;       "\_\_v": 0

&#x20;   }

}



&#x20;**Test Case 3.4: Update Task Status (already done)**

**http://localhost:5000/api/tasks/6af35f39e24d5adaa76df6ef**

{

&#x20;   "message": "Task status updated successfully",

&#x20;   "task": {

&#x20;       "\_id": "6af35f39e24d5adaa76df6ef",

&#x20;       "title": "Learn Backend",

&#x20;       "description": "Iron Fe 56 annd Fe57!",

&#x20;       "status": "done",

&#x20;       "userId": "6af35b1fe24d5adaa76df6ee",

&#x20;       "deletedAt": null,

&#x20;       "createdAt": "2026-11-10T18:15:21.603Z",

&#x20;       "\_\_v": 0

&#x20;   }

}
but it should show same as above



&#x20;**Test Case 3.4: Update Task Status (new option )**

**http://localhost:5000/api/tasks/6af35f39e24d5adaa76df6ef**

{

&#x20;   "status": "changed title",

}

res

{

&#x20;   "message": "Invalid task status"

}

**Test Case 3.5: Delete Task soft**

http://localhost:5000/api/tasks/6af35f39e24d5adaa76df6ef/soft-delete

{

&#x20;   "deletedAt": "new Date()"

}

res

{

&#x20;   "message": "Task soft deleted successfully",

&#x20;   "task": {

&#x20;       "\_id": "6af35f39e24d5adaa76df6ef",

&#x20;       "title": "Learn Backend",

&#x20;       "description": "Iron Fe 56 annd Fe57!",

&#x20;       "status": "done",

&#x20;       "userId": "6af35b1fe24d5adaa76df6ee",

&#x20;       "deletedAt": "2026-11-10T18:27:39.322Z",

&#x20;       "createdAt": "2026-11-10T18:15:21.603Z",

&#x20;       "\_\_v": 0

&#x20;   }

}



**Test Case 3.6: Unauthorized Access (No Token)**

{

&#x20;   "message": "Invalid or expired token."

}

incase no token available

{

&#x20;   "message": "Access denied. No token provided."

}

