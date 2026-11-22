
export interface CreateAppointmentDTO {
    patientName: string;
    number: string;
    email: string;
    dentalService: string;
    date: string;
    time: string;
}

export interface AppointmentResult {
    appointmentId: string;
    bookingReference: string;
    patientName: string;
    email: string;
    number: string;
    dentalService: string;
    date: string;
    time: string;
    startTime: string;
    endTime: string;
    status: "confirmed";
}

export class AppointmentError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message);
        this.name = "AppointmentError";
    }
}
