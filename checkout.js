function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
  localStorage.setItem('cart',JSON.stringify(cart));
}

function showCart() {
  const cart = getCart();
  let rows = '';
  let total = 0;

  $.each(cart, function (i,item) {
    rows += '<tr><td>' + item.id + '</td><td>' + item.description + '</td><td>' + item.price.toFixed(2) + '</td><td><button class="btn btn-sm btn-danger removeBtn" data-index="' + i + '">Remove</button></td></tr>';
    total += item.price;
  });

  if (cart.length === 0) {
    rows = '<tr><td colspan="4" class="text-center text-muted">Your cart is empty.</td></tr>';
  }
  $('#cartTable').html(rows);
  $('#cartTotal').text(total.toFixed(2));
}

$(document).on('click', '.addBtn', function() {
  const id = Number($(this).data('id'));
  const item = $.grep(products, function(p) { return p.id === id;})[0];
  if (!item) return;

  const cart = getCart();
  cart.push({ id: item.id, description: item.description, price: item.price });
  saveCart(cart);
  showCart();
});

$(document).on('click', '.removeBtn', function(){
  const cart = getCart();
  cart.splice(Number($(this).data('index')), 1);
  saveCart(cart);
  showCart();
});

$(document).on('click', '#checkoutBtn', function (event) {
  event.preventDefault();
  const cart = getCart();

  if (cart.length === 0) {
    alert('Your shopping cart is empty');
    return;
  }

  const order = {
    items: cart,
    total: cart.reduce(function (sum, item) { return sum + Number(item.price); }, 0)
  };
  const jsonData = JSON.stringify(order);
  console.log('Shopping cart JSON:', jsonData);
  
  $.ajax({
        url: "/api/orders",
        type: "POST",
        contentType: "application/json",
        data: jsonData,

        success: function(response) {
            alert("Order submitted");
        },

        error: function() {
            console.log("Not connected");
        },
        complete: function () {
          window.location.href = 'cart.html';
        }
    });
});

$(showCart);











