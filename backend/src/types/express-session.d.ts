
import "express-session";

declare module "express-session" {
    interface SessionData {
        doctorId?: string;
        csrfToken?: string;
    }
}

export {};
