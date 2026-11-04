const app = angular.module("returnsApp", []);

app.controller("ReturnsController", function ($scope, $http) {
  $scope.products = [];
  $scope.filteredProducts = [];
  $scope.selectedProduct = null;
  $scope.details = {
    reason: "",
    condition: ""
  };
  $scope.errors = [];
  $scope.message = "";
  $scope.returnJSON = "";
  $scope.loading = true;
  $scope.loadError = "";
  $scope.submitting = false;

  // get products from json
  $http.get("products.json").then(
    function (response) {
      $scope.products = response.data;
      $scope.filteredProducts = response.data;
      $scope.loading = false;
    },
    function () {
      $scope.loadError = "Could not load products.";
      $scope.loading = false;
    }
  );

  // jsquery searches json
  $("#searchProducts").on("input", function () {
    const search = $(this).val().trim().toLowerCase();

    const matches = $.grep($scope.products, function (product) {
      return product.name.toLowerCase().includes(search) ||
        String(product.id).includes(search);
    });

    // tells angularJS to update
    $scope.$applyAsync(function () {
      $scope.filteredProducts = matches;
    });
  });
  $scope.clearMessage = function () {
    $scope.message = "";
    $scope.returnJSON = "";
  };
  $scope.selectProduct = function (product) {
    $scope.selectedProduct = product;
    $scope.clearMessage();
  };
  $scope.submitReturn = function () {
    if ($scope.submitting) {
      return;
    }

    $scope.errors = [];
    $scope.clearMessage();
    const reason = ($scope.details.reason || "").trim();

    // check required fields
    if (!$scope.selectedProduct) {
      $scope.errors.push("Please select a product.");
    }
    if (reason == "") {
      $scope.errors.push("Please enter a reason for the return.");
    }
    if (!$scope.details.condition) {
      $scope.errors.push("Please choose the product condition.");
    }
    if ($scope.errors.length > 0) {
      return;
    }

    // combine return info into an object
    const returnDetails = {
      productId: $scope.selectedProduct.id,
      productName: $scope.selectedProduct.name,
      price: $scope.selectedProduct.price,
      reason: reason,
      condition: $scope.details.condition
    };

    $scope.returnJSON = JSON.stringify(returnDetails, null, 2);
    $scope.submitting = true;

    $.ajax({
      url: "/api/returns",
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(returnDetails),
      timeout: 10000,

      success: function (response) {
        $scope.$applyAsync(function () {
          $scope.submitting = false;

          if (response && response.success == true && response.returnId) {
            $scope.message =
              "Return received. Reference: " + response.returnId;
          } else {
            $scope.message =
              "Could not complete the return.";
          }
        });
      },
      error: function () {
        $scope.$applyAsync(function () {
          $scope.submitting = false;
          $scope.message =
            "Error submitting the return.";
        });
      }
    });
  };
});