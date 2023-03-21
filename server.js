const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connection = require('./models/mongooConnection');
const path = require("path");
const app = express();
const bcrypt = require("bcrypt");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
const mongoos = require("mongoose");
const port = 7070;

const AdminJS = require('adminjs')
const AdminJSExpress = require('@adminjs/express')
const AdminJSMongoose = require('@adminjs/mongoose')

AdminJS.registerAdapter({ Resource: AdminJSMongoose.Resource, Database: AdminJSMongoose.Database })

const adminOptions = {
    resources: require('./resource'),
    rootPath: '/master',
    logoutPath: '/master/logout',
    loginPath: '/master/login'
}

const admin = new AdminJS(adminOptions)

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    admin,
    {
        cookieName: "adminjs",
        cookiePassword: "complicatedsecurepassword",
        authenticate: async (email, password) => {
            const Author = mongoos.model('Author');
            const user = await Author.findOne({ email });
            if (user) {
                const matched = await bcrypt.compare(password, user.password);
                if (matched) {
                    return user;
                }
            }
            return false;
        },
    },
    null,
    // Add configuration required by the express-session plugin.
    {
        resave: false,
        saveUninitialized: true,
    }
);
app.use(admin.options.rootPath, adminRouter)

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    req.connection = connection;
    next();
});
const apirouter = require('./routes');
app.use(express.static(path.join(__dirname, 'public')));
app.use("/api", apirouter.api);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("/api", apirouter.api);
app.listen(port, () => {
    console.log(`AdminJS started on http://localhost:${port}/swagger`)
})