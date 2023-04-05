const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
const port = 4000;
const jsonParser = express.json();
const fileName = 'employees.json';

// Allow requests only from this client
app.use(cors({
    origin: 'http://localhost:3000'
}));

// Load data from file
let rawData = fs.readFileSync(fileName);
let data = JSON.parse(rawData);

// This is a RESTful GET web service
app.get('/employees', (request, response) => {
    // data.sort((a, b) => (a.firstName > b.firstName) ? 1 : -1 );
    response.send(data);
});

// This is a RESTful POST web service
app.post('/employees', jsonParser, (request, response) => {
    const newEmployee = request.body;
    data.push(newEmployee);
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    response.status(200).end();
  });
  

// This is a RESTful PUT web service
app.put('/employees/:id', jsonParser, (req, res) => {
  const employeeId = req.params.id;
  const employeeIndex = data.findIndex(emp => emp.id === employeeId);

  if (employeeIndex !== -1) {
    data[employeeIndex] = req.body;
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// This is a RESTful DELETE web service
app.delete('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const employeeIndex = data.findIndex(emp => emp.id === employeeId);
  
    if (employeeIndex !== -1) {
      data.splice(employeeIndex, 1);
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  });

app.listen(port);
console.log(`server listening on port ${port}`);
