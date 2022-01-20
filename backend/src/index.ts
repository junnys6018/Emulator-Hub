import express from 'express';

const app = express();
const port = 8000;

const environment = process.env.NODE_ENV;

if (environment !== undefined) {
    console.log(`Running in ${environment}`);
}

app.get('/api/', (_, res) => {
    res.status(200).send(`<p>it works | running in ${environment}<p>`);
});
app.listen(port, () => console.log(`Running on port ${port}`));
