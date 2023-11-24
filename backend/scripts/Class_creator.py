import random
import math
import json
import sys

d6 = (1, 2, 3, 4, 5, 6)
d8 = (1, 2, 3, 4, 5, 6, 7, 8)
d10 = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)
d12 = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12)

class Character:
    def __init__(self, name, race, characterclass, level, stats, hitpoints, speed, equipment, skills, saves, spells, language, size, abilities, classabilities, alignment):
        self.name = name
        self.characterclass = characterclass
        self.race = race
        self.level = level
        self.stats = stats
        self.hitpoints = hitpoints
        self.speed = speed
        self.equipment = equipment
        self.skills = skills
        self.saves = saves
        self.spells = spells
        self.language = language
        self.size = size
        self.abilities = abilities
        self.classabilities = classabilities
        self.alignment = alignment  
    
    def converttojsonandsend(self):
        jsonobject = {"Name" : self.name,
                      "Race" : self.race,
                      "Class" : self.characterclass,
                      "Level" : self.level,
                      "Alignment": self.alignment,
                      "Hitpoints": self.hitpoints,
                      "Stats": {
                      "Strength": self.stats['Str'],
                      "Dexterity": self.stats['Dex'],
                      "Constitution": self.stats['Con'],
                      "Intelligence": self.stats['Int'],
                      "Wisdom": self.stats['Wis'],
                      "Charisma": self.stats['Cha'],
        },
                      "Size": self.size,
                      "Speed": self.speed,
                      "Equipment": self.equipment,
                      "Skills": self.skills,
                      "Spells": self.spells,
                      "Languages": self.language,
                      "Abilities": self.abilities,
                      "ClassSkills": self.classabilities
                      }
        jsonobject = json.dumps(jsonobject)
        print(jsonobject)


classdictionary = {
    1: "fighter",
    2: "cleric",
    3: "rogue",
    4: "wizard"
}

names = ["Bob", "Alice", "Carl", "Diane"]
dragontypes = [("Black", "Acid"), ("Blue", "Lightning"), ("Brass", "Fire"), ("Bronze", "Lightning"), ("Copper", "Acid"), ("Gold", "Fire"), ("Green", "Poison"), ("Red", "Fire"), ("Silver", "Cold"), ("White", "Cold")]

racedictionary = {
    "Dragonborn": {"Stats": {"Str": 2, "Cha": 1},
                   "Speed": "30 feet",
                   "Size": "Medium",
                   "Special": ["Dragon type", "Breath Weapon", "Energy Resistance"]
                   },
    "Dwarf": {"Stats": {"Con": 2, "Wis": 1},
              "Speed": "25 feet",
              "Size": "Medium",
              "Tool Proficiency": ["Smith's tools", "Brewer's supplies", "Mason's tools"],
              "Weapon Proficiency": ["Battleaxe", "Handaxe", "Light Hammer", "Warhammer"],
              "Special": ["Darkvision", "Dwarven Resilience", "Stonecunning", "Dwarven Toughness"],
              "Language": ["Dwarven"]
              },
    "Elf": {"Stats": {"Dex": 2, "Int": 1},
            "Speed": "30 feet",
            "Size": "Medium",
            "Weapon Proficiency": ["Longsword", "Shortsword", "Shortbow", "Longbow"],
            "Special": ["Darkvision", "Fey Ancestry", "Trance", "Fey Step"],
            "Language": ["Elvish"]
            },
    "Gnome": {"Stats": {"Int": 2, "Con": 1},
            "Speed": "25 feet",
            "Size": "Small",
            "Tool Proficiency": ["Artisan's tools"],
            "Special": ["Darkvision", "Gnome Cunning", "Artificer's Lore", "Tinker"],
            "Language": ["Gnomish"]
            },
    "Half-Elf": {"Stats": {"Cha": 2, ("Str", "Dex", "Con", "Int", "Wis"): 1},
            "Speed": "30 feet",
            "Size": "Medium",
            "Skills": ["Any", "Any"],
            "Special": ["Darkvision", "Fey Ancestry"],
            "Language": ["Elvish", "Any"]
            },
    "Halfling": {"Stats": {"Dex": 2, "Cha": 1},
            "Speed": "25 feet",
            "Size": "Small",
            "Special": ["Lucky", "Brave", "Halfling Nimbleness", "Naturally Stealthy"],
            "Language": ["Halfling"]
            },
    "Half-Orc": {"Stats": {"Str": 2, "Con": 1},
            "Speed": "30 feet",
            "Size": "Medium",
            "Special": ["Darkvision", "Menacing", "Relentless Endurance", "Savage Attacks"],
            "Language": ["Orc"]
            },
    "Human": {"Stats":{
                "Str": 1,
                "Dex": 1,
                "Con": 1,
                "Int": 1,
                "Wis": 1,
                "Cha": 1},
            "Speed": "30 feet",
            "Size": "Medium",
            "Language": ["Any"]
            },
    "Tiefling": {"Stats": {"Cha": 2, "Int": 1},
            "Speed": "30 feet",
            "Size": "Medium",
            "Special": ["Darkvision", "Hellish Resistance", "Infernal Legacy"],
            "Language": ["Infernal"]
            },
}

