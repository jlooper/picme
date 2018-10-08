<template>
  <Page class="page">
	  <ActionBar class="action-bar" title="PicMe: Beat the Machine!">
		  <ActionItem ios.position="left">
			  <Label class="fa" @tap="open" :text="'fa-bars' | fonticon" />
		  </ActionItem>
	  </ActionBar>

  <RadSideDrawer ref="drawer">
    
    <StackLayout class="drawer" ~drawerContent>
      <ScrollView>
        <StackLayout>
          <Label text="Barn Owl or Apple?" @tap="loadNewGame('barnowl-apple')" padding="5" />
          <Label text="Chihuahua or Muffin?" @tap="loadNewGame('chihuahua-muffin')" padding="5" />
          <Label text="Chocolate or Dalmatian?" @tap="loadNewGame('chocolate-dalmatian')" padding="5" />
          <Label text="Croissant or Dog?" @tap="loadNewGame('croissant-dog')" padding="5" />
          <Label text="Kitten or Caramel?" @tap="loadNewGame('kitten-caramel')" padding="5" />
          <Label text="Labradoodle or Fried Chicken?" @tap="loadNewGame('labradoodle-friedchicken')" padding="5" />
          <Label text="Parrot or Guacamole?" @tap="loadNewGame('parrot-guacamole')" padding="5" />
          <Label text="Puppy or Bagel?" @tap="loadNewGame('puppy-bagel')" padding="5" />
          <Label text="Sheepdog or Mop?" @tap="loadNewGame('sheepdog-mop')" padding="5" />
          <Label text="Shiba or Marshmallow?" @tap="loadNewGame('shiba-marshmallow')" padding="5" />
          <Label text="Shrew or Kiwi?" @tap="loadNewGame('shrew-kiwi')" padding="5" />
          <Label text="Sloth or Bread?" @tap="loadNewGame('sloth-bread')" padding="5" />
          <Label text="Trump or Chicken?" @tap="loadNewGame('trump-chicken')" padding="5" />
        </StackLayout>
      </ScrollView>
    </StackLayout>
      
      <GridLayout ~mainContent columns="*" rows="1*,1*" verticalAlignment="top">

        <StackLayout class="top-grid" row="0" col="0"></StackLayout>

        <StackLayout row="1" col="0"></StackLayout>

        <StackLayout row="0" col="0" rowSpan="2">
 
         <GridLayout rows="60,auto,auto,4*,auto,auto" columns="*"> 

            <Label row="0" col="0" class="title" :text="title"></Label>

			<StackLayout :visibility="!count?'visible':'collapse'" row="1" orientation="horizontal"  horizontalAlignment="center">
              
				<StackLayout width="150" height="150" style="margin-right:5; padding: 5; border-radius: 75; background-color: white">
					<Image :src="'~/assets/images/'+choice1+'.jpg'" stretch="aspectFit"/>
				</StackLayout>
					
				<StackLayout width="150" height="150" style="margin-left: 5; padding: 5; border-radius: 75; background-color: white">
					<Image :src="'~/assets/images/'+choice2+'.jpg'" stretch="aspectFit"/>
				</StackLayout>
					
			</StackLayout>

			<Button row="2" style="height: 50; margin-top: 20" class="btnStart" :visibility="!count?'visible':'collapse'" @tap="countFiles" text="Ready? Start Game!"/>
            
            <SwipeLayout row="3" col="0" v-for="item in count" :key="item" @swipeLeft="swipeCallback(choice1,$event,item)" @swipeRight="swipeCallback(choice2,$event,item)">                             
              
              <GridLayout rows="4*,2*,4*" columns="*">

                <CardView row="0" elevation="20" margin="10" radius="10" backgroundColor="white" shadowOpacity=".2" shadowRadius="5">
                    <Image style="margin: 10" row="0" :src="'~/assets/images/'+imageFolder+'/'+item+'.jpg'"/>        
                </CardView> 

				<StackLayout :visibility="!count?'collapse':'visible'" row="1" col="0" orientation="horizontal"  horizontalAlignment="center">
              
					<StackLayout width="80" height="80" style="margin-right:40; padding: 10; border-radius: 40; background-color: white">
						<Image :src="'~/assets/images/'+choice1+'.jpg'" stretch="aspectFit"/>
					</StackLayout>
					
					<StackLayout width="80" height="80" style="margin-left: 40; padding: 10; border-radius: 40; background-color: white">
						<Image :src="'~/assets/images/'+choice2+'.jpg'" stretch="aspectFit"/>
					</StackLayout>
								
				</StackLayout>  

                <CardView row="2" elevation="5" margin="10" radius="10" backgroundColor="white" shadowOpacity=".2" shadowRadius="5">
                    <GridLayout rows="*" columns="*,*">
                      <Label class="emoji" text="🤖 💬" col="0"/>
                      <StackLayout col="1">
                        <Label class="response" col="1" v-for="item in response" :key="item" :text="item"/>
                      </StackLayout>
                    </GridLayout>
                </CardView>

              </GridLayout>
            
            </SwipeLayout>

            <StackLayout style="horizontal-align: center;padding-bottom: 10" orientation="horizontal" row="4">
              <Label class="emoji-small" :text="'👩‍ '+humanScore"/>
              <Label class="emoji-small" :text="'🤖 '+botScore"/>
            </StackLayout>

                  
            </GridLayout>       
        </StackLayout>
      </GridLayout>
    </RadSideDrawer>
  </Page>
</template>

<script>
const imageSourceModule = require('tns-core-modules/image-source');
const fileSystemModule = require('tns-core-modules/file-system');
const folder = fileSystemModule.knownFolders.currentApp();
import { mapActions } from 'vuex';
import { Feedback, FeedbackType, FeedbackPosition } from 'nativescript-feedback';
import { Color } from 'tns-core-modules/color';
import { Images } from '../data/types';

