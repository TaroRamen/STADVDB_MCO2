$(document).ready(function(){

    $('#view-view-submit-btn').click(function(){
        $.post('/view-view-post',function(data, status){
            if(status === 'success')
            {
                window.location.replace('/view-search');
            }//if
        });//get
    });//btn

    $('#report-1-btn').click(function(){
        $.post('/view-search-post',
            {
                query: ('START TRANSACTION; SELECT clinicid AS keyname, count(*) AS count FROM appointments GROUP BY clinicid ORDER BY count DESC')
            },
            function(data, status){
                if(status === 'success')
                {
                    window.location.replace('/view-view');
                }//if
        });//get
    });//btn

    $('#report-2-btn').click(function(){
        $.post('/view-search-post',
            {
                query: ('SELECT appstatus AS keyname, count(*) AS count FROM appointments GROUP BY appstatus ORDER BY count DESC')
            },
            function(data, status){
                if(status === 'success')
                {
                    window.location.replace('/view-view');
                }//if
        });//get
    });//btn

    $('#report-3-btn').click(function(){
        $.post('/view-search-post',
            {
                query: ('SELECT clinicregion AS keyname, count(*) AS count FROM appointments GROUP BY clinicregion ORDER BY count DESC')
            },
            function(data, status){
                if(status === 'success')
                {
                    window.location.replace('/view-view');
                }//if
        });//get
    });//btn

    $('#report-4-btn').click(function(){
        $.post('/view-search-post',
            {
                query: ('SELECT isvirtual AS keyname, count(*) AS count FROM appointments GROUP BY isvirtual ORDER BY count DESC')
            },
            function(data, status){
                if(status === 'success')
                {
                    window.location.replace('/view-view');
                }//if
        });//get
    });//btn

    
})//document ready