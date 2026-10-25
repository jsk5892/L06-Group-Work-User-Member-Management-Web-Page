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

let cart = [];

$(document).on('click', '.addBtn', function() {
const id = $(this).data('id');
  const item = products.find(function(p) { return p.id === id;});
  cart.push(item);
  showCart();
});

$(document).on('click', 'removeBtn', function(){
  const idex = $(this).data('index');
  cart.splice(index,1);
  showCart();
});


function showCart(){
  let rows = '';
  let total = 0;
  $.each(cart,function(i,item){
    rows += '<tr><td>' + item.id + '</td><td>' + item.description + '</td><td>' + item.price.toFixed(2) +
            '</td><td><button class="btn btn-sm btn-danger removeBtn" data-index="' + i + '">Remove</button></td></tr>';
    total += price item.price;
  });
  $(#'cartTable').html(rows);
  $(#'cartTotal').text(total.toFixed(2));
}

    
