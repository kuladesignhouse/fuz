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
    var buttonStyles = {
      'background-color': '#212121',
      'border-radius' : '28px',
      ':hover': {
        'background-color': 'black'
      },
      ':focus': {
        'background-color': 'black'
      }
    }
    var toggleStyles = {
      'background-color': '#212121',
      ':hover': {
        'background-color': 'black'
      },
      ':focus': {
        'background-color': 'black'
      }
    }
    const btnTemplate2 = `<button class="{{data.classes.product.button}} {{data.buttonClass}} buy-now-btn" data-element="product.button">{{data.buttonText}}</button>`;

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
        <div class="{{data.classes.product.buttonWrapper}} buy-btns fadeload">
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
        "events": {
          "addVariantToCart": function (component) {
            document.getElementById("cart-count").className = "notempty";
          }
        },
        "contents": {
          "description": true,
          "quantity": false,
          "options": false,
          "price": false,
          "img": false,
          "description": false,
          "button": false
        },
        "iframe": false,
        /*
        "order" : [
          "title",
          "img",
          "description",
          "button",
        ],
        */
        "styles": {
          "product": {
            /*
            "@media (min-width: 601px)": {
              "max-width": "calc(25% - 20px)",
              "margin-left": "20px",
              "margin-bottom": "50px",
              "width": "calc(25% - 20px)"
            },
            */
            "img": {
              "height": "calc(100% - 15px)",
              "position": "absolute",
              "left": "0",
              "right": "0",
              "top": "0"
            },
            "imgWrapper": {
              "padding-top": "calc(75% + 15px)",
              "position": "relative",
              "height": "0"
            },
            "button": Object.assign({}, buttonStyles, {
              "display" : "flex",
              "align-items": "center",
              "justify-content": "center",
              "padding": "10px 20px",
              "height": "39px",
              "box-sizing": "border-box",
              "margin" : "0",
              "font-family": "proxima-nova",
              "font-weight": "700",
              "font-size": "13px",
              "line-height": "17px",
              "letter-spacing": "1.25px",
              "width": "129px",
            }),
            "buttonWrapper": {
              "display" : "flex",
              "align-items": "center",
              "justify-content": "center"
            },
            "shopify-buy__btn buy-now-btn" : {
              "width": "150px",
              "margin-right": "10px",
            }
          }
        },
        "text": {
          "button": "Add to"
        },
        "templates": {
          "title": customTemplate,
        },
        //"toggles": [{node: document.getElementById("cart-wrap")}],
      },
      "productSet": {
        "styles": {
          "products": {
            "@media (min-width: 601px)": {
              "margin-left": "-20px"
            }
          }
        }
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
              } else  {
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

    var buy_now_btn = {
      "product": {
        "contents" : {
          "img": false,
          "price": false,
          "title": false,
        },
        "iframe":false,
        "styles": {
          "product": {
            "button": {
              "background-color": "#D35100",
              "border-radius" : "28px",
              ":hover": {
                "background-color": "#D35100"
              },
              ":focus": {
                "background-color": "#D35100"
              }          
            },
          }
        },
        "buttonDestination": "checkout",
        "templates": {
          "button": btnTemplate2,
        },
        "text": {
          "button": "Buy now"
        },
        //"toggles": [{node: document.getElementById("cart-wrap")}],
      },
      "productSet": {
        "styles": {
          "products": {
            "@media (min-width: 601px)": {
              "margin-left": "-20px"
            }
          }
        }
      },
      "option": {},
      "cart": {
        "text": {
          "total": "Subtotal",
          "button": "Checkout"
        },
        "popup": false,
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
        "sticky": false
      },
    };
        
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      
      async function addToCartBtns(){
        const carousel = document.querySelector('.main-carousel');
        for(i=0;i<product_ids.length;i++){
          let cell = document.createElement("div");
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

      async function buyNowBtns() {
        for (let i = 0; i < product_ids.length; i++) {
          while(!document.getElementById(product_ids[i]["handle"])) {
            await new Promise(r => setTimeout(r, 100));
          }
          let sock = document.getElementById(product_ids[i]["handle"]).parentElement.parentElement;
          for (let i=0; i<sock.childNodes.length; i++) {
            if (sock.childNodes[i].className == "sock-info") {
              for (let x=0; x<sock.childNodes[i].childNodes.length; x++) {
                if (sock.childNodes[i].childNodes[x].className == "sock-price") {                  
                  let price = sock.childNodes[i].childNodes[x].innerText.substring(2, 5);
                  sock.childNodes[i].childNodes[x].textContent = price;
                }
              }        
            }
          }
          ui.createComponent('product', { // buy now btn
            id: product_ids[i]["id"],
            node: document.getElementById(product_ids[i]["handle"]),
            options: buy_now_btn
          });
        }
      }

      async function makeButtons(){
        await addToCartBtns();    
        await buyNowBtns();
        //await buyNowBtns().then(_ => {console.log('done');});    
        document.getElementById("cart-wrap").addEventListener('click', event => {
          event.stopPropagation();
          ui.openCart();
        });
        if(window.location.hash) {
          console.log(window.location.hash);
          if (window.location.hash == "#cart") {
            ui.openCart();
          }
        }
      };
      
      makeButtons();

      var flkty = new Flickity( ".main-carousel", {
        cellAlign: 'left',
        contain: true,
        prevNextButtons: false,
        pageDots: false,
        setGallerySize: true,
        watchCSS: true
      });
      
      flkty.on( 'scroll', function( progress ) {
        progress = Math.max( 0, Math.min( 1, progress ) );
        //document.querySelector('.progress-bar').style.width = progress * 100 + '%';
      });
      document.addEventListener('click', function (e) {
        if (!e.target.matches('.readmore-link') && !e.target.matches('.add-to-cart-btn')) return;
        //if (!e.target.matches('.readmore-link')) return;
        e.preventDefault();
        if (e.target.matches('.add-to-cart-btn')) {
          addToCart(e.target.dataset.client_id);      
        }
        var isExpanded = e.target.classList.contains("expand");
        var expanded = document.querySelectorAll(".readmore.expand");
        for (const el of expanded) {
          el.classList.remove("expand");
        }
        var expanded_links = document.querySelectorAll(".readmore-link.expand");
        for (const el of expanded_links) {
          el.classList.remove("expand");
        }
        e.target.parentElement.parentElement.classList.toggle("xpnd");
        if (!isExpanded){
          e.target.parentElement.classList.add("expand");
          e.target.classList.add("expand");
        } 
      
      }, false);

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