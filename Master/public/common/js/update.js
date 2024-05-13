$(document).ready(function(){

    $('#update-insert-submit-btn').click(function(){
        $.post('/update-insert-post',
            {
                patientid: $('#update-patientid-input').val(),
                doctorid: $('#update-doctorid-input').val(),
                clinicid: $('#update-clinicid-input').val(),
                apptid: $('#update-container').attr('name'),
                appstatus: $('#update-appstatus-input').find(":selected").val(),
                timequeued: $('#update-timequeued-input').val(),
                queuedate: $('#update-queuedate-input').val(),
                starttime: $('#update-starttime-input').val(),
                endtime: $('#update-endtime-input').val(),
                apptype: $('#update-apptype-input').find(":selected").val(),
                isvirtual: $('#update-isvirtual-input').find(":selected").val(),
                clinicregion: $('#update-clinicregion-input').find(":selected").val()
            },
            function(data, status){
                if(status === 'success')
                {

                    if (data.result && data.result.affectedRows > 0) {
                        window.alert("Update successful");
                    } else {
                        window.alert("Update failed");
                    }

                    window.location.replace('/update-search')
                }//if
        });//get
    });//btn

    $('#update-search-submit-btn').click(function(){
        $.post('/update-search-post',
            {
                apptid: $('#update-apptid-search-input').val(),
            },
            function(data, status){
                if(status === 'success')
                {
                    $('#update-apptid-search-input').val('')
                    window.location.replace('/update-insert')
                }//if
        });//get
    });//btn

})//document ready