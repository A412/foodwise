import {SCREENHEIGHT,
	background,
	whiteSkin,
	remotePins,
	currentScreen,
	itemName
} from "variables";

import { 
	items,
	demoAddItems
} from "data";

import {itemScreen} from "itDetailScreen";

import {ScrollerContainer} from "listScroller";

import {headerAndNavBar} from "navbar";

import {addItemScreen} from "addItmScreen";

//********************************************

/* Inventory Screen */
function spoilToColor(life) {
  if (life >= 7) {
    return '#00B000'
  } else if (life >= 5) {
    return '#309000'
  } else if (life >= 3) {
    return '#606000'
  } else if (life >= 1) {
    return '#903000'
  } else {
    return '#B00000'
  }
}

export let StatusBar = Container.template($ => ({
  contents: [
    new Line({
    	left: 0, width: $.width, top: 0, bottom: 0, 
    	skin: new Skin({
    		fill: 'white', 
    		borders: {left: 1, right: 1, top: 1, bottom: 1}, 
    		stroke: 'black'
    	})
    }),
    new Line({ 
    	left: 0, width: ($.life/10) * $.width, top: 0, bottom: 0, height: $.height,
    	skin: new Skin({ fill: spoilToColor($.life) })
    }),
    new Label({
    	left: 0, right: 0, top: 3, bottom: 0, visible: ($.life == 0), 
        style: new Style({ font: "bold 16px Avenir", color: "#B00000" }), string: "SPOILED"})
  ]
}));



export let invItem = Line.template($ => ({
	skin: whiteSkin,
	width: 280,
	top: 10,
  	active: true,
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
				    width: 190, height: 15, top: 0, bottom: 0,
				    life: $.life 
				})
			]
		})
	],
  behavior: Behavior({
      onTouchEnded: function(invitem, id, x, y, ticks) {
        application.main.empty(0);
        application.main.add(new itemScreen({
        	id: $.id, itemName: $.name, itemPicture: $.img,
        	quantity: $.quantity, unit: $.unit,
        	life: $.life, recipes: $.recipes 
        }));
        application.main.add(headerAndNavBar);
        currentScreen = 'item';
      }
  })
}))

export let InventoryScreen = Column.template($ => ({
	skin: background,
	width: 320, height: SCREENHEIGHT,
	name: 'inventory',
	contents: 
		[
			ScrollerContainer({ content:  new Column({ 
					top: 0, left: 0, right: 0,
					contents: [
						items.map(item => new invItem({ 
							id: item.id, name: item.name, img: item.img, 
							quantity: item.quantity, unit: item.unit,
							life: item.life, recipes: item.recipes 
						}))
					]
				}) 
			})
		],
    behavior: Behavior ({
        onDisplayed: function (content) {
        	if (remotePins) {
        		remotePins.invoke("/ready/write", 0);
	        } else {
	        	trace("No remote pins\n");
	        }
        }
    })
}));

let addItemSkin = new Skin({
      width: 85, height: 85,
      texture: new Texture("assets/addbtn.png"),
      fill: "white",
      aspect: "fit"
});

export let addItemButton = new Content({
	name: 'addbtn',
	width: 60, height:60,
	top: 365, left: 250,
	skin: addItemSkin,
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			application.main.empty(0);
			application.main.add(addItemScreen());
			application.main.add(headerAndNavBar);
			currentScreen = 'add';
		}

	})
});