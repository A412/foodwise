import Pins from "pins";import {    HorizontalSlider, HorizontalSliderBehavior} from 'sliders';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'field';import {    SystemKeyboard} from 'keyboard';import {	LabeledCheckbox} from "buttons";//@program/* Pins stuff */let remotePins;application.behavior = Behavior({    onLaunch(application) {        application.add(mainScreen);        application.add(addItemButton);        this.data = { labels: {} };        let discoveryInstance = Pins.discover(            connectionDesc => {                if (connectionDesc.name == "food-sensors") {                    trace("Connecting to remote pins\n");                    remotePins = Pins.connect(connectionDesc);                }            },             connectionDesc => {                if (connectionDesc.name == "food-sensors") {                    trace("Disconnected from remote pins\n");                    remotePins = undefined;                }            }        );	}});/* Skins */let background = new Skin({ fill: '#F2F2F2' });let orangeSkin = new Skin({ fill: '#F2994A' });let blueSkin = new Skin({ fill: '#56CCF2' });let whiteSkin = new Skin({ fill: 'white' });/* Navigation bar */let inventorySkin = new Skin({      width: 54, height:54,      texture: new Texture("assets/inventory.png"),      fill: "white",      aspect: "fit"});let inventoryButton = new Content({	name: 'invBtn',	width: 30, height: 30, 	right: 30, left: 50, skin: inventorySkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (application.main.shopping) {				application.main.remove(shopScreen);				application.main.insert(inventoryScreen, application.main.nav);				application.add(addItemButton);			} else if (application.main.addItem) {				application.main.remove(addItemScreen);				application.main.insert(inventoryScreen, application.main.nav);				application.add(addItemButton);			}		}	})});let shoppingSkin = new Skin({      width: 48, height:48,      texture: new Texture("assets/shopping.png"),      fill: "white",      aspect: "fit"});let shoppingButton = new Content({	name: 'shopBtn',	width: 30, height:30,	right: 50, left:30, skin: shoppingSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (application.main.inventory) {				application.main.remove(inventoryScreen);				application.remove(addItemButton);				application.main.insert(shopScreen, application.main.nav);			} else if (application.main.addItem) {				application.main.remove(addItemScreen);				application.main.insert(shopScreen, application.main.nav);			}		}			})});/* Inventory Screen */let invItem = Line.template($ => ({	skin: whiteSkin,	width: 280,	top: 10,	contents: [		new Picture({			url: $.img,			width: 70, height: 70		}),		new Column({			left: 10,			contents: [				new Label({ 					name: 'itemName', left:0,					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),					string: $.itemName				}),				new Label({ 					name: 'quantity', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.quantity + " oz."				}),				new Label({ 					name: 'freshness', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.freshness				})			]		})	]}))let inventoryScreen = new Column({ 	skin: background,	width: 320, height: 360,	name: 'inventory',	contents: [		new invItem({ itemName: 'bell peppers1', freshness: 'replace with status bar',			img: 'assets/bell-peppers.png' }),		new invItem({ itemName: 'bell peppers2', freshness: 'replace with status bar', 			img: 'assets/bell-peppers.png' }),		new invItem({ itemName: 'bell peppers3', freshness: 'replace with status bar', 			img: 'assets/bell-peppers.png' }),		new invItem({ itemName: 'bell peppers4', freshness: 'replace with status bar',			img: 'assets/bell-peppers.png' })	],    behavior: Behavior ({        onDisplayed: function (content) {        	if (remotePins) {        		// Not ready        		remotePins.invoke("/ready/write", 0);	        } else {	        	trace("No remote pins\n");	        }        }    })});let addItemSkin = new Skin({      width: 85, height: 85,      texture: new Texture("assets/addbtn.png"),      fill: "white",      aspect: "fit"});let addItemButton = new Content({	name: 'addbtn',	width: 60, height:60,	top: 365, left: 250,	skin: addItemSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			application.main.remove(inventoryScreen);			application.remove(addItemButton);			application.main.insert(addItemScreen, application.main.nav);		}			})});/* Add item screen */let nameInputSkin = new Skin({ borders: { left: 1, right:1 , top:1, bottom: 1 }, stroke: 'gray' });let fieldStyle = new Style({ color: 'black', font: '20px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldHintStyle = new Style({ color: '#aaa', font: '20px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });let itemName;let itemNameField = Container.template($ => ({     width: $.width, height: 30, top: $.top, skin: $.skin, name:"itemField",     contents: [            Scroller($, { loop: true,            left: 4, right: 4, top: 0, bottom: 0, active: true,             Behavior: FieldScrollerBehavior, clip: true,             contents: [                Label($, {                     left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                     style: fieldStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            label.container.hint.visible = (data.name.length == 0);                            itemName = data.name;                        }                    },                }),                Label($, {                    left: 4, right: 4, top: 0, bottom: 0, style: fieldHintStyle,                    string: "Item name", name: "hint"                }),            ]        })    ]}));let freshness;let FreshnessSlider = HorizontalSlider.template($ => ({    height: 30, left: 50, right: 50, top:10,    Behavior: class extends HorizontalSliderBehavior {        onValueChanged(container) {        	let amount = Math.floor( this.data.value );            addItemScreen.freshness.string = amount + " days old";            freshness = amount;        }    }}));	let weight;let submitButton = Container.template($ => ({	skin: new Skin({ fill: '#2D9CDB' }),	top: 10,	width: 80, height: 30,	contents: [		Label($, {			name: 'submitButton', string: $.string , style: new Style({ font: 'bold 24px Avenir', color: 'white' })		})	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			application.main.remove(addItemScreen);			application.main.insert(inventoryScreen, application.main.nav);			inventoryScreen.insert(new invItem({ 					itemName: itemName, 					quantity: weight,					freshness: freshness + " days old",					img: 'assets/cilantro.png' }), inventoryScreen.first);			application.add(addItemButton);		}	}) }));let addItemScreen = new Column({ 			skin: background,			name: 'addItem',			width: 320, height: 360,			contents: [ 				new itemNameField({ width: 250, top: 20, name:'', skin: nameInputSkin}),				new FreshnessSlider({ min: 0, max: 5, value: 0 }),				new Label({ 					top: 0,					name: "freshness",					string: "0 days old", 					style: new Style({ font: "20px Avenir", color: 'black' }) 				}),				new Container({					name: 'imgHolder',					skin: new Skin({ fill: '#c4c4c4' }),					top: 10,					width: 220, height:180,					contents: [						new Label({ 							name: 'str',							top:60, left:10, right: 10,							style: new Style({ font: "bold 25px Avenir", color: "white" }),							string: "Press SCAN on"						}),						new Label({ 							top: 80, left:10, right: 10,							style: new Style({ font: "bold 25px Avenir", color: "white" }),							string: "the food scanner!"						})					]				}),				new submitButton({string: 'FINISH'})			],		    behavior: Behavior ({		        onTouchEnded: function(content, id, x, y, ticks) {		            SystemKeyboard.hide();		            content.focus();		        },		        onDisplayed: function (content) {		        	if (remotePins) {		        		// Let device know ur ready		        		remotePins.invoke("/ready/write", 1);			        	// Take pic			        	remotePins.repeat("/scan/read", 100, value => {			        		if (value && content.imgHolder.str) {			        			content.imgHolder.empty(0);			        			content.imgHolder.add(new Picture({ 			        				name: 'pic',			        				url: 'assets/cilantro.png',			        				width: 220, height: 180 }));				        		content.imgHolder.add(new Container({				        			name: 'weight',				        			skin: whiteSkin,				        			bottom: 0, right:0,				        			width: 50, height: 25,				        			contents: [				        				new Label({				        					name:'weight',				        					style: new Style({ font: '20px Avenir', color: 'black' }),				        					string: '...'				        				})				        			]				        		}))			        		} else if (value == 0 && content.imgHolder.pic) {			        			content.imgHolder.empty(0);			        			content.imgHolder.add(									new Label({ 										name: 'str',										top:60, left:10, right: 10,										style: new Style({ font: "bold 25px Avenir", color: "white" }),										string: "Press SCAN on"									}));			        			content.imgHolder.add(									new Label({ 										top: 80, left:10, right: 10,										style: new Style({ font: "bold 25px Avenir", color: "white" }),										string: "the food scanner!"									}))			        		}			        	});												// Read weight			        	remotePins.repeat("/scale/read", 100, value => {			        		if (content.imgHolder.weight) {			        			weight = value.weight.toPrecision(2);			        			content.imgHolder.weight.weight.string = value.weight.toPrecision(2) + " oz.";			        		}			        	});			        } else {			        	trace("No remote pins\n");			        }		        }		    })		});/*********************** Shopping screen */let MyCheckBoxTemplate = LabeledCheckbox.template($ => ({    active: true, top: 3, left:0, height:25,    behavior: Behavior({        onSelected: function(checkBox){        },        onUnselected: function(checkBox){        }    })}));let shopInvSkin = new Skin({fill: "#425fab"});let shoppingInventoryScreen = new Column({	name:"shopInvScreen",	skin: shopInvSkin,	top:0, bottom:0, left:0, right:0,});let addItemSubmitBtn = Label.template($ => ({	width: 60, height: 28,	left: 10,	skin: new Skin({ fill: "#2D9CDB" }),	style: new Style({font: "bold 24px Avenir", color: "white"}),	string: "ADD",	active:true,	behavior: Behavior({		onTouchEnded(content){			if(itemName){ 				shopScreen.itemList.remove(shopScreen.itemList.newItemField);				let newEntry = new Line({					left: 20, width: 320,					contents: [						new MyCheckBoxTemplate({ name: itemName }),						new Label({ 							right: 0, left: 100,							style: new Style({ font: 'bold 24px Avenir', color: 'gray' }),							string: 'x',							active: true,							behavior: Behavior({								onTouchEnded: function(content){									shopScreen.itemList.remove(newEntry)								}							})						})					]				});				// shopScreen.itemList.insert(new MyCheckBoxTemplate({name: itemName}), shopScreen.itemList.addBtn);				shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);				itemName = 0;			}		}	})}));let newItemField = Line.template($ => ({	left: 20, top: 5,	name: 'newItemField',	contents: [		new itemNameField({			width: 200,			top: 0,			name: '', 			skin: new Skin({ 				borders: { left:0, right:0 , top:0, bottom: 1 }, 				stroke: 'gray' 			})		}),		new addItemSubmitBtn()	]}));//have to reuse itemName for the itemNameField part. let listAddItemBtn = new Label({	left: 20, top: 10,	name: "addBtn",	skin: new Skin({		borders:{left:1, right:1, top:1, bottom:1},		stroke: 'black'	}),	width:25, height:25,	string: '+',	style: new Style({ font: "40px Avenir", color: 'black' }),	active:true,	behavior: Behavior({		onTouchEnded: function(content){			if (!shopScreen.itemList.itemField) {				shopScreen.itemList.insert(				new newItemField(), shopScreen.itemList.addBtn)			}		}	})});let shopScreen = new Column({ 	skin: background,	name: 'shopping',	width: 320, height: 360,	contents: [ 		new Column({			name: "itemList",			top: 20, bottom:0, left:0, right:0,			contents: [				listAddItemBtn			]		}),			new Line({			bottom:10, left:10, right:10, height:35,			contents:[				new Label({					height: 35, width: 200, left:5, right: 4,					skin: new Skin({ fill: "#2D9CDB" }),					style: new Style({font: 'bold 24px Avenir', color: "white"}),					string: "ADD FROM FRIDGE",					active:true,					behavior: Behavior({						onTouchEnded(content){							application.main.remove(shopScreen);							application.main.insert(addFromFridgeScreen, application.main.nav);						}					})				}),				new Label({					height: 35, width: 130, left: 4, right: 5,					skin: new Skin({ fill: "#EB5757" }),					style: new Style({font: 'bold 24px Avenir', color: "white"}),					string: "CLEAR LIST",					active:true,					behavior: Behavior({						onTouchEnded(content){							if(shopScreen.itemList.length != 0){								shopScreen.itemList.empty(0, shopScreen.itemList.length - 1);							}						}					})				})			]		})	],    behavior: Behavior ({        onDisplayed: function (content) {        	if (remotePins) {        		// Not ready        		remotePins.invoke("/ready/write", 0);	        } else {	        	trace("No remote pins\n");	        }        }    })});/* Add from fridge screen */let itemsToAdd = []let invItemShopping = Line.template($ => ({	skin: whiteSkin,	width: 280,	top: 10,	active: $.active,	contents: [		new Picture({			url: $.img,			width: 70, height: 70		}),		new Column({			name: 'info',			left: 10,			contents: [				new Label({ 					name: 'itemName', left:0,					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),					string: $.itemName				}),				new Label({ 					name: 'quantity', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.quantity + " oz."				}),				new Label({ 					name: 'freshness', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.freshness				})			]		})	],			behavior: Behavior({				onTouchEnded: function(content) {					trace("does this work?\n");					content.skin = orangeSkin;					itemsToAdd.push(content.info.itemName.string);				}			}) }));let addFromFridgeScreen = new Column({	skin: background,	name: "AddFromFridge",	width: 320, height: 360,	contents: [		new invItemShopping({ 			itemName: 'bellpeppers1', 			freshness: 'replace with status bar',			img: 'assets/bell-peppers.png', 			quantity: 1,			freshness: '4 days old',			active: true,		}),		new invItemShopping({ itemName: 'lemons', freshness: 'replace with status bar', 			skin: whiteSkin, img: 'assets/bell-peppers.png', active: true }),		new invItemShopping({ itemName: 'idk', freshness: 'replace with status bar', 			skin: whiteSkin, img: 'assets/bell-peppers.png', active: true, }),		new invItemShopping({ itemName: 'cucumber', freshness: 'replace with status bar',			skin: whiteSkin, img: 'assets/bell-peppers.png', active: true }),		new Label({			height: 35, width: 200, left:10, right: 10, bottom: 10,			skin: new Skin({ fill: "#2D9CDB" }),			style: new Style({font: 'bold 24px Avenir', color: "white"}),			string: "ADD SELECTED ITEMS",			active:true,			behavior: Behavior({				onTouchEnded(content){					application.main.remove(addFromFridgeScreen);					application.main.insert(shopScreen, application.main.nav);					for (var i = 0; i < itemsToAdd.length; i++) {						let newEntry = new Line({							left: 20, width: 320,							contents: [								new MyCheckBoxTemplate({ name: itemsToAdd[i] }),								new Label({ 									right: 0, left: 100,									style: new Style({ font: 'bold 24px Avenir', color: 'gray' }),									string: 'x',									active: true,									behavior: Behavior({										onTouchEnded: function(content){											shopScreen.itemList.remove(newEntry)										}									})								})							]						});						shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);					}				}			})		}),				]})/* Main screen */let mainScreen = new Column({ 	name: 'main',	left: 0, right: 0, top: 0, bottom: 0, skin: whiteSkin,	contents: [		new Line({			name: 'header',			skin: new Skin({ fill: 'white' }),			height: 70, width: 320,			contents: [				new Label({ 					left: 20,					string: "Foodwise", 					style: new Style({ font: 'bold 50px Avenir', color: '#2D9CDB' })}),			]		}),		inventoryScreen,		new Line({			skin: new Skin({ fill: 'white' }),			name: 'nav', 			width: 320, height: 50,			bottom: 0,			contents: [				inventoryButton,				shoppingButton			]		})	]});// stuff down here isn't part of the app, just for reference (from my pet app)let sliderOn;let foodBowl = new Container({	name: 'bowl',	width: 110, height: 110,	left: 10, right: 10,  skin: orangeSkin,	contents: [		new Label({ name: 'text', string: 'Food', style: new Style({font: '30px Avenir', color: 'white'}) })	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (!sliderOn) {				sliderOn = true;				application.main.amounts.add(AmountSlider({ min: 0, max: 5, value: 0 }));				application.main.amounts.add(new Label({ 					name: 'amount', string: 'New food amount: 0 cups',					style: new Style({font: '22px Avenir', color: 'black'})				}));				application.main.amounts.add( new Line({					top: 10,					contents: [ new cancelButton(), new submitButton({ bowl: "Food" }) ] 				}));			}		}	}) });let waterBowl = new Container({	name: 'bowl',	width: 110, height: 110,	left: 10, right:10, skin: blueSkin,	contents: [		new Label({ name:'text',string: 'Water', style: new Style({font: '30px Avenir', color: 'white'}) })	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (!sliderOn) {				sliderOn = true;				content.container.container.container.add(AmountSlider({ min: 0, max: 5, value: 0 }));				content.container.container.container.add(new Label({ 					name: 'amount', string: 'New water amount: 0 cups',					style: new Style({font: '22px', color: 'black'})				}));				content.container.container.container.add( new Line({					top: 10,					contents: [ new cancelButton(), new submitButton({ bowl: "Water" }) ] 				}));			}		}	}) });let newAmount;let AmountSlider = HorizontalSlider.template($ => ({    height: 50, left: 50, right: 50,    Behavior: class extends HorizontalSliderBehavior {        onValueChanged(container) {        	let amount = this.data.value.toPrecision(2);            trace("Value is: " + amount + "\n");            application.main.amounts.amount.string = amount + ' cups';            newAmount = amount;        }    }}));let cancelButton = Container.template($ => ({	skin: new Skin({ fill: 'gray' }),	width: 80, height: 30, bottom: 30,	left: 10, right:10,	contents: [		new Label({			name: 'cancelButton', string: 'Cancel', style: new Style({ font: 'bold 22px Avenir', color: 'white' })		})	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			application.main.amounts.empty(1, 4);			sliderOn = false;		}	}) }));