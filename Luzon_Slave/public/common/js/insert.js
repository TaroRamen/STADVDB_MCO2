$(document).ready(function(){

    $('#insert-submit-btn').click(function(){
        $.post('/insert-post',
            {
                patientid: $('#insert-patientid-input').val(),
                doctorid: $('#insert-doctorid-input').val(),
                clinicid: $('#insert-clinicid-input').val(),
                appstatus: $('#insert-appstatus-input').find(":selected").val(),
                timequeued: $('#insert-timequeued-input').val(),
                queuedate: $('#insert-queuedate-input').val(),
                starttime: $('#insert-starttime-input').val(),
                endtime: $('#insert-endtime-input').val(),
                apptype: $('#insert-apptype-input').find(":selected").val(),
                isvirtual: $('#insert-isvirtual-input').find(":selected").val(),
                clinicregion: $('#insert-clinicregion-input').find(":selected").val()
            },
            function(data, status){
                if(status === 'success')
                {

                    if (data.result && data.result.affectedRows > 0) {
                        window.alert("Insert successful");
                    } else {
                        window.alert("Insert failed");
                    }

                    const inputID = [
                        'patientid',
                        'doctorid',
                        'clinicid',
                        'timequeued',
                        'queuedate',
                        'starttime',
                        'endtime'
                    ];

                    for(let i = 0; i < inputID.length; i++){
                        $('#insert-' + inputID[i] + '-input').val('')
                    }//for

                    const selectID = [
                        'appstatus',
                        'apptype',
                        'isvirtual',
                        'clinicregion'
                    ]
                    
                    for(let i = 0; i < selectID.length; i++){
                        $('#insert-' + selectID[i] + '-input').val('').change();
                    }//for
                }//if
        });//get
    });//btn

})//document ready
