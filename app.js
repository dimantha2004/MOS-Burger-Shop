const validUsername = "nish";
const validPassword = "123";

function login(event) {
    event.preventDefault();
    const username = document.getElementById('USERNAME').value;
    const password = document.getElementById('PASSWORD').value;

    if (username === validUsername && password === validPassword) {
        document.querySelector('.login-container').style.display = 'none';
        document.getElementById('app-content').style.display = 'block';
    } else {
        alert("Incorrect username or password. Please try again.");
    }
}
// --------------------------------------------------------------------------

const orderButtons = document.querySelectorAll('.order-btn');

orderButtons.forEach(button => {
    button.addEventListener('click', function () {
        const productName = this.dataset.name;
        const productPrice = parseFloat(this.dataset.price);
        addToCart(productName, productPrice);
    });
});

let cart = [];
let orders = JSON.parse(localStorage.getItem('orders')) || [];

function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.price += productPrice;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
    updateCart();
}

function updateCart() {
    const cartItemsList = document.getElementById('cart-items');
    const totalElement = document.getElementById('total');
    cartItemsList.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ${item.price.toFixed(2)}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('remove-btn');
        removeButton.addEventListener('click', () => removeFromCart(index));
        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
        total += item.price;
    });

    totalElement.textContent = `Total: RS: ${total.toFixed(2)}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber')) || 0;

console.log('Initial lastOrderNumber:', lastOrderNumber);  

function saveOrder() {
    if (cart.length === 0) {
        alert("Your cart is empty");
        return;
    }

    lastOrderNumber++;
    console.log('Incremented lastOrderNumber:', lastOrderNumber);  
    
    localStorage.setItem('lastOrderNumber', lastOrderNumber); 
    
    const orderId = lastOrderNumber.toString().padStart(4, '0');
    console.log('Generated Order ID:', orderId); 

    const order = {
        id: orderId,
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price, 0),
        timestamp: new Date().toLocaleString()
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    cart = [];
    updateCart();
    alert(`Order ${orderId} saved successfully!`);
}


function displayReport() {
    if (orders.length === 0) {
        alert("No orders available to display.");
        return;
    }
    const reportWindow = window.open('', '_blank');
    reportWindow.document.write('<h1>Orders Report</h1>');
    orders.forEach(order => {
        reportWindow.document.write(`
            <div>
                <h3>Order ID: ${order.id}</h3>
                <p>Date: ${order.timestamp}</p>
                <ul>
                    ${order.items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
                </ul>
                <p><strong>Total: ${order.total.toFixed(2)}</strong></p>
                <hr>
            </div>
        `);
    });
}

function clearCart() {
    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    cart = [];
    updateCart();
    alert("Cart cleared successfully!");
}

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const confirmPayment = confirm(`Your total amount is ${totalAmount.toFixed(2)}. Do you wish to proceed to payment?`);

    if (confirmPayment) {
        alert("Payment successful! Thank you for your purchase.");
        saveOrder();
        cart = [];
        updateCart();
    } else {
        alert("Payment canceled.");
    }
}

document.getElementById('save-order-btn').addEventListener('click', saveOrder);
document.getElementById('report-btn').addEventListener('click', displayReport);
document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
document.getElementById('checkout-btn').addEventListener('click', checkout);

function showHome() {
    document.getElementById('menu-section').style.display = 'none';
    hideAllSections();
}

function showMenu() {
    document.getElementById('menu-section').style.display = 'block';
    hideAllSections();
}

function showCategory(category) {
    hideAllSections();
    document.getElementById(`${category}-section`).style.display = 'block';
}

function hideAllSections() {
    const sections = document.querySelectorAll('.category-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
    const confirmPayment = confirm(`Your total amount is RS: ${totalAmount.toFixed(2)}. Do you wish to proceed to payment?`);

    if (confirmPayment) {
        
        const phoneNumber = prompt("Please enter your phone number:");

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert("Invalid phone number. Please enter a 10-digit phone number.");
            return;
        }

        const order = {
            id: (lastOrderNumber + 1).toString().padStart(4, '0'),
            items: cart,
            total: totalAmount,
            timestamp: new Date().toLocaleString(),
            phoneNumber: phoneNumber
        };

        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        cart = [];
        updateCart();

        alert(`Order ${order.id} saved successfully!`);
        alert("Payment successful! Thank you for your purchase.");
    } else {
        alert("Payment canceled.");
    }
}

function displayReport() {
    if (orders.length === 0) {
        alert("No orders available to display.");
        return;
    }

    const reportWindow = window.open('', '_blank');
    reportWindow.document.write(`
        <html>
        <head>
            <title>Orders Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                h1 {
                    text-align: center;
                }
                .order {
                    border-bottom: 2px solid #ddd;
                    padding: 10px 0;
                    margin-bottom: 20px;
                }
                .order h3, .order p {
                    margin: 5px 0;
                }
                .items {
                    list-style-type: disc;
                    padding-left: 20px;
                }
                .items li {
                    margin: 5px 0;
                }
                .total {
                    font-weight: bold;
                    margin-top: 10px;
                }
            </style>
        </head>
        <body>
            <h1>Orders Report</h1>
    `);

    orders.forEach(order => {
        reportWindow.document.write(`
            <div class="order">
                <h3>Order ID: ${order.id}</h3>
                <h3>Phone Number: ${order.phoneNumber || 'Not provided'}</h3>
                <p><strong>Date:</strong> ${order.timestamp}</p>
                <ul class="items">
                    ${order.items.map(item => `<li>${item.name} - RS ${item.price.toFixed(2)}</li>`).join('')}
                </ul>
                <p class="total">Total: RS ${order.total.toFixed(2)}</p>
            </div>
        `);
    });

    
    reportWindow.document.close();
}







