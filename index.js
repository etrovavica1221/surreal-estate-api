const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const restify = require('express-restify-mongoose');
const app = express();
const path = require('path');
const router = express.Router();
const expressListRoutes   = require('express-list-routes');
const cors = require('cors');
const PropertyListingModel = require('./models/property');
const FavouriteModel = require('./models/favourite');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const morgan = require('morgan'); 
app.use(morgan('tiny'));

require('dotenv').config();
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors());
app.use(bodyParser.json());
app.use(methodOverride());

const uri = process.env.DATABASE_CONN;

mongoose.connect(uri,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }).then(() => {
    console.log('Connection established with MongoDB');
})
.catch(error => console.error(error.message));

restify.serve(router, PropertyListingModel);
restify.serve(router, FavouriteModel);

app.use(router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', router);

expressListRoutes({}, 'Endpoints:', router );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Surreal Estate API is running on :${PORT}`);
});
