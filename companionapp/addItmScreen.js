import {SCREENHEIGHT,
	background,
	blueSkin,
	remotePins,
	fieldStyle,
	itemName
} from "variables";
import {
    HorizontalSlider, HorizontalSliderBehavior
} from 'sliders';
import {
	LabeledCheckbox,
	RadioGroup, 
    RadioGroupBehavior
} from "buttons";
import {
    FieldScrollerBehavior,
    FieldLabelBehavior
} from 'field';
import { 
	items,
	demoAddItems
} from "data";
import {headerAndNavBar} from "navbar";
import {StatusBar, InventoryScreen, invItem, addItemButton} from "invScreen";

//*************************************************

/* Add item screen */
let nameInputSkin = new Skin({ borders: { bottom: 1 }, stroke: 'gray' });

let fieldHintStyle = new Style({ color: '#aaa', font: '17px', horizontal: 'left',
    vertical: 'middle', left: 5, right: 5, top: 5, bottom: 5 });
let fieldLabelSkin = new Skin({ fill: ['transparent', 'transparent', '#C0C0C0', '#acd473'] });

export let itemNameField = Container.template($ => ({
    width: $.width, height: 25, top: $.top, skin: $.skin, name:"itemField",
    contents: [
        Scroller($, { loop: true,
            left: 4, right: 4, top: 0, bottom: 0, active: true,
            Behavior: FieldScrollerBehavior, clip: true,
            contents: [
                Label($, {
                    left: 0, top: 0, bottom: 0, skin: fieldLabelSkin,
                    style: fieldStyle, anchor: 'NAME',
                    editable: true, string: $.name,
                    Behavior: class extends FieldLabelBehavior {
                        onEdited(label) {
                            let data = this.data;
                            data.name = label.string;
                            label.container.hint.visible = (data.name.length == 0);
                            itemName = data.name;
                        }
                    },
                }),
                Label($, {
                    left: 4, right: 4, top: 0, bottom: 0, style: fieldHintStyle,
                    string: "Item name", name: "hint"
                }),
            ]
        })
    ]
}));

let nameInput = Line.template($ => ({
	left: 52,
	top: 8,
	name: 'nameInput',
	contents: [
		new Label({
			right: 15,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Name',
		}),
		new itemNameField({ width: 180, name:'', skin: nameInputSkin}),
	]
}));

let life;
let FreshnessSlider = HorizontalSlider.template($ => ({
	name: 'freshSlider',
    height: 20, left: 0, right: 0,
    Behavior: class extends HorizontalSliderBehavior {
        onValueChanged(container) {
        	let amount = Math.floor( this.data.value );
            container.container.label.string = amount + " days until spoiled";
            life = amount;
        }
    }
}));
let freshnessInput = Line.template($ => ({
	left: 30, top: 10,
	name: 'freshInput',
	contents: [
		new Label({
			right: 5,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Shelf life'
		}),
		new Column({
			width: 200,
			contents: [
				new FreshnessSlider({ min: 0, max: 10, value: 0 }),
				new Label({
					name: "label",
					string: " days until spoiled",
					style: new Style({ font: "17px Avenir", color: 'black' })
				}),
			]
		})
	]
}));

let quantity = 0; //check see if fixes issues
let unit = "";

let MyRadioGroup = RadioGroup.template($ => ({
    top: 0, left: 5, 
    Behavior: class extends RadioGroupBehavior {
        onRadioButtonSelected(buttonName) {
            unit = " "  + buttonName;
        }
    }
}));

let QuantitySlider = HorizontalSlider.template($ => ({
	name: 'quantitySlider',
    height: 20, left: 0, right: 0,
    Behavior: class extends HorizontalSliderBehavior {
        onValueChanged(container) {
        	quantity = Math.floor( this.data.value );
            container.container.unit.label.string = quantity + " " + unit;
        }
    }
}));

