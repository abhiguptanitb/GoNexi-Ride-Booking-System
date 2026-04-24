const Stripe = require('stripe');

let stripeClient;

function getStripeClient() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    if (!stripeClient) {
        stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    return stripeClient;
}

function getFrontendBaseUrl() {
    return process.env.FRONTEND_URL || 'http://localhost:5173';
}

module.exports = {
    getFrontendBaseUrl,
    getStripeClient,
};
