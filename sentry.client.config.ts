import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://60bc70a468350444d51ce6525f6f11b9@o4509524411416576.ingest.us.sentry.io/4509524547010560",
    integrations: [
        Sentry.replayIntegration(),
        Sentry.feedbackIntegration({
            // Additional SDK configuration goes in here, for example:
            colorScheme: "system",
            isNameRequired: true,
            isEmailRequired: true,
        }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: false,
});