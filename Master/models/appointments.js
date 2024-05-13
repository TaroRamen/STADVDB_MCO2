const sql = require('../sql');

//-----------------------------------------------------------------------------------
//                             Get All Appointments Functions
//-----------------------------------------------------------------------------------

function getAllLuzonApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments";
        sql.readLuzon.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getAllVisminApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments";
        sql.readVisMin.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function getAllApps() {
    var luzonData = await getAllLuzonApps()
    var visminData = await getAllVisminApps()
    return combine(luzonData, visminData)
} //func

//-----------------------------------------------------------------------------------
//                         Get Count of Appointments Functions
//-----------------------------------------------------------------------------------

function getCountLuzonApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT count(*) as 'count' FROM appointments";
        sql.readLuzon.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getCountVisminApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT count(*) as 'count' FROM appointments";
        sql.readVisMin.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getCountTempLuzonApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT count(*) as 'count' FROM tempLuzon";
        sql.writeLuzon.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getCountTempVisminApps() {
    return new Promise((resolve, reject) => {
        const query = "SELECT count(*) as 'count' FROM tempVisMin";
        sql.writeVisMin.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function getCountAppsMain() {
    var luzonData = await getCountLuzonApps()
    var visminData = await getCountVisminApps()
   return combineCount(luzonData, visminData)
} //func to be fixed

async function getCountAppsTemp() {
    var luzonData = await getCountTempLuzonApps()
    var visminData = await getCountTempVisminApps()
   return combineCount(luzonData, visminData)
} //func to be fixed


async function getCountApps(option) {
    if(option === 'false'){
        var count = await getCountAppsMain()
        return count
        }
    else{
            var count = await getCountAppsMain()
            var countTemp = await getCountAppsTemp()
            return count + countTemp + 1000000
    }
}

//-----------------------------------------------------------------------------------
//                           Get Appointment By Id Functions
//-----------------------------------------------------------------------------------

function getLuzonAppById(apptid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments WHERE apptid = ?";
        sql.readLuzon.query(query, [apptid], function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getVisminAppById(apptid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments WHERE apptid = ?";
        sql.readVisMin.query(query, [apptid], function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function getAppById(apptid) {
    var luzonData = await getLuzonAppById(apptid)
    var visminData = await getVisminAppById(apptid)
   return selectNotNull(luzonData, visminData)
} //func

//-----------------------------------------------------------------------------------
//                                  Insert Functions
//-----------------------------------------------------------------------------------

function insertLuzonApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO appointments 
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            console.log(data)
            sql.writeLuzon.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
    else{
        console.log('recovery')
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tempLuzon
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            sql.writeLuzon.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
} //func

function insertVisminApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO appointments 
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            sql.writeVisMin.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
    else{
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tempVisMin
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            sql.writeVisMin.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
} //func

async function insertApp(data, optionMain, optionSlave1, optionSlave2) {
    if(data.clinicregion === 'Ilocos Region (I)' ||
    data.clinicregion === 'Cagayan Valley (II)' ||
    data.clinicregion === 'Central Luzon (III)' ||
    data.clinicregion === 'CALABARZON (IV-A)' ||
    data.clinicregion === 'MIMAROPA (IV-B)' ||
    data.clinicregion === 'Bicol Region (V)' ||
    data.clinicregion === 'Cordillera Administrative Region (CAR)' ||
    data.clinicregion === 'National Capital Region (NCR)' ){
        return await insertLuzonApp(data, optionMain, optionSlave1)
    }
    else{
        return await insertVisminApp(data, optionMain, optionSlave2)
    }
} //func

//-----------------------------------------------------------------------------------
//                                  Update Functions
//-----------------------------------------------------------------------------------

function updateLuzonApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE appointments 
                SET 
                    patientid = ?, 
                    doctorid = ?, 
                    clinicid = ?, 
                    appstatus = ?, 
                    timequeued = ?, 
                    queuedate = ?, 
                    starttime = ?, 
                    endtime = ?, 
                    apptype = ?, 
                    isvirtual = ?,
                    clinicregion = ?
                WHERE 
                    apptid = ?`;
    
            sql.writeLuzon.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion,
                    data.apptid
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
    else{
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tempLuzon
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            sql.writeLuzon.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
} //func

function updateVisminApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                UPDATE appointments 
                SET 
                    patientid = ?, 
                    doctorid = ?, 
                    clinicid = ?, 
                    appstatus = ?, 
                    timequeued = ?, 
                    queuedate = ?, 
                    starttime = ?, 
                    endtime = ?, 
                    apptype = ?, 
                    isvirtual = ?,
                    clinicregion = ?
                WHERE 
                    apptid = ?`;
    
            sql.writeVisMin.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion,
                    data.apptid
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
    else{
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO tempVisMin
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            sql.writeVisMin.query(
                query,
                [
                    data.patientid,
                    data.doctorid,
                    data.clinicid,
                    data.apptid,
                    data.appstatus,
                    data.timequeued,
                    data.queuedate,
                    data.starttime,
                    data.endtime,
                    data.apptype,
                    data.isvirtual,
                    data.clinicregion
                ],
                function (err, result, fields) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            ); //sql.query
        }); //return promise
    }
} //func

async function updateApp(data, optionMain, optionSlave1, optionSlave2) {
    if(data.clinicregion === 'Ilocos Region (I)' ||
    data.clinicregion === 'Cagayan Valley (II)' ||
    data.clinicregion === 'Central Luzon (III)' ||
    data.clinicregion === 'CALABARZON (IV-A)' ||
    data.clinicregion === 'MIMAROPA (IV-B)' ||
    data.clinicregion === 'Bicol Region (V)' ||
    data.clinicregion === 'Cordillera Administrative Region (CAR)' ||
    data.clinicregion === 'National Capital Region (NCR)' ){
        return await updateLuzonApp(data, optionMain, optionSlave1)
    }
    else{
        return await updateVisminApp(data, optionMain, optionSlave2)
    }
} //func

//-----------------------------------------------------------------------------------
//                                  Search Functions
//-----------------------------------------------------------------------------------

function searchLuzonApp(data) {
    return new Promise((resolve, reject) => {
        const newData = filterEmptyValues(data);
        const query = constructSearchQuery(newData);

        const params = [
            newData.patientid || null,
            newData.doctorid || null,
            newData.clinicid || null,
            newData.apptid || null,
            newData.appstatus || null,
            newData.timequeued || null,
            newData.queuedate || null,
            newData.starttime || null,
            newData.endtime || null,
            newData.apptype || null,
            newData.isvirtual || null,
            newData.clinicregion || null
        ];

        var newParams =  removeNulls(params)

        sql.readLuzon.query(query, newParams, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function searchVisminApp(data) {
    return new Promise((resolve, reject) => {
        const newData = filterEmptyValues(data);
        const query = constructSearchQuery(newData);

        const params = [
            newData.patientid || null,
            newData.doctorid || null,
            newData.clinicid || null,
            newData.apptid || null,
            newData.appstatus || null,
            newData.timequeued || null,
            newData.queuedate || null,
            newData.starttime || null,
            newData.endtime || null,
            newData.apptype || null,
            newData.isvirtual || null,
            newData.clinicregion || null
        ];

        var newParams =  removeNulls(params)

        sql.readVisMin.query(query, newParams, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function searchApp(data) {
    var luzonData = await searchLuzonApp(data)
    var visminData = await searchVisminApp(data)
   return combine(luzonData, visminData)
} //func

//-----------------------------------------------------------------------------------
//                                   View Functions
//-----------------------------------------------------------------------------------

function reportApp(query) {
    return new Promise((resolve, reject) => {
        const luzonPromise = new Promise((resolve, reject) => {
            sql.readLuzon.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        const visminPromise = new Promise((resolve, reject) => {
            sql.readVisMin.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        Promise.all([luzonPromise, visminPromise])
            .then(([luzonResult, visminResult]) => {
                // Combine or process the results from both databases
                const combinedResult = luzonResult.concat(visminResult);
                resolve(combinedResult);
            })
            .catch((error) => {
                reject(error);
            });
    }); //return promise
} //func

function viewLuzonAppById(apptid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments WHERE apptid = ?";
        sql.readLuzon.query(query, [apptid], function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function viewVisminAppById(apptid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments WHERE apptid = ?";
        sql.readVisMin.query(query, [apptid], function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function viewAppById(apptid) {
    try {
        const luzonData = await viewLuzonAppById(apptid);
        const visminData = await viewVisminAppById(apptid);
        return selectNotNull(luzonData, visminData);
    } catch (error) {
        console.error("Error in viewAppById:", error);
        throw error;
    }
} //func


//-----------------------------------------------------------------------------------
//                                  Helper Functions
//-----------------------------------------------------------------------------------

function combineCount(data1, data2) {
    return data1[0].count + data2[0].count;
}

function combine(data1, data2) {
    return data1.concat(data2)
}

function selectNotNull(luzonData, visminData) {
    if(luzonData.length === 0){
        return visminData
    }
    else if(visminData.length === 0){
        return luzonData
    }
    else{
        return [{data: 'none'}]
    }
}

function filterEmptyValues(data) {
    const newData = {};

    for (const key in data) {
        if (data[key] !== "") {
            newData[key] = data[key];
        }
    }

    return newData;
}

function removeNulls(arr) {
    return arr.filter(item => item !== null);
}

function constructSearchQuery(data) {
    let query = "SELECT * FROM appointments WHERE ";
    let conditions = [];
    
    if (data.patientid) {
        conditions.push('patientid = ?');
    }
    
    if (data.doctorid) {
        conditions.push('doctorid = ?');
    }
    
    if (data.clinicid) {
        conditions.push('clinicid = ?');
    }
    
    if (data.apptid) {
        conditions.push('apptid = ?');
    }

    if (data.appstatus) {
        conditions.push('appstatus = ?');
    }
    
    if (data.timequeued) {
        conditions.push('timequeued = ?');
    }
    
    if (data.queuedate) {
        conditions.push('queuedate = ?');
    }
    
    if (data.starttime) {
        conditions.push('starttime = ?');
    }
    
    if (data.endtime) {
        conditions.push('endtime = ?');
    }
    
    if (data.apptype) {
        conditions.push('apptype = ?');
    }
    
    if (data.isvirtual) {
        conditions.push('isvirtual = ?');
    }
    
    if (data.clinicregion) {
        conditions.push('clinicregion = ?');
    }

    if (conditions.length > 0) {
        query += conditions.join(" AND ");
    } else {
        query += "1"; // Returns all records if no condition is provided
    }

    return query;
}

//-----------------------------------------------------------------------------------
//                                  Export Functions
//-----------------------------------------------------------------------------------

module.exports = {
    getAllApps,
    getCountApps,
    getAppById,
    insertApp,
    updateApp,
    searchApp,
    reportApp,
    viewAppById
}
