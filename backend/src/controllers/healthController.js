//% backend/src/routes/healthRouter.js
//? Route de health check du serveur

const healthController = (req, res) => {
    res.status(200).json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        message: 'Le serveur, il est vivant !' 
    });
}

export default healthController;