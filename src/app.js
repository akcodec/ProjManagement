import express from 'express'
import cors from 'cors'
const app = express();

app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'));

app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowHeaders: ['Content-Type', 'Authorization']
}));

//import routes
//healthcheckRoutes 1 object jisse call kiya ja sakta hai
import healthCheckRoutes from './routes/healthcheck.routes.js';

app.use('/api/v1/healthcheck', healthCheckRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});
export default app;