backgrounddictionary = {
    "Acolyte": {"Feature": "Shelter of the Faithful",
                "Proficiencies": ("Insight", "Religion")},
    "Criminal": {"Feature": "Criminal Contact",
                "Proficiencies": ("Deception", "Stealth")},
    "Folk Hero": {"Feature": "Rustic Hospitality",
                "Proficiencies": ("Animal Handling", "Survival")},
    "Noble": {"Feature": "Position of Privilege",
                "Proficiencies": ("History", "Persuasion")},
    "Sage": {"Feature": "Researcher",
                "Proficiencies": ("Arcana", "History")},
    "Soldier": {"Feature": "Military Rank",
                "Proficiencies": ("Athletics", "Intimidation")}
}

classdictionary = {
    "Fighter": {"statpriority": ["Str", "Con", "Dex", "Wis", "Int", "Cha"],
                "backgroundpriority": ["Sage", "Soldier", "Soldier", "Soldier", "Soldier", "Soldier", "Noble", "Noble", "Folk Hero", "Folk Hero", "Criminal", "Criminal", "Acolyte"],
                "saves": ["Strength", "Constitution"],
                "skills": ["Acrobatics","Animal Handling", "Athletics", "History", "Insight", "Intimidation", "Perception", "Survival"],
                "amountofskills": 2,
                "hitdice": d10,
                "armour": ["Chain mail"],
                "weapon": ["Sword"],
                "classabilities": {1:["Second wind", "Fighting style"],
                                    2: ["Action Surge"],
                                    3: ["Martial Archetype"],},
                "spells": False},
    "Cleric": {"statpriority": ["Wis", "Cha", "Con", "Str", "Int", "Dex"],
                "backgroundpriority": ["Sage", "Sage", "Sage", "Soldier", "Noble", "Noble", "Folk Hero", "Folk Hero", "Criminal", "Acolyte", "Acolyte", "Acolyte", "Acolyte"],
                "saves": ["Wisdom", "Charisma"],
                "skills": ["History", "Insight", "Medicine", "Persuasion", "Religion"],
                "amountofskills": 2,
                "hitdice": d8,
                "armour": ["Scale mail", "Leather armour", "Chain mail"],
                "weapon": ["Mace", "Warhammer"],
                "classabilities": {1:["Spellcasting", "Divine Domain"],
                                    2: ["Channel Divinity", "Divine Domain Feature"],
                                    3: [],},
                "spells": "Cleric"},
    "Rogue": {"statpriority": ["Dex", "Int", "Con", "Str", "Cha", "Wis"],
                "backgroundpriority": ["Sage", "Soldier", "Soldier", "Noble", "Folk Hero", "Folk Hero", "Folk Hero", "Folk Hero", "Criminal", "Criminal", "Criminal", "Criminal", "Acolyte"],
                "saves": ["Dexterity", "Intelligence"],
                "skills": ["Acrobatics", "Athletics", "Deception", "Insight", "Intimidation", "investigation", "Perception", "Performance", "Persuasion", "Sleight of Hand", "Stealth"],
                "amountofskills": 4,
                "hitdice": d8,
                "armour": ["Leather armour"],
                "weapon": ["Rapier", "Shortsword"],
                "classabilities": {1:["Expertise", "Sneak Attack", "Thieves' Cant"],
                                    2: "Cunning Action",
                                    3: "Roguish Archetype",},
                "spells": False},
    "Wizard": {"statpriority": ["Int", "Wis", "Dex", "Con", "Cha", "Str"],
                "backgroundpriority": ["Sage", "Sage", "Sage", "Sage", "Sage", "Soldier", "Noble", "Noble", "Noble", "Folk Hero", "Criminal", "Acolyte",],
                "saves": ["Wisdom", "Intelligence"],
                "skills": ["Arcana", "History", "Insight", "Investigation", "Medicine", "Religion"],
                "amountofskills": 2,
                "hitdice": d6,
                "armour": ["Scholar's Pack", "Explorer's pack"],
                "weapon": ["Quarterstaff", "Dagger"],
                "classabilities": {1:["Spellcasting", "Arcane Recovery"],
                                    2: "Arcane Tradition",
                                    3: [],},
                "spells": "Wizard"}
}

