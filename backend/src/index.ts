import express from 'express';
import sendMail from './email';
import { body, validationResult } from 'express-validator';

const app = express();
const port = 8000;

app.use(express.json());

app.post(
    '/api/send-mail/',
    body('subject').isString(),
    body('email').isEmail().normalizeEmail(),
    body('message').isString(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        sendMail(req.body.subject, req.body.message, req.body.email);

        return res.status(201).json(req.body);
    },
);

app.listen(port, () => console.log(`running on port ${port}`));
