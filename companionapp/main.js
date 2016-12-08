import Pins from "pins";import {    HorizontalSlider, HorizontalSliderBehavior} from 'sliders';import {    FieldScrollerBehavior,    FieldLabelBehavior} from 'field';import {    SystemKeyboard} from 'keyboard';import {	LabeledCheckbox,	RadioGroup,     RadioGroupBehavior} from "buttons";import {    VerticalScroller,    VerticalScrollbar,    TopScrollerShadow,    BottomScrollerShadow} from 'scroller';import { items } from "data";//@program/* Pins stuff */let remotePins;application.behavior = Behavior({    onLaunch(application) {        application.add(mainScreen);        this.data = { labels: {} };        let discoveryInstance = Pins.discover(            connectionDesc => {                if (connectionDesc.name == "food-sensors") {                    trace("Connecting to remote pins\n");                    remotePins = Pins.connect(connectionDesc);                }            },            connectionDesc => {                if (connectionDesc.name == "food-sensors") {                    trace("Disconnected from remote pins\n");                    remotePins = undefined;                }            }        );	}});/* Constants */let SCREENHEIGHT = 400;/* Skins */let background = new Skin({ fill: '#F2F2F2' });let orangeSkin = new Skin({ fill: '#F2994A' });let blueSkin = new Skin({ fill: '#2D9CDB' });let lightGreySkin = new Skin({ fill: '#BDBDBD' });let darkGreySkin = new Skin({ fill: '#454545' });let redSkin = new Skin({ fill: '#EB5757' });let whiteSkin = new Skin({ fill: 'white' });/* Scroller */let darkGraySkin = new Skin({ fill: "#202020" });let titleStyle = new Style({ font: "20px", color: "white" });let ScrollerContainer = Container.template($ => ({    left: 0, right: 0, top: 0, bottom: 0,    contents: [        VerticalScroller($, {             active: true, top:10,            contents: [                $.content,                VerticalScrollbar(),                 TopScrollerShadow(),                 BottomScrollerShadow(),                ]                             })    ]}));/* Inventory Screen */function spoilToColor(freshness) {  if (freshness >= 0.8) {    return '#00B000'  } else if (freshness >= 0.6) {    return '#309000'  } else if (freshness >= 0.4) {    return '#606000'  } else if (freshness >= 0.2) {    return '#903000'  } else {    return '#B00000'  }}let StatusBar = Container.template($ => ({  contents: [    new Line({    	left: 0, width: $.width, top: 0, bottom: 0,     	skin: new Skin({    		fill: 'white',     		borders: {left: 1, right: 1, top: 1, bottom: 1},     		stroke: 'black'    	})    }),    new Line({     	left: 0, width: $.freshness * $.width, top: 0, bottom: 0, height: $.height,    	skin: new Skin({ fill: spoilToColor($.freshness) })    }),    new Label({    	left: 0, right: 0, top: 3, bottom: 0, visible: ($.freshness == 0),         style: new Style({ font: "bold 16px Avenir", color: "#B00000" }), string: "SPOILED"})  ]}));let invItem = Line.template($ => ({	skin: whiteSkin,	width: 280,	top: 10,  	active: true,	contents: [		new Picture({			url: $.img,			width: 70, height: 70		}),		new Column({			left: 10,			contents: [				new Label({					name: 'itemName', left:0,					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),					string: $.name				}),				new Label({					name: 'quantity', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.quantity + " " + unit_type,				}),				new StatusBar({ 				    width: 190, height: 15, top: 0, bottom: 0,				    freshness: $.freshness 				})			]		})	],  behavior: Behavior({      onTouchEnded: function(invitem, id, x, y, ticks) {        application.main.empty(0);        application.main.add(new itemScreen({        	id: $.id,        	itemName: $.name, itemPicture: $.img,        	itemLife: $.freshness, quantity: $.quantity,         	freshness: $.freshness,            recipes: $.recipes         }));        application.main.add(headerAndNavBar);        currentScreen = 'item';      }  })}))let InventoryScreen = Column.template($ => ({	skin: background,	width: 320, height: SCREENHEIGHT,	name: 'inventory',	contents: 		[			ScrollerContainer({ content:  new Column({ 					top: 0, left: 0, right: 0,					contents: [						items.map(item => new invItem({ 							id: item.id,							name: item.name, img: item.img, quantity: item.quantity, 							freshness: item.freshness, recipes: item.recipes 						}))					]				}) 			})		],    behavior: Behavior ({        onDisplayed: function (content) {        	if (remotePins) {        		remotePins.invoke("/ready/write", 0);	        } else {	        	trace("No remote pins\n");	        }        }    })}));let addItemSkin = new Skin({      width: 85, height: 85,      texture: new Texture("assets/addbtn.png"),      fill: "white",      aspect: "fit"});let addItemButton = new Content({	name: 'addbtn',	width: 60, height:60,	top: 365, left: 250,	skin: addItemSkin,	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			application.main.empty(0);			application.main.add(addItemScreen);			application.main.add(headerAndNavBar);			currentScreen = 'add';		}	})});/* Item detail screen */let itemScreenQuantity = -1;let itemScreenItemName;function listOfRecipes(recipes) {	if (recipes.length > 0) {		return recipes.map(recipe => new Label({				    					left: 0,						  				style: new Style({font: "20px Avenir", color: "black", horizontal: "left"}), 						  				string: recipe						  			  }))	} else {		return 'No recipes available.'	}}let normalStyle = new Style({ font: "20px Avenir", color: "black", horizontal: "left" });let itemScreen = Column.template($ => ({	skin: background,	left: 0, right: 0, top: 50, bottom: 0, 	contents: [		new Container({			left: 0, right: 0, top: 7, height: 40,			contents: [				new Label({					left: 20, top: 0, bottom: 0, 					style: new Style({ font: "bold 30px Avenir", color: "black" }), 					string: $.itemName				})			]}),		new Line({			width: 320,			left: 10,			contents: [		 		new Picture({ height: 100, url: $.itemPicture }),		  		new Column({		  			width: 200,		  			contents: [					    new Label({					    	left: 0,					    	style: normalStyle,					    	string: $.quantity + "oz remaining" 					    }),					    // new Label({					    // 	left: 0,					    // 	style: normalStyle,					    // 	string: "Entered 1 day ago"					    // }),					    new Label({					    	left: 0,					    	style: normalStyle,					    	string: $.freshness.toPrecision(2) + " days until spoiled"					    })					]				}),			]		}),		new Column({ // status bar			left: 40, right: 40, height: 30,  top: 10,			contents: [				new StatusBar({ 				    width: 260, height: 15, bottom: 10,				    freshness: $.freshness 				}),				new Container({					contents: [						new Label({							left: 0, width: 260,							style: new Style({ font: "18px Avenir", color: "black", horizontal: "left" }), 							string: 'Spoiled' 						}),						new Label({							right: 0, width: 260,							style: new Style({ font: "18px Avenir", color: "black", horizontal: "right" }), 							string: 'Fresh'						})					]				})		]}),		new Column({ // recipes			left: 20, top: 15,			contents: [			    new Label({			    	left: 0,			    	style: new Style({font: "bold 22px Avenir", color: "black", horizontal: "left"}), 			    	string: "Recipes"			    }),			    new Column({			    	left: 0,			    	contents: listOfRecipes($.recipes)			    })			]		}),    new Column({  		left: 20, top: 15, height: 40,   		contents: [		    new Label({		    	left: 0,		    	style: new Style({font: "bold 22px Avenir", color: "black", horizontal: "left"}), 		    	string: "Update quantity"		    }),		    new Line({		    	contents: [					new Scroller({						width: 100, top: 5, height: 30, active: true,						Behavior: FieldScrollerBehavior, clip: true,					  	contents: [						    Label($, {						      left: 4, right: 0, top: 0, bottom: 0, 						      skin: new Skin({ fill: "white", borders: {left: 1, right: 1, top: 1, bottom: 1}, stroke: "black" }),						      style: fieldStyle,						      anchor: 'NAME', editable: true,						      Behavior: class extends FieldLabelBehavior {						        onEdited(label) {						          let data = this.data;						          data.name = label.string;						          label.container.hint.visible = (data.name.length == 0);						          itemScreenQuantity = data.name;						        }						      },						    }),						    new Label({						      left: 4, right: 4, top: 4, bottom: 4, style: new Style({font: "18px Avenir", color: "gray"}),						      string: "New quantity", name: "hint"						    })						]					}),				    new Container({				    	left: 10, width: 100, top: 5, height: 30, active: true, skin: blueSkin, 				    	contents: [				      		new Label({				      			left: 0, right: 0, top: 0, bottom: 0, 				      			style: new Style({ font: "bold 22px Avenir", color: "white" }), 				      			string: "UPDATE"				      		})				      	], 				      	behavior: Behavior({					        onTouchBegan(button, id, x, y, ticks) {					        	button.skin = darkGreySkin;					        },					        onTouchEnded(button, id, x, y, ticks) {					        	button.skin = blueSkin;					            application.main.add(new Column({					            	name: 'modal',					            	skin: whiteSkin,					            	width: 220, height: 130,					            	contents: [					            		new Label({					            			left: 0, right: 0, top: 5,					            			style: new Style({ font: 'bold 23px Avenir', color: 'black' }),					            			string: 'Quantity updated'					            		}),					            		new Label({					            			left: 0, right: 0, top: 5,					            			style: new Style({ font: '18px Avenir', color: 'black' }),					            			string: 'New quantity for ' + $.itemName + ': ' + itemScreenQuantity + ' oz.'					            		}),										new Label({											height: 25, width: 100, top: 10,											skin: new Skin({ fill: "#2D9CDB" }),											style: new Style({font: 'bold 20px Avenir', color: "white"}),											string: "CLOSE",											active:true,											behavior: Behavior({												onTouchEnded(content){													items[$.id].quantity = itemScreenQuantity;											        application.main.empty(0);											        application.main.add(new itemScreen({											        	id: $.id,											        	itemName: $.itemName, itemPicture: $.itemPicture,											        	itemLife: $.itemLife, quantity: itemScreenQuantity, 											        	freshness: $.freshness,											            recipes: $.recipes 											        }));											        application.main.add(headerAndNavBar);													currentScreen = 'item';												}											})										}),										new Label({											height: 25, width: 100, top: 5,											skin: new Skin({ fill: "gray" }),											style: new Style({font: 'bold 20px Avenir', color: "white"}),											string: "UNDO",											active:true,											behavior: Behavior({												onTouchEnded(content){													application.main.remove(content.container);												}											})										}),					            	]					            }))					        }				      	})				    })		    	]		    })		]	}),]}));/* Add item screen */let nameInputSkin = new Skin({ borders: { bottom: 1 }, stroke: 'gray' });let fieldStyle = new Style({ color: 'black', font: '17px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldHintStyle = new Style({ color: '#aaa', font: '17px', horizontal: 'left',    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });let itemName;let itemNameField = Container.template($ => ({    width: $.width, height: 25, top: $.top, skin: $.skin, name:"itemField",    contents: [        Scroller($, { loop: true,            left: 4, right: 4, top: 0, bottom: 0, active: true,            Behavior: FieldScrollerBehavior, clip: true,            contents: [                Label($, {                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,                    style: fieldStyle, anchor: 'NAME',                    editable: true, string: $.name,                    Behavior: class extends FieldLabelBehavior {                        onEdited(label) {                            let data = this.data;                            data.name = label.string;                            label.container.hint.visible = (data.name.length == 0);                            itemName = data.name;                        }                    },                }),                Label($, {                    left: 4, right: 4, top: 0, bottom: 0, style: fieldHintStyle,                    string: "Item name", name: "hint"                }),            ]        })    ]}));let nameInput = new Line({	left: 52,	top: 8,	name: 'nameInput',	contents: [		new Label({			right: 15,			style: new Style({ font: '23px Avenir', color: 'black' }),			string: 'Name',		}),		new itemNameField({ width: 180, name:'', skin: nameInputSkin}),	]})let freshness;let FreshnessSlider = HorizontalSlider.template($ => ({	name: 'freshSlider',    height: 20, left: 0, right: 0,    Behavior: class extends HorizontalSliderBehavior {        onValueChanged(container) {        	let amount = Math.floor( this.data.value );            addItemScreen.freshInput[1].label.string = amount + " days to expire";            freshness = amount;        }    }}));let freshnessInput = new Line({	left: 23, top: 10,	name: 'freshInput',	contents: [		new Label({			right: 5,			style: new Style({ font: '23px Avenir', color: 'black' }),			string: 'Shelf life'		}),		new Column({			width: 200,			contents: [				new FreshnessSlider({ min: 0, max: 10, value: 0 }),				new Label({					name: "label",					string: "days old",					style: new Style({ font: "17px Avenir", color: 'black' })				}),			]		})	]})let unit_type = "";let quantity;let MyRadioGroup = RadioGroup.template($ => ({    top: 0, left: 5,     Behavior: class extends RadioGroupBehavior {        onRadioButtonSelected(buttonName) {            trace("Radio button with name " + buttonName + " was selected.\n");            unit_type = buttonName;        }    }}));let QuantitySlider = HorizontalSlider.template($ => ({	name: 'quantitySlider',    height: 20, left: 0, right: 0,    Behavior: class extends HorizontalSliderBehavior {        onValueChanged(container) {        	let amount = Math.floor( this.data.value );            addItemScreen.qtyInput[1].unit_ch.label.string = amount + " " + unit_type;            quantity = amount;        }    }}));let quantityInput = new Line({	left: 30, top: 5,	name: 'qtyInput',	contents: [		new Label({			right: 5,			style: new Style({ font: '23px Avenir', color: 'black' }),			string: 'Quantity'		}),		new Column({			width: 200,			contents: [				new QuantitySlider({ min: 0, max: 20, value: 0 }),				new Line({					top:0, left:0,					name: "unit_ch",					contents: [						new Label({							left:70,							name: "label",							string: 0,							style: new Style({ font: "17px Avenir", color: 'black' })						}),						new Container({							top:0, left:0,							active: true,							contents:[								new Label({									left:10,									name: "units",									string: " Units ",									style: new Style({ font: "17px Avenir", color: 'black' }),									skin: new Skin({										borders: { left:1, right:1 , top:1, bottom: 1 },										stroke: 'gray'}),								})								],							behavior: Behavior({								onTouchEnded: function(contents){									application.add(new Column({										name:"unit_list",										width:100, height:200,										skin: new Skin({ fill: "white",											borders: { left:1, right:1 , top:1, bottom: 1 },											stroke: 'gray'}),										contents:[											new MyRadioGroup({buttonNames: "cups,oz.,pds.,gal.,pc."}),											new Label({												top: 10, width: 30, height:30,												string: "OK",												skin: blueSkin,												style: new Style({ font: "20px Avenir", color: 'black' }),												active:true,												behavior: Behavior({													onTouchEnded: function(contents){														// i think i have to update here something before the modeal disappears														//but i can't figure out how ...														// application.qtyInput[1].														addItemScreen.qtyInput[1].unit_ch.label.string = quantity + " " + unit_type;														application.remove(application.unit_list);													}												})											})										]									}));								}							})						})					]				})				// new Label({				// 	name: "label",				// 	string: "10", // + some variable that tells what units				// 	style: new Style({ font: "17px Avenir", color: 'black' })				// }),			]		})	]})let submitButton = Container.template($ => ({	skin: new Skin({ fill: '#2D9CDB' }),	top: 10,	width: 80, height: 30,	contents: [		Label($, {			name: 'submitButton', string: $.string , style: new Style({ font: 'bold 24px Avenir', color: 'white' })		})	],	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			items.push({ id: 0, name: itemName, freshness: freshness/10, 				         img: 'assets/carrots.png', quantity: quantity, recipes:[] });			application.main.empty(0);			application.main.add(InventoryScreen());			application.main.add(headerAndNavBar);			application.main.add(addItemButton);		}	})}));let addItemScreen = new Column({	skin: background,	name: 'addItem',	width: 320, height: SCREENHEIGHT,	contents: [		new Label({			style: new Style({ font: 'bold 27px Avenir', color: 'black' }),			string: 'Add Item', top: 23, left: 23,		}),		nameInput,		freshnessInput,		quantityInput,		new Container({			name: 'imgHolder',			skin: new Skin({ fill: '#c4c4c4' }),			top: 10,			width: 150, height:150,			contents: [				new Label({					name: 'str',					top:50, left:10, right: 10,					style: new Style({ font: "bold 23px Avenir", color: "white" }),					string: "Press SCAN on"				}),				new Label({					top: 70, left:10, right: 10,					style: new Style({ font: "bold 23px Avenir", color: "white" }),					string: "food scanner!"				})			]		}),		new submitButton({string: 'FINISH'})	],    behavior: Behavior ({        onTouchEnded: function(content, id, x, y, ticks) {            SystemKeyboard.hide();            content.focus();        },        onDisplayed: function (content) {        	if (remotePins) {        		// Let device know ur ready        		remotePins.invoke("/ready/write", 1);	        	// Take pic	        	remotePins.repeat("/scan/read", 100, value => {	        		if (value && content.imgHolder.str) {	        			content.imgHolder.empty(0);	        			content.imgHolder.add(new Picture({	        				name: 'pic',	        				url: 'assets/carrots.png',	        				width: 150, height: 150 }));	        			// Read weight			        	remotePins.invoke("/scale/read", 100, value => {			        		quantity = value.weight.toPrecision(2);			        		content.freshInput[1].label.string = quantity + " days old";			        	});						// Read freshness			        	remotePins.invoke("/freshness/read", 100, value => {			        		freshness = value.weight.toPrecision(2);			        		content.qtyInput[1].label.string = freshness + " oz.";			        	});	        		} else if (value == 0 && content.imgHolder.pic) {	        			content.imgHolder.empty(0);	        			content.imgHolder.add(							new Label({								name: 'str',								top:50, left:10, right: 10,								style: new Style({ font: "bold 23px Avenir", color: "white" }),								string: "Press SCAN on"							})),					        			content.imgHolder.add(							new Label({								top: 70, left:10, right: 10,								style: new Style({ font: "bold 23px Avenir", color: "white" }),								string: "food scanner!"							}));	        		}	        	});	        } else {	        	trace("No remote pins\n");	        }        }    })});/* Shopping screen */let ShoppingListCheckbox = LabeledCheckbox.template($ => ({    active: true, top: 3, left:0, height:25,    behavior: Behavior({        onSelected: function(checkBox){        },        onUnselected: function(checkBox){        }    })}));let shopInvSkin = new Skin({fill: "#425fab"});let shoppingInventoryScreen = new Column({	name:"shopInvScreen",	skin: shopInvSkin,	top:0, bottom:0, left:0, right:0,});let addItemSubmitBtn = Label.template($ => ({	width: 60, height: 28,	left: 10,	skin: new Skin({ fill: "#2D9CDB" }),	style: new Style({font: "bold 24px Avenir", color: "white"}),	string: "ADD",	active:true,	behavior: Behavior({		onTouchEnded(content){			if(itemName){				shopScreen.itemList.remove(shopScreen.itemList.newItemField);				let newEntry = new Line({					left: 20, width: 320,					contents: [						new Line({							left: 0, width: 270,							contents: [								new ShoppingListCheckbox({ name: itemName }),							]						}),						new Label({							style: new Style({ font: 'bold 24px Avenir', color: 'gray',	horizontal: "right", }),							string: 'x',							active: true,							behavior: Behavior({								onTouchEnded: function(content){									shopScreen.itemList.remove(newEntry)								}							})						})					]				});								shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);				itemName = 0;			}		}	})}));let newItemField = Line.template($ => ({	left: 20, top: 5,	name: 'newItemField',	contents: [		new itemNameField({			width: 200,			top: 0,			name: '',			skin: new Skin({				borders: { left:0, right:0 , top:0, bottom: 1 },				stroke: 'gray'			})		}),		new addItemSubmitBtn()	]}));//have to reuse itemName for the itemNameField part.let listAddItemBtn = new Label({	left: 20, top: 10,	name: "addBtn",	skin: new Skin({		borders:{left:1, right:1, top:1, bottom:1},		stroke: 'black'	}),	width:25, height:25,	string: '+',	style: new Style({ font: "40px Avenir", color: 'black' }),	active:true,	behavior: Behavior({		onTouchEnded: function(content){			if (!shopScreen.itemList.newItemField) {				shopScreen.itemList.insert(				new newItemField(), shopScreen.itemList.addBtn)			}		}	})});let shopScreen = new Column({	skin: background,	name: 'shopping',	width: 320, height: 400,	contents: [		new Column({			name: "itemList",			top: 20, bottom:0, left:0, right:0,			contents: [				listAddItemBtn			]		}),		new Line({			bottom:20, left:10, right:10, height:35,			contents:[				new Label({					height: 35, width: 220, left:5, right: 4,					skin: new Skin({ fill: "#2D9CDB" }),					style: new Style({font: 'bold 23px Avenir', color: "white"}),					string: "ADD FROM INVENTORY",					active:true,					behavior: Behavior({						onTouchEnded(content){							application.main.empty(0);							application.main.add(AddFromFridgeScreen());							application.main.add(headerAndNavBar);							currentScreen = 'addFridge';						}					})				}),				new Label({					height: 35, width: 80, left: 4, right: 5,					skin: new Skin({ fill: "#EB5757" }),					style: new Style({font: 'bold 23px Avenir', color: "white"}),					string: "CLEAR",					active:true,					behavior: Behavior({						onTouchEnded(content){							if(shopScreen.itemList.length != 1){								shopScreen.itemList.empty(0, shopScreen.itemList.length - 1);							}						}					})				})			]		})	],    behavior: Behavior ({        onDisplayed: function (content) {        	if (remotePins) {        		// Not ready        		remotePins.invoke("/ready/write", 0);	        } else {	        	trace("No remote pins\n");	        }        }    })});/* Add from fridge screen */let itemsToAdd = {}let invItemShopping = Line.template($ => ({	skin: whiteSkin,	width: 260,	top: 10,	active: $.active,	contents: [		new Picture({			url: $.img,			width: 70, height: 70		}),		new Column({			left: 10,			contents: [				new Label({					name: 'itemName', left:0,					style: new Style({ font: 'bold 22px Avenir', color: 'black' }),					string: $.name				}),				new Label({					name: 'quantity', left:0,					style: new Style({ font: '20px Avenir', color: 'black' }),					string: $.quantity + " oz."				}),				new StatusBar({ 				    width: 170, height: 15, top: 0, bottom: 0,				    freshness: $.freshness 				})			]		})	],}));let AddFromFridgeCheckbox = LabeledCheckbox.template($ => ({    active: true, top: 33, left:0, height:25,    behavior: Behavior({        onSelected: function(checkBox){        	itemsToAdd[$.item] = true;        },        onUnselected: function(checkBox){        	delete itemsToAdd[$.item]        }    })}));let AddFromFridgeScreen = Container.template($ => ({	skin: background,	name: "AddFromFridge",	width: 320, height: 400,	contents: [		new Column({			top: 0,			name: 'items',			contents: [				ScrollerContainer({ content:  new Column({ 						top: 0, left: 0, right: 0, 						contents: [						 	items.map(item => 							 			new Line({							 				contents: [							 					new AddFromFridgeCheckbox({ item: item.name, name: '' }),												new invItemShopping({													name: item.name,													freshness: item.freshness,													img: item.img,													quantity: item.quantity,													active: true,												})							 				]							 			})						 			)						]					}) 				})			]			}),		new Label({			height:25, width: 200, bottom: 20,			skin: new Skin({ fill: "#2D9CDB" }),			style: new Style({font: 'bold 21px Avenir', color: "white"}),			string: "ADD SELECTED ITEMS",			active:true,			behavior: Behavior({				onTouchEnded(content){					for (var i = 0; i < content.container.items.length; i++) {						content.container.items[i].skin = whiteSkin;					}					application.main.empty(0);					application.main.add(shopScreen);					application.main.add(headerAndNavBar);					for (var item in itemsToAdd) {						let newEntry = new Line({							left: 20, width: 320,							contents: [								new Line({									left: 0, width: 270,									contents: [										new ShoppingListCheckbox({ name: item }),									]								}),								new Label({									right: 0,									style: new Style({ font: 'bold 24px Avenir', color: 'gray', horizontal: 'right' }),									string: 'x', active: true,									behavior: Behavior({										onTouchEnded: function(content){											shopScreen.itemList.remove(newEntry)										}									})								})							]						});						shopScreen.itemList.insert(newEntry, shopScreen.itemList.addBtn);					}					itemsToAdd = {};				}			})		}),	]}));/* Navigation bar */let inventoryButton = new Content({	name: 'invBtn',	width: 30, height: 30,	right: 30, left: 50, 	skin: new Skin({		width: 54, height:54,		texture: new Texture("assets/inventory.png"),		fill: "white",		aspect: "fit"	}),	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (currentScreen != 'inventory') {				currentScreen = 'inventory';				application.main.empty(0);				application.main.add(InventoryScreen());				application.main.add(headerAndNavBar);				application.main.add(addItemButton);			}		}	})});let shoppingButton = new Content({	name: 'shopBtn',	width: 30, height:30,	right: 50, left:30, 	skin: new Skin({	    width: 48, height:48,	    texture: new Texture("assets/shopping.png"),	    fill: "white",	    aspect: "fit"	}),	active: true,	behavior: Behavior ({		onTouchEnded: function(content, id, x, y, ticks) {			if (currentScreen != 'shop') {				currentScreen = 'shop';				application.main.empty(0);				application.main.add(shopScreen);				application.main.add(headerAndNavBar);			}		}	})});/* Main screen */let currentScreen = 'inventory';let headerAndNavBar = new Column({	contents: [		new Container({			name: 'header',			skin: whiteSkin,			width: 320, height: 50,			contents: [				new Picture({					top: 10, left:10, right: 120,					height:35,					url: "assets/header.png"				})			]		}),		new Line({			name: 'nav',			skin: whiteSkin,			width: 320, height: 50,			top: 380,			contents: [				inventoryButton,				shoppingButton			]		})	]})let mainScreen = new Container({	name: 'main',	left: 0, right: 0, top: 0, bottom: 0,	contents: [		InventoryScreen(),        addItemButton,		headerAndNavBar,	],});