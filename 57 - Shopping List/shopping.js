const shoppingForm = document.querySelector('.shopping');
const list = document.querySelector('.list');

let items = [];

function handleSubmit(e) {
    e.preventDefault();
    const item = e.currentTarget.item.value;
    if (!item) return;
    const itemId = Date.now();
    const itemStorage = {
        name: item,
        id: itemId,
        isChecked: false,
    };
    items.push(itemStorage);
    shoppingForm.reset();
    displayItemList();
    list.dispatchEvent(new CustomEvent('updateItems'));
}

function displayItemList() {
    const html = items.map(
        input => `
        <ul class="list">
            <li class="shopping-item">
                <input 
                    type="checkbox"
                    data-id="${input.id}"
                    class="checkbox"
                    ${input.isChecked && 'checked'}>
                <span class="itemName">${input.name}</span>
                <button
                    class="remove-btn" 
                    type="button"
                    data-id="${input.id}"
                    aria-label="remove">
                    &times
                </button>
            </li>
        </ul>
        `).join('');
    list.innerHTML = html;
}

function sendItemstoLS() {
    localStorage.setItem('items', JSON.stringify(items));
}

function getItemsFromLS() {
    const localItemsList = JSON.parse(localStorage.getItem('items'));
    items.push(...localItemsList);
    list.dispatchEvent(new CustomEvent('updateItems'));
}

function removeItem(id) {
    items = items.filter(item => item.id !== id);
    list.dispatchEvent(new CustomEvent('updateItems'));
}

function handleChecked(id) {
    const clickedItem = items.find(clickedObj => clickedObj.id === id);
    clickedItem.isChecked = !clickedItem.isChecked;
    list.dispatchEvent(new CustomEvent('updateItems'));
}

shoppingForm.addEventListener('submit', handleSubmit);
list.addEventListener('updateItems', sendItemstoLS);
list.addEventListener('updateItems', displayItemList);

getItemsFromLS();

list.addEventListener('click', function(event) {
    if (event.target.matches(".remove-btn")) {
        const id = parseInt(event.target.dataset.id);
        return removeItem(id);
    }
    if (event.target.matches(".checkbox")) {
        const id = parseInt(event.target.dataset.id);
        return handleChecked(id); 
    }
    return;
});