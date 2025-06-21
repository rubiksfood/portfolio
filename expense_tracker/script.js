const inputForm = document.getElementById('input-form');
const inputDescription = document.getElementById('input-description');
const inputAmount = document.getElementById('input-amount');
const inputCategory = document.getElementById('input-category');

const darkModeButton = document.getElementById('dark-mode-button');
const inputGroup = document.getElementsByClassName('input-group');

const clearAllForms = document.getElementById('clear-all-forms');
const transactionList = document.getElementById('transaction-list');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expense');

const balance = document.getElementById('balance');
const totalBalance = document.getElementById('total-balance');

window.addEventListener('load', function() {
    inputDescription.focus();
});

window.addEventListener('load', loadTransactions);

clearAllForms.addEventListener('submit', function() {
    localStorage.setItem('transactions', JSON.stringify([]));
});

darkModeButton.addEventListener('submit', function(e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    inputForm.classList.toggle('dark-mode');
});

inputForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const description = inputDescription.value.trim();
    const amount = parseFloat(inputAmount.value.trim());
    const category = inputCategory.value;
    const isLoading = false;

    if (description === '' || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    addTransaction(description, amount, category, isLoading);
    showNotification('Transaction successfully added!');
    updateSummary();
    clearInputs();
    inputDescription.focus();
});

// Below: Adds a new transaction to the table.
// Creates table row 'tr', and uses values generated in the previous calling function.
// ToFixed(2) returns a string representation (of the number in the variable) to 2 decimal places.
// Appends created table row to table.

function addTransaction(description, amount, category, isLoading) {
    let type = (category === "Income") ? "+ " : "- ";

    const transaction = {
        description: description,
        amount: amount,
        category: category,
        type: type
    };

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    if(!isLoading) { 
        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
    
    const transactionRow = document.createElement('tr');
    transactionRow.innerHTML = `
    <td>${description}</td>
    <td>${category}</td>
    <td>${type}${amount.toFixed(2)}</td>
    <td><button class="edit-btn">Edit</button></td>
    <td><button class="delete-btn"><i class="fas fa-trash"></i></button></td>
    `;

    if(category === "Income")  transactionRow.children[2].classList.add('positive');
    else                       transactionRow.children[2].classList.add('negative');

    transactionList.appendChild(transactionRow);

    // After adding a transaction, enables the ability to edit or remove the transaction using the edit/delete button.

    transactionRow.querySelector('.edit-btn').addEventListener('click', function() {
        transactionRow.remove();
        editTransaction(transaction);
        updateSummary();
    });

    transactionRow.querySelector('.delete-btn').addEventListener('click', function() {
        transactionRow.remove();
        removeTransaction(transaction);
        updateSummary();
    });
}

// Below: Fills in the input form with the details of the selected transaction, then deletes the transaction, allowing it to be added again with different details.

function editTransaction(transactionToEdit) {

    inputDescription.value = transactionToEdit.description;
    inputAmount.value = transactionToEdit.amount;
    inputCategory.value = transactionToEdit.category;

    removeTransaction(transactionToEdit);
}

function removeTransaction(transactionToRemove) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    transactions = transactions.filter(function(transaction) {
        return !(transaction.description === transactionToRemove.description &&
                 transaction.amount === transactionToRemove.amount &&
                 transaction.category === transactionToRemove.category);
    });

    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function loadTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const isLoading = true;

    transactions.forEach(function(transaction) {
        addTransaction(transaction.description, transaction.amount, transaction.category, isLoading);
    });

    updateSummary();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(function() {
        notification.classList.add('hidden');
    }, 1500); // Notification appears for 1.5 secs
}

// Below: Loops through each transaction in the table. 
// Sums totalExpenses & totalIncomes.

function updateSummary() {
    let totalExpenses = 0;
    let totalIncomes = 0;

    const transactions = transactionList.querySelectorAll('tr');

    transactions.forEach(function(transaction) {
        const category = transaction.children[1].textContent;
        const amount = parseFloat(transaction.children[2].textContent.replace(/\s/g,''));

        if (category === 'Income') {
            totalIncomes += amount;
        } else {
            totalExpenses -= amount;
        }
    });

    totalExpense.textContent = totalExpenses.toFixed(2);
    totalIncome.textContent = totalIncomes.toFixed(2);
    const currentBalance = totalIncomes - totalExpenses;
    balance.textContent = currentBalance.toFixed(2);

    if (currentBalance >= 0) {
        totalBalance.classList.remove('negative');
        totalBalance.classList.add('positive');
    } else {
        totalBalance.classList.remove('positive');
        totalBalance.classList.add('negative');
    }
}

// Below: Clears the values held by the form inputs.

function clearInputs() {
    inputDescription.value = '';
    inputAmount.value = '';
}
