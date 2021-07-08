let firstLoop = true;
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  const product_ids = [
    {"id": 6837440250009, "handle" : "moon-light"},
    {"id": 6837440217241, "handle" : "top-soil"},
    {"id": 6837440315545, "handle" : "tree-line"}
  ]
  
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'checkout.fuzzymansocks.com',
      storefrontAccessToken: 'e77e3a33f5aa624f84b496dfaafa751b',
    });

    //var ui = ShopifyBuy.UI.init(client);  
    var toggleStyles = {
      'background-color': '#212121',
      ':hover': {
        'background-color': 'black'
      },
      ':focus': {
        'background-color': 'black'
      }
    }

    const customTemplate = `
      <div class="sock">
        <div class="sock-info">
          <h2>{{data.title}}</h2>
          <div class="sock-price">
            {{#data.selectedVariant}}
            <span class="visuallyhidden">{{data.priceAccessibilityLabel}}&nbsp;</span>
            <span class="{{data.classes.product.price}} {{data.priceClass}}" data-element="product.price">{{data.formattedPrice}}</span>
            {{#data.hasCompareAtPrice}}
            <span class="visuallyhidden">{{data.compareAtPriceAccessibilityLabel}}&nbsp;</span>
            <span class="{{data.classes.product.compareAt}}" data-element="product.compareAt">{{data.formattedCompareAtPrice}}</span>
            {{/data.hasCompareAtPrice}}
            {{#data.showUnitPrice}}
            <div class="{{data.classes.product.unitPrice}}" data-element="product.unitPrice">
              <span class="visuallyhidden">{{data.text.unitPriceAccessibilityLabel}}</span>
              {{data.formattedUnitPrice}}<span aria-hidden="true">/</span><span class="visuallyhidden">&nbsp;{{data.text.unitPriceAccessibilitySeparator}}&nbsp;</span>{{data.formattedUnitPriceBaseUnit}}
            </div>
            {{/data.showUnitPrice}}
            {{/data.selectedVariant}}
          </div>
        </div>
        {{#data.currentImage.srcLarge}}<img src="{{data.currentImage.srcLarge}}" alt="{{data.currentImage.altText}}">{{/data.currentImage.srcLarge}}
        <div class="readmore">
          {{{data.descriptionHtml}}}
          <span class="readmore-link"></span>   
        </div>
        <div class="{{data.classes.product.buttonWrapper}} buy-btns">
          <div id="{{data.handle}}"></div>
          <button class="{{data.classes.product.button}} {{data.buttonClass}}">
            <span class="addto">{{data.buttonText}}</span>
            <img src="img/cart.svg" width="21.86" height="28.87">
          </button>
        </div>
      </div>`;
    
    let cartCount = document.getElementById("cart-count");
    
    function getCount(lineItems) {
      let count = 0;
      for (i=0; i<lineItems.length;i++) {
        count += lineItems[i].quantity;
      }
      if (count > 9) {
        if (!cartCount.classList.contains("dbldgts")) {
          cartCount.classList.add("dbldgts");
        }
      } else {
        if (cartCount.classList.contains("dbldgts")) {
          cartCount.classList.remove("dbldgts");
        }
      }
      return count;
    }
    
    var add_to_cart_btn = {
      "product": {
        "contents": {
          "description": true,
          "quantity": false,
          "options": false,
          "price": false,
          "img": false,
          "description": false,
          "button": false,
          "title": false,
          "variantTitle": false,
          "quantityIncrement": false,
          "quantityDecrement": false,
          "quantityInput": false,
        },
        "iframe": false,
      },
      "option": {},
      "cart": {
        "events": {
          "updateItemQuantity": function (component) {
            async function getUpdatedQty(prevCount){
              let count = getCount(component.model.lineItems);
              while(count == prevCount) {
                count = getCount(component.model.lineItems);
                await new Promise(r => setTimeout(r, 200));
              }
              if (count == 0) {
	              if (cartCount.classList.contains("notempty")) {
                  cartCount.classList.remove("notempty");
                }                
              } else {
	              if (!cartCount.classList.contains("notempty")) {
                  cartCount.classList.add("notempty");
                }
              }
              return count;
            };

            var prevCount = getCount(component.model.lineItems);
            getUpdatedQty(prevCount).then(value => {
              //console.log(`Updated qty ${value}`);
            }, reason => {
              console.error(reason); // Error!
            });
          },
        },
        "text": {
          "total": "Subtotal",
          "button": "Checkout"
        },
        "popup": false,
        "startOpen": false,
        "styles": {
          "button": toggleStyles
        }
      },
      "toggle": {
        "iframe": false,
        "contents": {
          "count": true,
          "icon": false,
          "title": false
        },
        "styles": {
          "toggle": toggleStyles
        },
        "sticky": false,
        "events": {
          "beforeRender": function (component) {
            if (firstLoop) {
              let count = getCount(component.model.lineItems);
              if (count > 0) {
                cartCount.classList.add("notempty");
              }
              document.getElementById('cart-count').appendChild(component.node);            
            }
            firstLoop = false;
          },
        },
      }
    };
        
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      
      async function addToCartBtns(){
        let carousel = document.querySelector('.main-carousel');
        for(i=0;i<product_ids.length;i++){
          var cell = document.createElement("div");
          cell.className = "carousel-cell";
          carousel.appendChild(cell);
          ui.createComponent('product', { // add to cart btn
            id: product_ids[i]["id"],
            node: cell,
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: add_to_cart_btn
          });
        }
        return;
      };

      async function makeButtons(){
        await addToCartBtns();
        document.getElementById("cart-wrap").addEventListener('click', event => {
          event.stopPropagation();
          ui.openCart();
        });
      };
      makeButtons();

    });

  }
})();

function openNav() {
  var mobnavwrap = document.querySelector(".mobnavwrap");
  if (mobnavwrap.classList.contains("open")) {
    mobnavwrap.classList.remove("open");
  } else {
    mobnavwrap.classList.add("open");
  }
}