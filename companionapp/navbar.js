import {addItemButton, InventoryScreen} from "invScreen";
import {shopScreen} from "shopListScreen";
import {whiteSkin,
	currentScreen,
	pressed_inv_skin,
	pressed_shop_skin,
	unpressed_inv_skin,
	unpressed_shop_skin
} from "variables";

//***************************************


// trace(pressed_skin.width + " what do we see\n");

/* Navigation bar */
let inventoryButton = new Content({
	name: 'invBtn',
	width: 30, height: 30,
	right: 30, left: 50, 
	skin: new Skin({
		name: "theSkin",
		width: 54, height:54,
		texture: new Texture("assets/inventory.png"),
		fill: "white",
		aspect: "fit"
	}),
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			if (currentScreen != 'inventory') {
				currentScreen = 'inventory';
				application.main.empty(0);
				application.main.add(InventoryScreen());
				application.main.add(headerAndNavBar);
				application.main.hAndN.nav.invBtn.skin = pressed_inv_skin;
				application.main.hAndN.nav.shopBtn.skin = unpressed_shop_skin;
				application.main.add(addItemButton);
			}
		}
	})
});

let shoppingButton = new Content({
	name: 'shopBtn',
	width: 30, height:30,
	right: 50, left:30, 
	skin: new Skin({
	    width: 48, height:48,
	    texture: new Texture("assets/shopping.png"),
	    fill: "white",
	    aspect: "fit"
	}),
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			if (currentScreen != 'shop') {
				currentScreen = 'shop';
				application.main.empty(0);
				application.main.add(shopScreen);
				application.main.add(headerAndNavBar);
				application.main.hAndN.nav.shopBtn.skin = pressed_shop_skin;
				application.main.hAndN.nav.invBtn.skin = unpressed_inv_skin;
			}
		}
	})
});


export let headerAndNavBar = new Column({
	name: "hAndN",
	contents: [
		new Container({
			name: 'header',
			skin: whiteSkin,
			width: 320, height: 50,
			contents: [
				new Picture({
					top: 10, left:10, right: 120,
					height:35,
					url: "assets/header.png"
				})
			]
		}),
		new Line({
			name: 'nav',
			skin: whiteSkin,
			width: 320, height: 50,
			top: 380,
			contents: [
				inventoryButton,
				shoppingButton
			]
		})
	]
})
