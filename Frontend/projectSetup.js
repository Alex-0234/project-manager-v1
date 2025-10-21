import { buildOptions, buildCloseIcon, buildInput, buildTextArea } from './DOMcreation.js'

export function SetupWindow() {
    /* */
    const container = document.querySelector('body');
    const rendered = container.querySelector('.setup');
    if (rendered) {
        rendered.remove();
    }
    const setup = document.createElement('div');
    const wrapper = document.createElement('div');
    const dueDateInput = buildInput( 'date', 'setup-dueDate', 'setup-duedate-field');
    const selectInput = buildInput( 'text', 'status-select', 'status-select-field', `Seperate with ","`,`In-progress, Finished`);
    const statusSelect = document.createElement('select');
    const nameInput = buildInput( 'text', 'setup-input', 'setup-name-field', 'Project name..');
    const descriptionInput = buildTextArea( 'textarea', 'setup-textarea-field', 'Project description..')
        

    const createButton = document.createElement('button');
    /*         CSS / Visuals        */
    setup.classList.add('setup');

        /*      Status input      */
        statusSelect.classList.add('status-select');
            buildOptions(statusSelect, 'options', ['In-progress', 'Finished']);
        
        wrapper.classList.add('wrapper');
        
        createButton.textContent = 'Create';


    /*              Event listeners              */

    
    createButton.addEventListener('click', async(e) => {
        e.preventDefault();
        const name = nameInput.value;           //                   Project inputs 
        const desc = descriptionInput.value;
        const date = dueDateInput.value;
        const status = statusSelect.value;
        const project = {
                name: name,
                description: desc,
                status: status,
                dueDate: date,
            }
        const response = await fetch('http://127.0.0.1:5000/projects', {
            method: 'POST',
            headers: { 
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(project)
        })
        const data = response.json();
        
        location.reload();
    })

    selectInput.addEventListener('input', () => {
        while (statusSelect.firstChild) {
            statusSelect.firstChild.remove();
        }
        buildOptions(statusSelect, 'status-select', selectInput.value.split(','));
    })



    /*      Appending    */
    wrapper.appendChild(dueDateInput);
    wrapper.appendChild(selectInput);
    wrapper.appendChild(statusSelect);

    buildCloseIcon(setup);
    setup.appendChild(nameInput);
    setup.appendChild(descriptionInput);
    setup.appendChild(wrapper);
    setup.appendChild(createButton);
    container.appendChild(setup);
}