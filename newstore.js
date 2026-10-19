if (products.length === 0) {
  $.getJSON('store.json', function(data) {
    products = $.map(data, function(p) {
      return {
        id: p.id,
        description: p.description,
        category: p.category,
        unitOfMeasurement: p.unit,
        price: p.price,
        additionalInfo: ''
      };
    });
    localStorage.setItem('products', JSON.stringify(products));
    showProducts();
  });
}

$('#searchProducts').on('input', function() {
  const term = $(this).val().trim().toLowerCase();
  if (term === '') {
      showProducts(products);
      return;
  }
  const matches = $.grep(products, function(p) {
    return String(p.id) === term ||
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term);
  });
  showProducts(matches);
});

