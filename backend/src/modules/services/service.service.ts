
import { getDentalServiceRepository } from "./service.repository.js";

export async function getAllDentalServices() {
    const repository = getDentalServiceRepository();

    return repository.find({
        order: {
            serviceName: "ASC"
        }
    });
}

export async function createDentalService(
    serviceName: string,
    durationMinutes: number
) {
    const repository = getDentalServiceRepository();

    const newService = repository.create({
        serviceName: serviceName.trim(),
        durationMinutes
    });

    return repository.save(newService);
}

export async function updateDentalServiceDuration(
    serviceId: string,
    durationMinutes: number
) {
    const repository = getDentalServiceRepository();

    const service = await repository.findOneBy({
        serviceId
    });

    if (!service) {
        return null;
    }

    service.durationMinutes = durationMinutes;

    return repository.save(service);
}
