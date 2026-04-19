import { Request, Response, NextFunction } from "express";
import { locationService } from "./location.service";
import sendResponse from "@/src/lib/sendResponse";
import { statusCodes } from "@/src/constants/statusCodes";

async function getAllLocations(req: Request, res: Response, next: NextFunction) {
  try {
    const { search } = req.query;
    const locations = await locationService.getAllLocations({ search: search as string });
    return sendResponse({ res, status: true, message: "Locations fetched successfully", data: locations });
  } catch (err) {
    next(err);
  }
}

async function getSingleLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const location = await locationService.getSingleLocationById(Number(id));
    return sendResponse({ res, status: true, message: "Location fetched successfully", data: location });
  } catch (err) {
    next(err);
  }
}

async function createLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const location = await locationService.createLocation(req.body);
    return sendResponse({ res, status: true, message: "Location created successfully", data: location, statusCode: statusCodes.CREATED });
  } catch (err) {
    next(err);
  }
}

async function updateLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const location = await locationService.updateLocation(Number(id), req.body);
    return sendResponse({ res, status: true, message: "Location updated successfully", data: location });
  } catch (err) {
    next(err);
  }
}

async function deleteLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await locationService.deleteLocation(Number(id));
    return sendResponse({ res, status: true, message: "Location deleted successfully" });
  } catch (err) {
    next(err);
  }
}

export const locationController = {
  getAllLocations,
  getSingleLocation,
  createLocation,
  updateLocation,
  deleteLocation,
};
