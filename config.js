import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty
} from '../Vigilance/index';

@Vigilant('AutoKick', 'Auto Kick', {
    getCategoryComparator: () => (a, b) => {
        const categories = ['General', 'Party Finder', 'Auto Kick'];

        return categories.indexOf(a.name) - categories.indexOf(b.name);
    }
})
class Settings {
    constructor() {
        this.initialize(this);
        this.setCategoryDescription("General", "&6Mod Settings\n\nAuthor: &7Ghostyy (.ghxstyy)")
        this.setSubcategoryDescription("General", "API Settings", "&cEnter your API Key here, might exipre though so just make a new one")
        this.setSubcategoryDescription("General", "Toggle", "&cEasy access toggle. Turns everything on/off")
        this.setCategoryDescription("Party Finder", "&6Party Finder Settings")
        this.setSubcategoryDescription("Party Finder", "Note", "&cCool Party Finder Notes")
        this.setSubcategoryDescription("Party Finder", "Stats", "&cBetter party finder settings.")
        this.setCategoryDescription("Auto Kick", "&6Kick Settings. Noone is safe\n\n/pf help &8- for whitelist/blacklist help.")
        this.setSubcategoryDescription("Auto Kick", "Toggles", "&cGeneral Toggles")
        this.setSubcategoryDescription("Auto Kick", "Settings", "&cSettings at which players are kicked.")
    }
    // --- --- General Settings --- --- //

    // Api Key
    @TextProperty({
        name: 'API Key',
        description: 'Your API Key &chttps://developer.hypixel.net/dashboard',
        category: 'General',
        subcategory: 'API Settings'
    })
    apiKey = "null";

    // Main Toggle
    @SwitchProperty({
        name: '&cMain Toggle',
        description: 'Main on/off switch for the module.',
        category: 'General',
        subcategory: 'Toggle',
    })
    toggle = false

    // --- --- Party Finder Settings --- --- //
    
    // --- Party Finder Note --- //

    // --- Player Join --- //
    // Stats in Party Chat
    @SwitchProperty({
        name: 'Party Chat',
        description: 'Decides if the stats are sent in party chat.',
        category: 'Party Finder',
        subcategory: 'Stats',
    })
    SendStats = false

    // Player Join Sounds
    @SwitchProperty({
        name: 'Join Sound',
        description: 'Plays a sound when a player joins the party.',
        category: 'Party Finder',
        subcategory: 'Stats',
    })
    PFSound = false

    // Sound ID
    @TextProperty({
        name: 'Sound ID',
        description: 'Sound to be played when a player joins',
        category: 'Party Finder',
        subcategory: 'Stats'
    })
    PFSoundID = "note.pling";

    // Sound Volume
    @SliderProperty({
        name: 'Sound Volume',
        description: 'Volume of the sound played',
        category: 'Party Finder',
        subcategory: 'Stats',
        min: 1,
        max: 100,
        step: 1,
    })
    PFSoundVolume = 50;

    // --- --- Auto Kick --- --- //

    // --- Main Toggles --- // 

    // Auto Kick
    @SwitchProperty({
        name: '&dToggle AutoKick',
        description: 'Decides whether players are kicked or not.',
        category: 'Auto Kick',
        subcategory: 'Toggles',
    })
    AutoKick = false

    // Blacklist use
    @SwitchProperty({
        name: 'Blacklist',
        description: 'Decides whether blacklist is considered.',
        category: 'Auto Kick',
        subcategory: 'Toggles',
    })
    BlacklistUse = false
    
    // Whitelist use
    @SwitchProperty({
        name: 'Whitelist',
        description: 'Decides whether whitelist is considered.',
        category: 'Auto Kick',
        subcategory: 'Toggles',
    })
    WhitelistUse = false

    // --- Kick Settings --- //

    // Cata Level
    @SliderProperty({
        name: 'Cata Level',
        description: 'Minimum Catacombs Level',
        category: 'Auto Kick',
        subcategory: 'Settings',
        min: 10,
        max: 100,
        step: 1,
    })
    minCata = 50;

    // Class Level
    @SliderProperty({
        name: 'Class Level',
        description: 'Minimum Class Level',
        category: 'Auto Kick',
        subcategory: 'Settings',
        min: 10,
        max: 60,
        step: 1,
    })
    minClass = 45;

    // MP
    @SliderProperty({
        name: 'Magical Power',
        description: 'Minimum Magical Power',
        category: 'Auto Kick',
        subcategory: 'Settings',
        min: 800,
        max: 1700,
        step: 1,
    })
    minMP = 1450;

    // SB Level
    @SliderProperty({
        name: 'Skyblock Level',
        description: 'Minimum Skyblock Level',
        category: 'Auto Kick',
        subcategory: 'Settings',
        min: 100,
        max: 460,
        step: 1,
    })
    minLvl = 300;

    // PB
    @SelectorProperty({
        name: 'Personal Best',
        description: 'Minimum Personal Best',
        category: 'Auto Kick',
        subcategory: 'Settings',
        options: ['Sub 4:40', 'Sub 5:00', 'Sub 5:30', 'Sub 6:00', 'Custom'],
    })
    minPB = 0;

    // PB Custom
    @TextProperty({
        name: 'Custom PB Time',
        description: 'Custom personal best time in milliseconds.',
        category: 'Auto Kick',
        subcategory: 'Settings',
    })
    customMinPB = "300000";
    
    // Secrets
    @TextProperty({ 
        name: 'Secret Count',
        description: 'Minimum Secret Count',
        category: 'Auto Kick',
        subcategory: 'Settings',
    })
    minSecrets = "50000";
}

export default new Settings();