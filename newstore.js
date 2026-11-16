function applyProductSearch() {
    const term = document.getElementById("searchProducts").value.trim().toLowerCase();
    let matches = [];

    for (let i = 0; i < products.length; i++) {
        if (
            String(products[i].id).includes(term) ||
            products[i].description.toLowerCase().includes(term) ||
            products[i].category.toLowerCase().includes(term)
        ) {
            matches.push(products[i]);
        }
    }
    showProducts(matches);
}

document.getElementById("searchProducts").addEventListener("input", applyProductSearch);
