// IIFEs are an ideal solution for locally scoping global variables/properties and protecting my JavaScript codebase from outside interference (e.g. third-party libraries).
// I am using jQuery that will be run in many different environments (e.g. jQuery plugins) possibly, thus it is important to use an IIFE to locally scope jQuery.
(function($, document, window) {

  // ------------------ Merchandise Page Start ------------------

  // Query elements in the document
  const thumbnailImages = document.querySelectorAll('.thumbnail-image');
  // Access the default thumbnail image with a class of `active`
  let activeThumbnailImage = thumbnailImages[0];
  const apronTerms = document.querySelectorAll('.apron-term');
  let activeApronTerm = apronTerms[0];
  let activeTermDescription = document.querySelectorAll('.term-description')[0];

  // Slide up or down the sections on the lower right quadrant of the page
  const slideTermDescription = apronTerm => {
    const termDescription = apronTerm.nextElementSibling;

    if (apronTerm.textContent === 'Collapsed') {
      $(termDescription).slideUp(400, 'swing', () => {
        termDescription.classList.remove('active');
      });
    } else {
      $(termDescription).slideDown(400, 'swing', () => {
        termDescription.classList.add('active');
      });
    }

    // Another way to slide up or down the sections
    // Comment out the code above, and comment in the code below and in the toggleActiveItem function to see it in action
    /* if (termDescription !== activeTermDescription) {
      $(termDescription).slideDown(400, 'swing');

      $(activeTermDescription).slideUp(400, 'swing');

      activeTermDescription = termDescription;
    } */
  };

  // Fade in or out the hero image using small images
  const fadeHeroImage = thumbnailImage => {
    const heroImageWrapper = document.querySelector('.hero-image-wrapper');
    const heroImageUrl = document.getElementById('hero-image')
    .getAttribute('src');
    const thumbnailImageUrl = thumbnailImage.dataset.thumbnailImageUrl;

    if (thumbnailImageUrl !== heroImageUrl) {
      const newHeroImage = document.createElement('img');

      newHeroImage.setAttribute('src', heroImageUrl);

      newHeroImage.classList.add('new-hero-image');

      heroImageWrapper.appendChild(newHeroImage);

      $('.new-hero-image').fadeOut(400, 'swing', () => {
        $(this).remove();
      });

      $('.hero-image').hide()
      .attr('src', thumbnailImageUrl)
      .fadeIn(400, 'swing');
    }
  };

  // Add or remove the active state to or from a thumbnail image and an expanding term
  const toggleActiveItem = item => {
    if (item.getAttribute('href') && !item.classList.contains('active')) {
      item.classList.add('active');

      activeThumbnailImage.classList.remove('active');

      activeThumbnailImage = item;
    } else if (!item.getAttribute('href') && item.classList.contains('active')) {
      item.classList.remove('active');

      item.textContent = 'Collapsed';
    } else if (!item.getAttribute('href')) {
      item.classList.add('active');

      item.textContent = 'Expanded';
    }

    // Another way to add or remove the active state to or from the expanding term
    // Comment out the code above, and comment in the code below and in the slideTermDescription function to see it in action
    /* if (!item.classList.contains('active')) {
      item.classList.add('active');

      if (item.getAttribute('href')) {
        activeThumbnailImage.classList.remove('active');

        activeThumbnailImage = item;
      } else {
        item.textContent = 'Expanded';

        if (activeApronTerm.classList.contains('active')) {
          activeApronTerm.classList.remove('active');

          activeApronTerm.textContent = 'Collapsed';
        }

        activeApronTerm = item;
      }
    } */
  };

  // Loop through a collection of items, update their active state and animate them on click
  const forEach = (items, animate) => {
    items.forEach(item => {
      item.addEventListener('click', () => {
        toggleActiveItem(item);

        animate(item);
      });
    });
  };

  // Create an object to store collections of items and animate functions
  const itmesAndAnimate = {
    thumbnailImages: [
      thumbnailImages,
      fadeHeroImage
    ],
    apronTerms: [
      apronTerms,
      slideTermDescription
    ]
  };

  // Loop through the object and call the forEach function with each collection
  for (let itmeAndAnimate in itmesAndAnimate) {
    const items = itmesAndAnimate[itmeAndAnimate][0];
    const animate = itmesAndAnimate[itmeAndAnimate][1];

    forEach(items, animate);
  }

  // ------------------ Merchandise Page End ------------------

  // ------------------ Cart Modal Start ------------------

  // Get elements for the cart modal
  const addToCartButton = document.getElementById('add-to-cart-button');
  const cart = document.getElementById('cart');
  const closeCartButton = document.getElementById('close-cart-button');
  const continueShoppingLink = document.getElementById('continue-shopping-link');
  const body = document.getElementsByTagName('body')[0];

  // Check if a user enters a valid quantity of items
  const checkQuantity = () => {
    const quantity = document.querySelector('.quantity');
    const quantityValue = parseInt(quantity.value, 10);
    const alert = document.querySelector('.alert');

    if (quantityValue <= 0 && !alert) {
      const apronName = document.querySelector('.apron-name');
      const alertBox = document.createElement('div');

      alertBox.textContent = 'Please enter the quantity you wish to purchase in the quantity box before continuing.';

      alertBox.classList.add('alert');

      apronName.parentNode.insertBefore(alertBox, apronName.nextElementSibling);

      quantity.value = '1';
    } else if (quantityValue <= 0 && alert) {
      quantity.value = '1';
    } else if (quantityValue > 0) {
      if (alert) {
        alert.remove();
      }

      const smallImageUrl = document.querySelector('.thumbnail-image.active')
      .children[0]
      .getAttribute('src');
      const itemImage = document.querySelector('.item-image');
      const apronNameText = document.querySelector('.apron-name')
      .textContent;
      const itemName = document.querySelector('.item-name');
      const itemQuantity = document.querySelector('.item-quantity');
      const priceValue = Number(document.querySelector('.price').textContent);
      const itemPrice = document.querySelector('.item-price');
      const summaryQuantity = document.querySelector('.summary-quantity');
      const summaryPrice = document.querySelector('.summary-price');

      itemImage.setAttribute('src', smallImageUrl);

      itemName.textContent = apronNameText;

      itemQuantity.textContent = quantityValue;

      itemPrice.textContent = priceValue;

      summaryQuantity.textContent = quantityValue;

      summaryPrice.textContent = priceValue * quantityValue;

      // Show the cart modal
      cart.style.display = 'block';

      body.classList.add('modal');
    }
  };

  // Add event listener to elements
  const addEventListener = item => {
    if (item === addToCartButton) {
      // Listen for a click on the Add to Cart button
      item.addEventListener('click', () => {
        checkQuantity();
      });
      // Listen for a click on the Close cart button or the Continue Shopping link
    } else if (item === closeCartButton || item === continueShoppingLink) {
      item.addEventListener('click', () => {
        // Hide the cart modal
        cart.style.display = 'none';

        body.classList.remove('modal');

        document.querySelector('.quantity').value = '1';
      });
      // Listen for a click on the window object
    } else {
      item.addEventListener('click', () => {
        // Event propagation up to the window object
        if (event.target === cart) {
          // Hide the cart modal
          cart.style.display = 'none';

          body.classList.remove('modal');

          document.querySelector('.quantity').value = '1';
        }
      });
    }
  };

  // Create an array to store click items
  const clickItems = [addToCartButton, closeCartButton, continueShoppingLink, window];

  // Loop through the array and call the addEventListener function with each click item
  clickItems.forEach(clickItem => {
    addEventListener(clickItem);
  });

  // ------------------ Cart Modal End ------------------

}(window.jQuery, document, window));
