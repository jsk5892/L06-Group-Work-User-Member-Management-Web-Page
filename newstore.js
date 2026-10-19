$('searchProducts').on('input', function() {
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

