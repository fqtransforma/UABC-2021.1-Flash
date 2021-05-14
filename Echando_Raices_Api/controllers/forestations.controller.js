const dbPool = require('../db/sqldb');

// GET ALL FORESTATIONS
exports.forestations_getAll = (req, res, next) => {
    dbPool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return res.status(500).json({ error: err });
        }

        const sql = 'SELECT * FROM forestacion';
        conn.query(sql, (error, rows, fields) => {
            if(!error) {
                const response = {
                    forestations: rows.map(row => {
                        return {
                            _id: row.idforestacion,
                            plant_count: row.num_plantas,
                            coords: row.coordenadas,
                            plant_type: row.tipo_planta_id,
                            userId: row.usuario_id,
                            areaId: row.espacio_id,
                            date: row.fecha,
                            request: {
                                type: 'GET',
                                url: 'http://' + process.env.API_HOST + ':' + process.env.PORT + '/forestations/' + row.idforestacion
                            }
                        }
                    })
                }
                res.status(200).json(response);
            } else {
                res.status(400).json({ error: error });
            }
        });
        conn.release();
    });
}

// GET SPECIFIED FORESTATION BY ID
exports.forestations_getById = (req, res, next) => {
    dbPool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            return res.status(500).json({ error: err });
        }

        const id = req.params.forestationId;
        const sql = 'SELECT * FROM forestacion WHERE idforestacion = ' + conn.escape(id);
        conn.query(sql, (error, rows, fields) => {
            if(!error) {
                if(rows.length > 0) {
                    const response = {
                        forestation: rows.map(row => {
                            return {
                                _id: row.idforestacion,
                                plant_count: row.num_plantas,
                                coords: row.coordenadas,
                                plant_type: row.tipo_planta_id,
                                userId: row.usuario_id,
                                areaId: row.espacio_id,
                                date: row.fecha,
                                request: {
                                    type: 'GET',
                                    url: 'http://' + process.env.API_HOST + ':' + process.env.PORT + '/forestations'
                                }
                            }
                        })[0]
                    }
                    res.status(200).json(response);
                } else
                    res.status(404).json({ message: 'No valid entry for specified ID' });
            } else {
                res.status(400).json({ error: error });
            }
        });
        conn.release();
    });
}
