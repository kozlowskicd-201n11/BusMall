'use strict';

Product.names = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

Product.allProducts = [];
Product.pictures = [document.getElementById('left'), document.getElementById('center'), document.getElementById('right')];
Product.listTotal = document.getElementById('listTotal');
Product.imgSection = document.getElementById('allThreeImages');
Product.justBeenViewed = [];
Product.totalClicks = 0;

function Product(name) {
  this.name = name;
  if (this.name === 'usb') {
    this.imgPath = 'img/' + name + '.gif';
  }
  else if (this.name === 'sweep') {
    this.imgPath = 'img/' + name + '.png';
  }
  else {
    this.imgPath = 'img/' + name + '.jpg';
  }
  this.votes = 0;
  this.views = 0;
  Product.allProducts.push(this);
}

for (var i = 0; i < Product.names.length; i++) {
  new Product(Product.names[i]);
}

function makeRandom() {
  return Math.floor(Math.random() * Product.names.length);
}

function placeImgs() {
  var currentlyShowing = [];
  currentlyShowing[0] = makeRandom();
  while (Product.justBeenViewed.indexOf(currentlyShowing[0]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[0] = makeRandom();
  }
  currentlyShowing[1] = makeRandom();
  while (currentlyShowing[1] === currentlyShowing[0] || Product.justBeenViewed.indexOf(currentlyShowing[1]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[1] = makeRandom();
  }
  currentlyShowing[2] = makeRandom();
  while (currentlyShowing[2] === currentlyShowing[1] || currentlyShowing[2] === currentlyShowing[0] || Product.justBeenViewed.indexOf(currentlyShowing[2]) !== -1) {
    console.log('Duplicate found, rerunning.');
    currentlyShowing[2] = makeRandom();
  }
  for (var i = 0; i < 3; i++) {
    Product.pictures[i].src = Product.allProducts[currentlyShowing[i]].imgPath;
    Product.pictures[i].id = Product.allProducts[currentlyShowing[i]].name;
    Product.allProducts[currentlyShowing[i]].views++;
    Product.justBeenViewed[i] = currentlyShowing[i];
  }
}

function handleClick(event) {
  console.log(Product.totalClicks, 'total clicks');
  if(Product.totalClicks > 24) {
    Product.imgSection.removeEventListener('click', handleClick);
    showTotals();
  }
  if(event.target.id === 'allThreeImages') {
    return alert('Need to click on an image.');
  }
  Product.totalClicks += 1;
  for(var i = 0; i < Product.names.length; i++) {
    if(event.target.id === Product.allProducts[i].name) {
      Product.allProducts[i].votes += 1;
      console.log(event.target.id + ' has ' + Product.allProducts[i].votes + ' votes in a total of ' + Product.allProducts[i].views + ' views.');
    }
  }
  placeImgs();
}

function showTotals() {
  for(var i = 0; i < Product.allProducts.length; i++) {
    var liEl = document.createElement('li');
    liEl.textContent = Product.allProducts[i].name + ' has ' + Product.allProducts[i].votes + ' votes in ' + Product.allProducts[i].views + ' views.';
    Product.listTotal.appendChild(liEl);
  }
}
Product.imgSection.addEventListener('click', handleClick);
placeImgs();