let quantityInput = Line.template($ => ({
	left: 30, top: 5,
	name: 'qtyInput',
	contents: [
		new Label({
			right: 5,
			style: new Style({ font: '23px Avenir', color: 'black' }),
			string: 'Quantity'
		}),
		new Column({
			width: 200,
			contents: [
				new QuantitySlider({ min: 0, max: 20, value: 0 }),
				new Line({
					top:0, left:0,
					name: "unit",
					contents: [
						new Label({
							left:70,
							name: "label",
							string: 0,
							style: new Style({ font: "17px Avenir", color: 'black' })
						}),
						new Container({
							top:0, left:0,
							active: true,
							contents:[
								new Label({
									left:10,
									name: "units",
									string: " Units ▼ ",
									style: new Style({ font: "17px Avenir", color: 'black' }),
									skin: new Skin({
										borders: { left:1, right:1 , top:1, bottom: 1 },
										stroke: 'gray'}),
								})	
							],
							behavior: Behavior({
								onTouchEnded: function(content){
									if (application.unit_modal) {
										application.remove(application.unit_modal)
									} else {
										application.add(new Column({
											name:"unit_modal",
											width:100, height:135,
											top: 213, left: 170,
											skin: new Skin({ 
												fill: "white",
												borders: { left:1, right:1 , top:1, bottom: 1 },
												stroke: 'gray'
											}),
											contents:[
												new MyRadioGroup({buttonNames: "cups,oz.,lbs."}),
												new Label({
													top: 5, width: 30, height:30,
													string: "OK",
													skin: blueSkin,
													style: new Style({ font: "bold 20px Avenir", color: 'white' }),
													active:true,
													behavior: Behavior({
														onTouchEnded: function(content){
															application.remove(application.unit_modal);
															application.main.addItem.qtyInput[1].unit.label.string = quantity + " " + unit;
														}
													})
												})
											]
										}));
									}
								}
							})
						})

					]
				})
			]
		})
	]
}));

let submitButton = Container.template($ => ({
	skin: new Skin({ fill: '#2D9CDB' }),
	top: 10,
	width: 80, height: 30,
	contents: [
		Label($, {
			name: 'submitButton', string: $.string , style: new Style({ font: 'bold 24px Avenir', color: 'white' })
		})
	],
	active: true,
	behavior: Behavior ({
		onTouchEnded: function(content, id, x, y, ticks) {
			items.push({ id: items.length, name: itemName, life: life, unit: unit, //there may be a problem with the id here, it was 0 and i changed to items.length
				         img: newItem.img, 
				         quantity: quantity, 
				         recipes: newItem.recipes});
			newItem = false;
			application.main.empty(0);
			application.main.add(InventoryScreen());
			application.main.add(headerAndNavBar);
			application.main.add(addItemButton);
		}
	})
}));

let newItem;
export let addItemScreen = Column.template($ => ({
	skin: background,
	name: 'addItem',
	width: 320, height: SCREENHEIGHT,
	contents: [
		new Label({
			style: new Style({ font: 'bold 27px Avenir', color: 'black' }),
			string: 'Add Item', top: 23, left: 23,
		}),
		nameInput(),
		freshnessInput(),
		quantityInput(),
		new Container({
			name: 'imgHolder',
			skin: new Skin({ fill: '#c4c4c4' }),
			top: 10,
			width: 150, height:150,
			contents: [
				new Label({
					name: 'str',
					top:50, left:10, right: 10,
					style: new Style({ font: "bold 23px Avenir", color: "white" }),
					string: "Press SCAN on"
				}),
				new Label({
					top: 70, left:10, right: 10,
					style: new Style({ font: "bold 23px Avenir", color: "white" }),
					string: "food scanner!"
				})
			]
		}),
		new submitButton({string: 'FINISH'})
	],
    behavior: Behavior ({
        onTouchEnded: function(content, id, x, y, ticks) {
            SystemKeyboard.hide();
            content.focus();
        },
        onDisplayed: function (content) {
        	if (remotePins) {
        		// Let device know ur ready
        		remotePins.invoke("/ready/write", 1);

	        	// Take pic
	        	remotePins.repeat("/scan/read", 100, value => {
	        		if (value && content.imgHolder.str && !newItem) {
	        			newItem = demoAddItems.pop();
	        			trace(newItem + '\n');
	        			content.imgHolder.empty(0);
	        			content.imgHolder.add(new Picture({
	        				name: 'pic',
	        				url: newItem.img,
	        				width: 150, height: 150 }));
,
	        			trace("img added\n");

	        			// Read quantity
			        	remotePins.invoke("/quantity/read", 100, value => {
			        		quantity = Math.ceil(value.quantity);
			        		content.qtyInput[1].unit.label.string = quantity;
			        	});


						// Read freshness
			        	remotePins.invoke("/shelfLife/read", 100, value => {
			        		life = Math.ceil(value.life); 
			        		content[2][1].label.string = life + ' days until spoiled';
			        	});
	        		} else if (value == 0 && content.imgHolder.pic) {
	        			content.imgHolder.empty(0);
	        			content.imgHolder.add(
							new Label({
								name: 'str',
								top:50, left:10, right: 10,
								style: new Style({ font: "bold 23px Avenir", color: "white" }),
								string: "Press SCAN on"
							})),
				
	        			content.imgHolder.add(
							new Label({
								top: 70, left:10, right: 10,
								style: new Style({ font: "bold 23px Avenir", color: "white" }),
								string: "food scanner!"
							}));
	        		}
	        	});
	        } else {
	        	trace("No remote pins\n");
	        }
        }
    })
}));

