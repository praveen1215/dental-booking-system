
import "dotenv/config";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret || sessionSecret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
}

const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
    name: "dental.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,

    store: new PgSession({
        conObject: {
            host: process.env.DB_HOST ?? "localhost",
            port: Number(process.env.DB_PORT ?? 5432),
            user: process.env.DB_USER ?? "postgres",
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME ?? "dental_booking_db"
        },
        tableName: "user_sessions",
        createTableIfMissing: true
    }),

    cookie: {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 8,
        path: "/"
    }
});
