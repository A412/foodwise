import {SCREENHEIGHT,
	background,
	whiteSkin,
	itemName
} from "variables";
import {
	LabeledCheckbox,
} from "buttons";
import {items} from "data";
import {ScrollerContainer} from "listScroller";
import {headerAndNavBar} from "navbar";
import {shopScreen, ShoppingListCheckbox} from "shopListScreen";
import {StatusBar, InventoryScreen} from "invScreen";

//*************************************

/* Add from fridge screen */
let itemsToAdd = {}

let invItemShopping = Line.template($ => ({
	skin: whiteSkin,
	width: 260,
	top: 10,
	active: $.active,
	contents: [
		new Picture({
			url: $.img,
			width: 70, height: 70
		}),
		new Column({
			left: 10,
			contents: [
				new Label({
					name: 'itemName', left:0,
					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),
					string: $.name
				}),
				new Label({
					name: 'quantity', left:0,
					style: new Style({ font: '20px Avenir', color: 'black' }),
					string: $.quantity +''+ $.unit
				}),
				new StatusBar({ 
				    width: 170, height: 15, top: 0, bottom: 0,
				    life: $.life 
				})
			]
		})
	],

}));


let AddFromInventoryCheckbox = LabeledCheckbox.template($ => ({
    active: true, top: 33, left:0, height:25,
    behavior: Behavior({
        onSelected: function(checkBox){
        	itemsToAdd[$.item] = true;
        },
        onUnselected: function(checkBox){
        	delete itemsToAdd[$.item]
        }
    })
}));


export let AddFromInventoryScreen = Container.template($ => ({
	skin: background,
	name: "AddFromFridge",
	width: 320, height: SCREENHEIGHT,
	contents: [
		// new Column({
		// 	top: 0,
		// 	name: 'items',
			// contents: [
				ScrollerContainer({ content:  new Column({ 
						top: 0, left: 0, right: 0, 
						name: 'items',
						contents: [
						 	items.map(item => 
							 			new Line({
							 				top:0, left:5,
							 				contents: [
							 					new AddFromInventoryCheckbox({ item: item.name, name: '' }),
												new invItemShopping({
													name: item.name,
													life: item.life, unit: item.unit,
													img: item.img,
													quantity: item.quantity,
													active: true,
												})

							 				]
							 			})
						 			)
						]
					}) 
				}),
			// ]
			// }),
		new Label({
			height:25, width: 200, bottom: 20,
			skin: new Skin({ fill: "#2D9CDB" }),
			style: new Style({font: 'bold 21px Avenir', color: "white"}),
			string: "ADD SELECTED ITEMS",
			active:true,
			behavior: Behavior({
				onTouchEnded(content){
					for (var i = 0; i < content.container[0][0].items.length; i++) {
						content.container[0][0].items[i].skin = whiteSkin;
					}
					application.main.empty(0);
					application.main.add(shopScreen);
					application.main.add(headerAndNavBar);
					for (var item in itemsToAdd) {
						let newEntry = new Line({
							left: 20, width: 320,
							contents: [
								new Line({
									left: 0, width: 270,
									contents: [
										new ShoppingListCheckbox({ name: item }),
									]
								}),
								new Label({
									right: 0,
									style: new Style({ font: 'bold 24px Avenir', color: 'gray', horizontal: 'right' }),
									string: 'x', active: true,
									behavior: Behavior({
										onTouchEnded: function(content){
											shopScreen.itemList.remove(newEntry)
										}
									})
								})
							]
						});
						shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);
					}
					itemsToAdd = {};
				}
			})
		}),


	]
}));
