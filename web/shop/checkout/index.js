const cardItems = new Map();
var itemsOfPINCart, dataElements = [];
const itemsCart = document.getElementById("itemsCart");
const cartItemsTotal = document.getElementById("total");
const cartPCS = document.getElementById("cartPCS");
var priceOfAll = 0;


fetch("/shopper/fetchdata").then(function(response) {
    return response.json();
}).then(function(data) {
    console.log(data);
    showProducts(data)
}).catch(function(error) {
    console.log("error: " + error);
});
showProducts = (data) => {
    dataElements = data;
    priceOfAll = 0;
    var pcsOfAll = 0;
    for (let x = 0; x < data.length; x++) {
        itemsOfPINCart = 0;
        const element = data[x];
        cardItems.set(element.id, element.id);
        const shoppingCard = JSON.parse(window.localStorage.getItem("shoppingcard"));

        if (Array.isArray(shoppingCard) == true) {
            for (let x = 0; x < shoppingCard.length; x++) {
                const element2 = shoppingCard[x];
                if (element.id == element2.id) {
                    itemsOfPINCart = element2.quantity;
                    pcsOfAll = pcsOfAll + itemsOfPINCart;
                }
            }
        } else {
            console.error("no items");
        }
        if (itemsOfPINCart != 0) {
            const product = document.createElement("p");
            const productName = document.createElement("a");
            const productPrice = document.createElement("span");
            productPrice.className = "price";
            productPrice.innerHTML = (element.price * itemsOfPINCart).toFixed(2) + " &euro;";
            priceOfAll = priceOfAll + (element.price * itemsOfPINCart);
            const cart = document.getElementById("container");
            var nameCart = "",
                nameCa = element.name;
            var lengthMax = 11;
            if (nameCa.length < lengthMax) {
                lengthMax = nameCa.length;
            }
            for (let a = 0; a < lengthMax; a++) {
                nameCart = nameCart + element.name[a];
            }
            if (11 == lengthMax) nameCart = nameCart + "..."
            productName.innerHTML = nameCart;
            productName.href = "/shop";
            cartItemsTotal.innerHTML = priceOfAll.toFixed(2) + " &euro;";
            cartPCS.innerText = pcsOfAll.toFixed(0);
            product.append(productName, productPrice);
            cart.append(product);
        }
    }
}

start = () => {
    const json = {
        "name": document.getElementById("fname").value,
        "email": document.getElementById("email").value,
        "adr": document.getElementById("adr").value,
        "city": document.getElementById("city").value,
        "state": document.getElementById("state").value,
        "zip": document.getElementById("zip").value,
        "cname": document.getElementById("cname").value,
        "ccnum": document.getElementById("ccnum").value,
        "expmonth": document.getElementById("expmonth").value,
        "expyear": document.getElementById("expyear").value,
        "cvv": document.getElementById("cvv").value,
        "products": JSON.parse(window.localStorage.getItem("shoppingcard")),
        "price": priceOfAll
    }
    fetch('/shopper/buy', {
            body: JSON.stringify(json),
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json',
            },
            method: 'POST'
        }).then(function(res) {
            console.log(res);

            window.location.href = "/shop/bought";
        })
        .catch(function(res) {
            console.log(res);
        });

}