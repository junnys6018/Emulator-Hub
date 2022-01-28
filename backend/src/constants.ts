export const ENVIRONMENT = process.env.NODE_ENV ?? 'development';
export const EMAIL_USER = process.env.EMAIL_USER as string;
export const EMAIL_PASS = process.env.EMAIL_PASS as string;

if (ENVIRONMENT === 'production') {
    if (process.env.EMAIL_USER === undefined || process.env.EMAIL_PASS === undefined) {
        console.error('missing environment variable EMAIL_USER or EMAIL_PASS');
        process.exit(1);
    }
}
