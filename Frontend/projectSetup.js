export function SetupWindow() {
    /* */
    const container = document.querySelector('body');
    const rendered = container.querySelector('.setup');
    if (rendered) {
        rendered.remove();
    }
    const setup = document.createElement('div');
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    const nameInput = document.createElement('input');
    const descriptionInput = document.createElement('textarea');
    const dueDateInput = document.createElement('input');
    const statusSelection = document.createElement('select');
    const createButton = document.createElement('button');
    /*         CSS / Visuals        */
    setup.classList.add('setup');
    /*      SVG close button      */
      path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        closeIcon.setAttribute('height', '20px');
        closeIcon.setAttribute('width', '20px');
        closeIcon.setAttribute('viewBox', '0 0 24 24');
        closeIcon.classList.add('close-icon');

    /*      Name input      */
    nameInput.placeholder = 'Project name..';
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('id', 'setup-name-field');

    /*      Description input      */
    descriptionInput.classList.add('textarea');
    descriptionInput.setAttribute('id', 'setup-textarea-field');

    /*      DueDate input      */
    dueDateInput.setAttribute('type', 'date');
    dueDateInput.setAttribute('id', 'setup-duedate-field');

    /*      Status input      */


    createButton.textContent = 'Create';
    /* Event listeners */
    closeIcon.addEventListener('click', ()=> {
            setup.remove();
        })
    createButton.addEventListener('click', async(e) => {
        e.preventDefault();
        const name = nameInput.value;
        const desc = descriptionInput.value;
        const date = dueDateInput.value
        const token = localStorage.getItem('token');
        const project = {
                name: name,
                description: desc,
                dueDate: date,
                token: token
            }
        const response = await fetch('http://127.0.0.1:5000/projects', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project)
        })
        const data = response.json();
        console.log(data); 
        

        location.reload();
    })
    /* Appending */
    closeIcon.appendChild(path);
    setup.appendChild(closeIcon);
    setup.appendChild(nameInput);
    setup.appendChild(descriptionInput);
    setup.appendChild(dueDateInput);
    setup.appendChild(createButton);
    container.appendChild(setup);
}