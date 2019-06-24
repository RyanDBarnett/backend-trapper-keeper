// Import the express app
const app = require('./app.js');

// Set the port
app.set('port', process.env.PORT || 3000);

// Message to show what port the app is running on
app.listen(app.get('port'), () => {
    console.log(`Trapper Keeper is running http://localhost:${app.get('port')}`)
});