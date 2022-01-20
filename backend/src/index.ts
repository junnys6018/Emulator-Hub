import express from 'express';

const app = express();
const port = 8000;

app.get('/api/', (_, res) => {
    res.status(200).send('<p>it works<p>');
});
app.listen(port, () => console.log(`Running on port ${port}`));
