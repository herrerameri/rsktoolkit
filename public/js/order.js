
var deferredOrder = new $.Deferred();

function getOrder(btcAddress){
  $.ajax({
    url: "http://localhost:3001/orderStatus/" + btcAddress,    
    success: function(res){      
      deferredOrder.resolve(res);      
    },
    error:function(res){
      deferredOrder.resolve('');
    }, 
  });
}

$("#status-button").on("click", function(){
  deferredOrder = new $.Deferred();
  document.getElementById("order-information").innerHTML = "";
  var oderAddress = $("#btc-order-address").val();
  getOrder(oderAddress);
  
  $.when(deferredOrder).done(function(res1) {

    if(!res1){

      return;
    }

    var wrapper = document.getElementById("order-information");    
    var tree = jsonTree.create(res1, wrapper);

    tree.expand(function(node) {
      return node;
    });

  });
});
