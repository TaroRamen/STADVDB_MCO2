const mysql = require('mysql2');

var write = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20030",
    user: "master",
    password: "master",
    database: "VisMin"
});

var read = mysql.createConnection({
    host: "ccscloud.dlsu.edu.ph",
    port: "20032",
    user: "slave2",
    password: "slave2",
    database: "VisMin"
});

write.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Master database!: Master VisMin");
});

read.connect(function(err) {
    if (err) throw err;
    console.log("Connected to Slave database!: Slave VisMin");
})

function masterCrash(write){

    write.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Master database!: Master VisMin");
    });

    write = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20032",
        user: "slave2",
        password: "slave2",
        database: "VisMin"
    });
    
    write.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Slave Recovery database!: Slave Recovery VisMin");
    });

    module.exports.write = write;

}

function slaveCrash(read, write){

    read.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!: Slave VisMin");
    });

    read = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "VisMin"
    });
    
    read.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!: Master Recovery VisMin");
    });

    write.end(function(err) {
        if (err) throw err;
        console.log("Disconnected to Slave database!: Slave Database");
    });

    write = mysql.createConnection({
        host: "ccscloud.dlsu.edu.ph",
        port: "20030",
        user: "master",
        password: "master",
        database: "tempDB"
    });

    write.connect(function(err) {
        if (err) throw err;
        console.log("Connected to Master Recovery database!: Master Recovery VisMin");
    })

    module.exports.read = read;
    module.exports.write = write;

}

async function masterRecover(read, write){

    try {

        //recover the values from VisMin.tempVisMin
        var tempData = await getAllApps(1, read)

        console.log(tempData)

        //delete the values
        var resultDelAll = await deleteAllApps(1, read)

        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempVisMin")
        }

        write.end(function(err) {
            if (err) throw err;
            console.log("Disconnected to Slave Recovery database!: Slave VisMin");
        });

        write = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "VisMin"
        });
        
        write.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Master database!: Master VisMin");
        });

        module.exports.write = write;

        var update = 0;
        var insert = 0;
        //write them to master
        for(let i = 0; i < tempData.length ; i++){
            var newData = {
                patientid: tempData[i].patientid,
                doctorid: tempData[i].doctorid,
                clinicid: tempData[i].clinicid,
                apptid: tempData[i].apptid,
                appstatus: tempData[i].appstatus,
                timequeued: tempData[i].timequeued,
                queuedate: tempData[i].queuedate,
                starttime: tempData[i].starttime,
                endtime: tempData[i].endtime,
                apptype: tempData[i].apptype,
                isvirtual: tempData[i].isvirtual,
                clinicregion: tempData[i].clinicregion
            };

            var resultDel = await deleteApp(newData, write)
            var resultIns = await insertApp(newData, write)

            if (resultDel && resultDel.affectedRows > 0) {
                update += 1
                insert -= 1
            }

            if (resultIns && resultIns.affectedRows > 0) {
                insert += 1
            }
        }

        //return ammount of success
        return { update: update, insert: insert }

    
    } catch (error) {
    // Handle any errors that occur within the try block
    console.error("An error occurred:", error);
    // You may want to add additional error handling or logging here
}
}

async function slaveRecover(read, write){

    try {
        // Recover the values from Master.tempDB.tempVisMin
        var tempData = await getAllApps(2, write);
        console.log(tempData);
    
        // Delete the values
        var resultDelAll = await deleteAllApps(2, write);

        if (resultDelAll && resultDelAll.affectedRows > 0) {
            console.log("Deleted values from TempVisMin");
        }
    
        // End the current read connection
        read.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!: Master Recovery VisMin");
        });
    
        // Create a new read connection
        var read = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20032",
            user: "slave2",
            password: "slave2",
            database: "VisMin"
        });
    
        // Connect to the new read database
        read.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Slave database!: Slave VisMin");
        });
    
        // End the current write connection
        write.end(function(err) {
            if (err) throw err;
            console.log("Disconnected from Master Recovery database!: Master Recovery VisMin");
        });
    
        // Create a new write connection
        var write = mysql.createConnection({
            host: "ccscloud.dlsu.edu.ph",
            port: "20030",
            user: "master",
            password: "master",
            database: "VisMin"
        });
    
        // Connect to the new write database
        write.connect(function(err) {
            if (err) throw err;
            console.log("Connected to Slave database!: Slave VisMin");
        });
    
        // Export read and write modules
        module.exports.read = read;
        module.exports.write = write;
    
        var update = 0;
        var insert = 0;
    
        // Write data to the master
        for (let i = 0; i < tempData.length; i++) {
            var newData = {
                patientid: tempData[i].patientid,
                doctorid: tempData[i].doctorid,
                clinicid: tempData[i].clinicid,
                apptid: tempData[i].apptid,
                appstatus: tempData[i].appstatus,
                timequeued: tempData[i].timequeued,
                queuedate: tempData[i].queuedate,
                starttime: tempData[i].starttime,
                endtime: tempData[i].endtime,
                apptype: tempData[i].apptype,
                isvirtual: tempData[i].isvirtual,
                clinicregion: tempData[i].clinicregion
            };
    
            var resultDel = await deleteApp(newData, write);
            var resultIns = await insertApp(newData, write);
    
            if (resultDel && resultDel.affectedRows > 0) {
                update += 1;
                insert -= 1;
            }
    
            if (resultIns && resultIns.affectedRows > 0) {
                insert += 1;
            }
        }
    
        // Return the number of successful updates and inserts
        return { update: update, insert: insert };
    } catch (error) {
        // Handle any errors that occur within the try block
        console.error("An error occurred:", error);
        // You may want to add additional error handling or logging here
    }
    


}

module.exports = {
    write, read,
    masterCrash,
    masterRecover,
    slaveCrash,
    slaveRecover
};

function getAllApps(option, sql) {
    if(option === 1){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM tempVisMin";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
    if(option === 2){
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM tempVisMin";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
} //func

function deleteAllApps(option, sql) {
    if(option === 1){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM tempVisMin";
            sql.query(query , function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
    if(option === 2){
        return new Promise((resolve, reject) => {
            const query = "DELETE FROM tempVisMin";
            sql.query(query, function (err, result, fields) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            }); //sql.query
        }); //return promise
    }
} //func

function insertApp(data, sql) {
    return new Promise((resolve, reject) => {
        const query = `
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
            START TRANSACTION;
            INSERT INTO appointments 
            (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            COMMIT;`;

        sql.query(
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
} //func

function deleteApp(data, sql) {
    return new Promise((resolve, reject) => {
        const query = `
            DELETE FROM appointments
            WHERE apptid = ?`;

        sql.query(
            query,
            [
                data.apptid,
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
} //func

function mainrecApp(data, sql) {
    return new Promise((resolve, reject) => {
        const query = `
            SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
            START TRANSACTION;
            INSERT INTO appointments 
            (patientid, doctorid, clinicid, apptid, appstatus, timequeued, queuedate, starttime, endtime, apptype, isvirtual, clinicregion) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            COMMIT;`;

        sql.query(
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
} //func