export default {
	data() {
		return {
			imageFolder: 'puppy-bagel',
			response: [],
			images: Images,
			currImage: 0,
			voted: false,
		};
	},
	computed: {
		count() {
			return this.$store.state.counter.numFiles;
		},
		title() {
			return this.$store.state.counter.title;
		},
		choice1() {
			return this.$store.state.counter.choice1;
		},
		choice2() {
			return this.$store.state.counter.choice2;
		},
		humanScore() {
			return this.$store.state.counter.humanScore;
		},
		botScore() {
			return this.$store.state.counter.botScore;
		},
	},
	methods: {
		...mapActions(['countFiles,setGameParams']),

		countFiles() {
			this.$store.dispatch('clearCount').then(() => {
				this.$store.dispatch('countFiles', this.imageFolder).then(() => {
					this.queryMLKit(this.$store.state.counter.numFiles + 1);
				});
			});
		},

		loadNewGame(folderName) {
			this.$store.dispatch('clearCount');
			this.$store.dispatch('clearScore');
			this.imageFolder = folderName;
			this.$store.dispatch('setGameParams', this.imageFolder).then(() => {
				this.close();
			});
		},

		select(choice) {
			if (!this.voted) {
				this.images.forEach((image, index) => {
					if (choice == image.type) {
						for (var i = 0; i < image.ids.length; i++) {
							if (image.ids[i] == this.currImage) {
								this.$store.dispatch('setHumanScore');
							}
						}
					}
				});
			}
			this.voted = true;
		},

		swipeCallback(choice, e, id) {
			this.response = '';
			this.voted = false;

			//calculate the choice
			this.select(choice);

			let msg = '';

			if (id == 1) {
				if (this.$store.state.counter.humanScore > this.$store.state.counter.botScore) {
					msg = '👩 🏆';
				} else if (this.$store.state.counter.humanScore < this.$store.state.counter.botScore) {
					msg = '🤖 🏆';
				} else {
					msg = "It's a 👩 🤖 tie!";
				}

				let feedback = new Feedback();

				feedback.show({
					title: msg,
					message: 'Try another set of images!',
					position: FeedbackPosition.Bottom, // iOS only
					messageColor: new Color('#6a5cff'),
					duration: 3000,
					backgroundColor: new Color('#4fffe8'),
					onTap: () => {
						feedback.hide();
					},
				});

				this.$store.dispatch('clearCount');
				this.$store.dispatch('clearScore');
			} else {
				this.queryMLKit(id);
			}
		},

		queryMLKit(id) {
			this.response = ['thinking...'];
			this.currImage = id - 1;
			let p = '/assets/images/' + this.imageFolder + '/' + this.currImage + '.jpg';

			const path = fileSystemModule.path.join(folder.path, p);
			const exists = fileSystemModule.File.exists(path);
			const source = new imageSourceModule.ImageSource();
			source.fromFile(path).then(imageSource => {
				this.$firebase.mlkit.imagelabeling
					.labelImageOnDevice({
						image: { imageSource: source },
						confidenceThreshold: 0.6,
					})
					.then(result => {
						let arr = [];
						let labelsArr = [];
						for (let i = 0; i < result.labels.length; ++i) {
							arr.push(
								result.labels[i].text + ' : ' + Math.floor(result.labels[i].confidence * 100) + '%'
							);
							//this array is used to calculate the score
							labelsArr.push(result.labels[i].text);
						}
						this.calculateBotScore(this.imageFolder, this.currImage, labelsArr);

						this.response = arr;
					})
					.catch(errorMessage => (result = 'I have no idea!'));
			});
		},

		calculateBotScore(folder, currImage, labels) {
			//what is this thing?

			let gameName = folder.split(/\s*\-\s*/g);
			let choice1 = gameName[0];
			let choice2 = gameName[1];

			this.images.forEach((image, index) => {
				if (choice1 == image.type) {
					for (var i = 0; i < image.ids.length; i++) {
						if (image.ids[i] == currImage) {
							let answers = image.acceptedAnswers;
							for (var j = 0; j < answers.length; j++) {
								for (var k = 0; k < labels.length; k++) {
									if (answers[j].toLowerCase() == labels[k].toLowerCase()) {
										this.$store.dispatch('setBotScore');
									}
								}
							}
						}
					}
				} else if (choice2 == image.type) {
					for (var i = 0; i < image.ids.length; i++) {
						if (image.ids[i] == currImage) {
							let answers = image.acceptedAnswers;
							for (var j = 0; j < answers.length; j++) {
								for (var k = 0; k < labels.length; k++) {
									if (answers[j].toLowerCase() == labels[k].toLowerCase()) {
										this.$store.dispatch('setBotScore');
									}
								}
							}
						}
					}
				}
			});
		},

		open() {
			this.$refs.drawer.nativeView.showDrawer();
		},

		close() {
			this.$refs.drawer.nativeView.closeDrawer();
		},
	},
	created() {
		this.$store.dispatch('clearCount');
	},
};
</script>

<style scoped>
.action-bar {
	background-color: #4fffe8;
	color: #6a5cff;
}
.top-grid {
	background: linear-gradient(to top, #5cb0ff, #55cde8);
}

.emoji {
	font-size: 75;
}
.emoji-small {
	font-size: 30;
}
.response {
	margin: 5;
}

.btnStart {
	font-size: 25;
	color: white;
	background-color: #6a5cff;
	text-transform: uppercase;
	margin: 5;
	padding: 5;
	border-radius: 5;
}
</style>