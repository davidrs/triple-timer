
let actor_movies = {};
let current_name='';
let seed=0;
let start_time=0;
let previous_times=[];



function render_times() {    

    // This code displays the date and time of the previous times that the user 
    // clicked the button in an html table.
    // The table has three columns: <th>Start Time</th>, <th>15 min end</th>, <th>2hr end</th>
    // The table is sorted by the start time.
    // The table is cleared and re-rendered every time the user clicks the button.
    
    // Clear the table.
    $("#history").html('');
    // Reverse Sort the previous_times list.
    previous_times.sort(function(a, b){return b-a});
    // Add the table header.
    $("#history").append('<tr><th>Start Time</th><th>15 min end</th><th>2hr end</th><th> </th></tr>');
    // Add the table rows.
    for (let i = 0; i < previous_times.length; i++) {
        let date = new Date(previous_times[i]);
        let date_string = date.toLocaleDateString();    
        let time_string = date.toLocaleTimeString();
        let fifteen_min_end = new Date(previous_times[i] + 15*60000);
        // Only show hours and minutes.
        let fifteen_min_end_string = fifteen_min_end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        let two_hr_end = new Date(previous_times[i] + 120*60000);
        let two_hr_end_string = two_hr_end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        // Only show date if first of that day.
        if (i > 0) {
            let previous_date = new Date(previous_times[i-1]);
            if (date.getDate() == previous_date.getDate()) {
                date_string = '';
            }
        }   

        //include a column with a delete buytton to remove that ebntry from the list of previous_times.
        $("#history").append('<tr><td>' + date_string + ' ' + time_string + '</td><td>' + fifteen_min_end_string + '</td><td>' + two_hr_end_string +    '</td><td><button class="delete" id="delete' + i + '">x</button></td></tr>');  
        // Add a click handler to the delete button.
        $("#delete" + i).click(function() {
            // Remove the time from the list.
            previous_times.splice(i, 1);
            // Save the list to local storage.
            localStorage.setItem('previous_times', JSON.stringify(previous_times));
            // Re-render the table.
            render_times();
        }
        );  

    }

}

// #delete button should clear previous_times list and local storage.
$( "#delete" ).click(function() {
    previous_times = [];
    localStorage.setItem('previous_times', JSON.stringify(previous_times));
    render_times();
});



$( "#start" ).click(function() {
    // Set start_time to now.
    start_time = Date.now();
    localStorage.setItem('start_time', start_time);

    // Add start_time list o previous_times
    previous_times.push(start_time);
    render_times();


    // Save list of previous times to local storage.
    localStorage.setItem('previous_times', JSON.stringify(previous_times));

});


// Once page loads, load previous_times from local storage.
$(document).ready(function() {
    //load start time from local storage
    start_time = localStorage.getItem('start_time');
    if (start_time == null) {
        start_time = 0;
    }


    //load previous times from local storage    
    previous_times = JSON.parse(localStorage.getItem('previous_times'));
    if (previous_times == null) {
        previous_times = [];
    }
    render_times();

    // Set the timer to update every 1000ms.
    setInterval(function() {
        // Get the current time.
        var now = Date.now();
        // Calculate the difference between now and start_time.
        var diff = now - start_time;
        // Calculate the minutes and seconds.
        var minutes = Math.floor(diff / 60000);
        var seconds = Math.floor((diff % 60000) / 1000);
        // Update the #time, pad minutes and seconds with 0 if needed.
        $('#time').html(minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0'));
    }, 1000);
});