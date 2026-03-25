//% backend/src/routes/healthRouter.js
//? Route de health check du serveur


/**
 * Route de health check du serveur
 * 
 * @import { Request, Response } from 'express';
 * @import { ApiResponse } from '../types/index.js';
 * @param {Request} req 
 * @param {Response<ApiResponse<any>>} res 
 */
const healthController = (req, res) => {
    res.status(200).json({ 
        data: {
            status: 'OK',
            timestamp: new Date().toISOString(),
        },
        success: true,
        message: 'Le serveur, il est vivant !'
    });
}

export default healthController;