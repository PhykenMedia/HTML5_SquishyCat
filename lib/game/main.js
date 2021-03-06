ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
    'game.utilities.Camera',
	
	'game.entities.SquishKitten',
    'game.entities.LevelCompleteScreen',
	
	'game.levels.level1',
    'game.levels.level2',
    'game.levels.level3',
    'game.levels.level4',
    'game.levels.level5',
    'game.levels.level6',
    'game.levels.level7',
    'game.levels.StageSelect',

    'game.entities.LevelButton',
    'game.entities.ExitLevelButton'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
    player: null,
    camera: null,
    preLoadMusic1: new ig.Sound( 'media/Music/Ritual.*' ),
    preLoadMusic2: new ig.Sound( 'media/Music/SnowQueen.*' ),
    preLoadMusic3: new ig.Sound( 'media/Music/Victory.*')   ,
    slingshot: true,
    characterRelative: false,
    victoryScreen: null,
    exitButton: null,

	init: function() {
        this.camera = new Camera( ig.system.width/4, ig.system.height/3, 5 );
        this.camera.trap.size.x = ig.system.width/10;
        this.camera.trap.size.y = ig.system.height/3;
        this.camera.lookAhead.x = 0;

        ig.music.add( 'media/Music/Ritual.*', 'Ritual');
        ig.music.add( 'media/Music/SnowQueen.*', 'SnowQueen');
        ig.music.add( 'media/Music/Victory.*', 'Victory')    ;

        ig.music.loop = true;

        ig.input.bind( ig.KEY.MOUSE1, 'mouse1');
        ig.input.bind( ig.KEY.MOUSE2, 'mouse2');

        ig.game.gravity = 400;


		this.loadLevel( LevelStageSelect );
	},

    loadLevelByName: function( levelName ) {

        switch ( levelName ) {
            case "level1" :
                this.loadLevel( LevelLevel1 );
                break;
            case "level2" :
                this.loadLevel( LevelLevel2 );
                break;
            case "level3" :
                this.loadLevel( LevelLevel3 );
                break;
            case "level4" :
                this.loadLevel( LevelLevel4 );
                break;
            case "level5" :
                this.loadLevel( LevelLevel5 );
                break;
            case "level6" :
                this.loadLevel( LevelLevel6 );
                break;
	    case "level7" :
		this.loadLevel( LevelLevel7);
		break;
            case "stageSelect" :
                this.loadLevel( LevelStageSelect );
                break;
        }

    },


    loadLevel: function( level ) {
        this.parent( level );

        this.player = this.getEntitiesByType( EntitySquishKitten )[0];
        this.victoryScreen = null;

        //Level select?
        for (var i=0; i<this.getEntitiesByType( EntityLevelButton ).length; i++) {
            var nextLevelButton =  this.getEntitiesByType( EntityLevelButton )[i];
            nextLevelButton.pointerToMain = this;
        }

        // Set camera max and reposition trap
        if (this.player!=null) {
            this.player.pointerToMain = this;
            this.player.slingshot = this.slingshot;
            this.player.characterRelative = this.characterRelative;

            this.camera.max.x = this.collisionMap.width * this.collisionMap.tilesize - ig.system.width;
            this.camera.max.y = this.collisionMap.height * this.collisionMap.tilesize - ig.system.height;

            this.camera.set( this.player );

            this.exitButton = ig.game.spawnEntity(EntityExitLevelButton, (this.screen.x + 869), (this.screen.y));
            this.exitButton.pointerToMain = this;
            ig.game.sortEntitiesDeferred();

            ig.music.loop = true;
            ig.music.play('SnowQueen');
        }
        else {
            ig.music.loop = true;
            ig.music.play('Ritual');
        }
    },


	update: function() {
        if (this.player!=null) {
            this.camera.follow( this.player );
        }

        if (this.exitButton!=null) {
            this.exitButton.pos.x = (this.screen.x + 869);
            this.exitButton.pos.y = (this.screen.y);
        }

		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	},

    Victory : function() {
        this.victoryScreen =   ig.game.spawnEntity(EntityLevelCompleteScreen, (this.screen.x + 128), (this.screen.y + 64));
        ig.music.stop()
        ig.music.loop = false;
        ig.music.play('Victory');

    }

});


ig.main( '#canvas', MyGame, 60, 1042, 768, 1 );

});
