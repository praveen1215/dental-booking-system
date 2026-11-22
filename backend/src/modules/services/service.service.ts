
import { getDentalServiceRepository } from "./service.repository.js";

export async function getAllDentalServices() {
    const repository = getDentalServiceRepository();

    const services = await repository.find({
        order: {
            serviceName: "ASC"
        }
    });

    return services;
}
