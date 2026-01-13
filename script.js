const bagIcon = document.querySelector("#bag-icon");
const bag = document.querySelector(".bag");
const bagClose = document.querySelector("#bag-close");
bagIcon.addEventListener("click", () => bag.classList.add("active"));
bagClose.addEventListener("click", () => bag.classList.remove("active"));

const addBagButtons = document.querySelectorAll(".add-to-cart");
addBagButtons.forEach(button => {
  button.addEventListener("click", event => {
    const productCard = event.target.closest(".product-card");
    addToBag(productCard);
  });
});

const bagContent = document.querySelector(".bag-content");
const addToBag = productCard => {
    const productImgSrc = productCard.querySelector(".product-img").src;
    const productName = productCard.querySelector(".product-name").textContent;
    const productPrice = productCard.querySelector(".price").textContent;
    const productSize = productCard.querySelector(".size").textContent;
    const productBrand = productCard.querySelector(".Brand").textContent;

    const bagItems = bagContent.querySelectorAll(".bag-product-title");
    for (let item of bagItems) {
      if (item.textContent === productName) {
        alert("This item is already in the bag.");
        return;
      }
    }

    const bagBox = document.createElement("div");
    bagBox.classList.add("bag-box");
    bagBox.innerHTML = `
        <img src="${productImgSrc}" class="bag-img">
          <div class="bag-details">
              <p class=Brand">${productBrand}</p>
              <h2 class="bag-product-title">${productName}</h2>
              <p class="bag-price">${productPrice}</p>
              <p class="bag-size">${productSize}</p>
              
              <div class="bag-quantity">
                <button id="decrease">-</button> 
                <span class="quantity">1</span>
                <button id="increase">+</button>
              </div>   
          </div>
          <i class="fa-solid fa-trash bag-remove"></i>
      `;
    bagContent.appendChild(bagBox);

    bagBox.querySelector(".bag-remove").addEventListener("click", () => {
      bagBox.remove();

      updateBagCount(-1);

      updateTotalPrice();

      });
      
     bagBox.querySelector(".bag-quantity").addEventListener("click", event => {
      const numberElement = bagBox.querySelector(".quantity");
      const decrementButton = bagBox.querySelector("#decrease");
      let quantity = numberElement.textContent;
      
    if (event.target.id === "decrease" && quantity > 1) {
      quantity--;
      if (quantity === 1) {
        decrementButton.style.color = "#f5efeb";
      }
    } else if (event.target.id === "increase") {
      quantity++;
      decrementButton.style.color = "#999";
    }
    numberElement.textContent = quantity;

    updateTotalPrice();
     });

     updateBagCount(1);

     updateTotalPrice();
};

const updateTotalPrice = () => {
  const totalPriceElement = document.querySelector(".total-price");
  const bagBoxes = bagContent.querySelectorAll(".bag-box");
  let total = 0;
  bagBoxes.forEach(bagBox => {
    const priceElement = bagBox.querySelector(".bag-price");
    const quantityElement = bagBox.querySelector(".quantity");
    const price = priceElement.textContent.replace("₦", "").replace(/,/g, "");
    const quantity = quantityElement.textContent;
    total += price * quantity;
  });
  totalPriceElement.textContent = `₦ ${total}`;
};

let bagItemCount = 0;
const updateBagCount = change => {
  const bagItemCountBadge = document.querySelector(".bag-count");
  bagItemCount += change;
  if (bagItemCount > 0) {
    bagItemCountBadge.style.visibility = "visible";
    bagItemCountBadge.textContent = bagItemCount;
  } else {
    bagItemCountBadge.style.visibility = "hidden";
    bagItemCountBadge.textContent = "";
  }
};

const checkoutButton = document.querySelector(".btn-checkout");
checkoutButton.addEventListener("click", () => {
  const bagBoxes = bagContent.querySelectorAll(".bag-box");
  if (bagBoxes.length === 0) {
    alert("Your bag is empty. Please continue Shopping");
    return;
  }

  bagBoxes.forEach(bagBox => bagBox.remove());

  bagItemCount = 0;
  updateBagCount(0);

  updateTotalPrice();

  alert("Thank you for your Purchase!");
});
const searchBtn = document.getElementById('searchBtn');
const searchContainer = document.querySelector('.search-container');
const searchInput = document.querySelector('.search-input'); // declared once
const products = document.querySelectorAll('.product-card');

