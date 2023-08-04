const socket = io()


socket.on("updateProducts", (products) => {
    
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
        const li = document.createElement("li");
        li.innerText = ` ${product.title} - $${product.price} - `;
        const button = document.createElement("button");
        button.innerText = "Eliminar";
        button.onclick = () => deleteProduct(product.id);
        li.appendChild(button);
        productList.appendChild(li);
    });
});

// Función para crear un nuevo producto
function createProduct() {
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    socket.emit("newProduct", { id: Date.now(), name, price });
}

// Función para eliminar un producto existente
function deleteProduct(id) {
    socket.emit("deleteProduct", { id });
}