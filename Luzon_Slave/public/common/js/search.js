$(document).ready(function(){

    $('#search-insert-submit-btn').click(function(){
        $.post('/search-insert-post',
            {
                patientid: $('#search-patientid-input').val(),
                clinicid: $('#search-clinicid-input').val(),
                doctorid: $('#search-doctorid-input').val(),
                apptid: $('#search-apptid-input').val(),
                appstatus: $('#search-appstatus-input').find(":selected").val(),
                timequeued: $('#search-timequeued-input').val(),
                queuedate: $('#search-queuedate-input').val(),
                starttime: $('#search-starttime-input').val(),
                endtime: $('#search-endtime-input').val(),
                apptype: $('#search-apptype-input').find(":selected").val(),
                isvirtual: $('#search-isvirtual-input').find(":selected").val(),
                clinicregion: $('#search-clinicregion-input').find(":selected").val(),
            },
            function(data, status){
                if(status === 'success')
                {
                    window.location.replace('/search-view')
                }//if
        });//get
    });//btn

    $('#search-view-submit-btn').click(function(){
        $.post('/search-view-post',function(data, status){
            if(status === 'success')
            {
                window.location.replace('/search-insert');
            }//if
        });//get
    });//btn
    
})//document ready
