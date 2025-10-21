
export function buildButton(label, className) {
  const btn = document.createElement('button');
  btn.classList.add(`${className}`)
  btn.textContent = label;
  return btn;
}




export function buildLabel( container, text, forWhat ) {
    const label = document.createElement('label');
    label.textContent = `${text}`;
    /* label.classList.add(``) */
    label.setAttribute('for', `${forWhat}`);
    container.appendChild(label)
}





export function buildCloseIcon(container) {
    const closeIcon = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');

    path.setAttribute('d', 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z');
        closeIcon.setAttribute('height', '20px');
        closeIcon.setAttribute('width', '20px');
        closeIcon.setAttribute('viewBox', '0 0 24 24');
        closeIcon.classList.add('close-icon');

    closeIcon.addEventListener('click', ()=> {
                container.remove();
        })
    
    closeIcon.appendChild(path);
    container.appendChild(closeIcon);
}

export function buildInput(type, className, id = 'noIDHere', placeholder = 'none', value = '') {
    const input = document.createElement('input');
    input.setAttribute('type', `${type}`);
    input.classList.add(`${className}`);
    if (!(id === "noIDHere")) input.setAttribute('id', `${id}`);
    if (!(placeholder === 'none')) input.placeholder = `${placeholder}`; 
    if (!(value === '')) input.value = `${value}`;
    return input;
}

export function buildTextArea(className, id = 'noIDHere', placeholder = 'none') {
    const textarea = document.createElement('textarea');
    textarea.classList.add(`${className}`);
    if (!(id === 'noIDHere')) textarea.setAttribute('id', `${id}`);
    if (!(placeholder === 'none')) textarea.placeholder = `${placeholder}`;
   
    return textarea;
}





export function customCheckTask(container, info) {
    const wrapper = document.createElement('div');
    const checkbox = document.createElement('input');
    const paragraph = document.createElement('p');

    /*   CSS / Visuals   */
    wrapper.classList.add('sub-task');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.classList.add('sub-task-check')
    paragraph.classList.add('sub-task-paragraph');
    paragraph.textContent = `${info}`;

    /*    Appending    */
    wrapper.appendChild(checkbox);
    wrapper.appendChild(paragraph);
    container.appendChild(wrapper);
}





export function buildOptions(container, className, statusesArr = []) {
    for (let i = 0; i<= statusesArr.length - 1; i++) {
        const option = document.createElement('option');
        option.classList.add(`${className}`);
        option.textContent = `${statusesArr[i]}`;
        container.appendChild(option);
    } 
}