$(function () {
  let edit = false;
  console.log("Jquery is working");
  $("#task-result").hide();

  fetchTasks();

  $("#search").keyup(function name() {
    if ($("#search")) {
      let search = $("#search").val();
      $.ajax({
        url: "task-search.php",
        type: "POST",
        data: { search }, //search : search
        success: function (response) {
          let tasks = JSON.parse(response);
          let template = "";
          tasks.forEach((task) => {
            console.log(task);
            template += `<li>
                    ${task.name}
                    </li>`;
          });
          $("#container").html(template);
          $("#task-result").show();
        },
      });
    }
  });
  $("#task-form").submit(function (e) {
    const postData = {
      name: $("#name").val(),
      description: $("#description").val(),
      id: $('#taskID').val()
    };
    let url = edit === false ? 'task-add.php' : 'task-edit.php';
    console.log(url);
    $.post(url, postData, function (response) {
      console.log(response);
      fetchTasks();
      $('#task-form').trigger('reset');
    });
    e.preventDefault();
  });
 function fetchTasks(){
    $.ajax({
        url: 'task-list.php',
        type: 'GET',
        success: function(response){
            let tasks = JSON.parse(response);
            //console.log(response);
            let template = '';
            tasks.forEach(task => {
                template += `
                    <tr taskId="${task.id}">
                        <td>${task.id}</td>
                        <td>
                            <a href="#" class="task-item">${task.name}<a/>
                        </td>
                        <td>${task.description}</td>
                        <td>
                                <button class="btn btn-danger task-delete">
                                    DELETE
                                </button>
                        </td>
                    </tr>
                `;
                $('#tasks').html(template);
            });
        }
      });
 }
 $(document).on('click', '.task-delete', function(){
    if(confirm('Are you sure you want to delete it?')){
        let element = $(this)['0'].parentElement.parentElement;
        let id = $(element).attr('taskId');
        $.post('task-delete.php', {id}, function(response){
            fetchTasks();
            console.log(response);
        });
    }
 });
$(document).on('click', '.task-item', function(){
    let element =$(this)[0].parentElement.parentElement;
    let id= $(element).attr('taskId');
    $.post('task-single.php', {id}, function(response){
        const task = JSON.parse(response);
        $('#name').val(task.name);
        $('#description').val(task.description);
        $('#taskID').val(task.id);
        edit = true;
    })
   
})

});
