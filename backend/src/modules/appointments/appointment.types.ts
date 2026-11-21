export interface Appointment {
    id: string;
    patientName: string;
    number: string;
    dentalService: string;
    date: string;
    time: string;
    email:string;
    status: "confirmed" | "canceled";
}
 
export type CreateAppointmentDTO = Omit<Appointment, "id" | "status">;