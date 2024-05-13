$(document).ready(function(){

    $('#home-btn').click(function(){
        $.get('/',function(data, status){
            if(status === 'success')
            {
                window.location.replace('/');
            }//if
        });//get
    });//btn

    $('#insert-btn').click(function(){
        $.get('insert',function(data, status){
            if(status === 'success')
            {
                window.location.replace('insert');
            }//if
        });//get
    });//btn

    $('#update-btn').click(function(){
        $.get('update-search',function(data, status){
            if(status === 'success')
            {
                window.location.replace('update-search');
            }//if
        });//get
    });//btn

    $('#search-btn').click(function(){
        $.get('search-insert',function(data, status){
            if(status === 'success')
            {
                window.location.replace('search-insert');
            }//if
        });//get
    });//btn

    $('#view-btn').click(function(){
        $.get('view-search',function(data, status){
            if(status === 'success')
            {
                window.location.replace('view-search');
            }//if
        });//get
    });//btn

    $('#crash-main-btn').click(function(){
        $.post('crash-main', 
            {
                crash: $('#crash-main-btn').attr('name')
            },
            function(data, status)
            {
                if(status === 'success')
                {
                    if(data.crash === "false"){
                        $('#crash-main-btn').attr('name','true')
                        $('#crash-status-main').html('true')
                    }
                    else{
                        $('#crash-main-btn').attr('name','false')
                        $('#crash-status-main').html('false')
                    }
                    $('#lightning').get(0).play()
                    window.alert(JSON.stringify(data.recoveryResults))
                }//if
            }//fn
        );//post
    });//btn
    
    $('#crash-slave-btn').click(function(){
        $.post('crash-slave', 
            {
                crash: $('#crash-slave-btn').attr('name')
            },
            function(data, status)
            {
                if(status === 'success')
                {
                    if(data.crash === "false"){
                        $('#crash-slave-btn').attr('name','true')
                        $('#crash-status-slave').html('true')
                    }
                    else{
                        $('#crash-slave-btn').attr('name','false')
                        $('#crash-status-slave').html('false')
                    }
                    $('#lightning').get(0).play()
                    window.alert(JSON.stringify(data.recoveryResults))
                }//if
            }//fn
        );//post
    });//btn
})//document ready
