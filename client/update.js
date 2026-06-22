function updateDashboard(){
    fetch("{% url 'live_data' %}").then(response => response.json()).then(data =>{
        document.getElementById("count_patients").innerText = data.patients;
        document.getElementById("count_doctors").innerText = data.doctors;
        document.getElementById("count_staff").innerText = data.staff;
        document.getElementById("count_appointments_today").innerText = data.appointments_today;

        document.getElementById("count_pending_bills").innerText = data.pending_bills;
        document.getElementById("count_cleared_bills").innerText = data.cleared_bills;

        let list = "";
        data.recent_actions.forEach(item =>{
            list += `<li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.time} 
                        <span class="badge bg-primary rounded-pill">${item.message}</span>
                    </li>`;
        });
        document.getElementById("recent_actions_list").innerHTML = list;

        let ann="";
        data.announcements.forEach(a =>{
            ann += `<div class="list-group-item d-flex justify-content-between align-items-center">
                        <h5>${a.title}</h5>
                        <p>${a.message}</p>
                        <small class="text-muted">${a.date}</small>
                    </div>`;
        });
        document.getElementById("announcements_list").innerHTML = ann;
    }).catch(error => console.error('Error fetching data:', error));
}

setInterval(updateDashboard, 5000);

updateDashboard();