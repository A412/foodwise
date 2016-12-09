import {background,
	remotePins,
	currentScreen,
	itemName
} from "variables";
import {LabeledCheckbox} from "buttons";
import {itemNameField} from "addItmScreen";
import {headerAndNavBar} from "navbar";
import {AddFromInventoryScreen} from "addFromInvScreen";

//*********************************************

/* Shopping screen */
export let ShoppingListCheckbox = LabeledCheckbox.template($ => ({
    active: true, top: 3, left:0, height:25,
    behavior: Behavior({
        onSelected: function(checkBox){
        },
        onUnselected: function(checkBox){
        }
    })
}));

let shopInvSkin = new Skin({fill: "#425fab"});
let shoppingInventoryScreen = new Column({
	name:"shopInvScreen",
	skin: shopInvSkin,
	top:0, bottom:0, left:0, right:0,
});

let addItemSubmitBtn = Label.template($ => ({
	width: 60, height: 28,
	left: 10,
	skin: new Skin({ fill: "#2D9CDB" }),
	style: new Style({font: "bold 24px Avenir", color: "white"}),
	string: "ADD",
	active:true,
	behavior: Behavior({
		onTouchEnded(content){
			if(itemName){
				shopScreen.itemList.remove(shopScreen.itemList.newItemField);
				let newEntry = new Line({
					left: 20, width: 320,
					contents: [
						new Line({
							left: 0, width: 270,
							contents: [
								new ShoppingListCheckbox({ name: itemName }),
							]
						}),
						new Label({
							style: new Style({ font: 'bold 24px Avenir', color: 'gray',	horizontal: "right", }),
							string: 'x',
							active: true,
							behavior: Behavior({
								onTouchEnded: function(content){
									shopScreen.itemList.remove(newEntry)
								}
							})
						})
					]
				});
				
				shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);
				itemName = 0;
			}
		}
	})
}));

let newItemField = Line.template($ => ({
	left: 20, top: 5,
	name: 'newItemField',
	contents: [
		new itemNameField({
			width: 200,
			top: 0,
			name: '',
			skin: new Skin({
				borders: { left:0, right:0 , top:0, bottom: 1 },
				stroke: 'gray'
			})
		}),
		new addItemSubmitBtn()
	]
}));

//have to reuse itemName for the itemNameField part.
let listAddItemBtn = new Label({
	left: 20, top: 10,
	name: "addBtn",
	skin: new Skin({
		borders:{left:1, right:1, top:1, bottom:1},
		stroke: 'black'
	}),
	width:30, height:30,
	string: '+',
	style: new Style({ font: "35px Avenir", color: 'black' }),
	active:true,
	behavior: Behavior({
		onTouchEnded: function(content){
			if (!shopScreen.itemList.newItemField) {
				shopScreen.itemList.insert(
				new newItemField(), shopScreen.itemList.addBtn)
			}
		}
	})
});

export let shopScreen = new Column({
	skin: background,
	name: 'shopping',
	width: 320, height: 400,
	contents: [
		new Column({
			name: "itemList",
			top: 20, bottom:0, left:0, right:0,
			contents: [
				listAddItemBtn
			]
		}),
		new Line({
			bottom:20, left:10, right:10, height:35,
			contents:[
				new Label({
					height: 35, width: 220, left:5, right: 4,
					skin: new Skin({ fill: "#2D9CDB" }),
					style: new Style({font: 'bold 23px Avenir', color: "white"}),
					string: "ADD FROM INVENTORY",
					active:true,
					behavior: Behavior({
						onTouchEnded(content){
							application.main.empty(0);
							application.main.add(AddFromInventoryScreen());
							application.main.add(headerAndNavBar);
							currentScreen = 'addFridge';
						}
					})
				}),
				new Label({
					height: 35, width: 80, left: 4, right: 5,
					skin: new Skin({ fill: "#EB5757" }),
					style: new Style({font: 'bold 23px Avenir', color: "white"}),
					string: "CLEAR",
					active:true,
					behavior: Behavior({
						onTouchEnded(content){
							if(shopScreen.itemList.length != 1){
								shopScreen.itemList.empty(0, shopScreen.itemList.length - 1);
							}
						}
					})
				})
			]
		})
	],
    behavior: Behavior ({
        onDisplayed: function (content) {
        	if (remotePins) {
        		// Not ready
        		remotePins.invoke("/ready/write", 0);
	        } else {
	        	trace("No remote pins\n");
	        }
        }
    })
});
