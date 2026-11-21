import { AppDataSource } from "../../config/data_source.js";
import { DentalService } from "../../entities/DentalService.js";

export function getDentalServiceRepository() {
    return AppDataSource.getRepository(DentalService);
}
