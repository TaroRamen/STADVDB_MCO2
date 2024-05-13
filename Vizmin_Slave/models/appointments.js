const sql = require('../sql');

function getAllApps() {
    return new Promise((resolve, reject) => {
        const query = " SELECT * FROM appointments;";
        sql.read.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getCountAppsMain() {
    return new Promise((resolve, reject) => {
        const query = " SELECT count(*) as 'count' FROM appointments;";
        sql.read.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function getCountAppsSlave() {
    return new Promise((resolve, reject) => {
        const query = " SELECT count(*) as 'count' FROM tempVizMin; ";
        sql.read.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

async function getCountApps(option){
    if(option === 'false'){
        var count = await getCountAppsMain()
        return count[0].count
    }
    else{
        var count = await getCountAppsMain()
        var countTemp = await getCountAppsSlave()
        return count[0].count + countTemp[0].count
    }
}

function getAppById(apptid) {
    return new Promise((resolve, reject) => {
        const query = "SELECT * FROM appointments WHERE apptid = ?;";
        sql.read.query(query, [apptid], function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function insertApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                INSERT INTO appointments 
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            sql.write.query(
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
                START TRANSACTION;
                INSERT INTO tempVisMin
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                COMMIT;`;
    
            sql.write.query(
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

function updateApp(data, optionMain, optionSlave) {
    if(optionMain === 'false' && optionSlave === 'false'){
        return new Promise((resolve, reject) => {
            const query = `
                START TRANSACTION;
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
                    apptid = ?
                    COMMIT;`;
    
            sql.write.query(
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
                START TRANSACTION;
                INSERT INTO tempVisMin
                (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                COMMIT;`;
    
            sql.write.query(
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

function searchApp(data) {
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

        sql.read.query(query, newParams, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

function reportApp(query) {
    return new Promise((resolve, reject) => {
        sql.read.query(query, function (err, result, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        }); //sql.query
    }); //return promise
} //func

//-----------------------------------------------------------------------------------
//                                  Helper Functions
//-----------------------------------------------------------------------------------

function combine(data1, data2) {
    return data1.concat(data2)
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

module.exports = {
    getAllApps,
    getCountApps,
    getAppById,
    insertApp,
    updateApp,
    searchApp,
    reportApp
}
