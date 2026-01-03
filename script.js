// Initialize count from localStorage
let count = parseInt(localStorage.getItem('count')) || 0;
// Update task counter display
function updateTaskCounter() {
    let pending = 0;

    $('.item').each(function () {
        const isChecked = $(this).find('.checkbox').is(':checked');
        if (!isChecked) {
            pending++;
        }
    });

    $('#pending-count').text(pending);
}

// Load tasks from localStorage
function appendLocalStorage() {
    const keys = Object.keys(localStorage).filter(key => key !== 'count');

    keys.forEach(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            const checkedAttr = data.checked ? 'checked' : '';
            const taskClass = data.checked ? 'task completed' : 'task';

            $('.taskItem').append(createTaskHTML(key, data.text, checkedAttr, taskClass));
        } catch (e) {
            // Handle old format (plain string) or invalid JSON
            const value = localStorage.getItem(key);
            $('.taskItem').append(createTaskHTML(key, value, '', 'task'));
        }
    });

    updateTaskCounter();
}

// Create task HTML
function createTaskHTML(id, text, checkedAttr, taskClass) {
    return `
        <div class="item" id='${id}'>
            <div class="leftContent">
                <div class="check">
                    <input type="checkbox" class="checkbox" ${checkedAttr} />
                </div>
                <div class="${taskClass}">
                    ${text}
                </div>
            </div>
            <div class="rightContent">
                <span class="delete">
                    <img
                        src="image/red-x-cross-mark-icon.svg"
                        alt="delete"
                        width="18px"
                        height="18px"
                    />
                </span>
                <span class="update">
                    <img
                        src="image/pencil-color-icon.svg"
                        alt="edit"
                        width="18px"
                        height="18px"
                    />
                </span>
            </div>
        </div>
    `;
}

// When document is ready
$(document).ready(function () {

    // Load existing tasks
    appendLocalStorage();

    // Add new task
    $("#btn-add").click(function (e) {
        e.preventDefault();

        const taskText = $('#addItem').val().trim();

        if (taskText === '') {
            alert("Item cannot be empty!");
            return;
        }

        const id = crypto.randomUUID();
        const taskData = {
            text: taskText,
            checked: false
        };

        // Add to DOM
        $('.taskItem').append(createTaskHTML(id, taskText, '', 'task'));

        // Save to localStorage
        localStorage.setItem(id, JSON.stringify(taskData));
        count++;
        localStorage.setItem('count', count);

        // Clear input and update counter
        $('#addItem').val('');
        updateTaskCounter();
    });

    // Delete task
    $(document).on('click', '.delete', function (e) {
        e.preventDefault();

        const $item = $(this).closest('.item');
        const itemId = $item.attr('id');

        // Remove from DOM
        $item.remove();

        // Remove from localStorage
        localStorage.removeItem(itemId);
        count--;
        localStorage.setItem('count', count);

        updateTaskCounter();
    });

    // Update/Edit task
    $(document).on('click', '.update', function (e) {
        e.preventDefault();

        const $item = $(this).closest('.item');
        const itemId = $item.attr('id');
        const $taskDiv = $item.find('.task');
        const currentText = $taskDiv.text().trim();

        const editedText = prompt("EDIT TASK:", currentText);

        if (editedText === null) {
            return; // User cancelled
        }

        if (editedText.trim() === '') {
            alert("Task cannot be empty!");
            return;
        }

        // Update display
        $taskDiv.text(editedText.trim());

        // Update localStorage
        const data = JSON.parse(localStorage.getItem(itemId));
        data.text = editedText.trim();
        localStorage.setItem(itemId, JSON.stringify(data));
    });

    // Toggle checkbox
    $(document).on('change', '.checkbox', function () {
        const $item = $(this).closest('.item');
        const itemId = $item.attr('id');
        const $taskDiv = $item.find('.task');
        const isChecked = $(this).is(':checked');

        if (isChecked) {
            $taskDiv.addClass('completed');
        } else {
            $taskDiv.removeClass('completed');
        }

        // Update localStorage
        const data = JSON.parse(localStorage.getItem(itemId));
        data.checked = isChecked;
        localStorage.setItem(itemId, JSON.stringify(data));

        updateTaskCounter();
    });

});