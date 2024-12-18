const validUsername = "nish";
const validPassword = "123";

console.log(validUsername+'- username');
console.log(validPassword+'- pass');


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

//--------------add------------------------------------------

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
//--------------update----------------------------------

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

//--------------remove----------------------------------

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber')) || 0;

console.log('Initial lastOrderNumber:', lastOrderNumber);  

//--------------save----------------------------------

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

//--------------report----------------------------------

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

//--------------clear----------------------------------

function clearCart() {
    if (cart.length === 0) {
        alert("Your cart is already empty.");
        return;
    }

    cart = [];
    updateCart();
    alert("Cart cleared successfully!");
}

//-------------checkout----------------------------------

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
    console.log('Total Amount:', totalAmount); 

    const confirmPayment = confirm(`Your total amount is RS: ${totalAmount.toFixed(2)}. Do you wish to proceed to payment?`);
    console.log('Confirm Payment:', confirmPayment); 

    if (confirmPayment) {
        
        const phoneNumber = prompt("Please enter your phone number:");

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert("Invalid phone number. Please enter a 10-digit phone number.");
            return;
        }

        let lastOrderNumber = parseInt(localStorage.getItem('lastOrderNumber') || '0');
        lastOrderNumber++;
        localStorage.setItem('lastOrderNumber', lastOrderNumber);

        const orderId = lastOrderNumber.toString().padStart(4, '0');
        console.log('Generated Order ID:', orderId); 

        const order = {
            id: orderId,
            items: cart,
            total: totalAmount,
            timestamp: new Date().toLocaleString(),
            phoneNumber: phoneNumber
        };

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        cart = [];
        updateCart(); 

        alert(`Order ${orderId} saved successfully!`);
        alert("Payment successful! Thank you for your purchase.");

        const printConfirm = confirm("Would you like to print your order?");
        if (printConfirm) {
            printOrder(order);
        }
    } else {
        alert("Payment canceled.");
    }
}

//--------------Print----------------------------------

function printOrder(order) {

    if (!order || !order.id) {
        console.error("Invalid order object:", order);
        alert("Failed to print the order. Try again later.");
        return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        console.error("Failed to open print window. Pop-up may be blocked.");
        alert("Failed to open the print window. Please enable pop-ups.");
        return;
    }

    printWindow.document.write(`
        <html>
        <head>
            <title>Order ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                h1 { text-align: center; }
                .order-details { margin-top: 20px; }
                .order-details h2, .order-details p { margin: 5px 0; }
                .items { list-style-type: none; padding-left: 0; }
                .items li { margin: 5px 0; }
                .total { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>Order Confirmation</h1>
            <div class="order-details">
                <h2>Order ID: ${order.id}</h2>
                <p><strong>Date:</strong> ${order.timestamp}</p>
                <p><strong>Phone Number:</strong> ${order.phoneNumber}</p>
                <ul class="items">
                    ${order.items.map(item => `<li>${item.name} - RS ${item.price.toFixed(2)}</li>`).join('')}
                </ul>
                <p class="total">Total: RS ${order.total.toFixed(2)}</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

//--------------report-display----------------------------------

function displayReport() {

    const orders = JSON.parse(localStorage.getItem('orders')) || [];

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
                .search-section {
                    text-align: center;
                    margin: 20px 0;
                }
                .search-section input, .search-section button {
                    padding: 8px;
                    margin: 5px;
                    font-size: 16px;
                }
            </style>
        </head>
        <body>
            <h1>Orders Report</h1>
            <div class="search-section">
                <input type="text" id="search-phone-input" placeholder="Enter Phone Number" />
                <button id="search-phone-btn">Search</button>
            </div>
            <div id="orders-container">
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
                <button id="print-btn">Print</button>
            </div>
        `);
    });

    reportWindow.document.write(`
            </div>
            <script>
                document.getElementById('search-phone-btn').addEventListener('click', function() {
                    const phoneNumber = document.getElementById('search-phone-input').value.trim();

                    const phoneRegex = /^\\d{10}$/;
                    if (!phoneRegex.test(phoneNumber)) {
                        alert("Invalid phone number. Please enter a 10-digit phone number.");
                        return;
                    }

                    const matchingOrders = ${JSON.stringify(orders)}.filter(order => order.phoneNumber === phoneNumber);

                    const ordersContainer = document.getElementById('orders-container');
                    ordersContainer.innerHTML = '';

                    if (matchingOrders.length === 0) {
                        ordersContainer.innerHTML = '<p>No orders found for this phone number.</p>';
                        return;
                    }

                    matchingOrders.forEach(order => {
                        ordersContainer.innerHTML += \`
                            <div class="order">
                                <h3>Order ID: \${order.id}</h3>
                                <h3>Phone Number: \${order.phoneNumber || 'Not provided'}</h3>
                                <p><strong>Date:</strong> \${order.timestamp}</p>
                                <ul class="items">
                                    \${order.items.map(item => \`<li>\${item.name} - RS \${item.price.toFixed(2)}</li>\`).join('')}
                                </ul>
                                <p class="total">Total: RS \${order.total.toFixed(2)}</p>
                            </div>
                        \`;
                    });
                });
            </script>
        </body>
        </html>
    `);

    reportWindow.document.close();
}

