let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
let add_task_btn = document.getElementById("add-task-btn");
let task_list = document.getElementById("task-list");
let edit_index = '';

add_task_btn.addEventListener("click",(e)=>{
    e.preventDefault();
    if(document.getElementById("task-input").value.trim()){
      document.getElementsByClassName("task-error")[0].innerHTML = "";
      let cookie = getCookie('todo');
      if(!cookie){
        appendTask();
      }else{
        appendTask();
      }
    }else{
      document.getElementsByClassName("task-error")[0].innerHTML = "Please Enter your task first";
    }
})

function appendTask(pageLoad=false){
  let cookie = getCookie('todo');
  if(!pageLoad){
    /* THIS CODE EXECUTE IF PAGE IS NOT LOADING */ 
    let task_input = document.getElementById("task-input").value.trim();
    let date_time = new Date();
    date_time = `${date_time.getDate()} ${months[date_time.getMonth()]} ${date_time.getFullYear()}, ${date_time.getHours()}:${date_time.getMinutes()}`;

    if(!cookie){
      let task = [{'task':task_input,'date':date_time}];
      setCookie('todo',JSON.stringify(task));
      appendData();
    }else{
      cookie = JSON.parse(cookie);
      let task = {'task':task_input,'date':date_time};
      cookie.push(task);
      setCookie('todo',JSON.stringify(cookie));
      appendData();
    }
  }else{
    /* THIS PART EXECUTE ON PAGE LOAD */ 
    cookie ? appendData():'';
  }
}

function appendData(){
  let cookie = getCookie('todo');
  cookie = cookie ? JSON.parse(cookie) : ''; 
  task_list.innerHTML = '';
  if(cookie){
    for(let index = 0; index < cookie.length; index++){
      let row = document.createElement('div');
      let col1 = document.createElement('div');
      let col2 = document.createElement('div');
      let date = document.createElement('div');

      let a1 = document.createElement('a');
      let a2 = document.createElement('a');
      let a3 = document.createElement('a');
      
      // add class row
      row.classList.add("row","task-box");
      row.id = index;
      // first column for task detail
      col1.classList.add("col-sm-10","col-xs-10","task");
      col1.id = `task${index}`
      col1.innerHTML = cookie[index]['task'];
      col1.setAttribute("data-bs-toggle","modal");
      col1.setAttribute("data-bs-target","#staticBackdrop");
      col1.addEventListener('click',showModal);
      // second column for actions button
      col2.classList.add("col-sm-2","col-sx-2","action-box");
      // Create Save button
      a1.setAttribute("href","javascript:void(0)");
      a1.classList.add("action","text-success","bi","bi-check-circle");
      a1.id = `save-task${index}`;
      a1.setAttribute("task-id",index);
      a1.setAttribute("type","save");
      a1.addEventListener('click',actions);
      a1.style.cssText = "display:none;"
      // create edit button
      a2.setAttribute("href","javascript:void(0)");
      a2.classList.add("action","text-info","bi","bi-pencil-square");
      a2.setAttribute("task-id",index);
      a2.setAttribute("type","edit");
      a2.addEventListener('click',actions);
      // create delete button
      a3.setAttribute("href","javascript:void(0)");
      a3.classList.add("action","text-danger","bi","bi-trash3-fill");
      a3.setAttribute("task-id",index);
      a3.setAttribute("type","delete");
      a3.addEventListener('click',actions);

      date.classList.add('time');
      date.innerHTML = cookie[index]['date']
      // Add all buttons inside second column 
      col2.append(a1,a2,a3,date);
      row.appendChild(col1);
      row.appendChild(col2);
      task_list.append(row);
    }
  }else{
    task_list.innerHTML = '';
  }
  document.getElementById("task-input").value = '';
}

window.addEventListener("load", () => {
  appendTask(true);
});

function actions(e){
  let task_id = e.target.getAttribute('task-id');
  let type = e.target.getAttribute('type');
  if(type === "delete"){
    // document.getElementById(task_id).remove();
    let cookie = JSON.parse(getCookie('todo'));
    cookie.splice(task_id,1);
    if (cookie.length === 0){
      document.cookie = "todo=''; expires=Thu, 18 Dec 2013 12:00:00 UTC";
      appendData();
    }else{
      setCookie('todo',JSON.stringify(cookie));
      appendData();
    }
  }
  else if(type === "edit" && !edit_index){
    let ele = document.getElementById(`task${task_id}`);
    ele.setAttribute("contentEditable",true);
    ele.style.backgroundColor = "#FFFFFF";
    e.target.style.cssText = "display:none";
    document.getElementById(`save-task${task_id}`).style.cssText = 'display:contents;'
    document.getElementById(`task${task_id}`).removeAttribute('data-bs-target');
    document.getElementById(`task${task_id}`).removeAttribute('data-bs-toggle');
    edit_index = `task${task_id}`;
  }
  else if(type === "save" && edit_index == `task${task_id}`){
    let text = document.getElementById(`task${task_id}`).innerText;
    let cookie = JSON.parse(getCookie('todo'));
    cookie[task_id]["task"] = text;
    setCookie('todo',JSON.stringify(cookie));
    appendData();
    edit_index = '';
  } 
}

let showModal = (e)=>{
  document.getElementsByClassName('modal-body')[0].innerHTML = e.target.innerHTML;
}