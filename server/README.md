## Run

1. Install node js

2. Run mongoDB docker container ```docker run -p 27017:27017 --name mongo -d mongo```, go to localhost:27017 to verify that mongoDB is running

3. Update dependencies (from this directory run) ```npm install```

4. Load data ```node load_data.js```

5. Run server ```node server.js```, go to localhost:3000/content to verify that the endpoint returns data