document.addEventListener("DOMContentLoaded", function () {
   
    const addProductButton = document.getElementById("add-new-product-btn");
    const appContent = document.querySelector(".app-content");
   
    let newCategoryContainer;

    addProductButton.addEventListener("click", function () {
       
        if (document.getElementById("add-product-form")) return;
        
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <form id="add-product-form" style="margin-top: 10px; padding: 10px; border: 1px solid #ccc;">
                <h3>Add New Product</h3>
                <input type="text" id="photo-link" placeholder="Photo Link" required style="display:block; margin: 5px 0; width: 100%;">
                <input type="text" id="product-name" placeholder="Product Name" required style="display:block; margin: 5px 0; width: 100%;">
                <input type="number" id="product-price" placeholder="Price" required style="display:block; margin: 5px 0; width: 100%;">
                <button type="submit" id="submit-product-btn" style="margin-right: 5px;">Add Product</button>
                <button type="button" id="cancel-form-btn">Cancel</button>
            </form>
        `;
        appContent.appendChild(formContainer);

        const form = document.getElementById("add-product-form");

        
        form.addEventListener("submit", function (e) {
            e.preventDefault();

        
            const photoLink = form.querySelector("#photo-link").value;
            const productName = form.querySelector("#product-name").value;
            const productPrice = form.querySelector("#product-price").value;

            if (photoLink && productName && productPrice) {
                
                if (!newCategoryContainer) {
                    newCategoryContainer = document.createElement("div");
                    newCategoryContainer.classList.add("category");
                    newCategoryContainer.innerHTML = `
                        <h2>Our New Products</h2>
                        <div class="products" id="new-products"></div>
                    `;
                    appContent.appendChild(newCategoryContainer);
                }

                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <img src="${photoLink}" alt="${productName}" style="width: 100px; height: 100px;">
                    <h4>${productName}</h4>
                    <p>Rs: ${productPrice}</p>
                    <button class="order-btn" data-name="${productName}" data-price="${productPrice}">Order</button>
                `;

                const newProductsContainer = document.getElementById("new-products");
                newProductsContainer.appendChild(productDiv);

                
                formContainer.remove();
            } else {
                alert("Please fill in all fields!");
            }
        });
        
        form.querySelector("#cancel-form-btn").addEventListener("click", () => {
            formContainer.remove();
        });
    });
    
    const cartItems = [];
    const cartElement = document.getElementById("cart-items");
    const totalElement = document.getElementById("total");

    document.addEventListener("click", function (event) {
        if (event.target.classList.contains("order-btn")) {
            const name = event.target.dataset.name;
            const price = parseFloat(event.target.dataset.price);
            
            cartItems.push({ name, price });
            updateCart();
        }
    });

//--------------New-updateCart-------------------------------------

    function updateCart() {
        cartElement.innerHTML = "";
        let total = 0;

        cartItems.forEach(item => {
            total += item.price;
            const li = document.createElement("li");
            li.textContent = `${item.name} - Rs: ${item.price}`;
            cartElement.appendChild(li);
        });

        totalElement.textContent = `Total: Rs: ${total.toFixed(2)}`;
    }

    document.getElementById("clear-cart-btn").addEventListener("click", function () {
        cartItems.length = 0; 
        updateCart();
    });
});

