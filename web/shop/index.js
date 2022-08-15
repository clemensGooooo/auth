const cardItems = new Map();
var itemsOfPINCart, dataElements = [];
const itemsCart = document.getElementById("itemsCart");
const cartItemsTotal = document.getElementById("price");
fetchNormal = (bodyHere, url, method) => {
    fetch(url, {
            body: bodyHere,
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            keepalive: true,
            method: method
        }).then(function(res) {
            window.location.reload();
        })
        .catch(function(res) {
            console.log(res);
        });
};
fetch("/shopper/fetchdata").then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(data);
    showProducts(data)
}).catch(function(error) {
    console.log("error: " + error);
});
showProducts = (data) => {
    const products = document.getElementById("products");
    dataElements = data;
    var priceOfAll = 0;
    for (let x = 0; x < data.length; x++) {
        itemsOfPINCart = 0;
        const element = data[x];
        const obj = document.createElement("div");
        obj.className = "div";
        const img = document.createElement("img");

        /** Controll of products buttom */
        const cardButton = document.createElement("button");
        const buttom = document.createElement("div"),
            buttonShoppingM = document.createElement("button"),
            buttonShoppingP = document.createElement("button");
        const remove = document.createElement("button");
        const name = document.createElement("a");
        const price = document.createElement("a");
        remove.innerText = "Remove";
        remove.className = "remove";
        buttonShoppingM.innerText = "-";
        buttonShoppingP.innerText = "+";
        buttonShoppingM.className = "plus";
        buttonShoppingP.className = "minus";
        const itemsInCard = document.createElement("a");
        const textCard = document.createElement("a");
        const br = document.createElement("br");
        cardItems.set(element.id, element.id);
        price.className = "price";
        name.className = "name";
        itemsInCard.id = "itemsInCart" + cardItems.get(element.id);
        itemsInCard.className = "itemsInCart";
        textCard.innerText = "in cart";
        price.innerHTML = element.price + " &euro;";
        name.innerText = element.name;
        cardButton.innerText = "Add item to card";
        cardButton.className = "addCard";
        cardButton.onclick = () => { addToCard(cardItems.get(element.id), 1) };
        const shoppingCard = JSON.parse(window.localStorage.getItem("shoppingcard"));
        if (Array.isArray(shoppingCard) == true) {
            for (let x = 0; x < shoppingCard.length; x++) {
                const element2 = shoppingCard[x];
                if (element.id == element2.id) {
                    itemsOfPINCart = element2.quantity;
                }
            }
        } else {
            console.error("no items");
        }
        buttom.append(name, price)

        if (itemsOfPINCart != 0) {
            itemsInCard.innerText = itemsOfPINCart;
            buttonShoppingM.onclick = () => { addToCard(cardItems.get(element.id), -1) };
            buttonShoppingP.onclick = () => { addToCard(cardItems.get(element.id), 1) };
            remove.onclick = () => { removeItemoflist(cardItems.get(element.id)) };
            buttom.append(itemsInCard, buttonShoppingM, itemsInCard, textCard, buttonShoppingP, remove);
            // create cart item
            const cartElement = document.createElement("div");
            const imgCart = document.createElement("img");
            const textItemCart = document.createElement("h2");
            const priceItemCart = document.createElement("a");
            const removeCartItem = document.createElement("button");
            const priceAllCartItem = document.createElement("a");
            priceAllCartItem.innerHTML = (itemsOfPINCart * element.price).toFixed(2) + "  &euro;";
            priceOfAll = priceOfAll + itemsOfPINCart * element.price;
            priceAllCartItem.className = "priceItemAll";
            priceAllCartItem.id = "priceTogether" + cardItems.get(element.id);
            removeCartItem.className = "removeCartItem";
            removeCartItem.innerText = "x";
            removeCartItem.onclick = () => { removeItemoflist(cardItems.get(element.id)) }
            priceItemCart.innerHTML = element.price + "  &euro;";
            priceItemCart.className = "priceCartElement";
            textItemCart.id = "name";
            var nameCart = "",
                nameCa = element.name;
            var lengthMax = 10;
            if (nameCa.length < lengthMax) {
                lengthMax = nameCa.length;
            }
            for (let a = 0; a < lengthMax; a++) {
                nameCart = nameCart + element.name[a];

            }
            textItemCart.innerHTML = nameCart;
            imgCart.src = "/shop/upload/" + element.image;
            imgCart.className = "imgCard";
            cartElement.append(imgCart, textItemCart, priceItemCart, removeCartItem, priceAllCartItem);
            itemsCart.append(cartElement);

        } else {
            buttom.append(cardButton)
        }

        obj.id = element.id;
        img.src = "/shop/upload/" + element.image;
        obj.append(img, br, buttom);
        cartItemsTotal.innerHTML = priceOfAll.toFixed(2);
        products.appendChild(obj)
    }
}

function openNav() {
    document.getElementById("mySidenav").style.width = "350px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

itemCounter = (num, dataInfo) => {
    try {
        const counter = document.getElementById("itemsInCart" + dataInfo);
        counter.innerText = num;
    } catch (error) {
        window.location.reload();
    }
}

addToCard = (dataInfo, steps) => {
    var changed = false;
    var allData,
        old = [],
        priceT = document.getElementById("priceTogether" + dataInfo);
    let priceOfAll2 = 0;
    if (window.localStorage.getItem("shoppingcard") != null) {
        old = JSON.parse(window.localStorage.getItem("shoppingcard"))
    }
    for (let x = 0; x < old.length; x++) {
        const element = old[x];
        if (element.id == dataInfo) {
            changed = true;
            old[x].quantity = steps + old[x].quantity;
            itemCounter(old[x].quantity, dataInfo);
            for (let a = 0; a < dataElements.length; a++) {
                if (dataElements[a].id == dataInfo) {
                    priceT.innerHTML = (dataElements[a].price * old[x].quantity).toFixed(2) + "  &euro;";
                }
            }
            allData = old;
        }
        for (let a = 0; a < dataElements.length; a++) {
            if (old[x].id === dataElements[a].id)
                priceOfAll2 = priceOfAll2 + (dataElements[a].price * old[x].quantity);
        }
    }
    if (changed === false) {
        itemCounter(steps);
        const data = { id: dataInfo, quantity: steps };
        if (old == null) {
            allData = [data];
        } else {
            allData = [data, ...old];

        }
    }
    window.localStorage.setItem("shoppingcard", JSON.stringify(allData));
    cartItemsTotal.innerHTML = priceOfAll2.toFixed(2);
}
removeItemoflist = (id) => {
    var allData,
        old = [];
    if (window.localStorage.getItem("shoppingcard") != null) {
        old = JSON.parse(window.localStorage.getItem("shoppingcard"))
    }
    for (let x = 0; x < old.length; x++) {
        const element = old[x];
        if (element.id == id) {
            changed = true;
            old.splice(x, 1);
            allData = old;
            window.localStorage.setItem("shoppingcard", JSON.stringify(allData));
        }
    }
    window.location.reload();
}

function isPositive(value) {
    return value > 0;
}

checkout = () => {
    // Simulate a mouse click:
    window.location.href = "checkout";
}