spelldictionary = {
    "Cleric": {0: ["Guidance", "Light", "Mending", "Thaumaturgy", "Sacred Flame", "Spare the Dying"], 
               1: ["Bane", "Bless", "Cure Wounds", "Detect Magic", "Guiding Bolt", "Inflict Wounds", "Protection from Evil", "Shield of Faith"],
               2: ["Aid", "Augury", "Calm Emotions", "Enhance Ability", "Hold Person", "Silence"]},
    "Wizard": {0: ["Acid Splash", "Blade Ward", "Booming Blade", "Chill Touch", "Control Flames", "Create Bonfire", "Dancing Lights", "Fire Bolt", "Minor Illusion"],
               1: ["Burning Hands", "Cause Fear", "Charm Person", "Chromatic Orb", "Detect Magic", "Grease", "Identify", "Mage Armour"],
               2: ["Blur", "Darkness", "Cloud of Daggers", "Enlarge/Reduce", "Hold Person", "Mirror Image", "Suggestion"],}
}

def randomlycreatestats():
    statlist = []
    x = 0
    while x < 6:
        y = 0
        stat = []
        while y < 4:
            newnumber = random.choice(d6)
            stat.append(newnumber)
            y += 1
        stat.remove(min(stat))
        statlist.append(stat)
        x += 1
    newlist = []
    for each in statlist:
        newlist.append(sum(each))            
    newlist.sort()
    return(newlist)    

def calculatestatmodifier(statvalue):
    statmodifier = (statvalue - 10) / 2
    statmodifier = math.floor(statmodifier)
    return statmodifier

def calculatehitpoints(level, hitdice, conmod):
    hp = hitdice[-1]
    counter = 1
    while counter < level:
        hp += random.choice(hitdice)
        counter += 1
    hp += (conmod * level)
    return hp

#def createafighter(name, level, hitdice):
    race = random.choice(list(racedictionary))
    stats = randomlycreatestats()
    fighterdictionary = {}
    for x in fighterstatpriority:
        fighterdictionary.update({x:stats.pop()})
    racestattuple = racedictionary[race].items()
    
    for x in racestattuple:
        if type(x[0]) == tuple:
            statname = random.choice(x[0])
        else:
            statname = x[0]
        statvalue = x[1]
        currentstatvalue = fighterdictionary.get(statname)
        newstatvalue = statvalue + currentstatvalue
        fighterdictionary[statname] = newstatvalue

    conmod = calculatestatmodifier(fighterdictionary["Con"])
    hp = calculatehitpoints(level, hitdice, conmod)
    statblock = Character(name, "Fighter", level, fighterdictionary, hp)
    return statblock

def assignstats(stats, priority):
    result = {}
    for x in priority:
        result.update({x:stats.pop()})
    return result
 