// 🔍 Drawer toggle
searchBtn.addEventListener('click', () => {
  searchContainer.classList.toggle('active');

  if (searchContainer.classList.contains('active')) {
    searchInput.focus();
  } else {
    searchInput.value = ""; // optional: clear input when closed
  }
});

// Search results UI and behavior
const resultsContainerId = 'search-results-container';

const createResultsContainer = () => {
  let container = document.getElementById(resultsContainerId);
  if (!container) {
    container = document.createElement('div');
    container.id = resultsContainerId;
    container.style.position = 'absolute';
    container.style.top = '100%';
    container.style.left = '0';
    container.style.right = '0';
    container.style.zIndex = '1000';
    container.style.background = '#fff';
    container.style.border = '1px solid #ddd';
    container.style.maxHeight = '320px';
    container.style.overflowY = 'auto';
    container.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
    container.style.marginTop = '6px';
    searchContainer.appendChild(container);
  }
  return container;
};

const clearSearchResults = () => {
  const container = document.getElementById(resultsContainerId);
  if (container) container.innerHTML = '';
};

const escapeHtml = str =>
  String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));

const renderNoResults = container => {
  container.innerHTML = '<div style="padding:12px;color:#666">No products found</div>';
};

const renderResults = matches => {
  const container = createResultsContainer();
  container.innerHTML = '';
  if (matches.length === 0) {
    renderNoResults(container);
    return;
  }

  matches.forEach(productCard => {
    const name = (productCard.querySelector('.product-name') || { textContent: '' }).textContent.trim();
    const price = (productCard.querySelector('.product-price') || { textContent: '' }).textContent.trim();
    const imgSrc = productCard.querySelector('.hidden-img') ? productCard.querySelector('.hidden-img').src : '';

    const item = document.createElement('div');
    item.className = 'search-result-item';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.padding = '8px 10px';
    item.style.cursor = 'pointer';
    item.style.borderBottom = '1px solid #f2f2f2';
    item.innerHTML = `
      <img src="${escapeHtml(imgSrc)}" alt="${escapeHtml(name)}" style="width:44px;height:44px;object-fit:cover;border-radius:4px;margin-right:10px" />
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;color:#222;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(name)}</div>
        <div style="font-size:12px;color:#777;margin-top:3px">${escapeHtml(price)}</div>
      </div>
    `;

    item.addEventListener('click', () => {
      productCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // brief visual highlight
      const prevOutline = productCard.style.boxShadow;
      productCard.style.boxShadow = '0 0 0 4px rgba(2, 16, 36, 1)';
      setTimeout(() => (productCard.style.boxShadow = prevOutline), 1600);

      searchInput.value = '';
      clearSearchResults();
      searchContainer.classList.remove('active');
      searchInput.blur();
    });

    container.appendChild(item);
  });
};

// main search logic
const performSearch = () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    clearSearchResults();
    return;
  }

  const matches = [...products].filter(productCard => {
    const name = (productCard.querySelector('.product-name') || { textContent: '' }).textContent.toLowerCase();
    const size = (productCard.querySelector('.product-size') || { textContent: '' }).textContent.toLowerCase();
    const price = (productCard.querySelector('.product-price') || { textContent: '' }).textContent.toLowerCase();
    return name.includes(q) || size.includes(q) || price.includes(q);
  });

  renderResults(matches);
};

// wire up input + keyboard behavior
searchInput.addEventListener('input', performSearch);

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    searchInput.value = '';
    clearSearchResults();
    searchContainer.classList.remove('active');
    searchInput.blur();
  }
});

// clear results when the search drawer is closed via the button toggle
const observer = new MutationObserver(mutations => {
  mutations.forEach(m => {
    if (m.attributeName === 'class') {
      if (!searchContainer.classList.contains('active')) {
        searchInput.value = '';
        clearSearchResults();
      } else {
        // focus when opened (redundant with existing logic but keeps behavior consistent)
        setTimeout(() => searchInput.focus(), 0);
      }
    }
  });
});
observer.observe(searchContainer, { attributes: true });
// End of Search Functionality

