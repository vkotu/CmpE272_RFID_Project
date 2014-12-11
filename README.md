

# 
•	Objective:  Is to provide the nutritional facts about a food product through RFID scanning.
•	This will work with a E-plate – an RFID reader connected to a computer. The smart plate reader will access the information implanted in the food. People will be able to check ingredients for allergens, keep tabs on diets and check that ingredients are genuine.
•	Technology Stack: NodeJS, Java Script, Html, JQuery, Mysql.

## Brief Overview
Our application is a node express project. The app.js is the main file that contains the core functionality of the application. This is an express project where we use a serial port node module to read the data through USB from serial com port. Whenever the RFID reader detects a new tag, the data is sent to our application. Once the data has been received, application fetches the data that has been mapped to its unique ID. Then the data is pushed to the user interface through socket.io. This socket.io is an event-driven mechanism that pushes the data whenever the item has been scanned. The calorie count of the user is maintained in the database on a daily basis. We have a cronjob running in the backend that rests the value of the calorie in the database to 0 as the day starts. We have used JavaScript and JQuery libraries for the dynamic changes in the UI. For login mechanism, we have used passport-local strategy. It is an authentication middleware for Node.js which is modular and extremely flexible. It is adaptable in an express based application which has a comprehensive set of approaches to support authorization.


## Usage



## Developing



### Tools

Nodejs
Socket.io
JavaScript
Jquery
SerialPort communication
HTML
Mysql



Created with [Nodeclipse](https://github.com/Nodeclipse/nodeclipse-1)
 ([Eclipse Marketplace](http://marketplace.eclipse.org/content/nodeclipse), [site](http://www.nodeclipse.org))   

Nodeclipse is free open-source project that grows with your contributions.