def createacharacter(name = "random", classname = "random", race = "random", level = 3):

    if name == "random":
        name = random.choice(names)

    if classname == "random":
        classname = random.choice(list(classdictionary.keys()))
    
    if race == "random":
        race = random.choice(list(racedictionary.keys()))

    if level is None:
        level = random.randint(1, 3)

    alignment = random.choice(["Lawful", "Neutral", "Chaotic"]) + " " + random.choice(["Good", "Neutral", "Evil"])
    if alignment == "Neutral Neutral":
        alignment = "True Neutral"
    

    stats = randomlycreatestats()

    priority = classdictionary[classname]["statpriority"]
    stats = assignstats(stats, priority)
    
    background = random.choice(classdictionary[classname]["backgroundpriority"])


    skills = list(backgrounddictionary[background]["Proficiencies"])
    skillcounter = classdictionary[classname]["amountofskills"]
    skilllist = classdictionary[classname]["skills"]
    counter = 0
    while counter < skillcounter:
        if not skilllist:
           
            break
        checkskill = random.choice(skilllist)
        skilllist.remove(checkskill)
        if checkskill in skills:
            continue
        else:
            skills.append(checkskill)
            counter +=1
    skills.sort()
    language = ["Common"]

    abilitylist = []
    for x in racedictionary[race]:
        if x == "Stats":
            racestats = racedictionary[race]["Stats"].items()
            

            for x in racestats:
                if type(x[0]) == tuple:
                    tempstatname = random.choice(x[0])
                else:
                    tempstatname = x[0]
                tempstatvalue = x[1]
                currentstatvalue = stats[tempstatname]
                newstatvalue = tempstatvalue + currentstatvalue
                stats[tempstatname] = newstatvalue
        if x == "Speed":
            speed = racedictionary[race]["Speed"]
        if x == "Size":
            size = racedictionary[race]["Size"]
        if x == "Tool Proficiency":
            abilitylist.append(random.choice(racedictionary[race]["Tool Proficiency"]))
        if x == "Weapon Proficiency":
            for y in racedictionary[race]["Weapon Proficiency"]:
                abilitylist.append(y)
        if x == "Special":
            for y in racedictionary[race]["Special"]:
                abilitylist.append(y)
        if x == "Language":
            for y in racedictionary[race]["Language"]:
                language.append(y)

    abilitylist.append(backgrounddictionary[background]["Feature"])

    if "Dragon type" in abilitylist:
        abilitylist.append(random.choice(dragontypes))
    conmod = calculatestatmodifier(stats["Con"])
    hitdice = classdictionary[classname]["hitdice"]
    hp = calculatehitpoints(level, hitdice, conmod)

    equipment = []
    equipment.append(random.choice(classdictionary[classname]["armour"]))
    equipment.append(random.choice(classdictionary[classname]["weapon"]))
    
    classabilities = {}
    counter = 0
    while counter < level:
        counter += 1
        classabilities.update({counter: classdictionary[classname]["classabilities"][counter]})
    
    if classdictionary[classname]["spells"] == "Wizard":
        spells = {0: [], 1: [], 2: []}
        spellcounter = 0
        levelspelllist0 = spelldictionary["Wizard"][0]
        listofnewspells = []
        while spellcounter < 3:
            addspell = random.choice(levelspelllist0)
            listofnewspells.append(addspell)
            levelspelllist0.remove(addspell)
            spellcounter +=1
        spells[0] = listofnewspells
        
        spellcounter = 0
        listofnewspells = []
        levelspelllist1 = spelldictionary["Wizard"][1]        
        while spellcounter < 6:
            addspell = random.choice(levelspelllist1)
            listofnewspells.append(addspell)
            levelspelllist1.remove(addspell)
            spellcounter += 1
        spells[1] = listofnewspells
        counter = 1
        levelspelllist2 = spelldictionary["Wizard"][2]
        while counter < level:
            counter += 1
            spelllevel = math.ceil(counter/2)
            if spelllevel == 1:
                addspell = random.choice(levelspelllist1)
                spells[1].append(addspell)
                levelspelllist1.remove(addspell)
                addspell = random.choice(levelspelllist1)
                spells[1].append(addspell)
                levelspelllist1.remove(addspell)
            elif spelllevel == 2:
                addspell = random.choice(levelspelllist2)
                spells[2].append(addspell)
                levelspelllist2.remove(addspell)
                addspell = random.choice(levelspelllist2)
                spells[2].append(addspell)
                levelspelllist2.remove(addspell)
    elif classdictionary[classname]["spells"] == "Cleric":
        spells = {0: []}
        spellcounter = 0
        levelspelllist0 = spelldictionary["Cleric"][0]
        listofnewspells = []
        while spellcounter < 3:
            addspell = random.choice(levelspelllist0)
            listofnewspells.append(addspell)
            levelspelllist0.remove(addspell)
            spellcounter +=1
        spells[0] = listofnewspells
    else:
        spells = classdictionary[classname]["spells"]
    saves = classdictionary[classname]["saves"]

    character = Character(name, race, classname, level, stats, hp, speed, equipment, skills, saves, spells, language, size, abilitylist, classabilities, alignment)

    return character

if __name__ == "__main__":
    # Check if command line arguments are provided for name, class, race, and level
    # and use them to create a character, otherwise use default values
    name = sys.argv[1] if len(sys.argv) > 1 else "random"
    classname = sys.argv[2] if len(sys.argv) > 2 else "random"
    race = sys.argv[3] if len(sys.argv) > 3 else "random"
    level = int(sys.argv[4]) if len(sys.argv) > 4 else None

    # Create the character using the provided or default arguments
    character = createacharacter(name, classname, race, level)
    # character.present()  # If you have a present() method, you can call it to display the character
    character.converttojsonandsend()
