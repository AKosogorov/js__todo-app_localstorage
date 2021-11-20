(function() {

  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title
    return appTitle
  };

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button,
    };
  };

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };

  function createTodoApp(container, title = 'Список дел', defaultItems = [], whoseTodo) {

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    let localItems =[];
    let storageItems = JSON.parse(localStorage.getItem(whoseTodo));

    function updateLocal() {
      localStorage.setItem(whoseTodo, JSON.stringify(localItems));
    };

    function createTodoItem(name, done) {

      let item = document.createElement('li');
          item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-imets-center');
          item.textContent = name;

      let buttonGroup = document.createElement('div');
          buttonGroup.classList.add('btn-group', 'btn-group-sm');

      let doneButton = document.createElement('button');
          doneButton.classList.add('btn', 'btn-success');
          doneButton.textContent = 'Готово';

      let deleteButton = document.createElement('button');
          deleteButton.classList.add('btn', 'btn-danger');
          deleteButton.textContent = 'Удалить';

      if (done) {
        item.classList.add('list-group-item-success');
      };

      doneButton.addEventListener('click', function(e) {
        item.classList.toggle('list-group-item-success');
        if (item.classList.contains('list-group-item-success')) {
          done = true;
        } else {
          done = false;
        };

        let items = document.querySelectorAll('.btn-success');
        let arrItems = [];
        for (let i=0; i < items.length; i++) {
          arrItems.push(items[i]);
        };
        localItems.forEach((element, index) => {
          if (index == arrItems.indexOf(e.target)) {
            element.done = done;
          };
        });

        updateLocal();
      });

      deleteButton.addEventListener('click', function(e) {
        if (confirm('Вы уверены?')) {

          let items = document.querySelectorAll('.btn-danger');
          let arrItems = [];
          for (let i=0; i < items.length; i++) {
            arrItems.push(items[i]);
          };
          localItems.splice(arrItems.indexOf(e.target), 1);

          item.remove();
          updateLocal();
        };
      });

      buttonGroup.append(doneButton, deleteButton);
      item.append(buttonGroup);
      todoList.append(item);

      localItems.push({name, done});
      updateLocal();

      return {
        item,
        doneButton,
        deleteButton,
      };
    };

    todoItemForm.input.addEventListener('input', function() {
      if (!todoItemForm.input.value) {
        todoItemForm.button.disabled = true;
      } else {
        todoItemForm.button.disabled = false;
      }
    });

    todoItemForm.form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      };
      let todoItem = createTodoItem(todoItemForm.input.value, done = false);
      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });

    function fillTodoList () {

      if (storageItems && storageItems.length > 0) {
        storageItems.forEach((item) => {
          createTodoItem(item.name, item.done);
        });
      } else {
          for (let item of defaultItems) {
            createTodoItem(item.name, item.done);
          };
      };
    };

    fillTodoList ();
  };

  window.createTodoApp = createTodoApp;

})();
