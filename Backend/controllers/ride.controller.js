const rideService = require("../services/ride.service")
const { validationResult } = require("express-validator")
const mapService = require("../services/maps.service")
const { sendMessageToSocketId } = require("../socket")
const rideModel = require("../models/ride.model")

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" })
    }

    const { pickup, destination, vehicleType } = req.body

    try {
        const ride = await rideService.createRide({
        user: req.user._id,
        pickup,
        destination,
        vehicleType,
    })

    // Fetch coordinates based on pickup location
    const pickupCoordinates = await mapService.getAddressCoordinate(pickup)
    console.log("Pickup coordinates:", pickupCoordinates)

    const captainsInRadius = await mapService.getCaptainsInTheRadius(
        pickupCoordinates.lat,
        pickupCoordinates.lng,
        10000, // 10km radius
    )

    console.log("All captains in radius:", captainsInRadius.length)

    // Filter captains by vehicle type and active status
    const matchingCaptains = captainsInRadius.filter((captain) => {
        const isVehicleMatch = captain.vehicle.vehicleType === vehicleType
        const isActive = captain.status === "active"
        const hasSocketId = captain.socketId

        console.log(`Captain ${captain._id}:`, {
            vehicleType: captain.vehicle.vehicleType,
            requestedType: vehicleType,
            isVehicleMatch,
            isActive,
            hasSocketId: !!hasSocketId,
            socketId: captain.socketId,
        })

        return isVehicleMatch && isActive && hasSocketId
    })

    console.log("Matching captains found:", matchingCaptains.length)

    if (matchingCaptains.length === 0) {
        console.log("No matching captains found for vehicle type:", vehicleType)
        return res.status(404).json({ message: "No drivers available for this vehicle type" })
    }

    ride.otp = ""

    // Populate the ride with user info (for sending to captains)
    const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate("user")

    // Send ride info to matching captains only
    matchingCaptains.forEach((captain) => {
        console.log(`Sending ride to captain ${captain._id} with socket ${captain.socketId}`)
        sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: { ...rideWithUser._doc, vehicleType },
        })
    })

    res.status(201).json(ride)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

    module.exports.getFare = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { pickup, destination } = req.query

    try {
        const fare = await rideService.getFare(pickup, destination)
        return res.status(200).json(fare)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

    module.exports.confirmRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId } = req.body

    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain })

        sendMessageToSocketId(ride.user.socketId, {
        event: "ride-confirmed",
        data: ride,
        })

        return res.status(200).json(ride)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

    module.exports.startRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId, otp } = req.query

    try {
        const ride = await rideService.startRide({ rideId, otp, captain: req.captain })

        console.log(ride)

        sendMessageToSocketId(ride.user.socketId, {
        event: "ride-started",
        data: ride,
        })

        return res.status(200).json(ride)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}

    module.exports.endRide = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { rideId } = req.body

    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain })

        sendMessageToSocketId(ride.user.socketId, {
        event: "ride-ended",
        data: ride,
        })

        return res.status(200).json(ride)
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }
}
