/**
 * jQuery serializeObject
 * @copyright 2014, macek <paulmacek@gmail.com>
 * @link https://github.com/macek/jquery-serialize-object
 * @license BSD
 * @version 2.5.0
 */
(function(root, factory) {

  // AMD
  if (typeof define === "function" && define.amd) {
    define(["exports", "jquery"], function(exports, $) {
      return factory(exports, $);
    });
  }

  // CommonJS
  else if (typeof exports !== "undefined") {
    var $ = require("jquery");
    factory(exports, $);
  }

  // Browser
  else {
    factory(root, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(exports, $) {

  var patterns = {
    validate: /^[a-z_][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
    key:      /[a-z0-9_]+|(?=\[\])/gi,
    push:     /^$/,
    fixed:    /^\d+$/,
    named:    /^[a-z0-9_]+$/i
  };

  function FormSerializer(helper, $form) {

    // private variables
    var data     = {},
        pushes   = {};

    // private API
    function build(base, key, value) {
      base[key] = value;
      return base;
    }

    function makeObject(root, value) {

      var keys = root.match(patterns.key), k;

      // nest, nest, ..., nest
      while ((k = keys.pop()) !== undefined) {
        // foo[]
        if (patterns.push.test(k)) {
          var idx = incrementPush(root.replace(/\[\]$/, ''));
          value = build([], idx, value);
        }

        // foo[n]
        else if (patterns.fixed.test(k)) {
          value = build([], k, value);
        }

        // foo; foo[bar]
        else if (patterns.named.test(k)) {
          value = build({}, k, value);
        }
      }

      return value;
    }

    function incrementPush(key) {
      if (pushes[key] === undefined) {
        pushes[key] = 0;
      }
      return pushes[key]++;
    }

    function encode(pair) {
      switch ($('[name="' + pair.name + '"]', $form).attr("type")) {
        case "checkbox":
          return pair.value === "on" ? true : pair.value;
        default:
          return pair.value;
      }
    }

    function addPair(pair) {
      if (!patterns.validate.test(pair.name)) return this;
      var obj = makeObject(pair.name, encode(pair));
      data = helper.extend(true, data, obj);
      return this;
    }

    function addPairs(pairs) {
      if (!helper.isArray(pairs)) {
        throw new Error("formSerializer.addPairs expects an Array");
      }
      for (var i=0, len=pairs.length; i<len; i++) {
        this.addPair(pairs[i]);
      }
      return this;
    }

    function serialize() {
      return data;
    }

    function serializeJSON() {
      return JSON.stringify(serialize());
    }

    // public API
    this.addPair = addPair;
    this.addPairs = addPairs;
    this.serialize = serialize;
    this.serializeJSON = serializeJSON;
  }

  FormSerializer.patterns = patterns;

  FormSerializer.serializeObject = function serializeObject() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serialize();
  };

  FormSerializer.serializeJSON = function serializeJSON() {
    return new FormSerializer($, this).
      addPairs(this.serializeArray()).
      serializeJSON();
  };

  if (typeof $.fn !== "undefined") {
    $.fn.serializeObject = FormSerializer.serializeObject;
    $.fn.serializeJSON   = FormSerializer.serializeJSON;
  }

  exports.FormSerializer = FormSerializer;

  return FormSerializer;
})
);

var MAX_CUTIES = 10; // you can only select this many profiles
var numSelected = 0;
var BLANK_STR = ""

function showContent(moreText) {
	var submitBtn = document.getElementById("submit-form");
	if (discordID.value === "noneSelected") {
		<!-- Hide text -->
		moreText.style.display = "none";
		submitBtn.style.display = "none";
	} else {
		<!-- Display text -->
		moreText.style.display = "inline";
		submitBtn.style.display = "inline"; 
	}
}

function updateProfiles(thisID){ // update profile count on change
	var newCount = 0;
	if(typeof candidates === 'undefined'){numSelected=0;return;} // candidates not defined
	for(var i = 0; i < candidates.length; i++){
		var ID = i+1;
		var formElement = document.getElementById("form_field_" + ID);
		if(formElement.value !== BLANK_STR) { // person selected
			newCount++;
		}
	}
	// change selected profile border
	var thisProfile = document.getElementById("profile_"+thisID);
	var thisField = document.getElementById("form_field_" + thisID);
	if(thisField.value !== BLANK_STR) { // person selected
		thisProfile.classList.add('selected');
	} else {
		thisProfile.classList.remove('selected');
	}
	console.log(thisProfile.style.border);
	
	// enforce max rule
	if(newCount > MAX_CUTIES){
		cutieWarn.style.display = "inline";
		
		// set changed field blank (the one the user is trying to change)
		opts = thisField.options;
		var optI = 0;
		while (optI < opts.length && opts[optI].value !== BLANK_STR) {optI++;} // find blank option
		if(optI < opts.length){ // failsafe
			thisField.selectedIndex = optI;
			newCount--;
		}
	} else{
		cutieWarn.style.display = "none";
	}
	if(newCount != numSelected){
		numSelected = newCount;
		if(typeof cutieCount !== 'undefined'){
			var ccText = numSelected + ' cutie';
			if(numSelected!==1){ccText += 's';}
			ccText += ' selected.';
			cutieCount.innerHTML = ccText;
		}
	}
	// dis-/enable submit button
	var submitBtn = document.getElementById("submit-form");
	if(discordID.value !== "noneSelected" && newCount > 0){ //enable
		submitBtn.disabled = false;
	} else {
		submitBtn.disabled = true;
	}
}

var $form = $('form#test-form'),
    url = 'https://script.google.com/macros/s/AKfycbyxfG2OyEBQ4z1OnF9YloyD8pb7T_xyJxKHdmQTb5O2oMBmqL4/exec'

$('#submit-form').on('click', function(e) {
  alert("submission successful ;) we will process your results shortly");
  e.preventDefault();
  var jqxhr = $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    data: $form.serializeObject()
  }).success(
    // do something
  );
  console.log("Submitted");
  location.reload();
})

var candidates = [
    {
        "timestamp": "2020-01-03T19:45:11.948Z",
        "discordId": "FanKiyoshi#7460",
        "age": 18,
        "pronouns": "She/Her",
        "country": "United States",
        "regionOrNearestCity": "Central Florida",
        "romanticOrientationSelectAllThatApply": "homoromantic, gyneromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Anime, Engineering, Trans"
    },
    {
        "timestamp": "2020-01-03T19:46:44.555Z",
        "discordId": "Xyno#0991",
        "age": 20,
        "pronouns": "He/Him",
        "country": "England",
        "regionOrNearestCity": "London",
        "romanticOrientationSelectAllThatApply": "heteromantic, demiromantic, cupioromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Caring, Techy, Self-Critical"
    },
    {
        "timestamp": "2020-01-03T19:47:26.667Z",
        "discordId": "shiloh#7392",
        "age": 27,
        "pronouns": "they/them pref but any are fine ",
        "country": "United States",
        "regionOrNearestCity": "Daytona Beach, FL",
        "romanticOrientationSelectAllThatApply": "demiromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Introverted, artistic, and quiet"
    },
    {
        "timestamp": "2020-01-03T19:47:58.667Z",
        "discordId": "jordanspixels#9267",
        "age": 22,
        "pronouns": "she/her",
        "country": "United States",
        "regionOrNearestCity": "Nashville, TN",
        "romanticOrientationSelectAllThatApply": "biromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Quiet, thoughtful, creative"
    },
    {
        "timestamp": "2020-01-03T19:48:59.924Z",
        "discordId": "one small piece of fairy cake#9137",
        "age": 23,
        "pronouns": "he/him",
        "country": "UK",
        "regionOrNearestCity": "Birmingham (Uni term-time), &/or Reading (non-term)",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "funny; goofy; idealistic"
    },
    {
        "timestamp": "2020-01-03T19:58:54.001Z",
        "discordId": "gtickno2#4933",
        "age": 22,
        "pronouns": "She/her",
        "country": "USA",
        "regionOrNearestCity": "Oregon",
        "romanticOrientationSelectAllThatApply": "biromantic, panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Shy nerdy day-dreamer"
    },
    {
        "timestamp": "2020-01-03T19:59:53.640Z",
        "discordId": "Coco1402#9955",
        "age": 17,
        "pronouns": "She/her",
        "country": "England ",
        "regionOrNearestCity": "Kettering",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Creative, introvert, smart"
    },
    {
        "timestamp": "2020-01-03T20:02:33.607Z",
        "discordId": "Amanda/Andi#0089",
        "age": 26,
        "pronouns": "She/Her",
        "country": "United States",
        "regionOrNearestCity": "New England",
        "romanticOrientationSelectAllThatApply": "homoromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Lively, Ambitious, Considerate"
    },
    {
        "timestamp": "2020-01-03T20:04:10.827Z",
        "discordId": "Vialuna #8230",
        "age": 36,
        "pronouns": "she/her",
        "country": "USA",
        "regionOrNearestCity": "Iowa",
        "romanticOrientationSelectAllThatApply": "demiromantic, cupioromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Intelligent, Patient, Demure"
    },
    {
        "timestamp": "2020-01-03T20:04:54.847Z",
        "discordId": "Orbfluid#0152",
        "age": "23 (Almost 24 in 1 month!)",
        "pronouns": "He/They is fine, but I prefer none.",
        "country": "The Netherlands",
        "regionOrNearestCity": "Noord-Holland, Enkhuizen",
        "romanticOrientationSelectAllThatApply": "panromantic, aroflux, demiromantic, alterous, cupioromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship, I'm not really looking for romance, but it could happen.",
        "describeYourselfIn3Words": "Odd, distant, humouristic"
    },
    {
        "timestamp": "2020-01-03T20:05:23.401Z",
        "discordId": "sheerpoetry#3066",
        "age": 31,
        "pronouns": "She/her",
        "country": "United States ",
        "regionOrNearestCity": "Mobile, Alabama ",
        "romanticOrientationSelectAllThatApply": "panromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Introvert, nerd, librarian"
    },
    {
        "timestamp": "2020-01-03T20:05:25.448Z",
        "discordId": "Saihah#9891",
        "age": 28,
        "pronouns": "he",
        "country": "Straya",
        "regionOrNearestCity": "Radelaide",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "greetings fellow human"
    },
    {
        "timestamp": "2020-01-03T20:06:12.470Z",
        "discordId": "Graytr #9417",
        "age": 25,
        "pronouns": "He",
        "country": "Canada",
        "regionOrNearestCity": "Saskatchewan",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Extrovert, nerd, baking"
    },
    {
        "timestamp": "2020-01-03T20:06:25.684Z",
        "discordId": "Baby Pea#2391",
        "age": 26,
        "pronouns": "She/Her",
        "country": "USA",
        "regionOrNearestCity": "New England",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Cheerful, Introverted, Soft"
    },
    {
        "timestamp": "2020-01-03T20:07:58.870Z",
        "discordId": "Thundermaiden#8986",
        "age": 31,
        "pronouns": "She/her",
        "country": "United States",
        "regionOrNearestCity": "Michigan",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Cute, funny, smart."
    },
    {
        "timestamp": "2020-01-03T20:08:53.732Z",
        "discordId": "MagicalPhi#3945",
        "age": 25,
        "pronouns": "She/Her",
        "country": "USA",
        "regionOrNearestCity": "NE Indiana, Near South Bend, IN",
        "romanticOrientationSelectAllThatApply": "homoromantic, gyneromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Cuuuuuuuuuutie, Funny, Empathetic"
    },
    {
        "timestamp": "2020-01-03T20:10:01.917Z",
        "discordId": "sunnyshowers#4444",
        "age": 20,
        "pronouns": "They/Them",
        "country": "United States",
        "regionOrNearestCity": "East. My closest city is Philadelphia.",
        "romanticOrientationSelectAllThatApply": "homoromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "I'm just tired (sorry. bad response. this is a difficult question lmao)"
    },
    {
        "timestamp": "2020-01-03T20:11:00.741Z",
        "discordId": "Trashboat #0462",
        "age": "25 (26 on jan 14)",
        "pronouns": "he/him",
        "country": "USA",
        "regionOrNearestCity": "Midwest/Chicago",
        "romanticOrientationSelectAllThatApply": "heteromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Loyal, Geeky, Proud"
    },
    {
        "timestamp": "2020-01-03T20:12:19.760Z",
        "discordId": "dotjpeg#6740",
        "age": 25,
        "pronouns": "She/Her",
        "country": "USA",
        "regionOrNearestCity": "Chicago",
        "romanticOrientationSelectAllThatApply": "heteromantic, aroflux",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "Creative, Independent, Stubborn"
    },
    {
        "timestamp": "2020-01-03T20:14:37.167Z",
        "discordId": "Sally庆楠#7554",
        "age": 22,
        "pronouns": "She/her ",
        "country": "US",
        "regionOrNearestCity": "NYC/Boston ",
        "romanticOrientationSelectAllThatApply": "panromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Weird, awesome, patient "
    },
    {
        "timestamp": "2020-01-03T20:17:45.103Z",
        "discordId": "Trashsan #0389",
        "age": 23,
        "pronouns": "He/Him",
        "country": "Feroe Islands ",
        "regionOrNearestCity": "Torshavn",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Online relationship ",
        "describeYourselfIn3Words": "Funny, Sarcastic, Creative"
    },
    {
        "timestamp": "2020-01-03T20:23:37.831Z",
        "discordId": "gailaga#1224",
        "age": 24,
        "pronouns": "SHE HER ",
        "country": "Us of a",
        "regionOrNearestCity": "Boston",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship, I like to participate in things ",
        "describeYourselfIn3Words": "Confident, adaptable, hedonist."
    },
    {
        "timestamp": "2020-01-03T20:39:53.490Z",
        "discordId": "gner0#6969",
        "age": 25,
        "pronouns": "They/Them",
        "country": "USA",
        "regionOrNearestCity": "Seattle/PNW",
        "romanticOrientationSelectAllThatApply": "aromantic, cupioromantic, autochorisromantic lmaoooooooo",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship, soft romo but im just here to support a good cause ",
        "describeYourselfIn3Words": "gay enticing troll"
    },
    {
        "timestamp": "2020-01-03T20:41:43.836Z",
        "discordId": "stone-age#1542",
        "age": 25,
        "pronouns": "He/they",
        "country": "Norway",
        "regionOrNearestCity": "Oslo",
        "romanticOrientationSelectAllThatApply": "aromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "neurodiverse empath animist "
    },
    {
        "timestamp": "2020-01-03T20:47:03.939Z",
        "discordId": "saturnskin#7135",
        "age": 28,
        "pronouns": "Just refer to me by name ",
        "country": "Netherlands",
        "regionOrNearestCity": "Rotterdam",
        "romanticOrientationSelectAllThatApply": "polyromantic, panromantic, aroflux, demiromantic, greyromantic, alterous",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friends, relationship Anarchist so I'm open to any type of connection",
        "describeYourselfIn3Words": "Philosophical, creative, and weird "
    },
    {
        "timestamp": "2020-01-03T20:55:32.755Z",
        "discordId": "bri53#3277",
        "age": 21,
        "pronouns": "She/They",
        "country": "United States ",
        "regionOrNearestCity": "Northeast ",
        "romanticOrientationSelectAllThatApply": "androromantic, neutroisromantic, aromantic, alterous",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Nerd, dogs, cool"
    },
    {
        "timestamp": "2020-01-03T21:00:57.062Z",
        "discordId": "Kumataru#5380",
        "age": 28,
        "pronouns": "She/They",
        "country": "USA",
        "regionOrNearestCity": "Tampa, FL",
        "romanticOrientationSelectAllThatApply": "quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR",
        "describeYourselfIn3Words": "Curious, Quiet, Kind"
    },
    {
        "timestamp": "2020-01-03T21:01:22.311Z",
        "discordId": "scienceandstage#7644",
        "age": 25,
        "pronouns": "She/her or They/them",
        "country": "Canada",
        "regionOrNearestCity": "Toronto",
        "romanticOrientationSelectAllThatApply": "biromantic, panromantic, greyromantic, alterous, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Logical, supportive, hard-working"
    },
    {
        "timestamp": "2020-01-03T21:05:47.924Z",
        "discordId": "Morkad#0249",
        "age": 21,
        "pronouns": "She/her",
        "country": "US",
        "regionOrNearestCity": "Blacksburg, VA",
        "romanticOrientationSelectAllThatApply": "biromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "Kind, pretty hair"
    },
    {
        "timestamp": "2020-01-03T21:05:48.925Z",
        "discordId": "Jen#1850",
        "age": 36,
        "pronouns": "Any work but he/him are cool",
        "country": "United States",
        "regionOrNearestCity": "Albuquerque",
        "romanticOrientationSelectAllThatApply": "androromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Shy, bookworm, outdoorsy"
    },
    {
        "timestamp": "2020-01-03T21:08:16.127Z",
        "discordId": "SamLock #0970",
        "age": 25,
        "pronouns": "They/Them",
        "country": "US",
        "regionOrNearestCity": "Twin Cities",
        "romanticOrientationSelectAllThatApply": "panromantic, demiromantic, quoiromantic, Still figuring it out @.@",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship, Romance is a maybe aaaa",
        "describeYourselfIn3Words": "ambitious, empathetic, chill"
    },
    {
        "timestamp": "2020-01-03T21:09:18.358Z",
        "discordId": "Tetrahedragon#6097",
        "age": 26,
        "pronouns": "He/him",
        "country": "United States",
        "regionOrNearestCity": "Northern Iowa (Midwest)",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Easygoing, joking, nerdy"
    },
    {
        "timestamp": "2020-01-03T21:11:05.559Z",
        "discordId": "MagistrateForOne#2745",
        "age": 24,
        "pronouns": "He/him",
        "country": "Germany",
        "regionOrNearestCity": "Mainz",
        "romanticOrientationSelectAllThatApply": "heteromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Shy pun nerd"
    },
    {
        "timestamp": "2020-01-03T21:15:43.162Z",
        "discordId": "BananaMan#4965",
        "age": 21,
        "pronouns": "He/him",
        "country": "Netherlands",
        "regionOrNearestCity": "Nijmegen",
        "romanticOrientationSelectAllThatApply": "heteromantic, demiromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship, Maybe just see where it goes? I don't really know what i want lol",
        "describeYourselfIn3Words": "very, very, very rebellious. uwu"
    },
    {
        "timestamp": "2020-01-03T21:53:57.530Z",
        "discordId": "radypus plaidypus#2567",
        "age": 25,
        "pronouns": "She/her",
        "country": "United States",
        "regionOrNearestCity": "Northeast Arkansas",
        "romanticOrientationSelectAllThatApply": "biromantic, aroflux, demiromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship, \"looking\" seems a bit strong ",
        "describeYourselfIn3Words": "Bad at forms"
    },
    {
        "timestamp": "2020-01-03T21:55:44.925Z",
        "discordId": "badgyote#2695",
        "age": 23,
        "pronouns": "He/him",
        "country": "United Kingdom",
        "regionOrNearestCity": "Bath",
        "romanticOrientationSelectAllThatApply": "biromantic, panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Quiet-spirited scatterbrain"
    },
    {
        "timestamp": "2020-01-03T22:04:37.576Z",
        "discordId": "n7apollo#5769",
        "age": 28,
        "pronouns": "He/him",
        "country": "USA",
        "regionOrNearestCity": "Los Angeles",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Geek/nerd, smart, political"
    },
    {
        "timestamp": "2020-01-03T22:17:48.185Z",
        "discordId": "JubalDiGriz#0553",
        "age": 35,
        "pronouns": "He/him",
        "country": "USA",
        "regionOrNearestCity": "Eugene",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "Shy, shiny, mensch"
    },
    {
        "timestamp": "2020-01-03T22:24:21.695Z",
        "discordId": "robin#9837",
        "age": 27,
        "pronouns": "she/they",
        "country": "USA",
        "regionOrNearestCity": "Nashville",
        "romanticOrientationSelectAllThatApply": "androromantic, neutroisromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "compassionate, proactive, curmudgeon"
    },
    {
        "timestamp": "2020-01-03T22:31:24.279Z",
        "discordId": "Mighty Bakugami#8872",
        "age": 18,
        "pronouns": "He/him",
        "country": "U.S.A",
        "regionOrNearestCity": "Kansas city Missouri ",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Chill, passionate, fun loving"
    },
    {
        "timestamp": "2020-01-03T22:49:33.862Z",
        "discordId": "centipedequeen#3095",
        "age": 27,
        "pronouns": "She/her",
        "country": "US",
        "regionOrNearestCity": "Ohio",
        "romanticOrientationSelectAllThatApply": "panromantic, aroflux",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Weird, passionate, loud"
    },
    {
        "timestamp": "2020-01-03T23:03:09.534Z",
        "discordId": "Ravencomeslaughing#1196",
        "age": 49,
        "pronouns": "she/her/they/them",
        "country": "USA",
        "regionOrNearestCity": "Albuquerque",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "creative, irreverent, geek"
    },
    {
        "timestamp": "2020-01-03T23:18:59.086Z",
        "discordId": "Joe#7458",
        "age": 25,
        "pronouns": "Cisgender male",
        "country": "England",
        "regionOrNearestCity": "Hampshire",
        "romanticOrientationSelectAllThatApply": "biromantic, Asexual",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Let's hold hands"
    },
    {
        "timestamp": "2020-01-03T23:24:01.662Z",
        "discordId": "Kio#7892",
        "age": 28,
        "pronouns": "She/her",
        "country": "Canada",
        "regionOrNearestCity": "Kootenays (please don't share /o\\)",
        "romanticOrientationSelectAllThatApply": "heteromantic, biromantic, polyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Multifarious, intense, focused-mania"
    },
    {
        "timestamp": "2020-01-03T23:43:06.724Z",
        "discordId": "AnnaKat#7457",
        "age": 26,
        "pronouns": "She/her",
        "country": "US",
        "regionOrNearestCity": "Southeast",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Quiet, pensive, compassionate"
    },
    {
        "timestamp": "2020-01-03T23:45:23.407Z",
        "discordId": "Naomi | SoggieWafflz#3939",
        "age": 18,
        "pronouns": "Fae/Faer or They/Them",
        "country": "United States of America",
        "regionOrNearestCity": "Lacey, WA",
        "romanticOrientationSelectAllThatApply": "aromantic, alterous",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Japan, Trans-Feminine, Chill"
    },
    {
        "timestamp": "2020-01-04T00:18:36.750Z",
        "discordId": "Naseem#2571",
        "age": 16,
        "pronouns": "He/Him",
        "country": "United States, (Currently on vacation in the Netherlands till 1/14/2020)",
        "regionOrNearestCity": "Las Vegas (Vacation in Hilversum)",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Happy, Uncreative, Giddy"
    },
    {
        "timestamp": "2020-01-04T00:22:32.266Z",
        "discordId": "Kaylan Vale#4881 ",
        "age": 18,
        "pronouns": "He/Him",
        "country": "United States",
        "regionOrNearestCity": "Central Maryland ",
        "romanticOrientationSelectAllThatApply": "biromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Empathetic, nerdy, athletic"
    },
    {
        "timestamp": "2020-01-04T00:43:43.097Z",
        "discordId": "farabor#1935",
        "age": 42,
        "pronouns": "He/his",
        "country": "United States",
        "regionOrNearestCity": "South Florida",
        "romanticOrientationSelectAllThatApply": "heteromantic, polyromantic, quoiromantic, Heteroromantic by default,  possibly pan-curious-romantic? Also unsure on the aro scale.",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Honorable, Quirky,  Geeky"
    },
    {
        "timestamp": "2020-01-04T01:14:03.741Z",
        "discordId": "Jigen-Is-Latinx#3875",
        "age": 22,
        "pronouns": "They/He",
        "country": "USA",
        "regionOrNearestCity": "New York City",
        "romanticOrientationSelectAllThatApply": "aromantic, greyromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "knowledgeable, curious, sleepy"
    },
    {
        "timestamp": "2020-01-04T01:32:41.367Z",
        "discordId": "RogueJedi#9337",
        "age": 20,
        "pronouns": "He/Him",
        "country": "U.S.A.",
        "regionOrNearestCity": "Virginia",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Empathetic, funny, positive"
    },
    {
        "timestamp": "2020-01-04T03:07:38.114Z",
        "discordId": "RiseAgainst 5618",
        "age": 26,
        "pronouns": "They/she",
        "country": "United States",
        "regionOrNearestCity": "Chicago , rural Illinois",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Creative, ambitious, socially conscious"
    },
    {
        "timestamp": "2020-01-04T04:26:19.451Z",
        "discordId": "keyofw#9348",
        "age": 31,
        "pronouns": "he/they",
        "country": "U.S.",
        "regionOrNearestCity": "Seattle",
        "romanticOrientationSelectAllThatApply": "heteromantic, gyneromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "I'm a bit extra"
    },
    {
        "timestamp": "2020-01-04T04:38:19.966Z",
        "discordId": "Asche#5688",
        "age": 17,
        "pronouns": "they/him",
        "country": "united states",
        "regionOrNearestCity": "san diego",
        "romanticOrientationSelectAllThatApply": "aromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "creative, hyper, chaotic(in a good way)"
    },
    {
        "timestamp": "2020-01-04T05:56:25.342Z",
        "discordId": "Blackra#8451",
        "age": 22,
        "pronouns": "He/Him/His",
        "country": "USA",
        "regionOrNearestCity": "Atlanta,  North Georgia",
        "romanticOrientationSelectAllThatApply": "aromantic, greyromantic, Honestly don't know sometimes, pretty decently aro though.",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Absurd, Diverse, Strategic"
    },
    {
        "timestamp": "2020-01-04T06:31:03.544Z",
        "discordId": "Ferocious Beast#2106",
        "age": 37,
        "pronouns": "They/Them",
        "country": "Australia",
        "regionOrNearestCity": "Perth",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Fun, energetic, playful"
    },
    {
        "timestamp": "2020-01-04T06:38:38.335Z",
        "discordId": "dayray#9290",
        "age": 20,
        "pronouns": "She/Her/They/Them",
        "country": "United States",
        "regionOrNearestCity": "Southeast / Savannah",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "Artsy, Nerd, Music"
    },
    {
        "timestamp": "2020-01-04T06:39:26.434Z",
        "discordId": "Ddlynightshade#9265",
        "age": 48,
        "pronouns": "She/her",
        "country": "USA",
        "regionOrNearestCity": "Springfield, MO",
        "romanticOrientationSelectAllThatApply": "biromantic, panromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Quirky, Compassionate, Honest"
    },
    {
        "timestamp": "2020-01-04T07:37:15.868Z",
        "discordId": "Anatar#2911",
        "age": 31,
        "pronouns": "She/Her",
        "country": "Finland",
        "regionOrNearestCity": "Helsinki (Uusimaa region)",
        "romanticOrientationSelectAllThatApply": "panromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Voice chat Queen"
    },
    {
        "timestamp": "2020-01-04T12:41:07.392Z",
        "discordId": "Robbie#3746",
        "age": 20,
        "pronouns": "She/her",
        "country": "Australia",
        "regionOrNearestCity": "Perth",
        "romanticOrientationSelectAllThatApply": "panromantic, cupioromantic, Recipromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Dedicated, focused, honest"
    },
    {
        "timestamp": "2020-01-04T13:40:17.975Z",
        "discordId": "Your Majesty #6437",
        "age": 21,
        "pronouns": "She/Her",
        "country": "Australia",
        "regionOrNearestCity": "Western Australia",
        "romanticOrientationSelectAllThatApply": "biromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Imaginative, Introverted and Optimistic "
    },
    {
        "timestamp": "2020-01-04T14:09:29.395Z",
        "discordId": "thecloud#2688",
        "age": 34,
        "pronouns": "he/they",
        "country": "USA",
        "regionOrNearestCity": "Washington DC",
        "romanticOrientationSelectAllThatApply": "heteromantic, alterous",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Polyamorous independent introvert."
    },
    {
        "timestamp": "2020-01-04T15:05:56.269Z",
        "discordId": "Yellow_Gecko#9764",
        "age": 17,
        "pronouns": "she/her",
        "country": "United Kingdom",
        "regionOrNearestCity": "Nottinghamshire",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Energetic, Loyal, Sensitive"
    },
    {
        "timestamp": "2020-01-04T19:41:42.863Z",
        "discordId": "Jade#4425",
        "age": 32,
        "pronouns": "She, They",
        "country": "India",
        "regionOrNearestCity": "Not Applicable",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Weird, Silly, Open-minded"
    },
    {
        "timestamp": "2020-01-04T20:11:56.511Z",
        "discordId": "Raedwulf#7520",
        "age": 32,
        "pronouns": "He, They",
        "country": "Denmark",
        "regionOrNearestCity": "Copenhagen",
        "romanticOrientationSelectAllThatApply": "heteromantic, neutroisromantic, aroflux, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Computers, write, sing"
    },
    {
        "timestamp": "2020-01-04T23:13:07.562Z",
        "discordId": "compressedjpeg#8320",
        "age": 18,
        "pronouns": "He, Him, His",
        "country": "United States",
        "regionOrNearestCity": "Phoenix, Arizona",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Very surreal humor"
    },
    {
        "timestamp": "2020-01-04T23:13:38.784Z",
        "discordId": "Peridot#3256",
        "age": 25,
        "pronouns": "He/him they/them",
        "country": "United states",
        "regionOrNearestCity": "Alabama ",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Nerd, chill, introvert "
    },
    {
        "timestamp": "2020-01-05T03:15:15.360Z",
        "discordId": "Rocam#7934",
        "age": 22,
        "pronouns": "He/him, they/them",
        "country": "USA",
        "regionOrNearestCity": "Washington DC",
        "romanticOrientationSelectAllThatApply": "heteromantic, gyneromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "That one mod"
    },
    {
        "timestamp": "2020-01-05T05:12:15.294Z",
        "discordId": "Amino7157",
        "age": 28,
        "pronouns": "They/them",
        "country": "USA",
        "regionOrNearestCity": "Arizona",
        "romanticOrientationSelectAllThatApply": "homoromantic, gyneromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Quirky, reserved, cryptic "
    },
    {
        "timestamp": "2020-01-05T11:23:43.291Z",
        "discordId": "Whjee#8437",
        "age": 22,
        "pronouns": "He/Him",
        "country": "Norway",
        "regionOrNearestCity": "Sandnessjøen",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Music Games Irony"
    },
    {
        "timestamp": "2020-01-05T15:47:06.633Z",
        "discordId": "Crzymnky#2594",
        "age": 25,
        "pronouns": "He/him",
        "country": "United States ",
        "regionOrNearestCity": "Ohio",
        "romanticOrientationSelectAllThatApply": "panromantic, gyneromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Dork, excitable, passionate"
    },
    {
        "timestamp": "2020-01-05T23:49:16.862Z",
        "discordId": "SaltyFox#9760",
        "age": 32,
        "pronouns": "She/her",
        "country": "United States",
        "regionOrNearestCity": "Billings MT",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Nerdy, introverted, gardener"
    },
    {
        "timestamp": "2020-01-06T02:15:27.307Z",
        "discordId": "astra#0003",
        "age": 30,
        "pronouns": "they/them",
        "country": "canada",
        "regionOrNearestCity": "Montreal",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "enthusiastic gay disaster"
    },
    {
        "timestamp": "2020-01-06T02:54:24.472Z",
        "discordId": "notpicasso#4257",
        "age": 20,
        "pronouns": "she/her",
        "country": "USA",
        "regionOrNearestCity": "Florida",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Friendship",
        "describeYourselfIn3Words": "cheerful, outdoorsy, goodlistener"
    },
    {
        "timestamp": "2020-01-06T05:20:48.671Z",
        "discordId": "Aliceline#5823",
        "age": 22,
        "pronouns": "She/her (but also any)",
        "country": "Tiny Caribbean Island",
        "regionOrNearestCity": "Caribbean",
        "romanticOrientationSelectAllThatApply": "biromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Creative, Honest, Curious"
    },
    {
        "timestamp": "2020-01-06T05:29:54.815Z",
        "discordId": "ciscokid#8094",
        "age": 30,
        "pronouns": "She/her",
        "country": "US",
        "regionOrNearestCity": "South Louisiana",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Fun, kind, sarcastic"
    },
    {
        "timestamp": "2020-01-06T11:48:31.543Z",
        "discordId": "Gamerman#9627",
        "age": 21,
        "pronouns": "He/Him",
        "country": "USA",
        "regionOrNearestCity": "Pittsburgh",
        "romanticOrientationSelectAllThatApply": "heteromantic, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Loud music nerd"
    },
    {
        "timestamp": "2020-01-06T12:19:47.751Z",
        "discordId": "Jemac",
        "age": 27,
        "pronouns": "She/her",
        "country": "United States",
        "regionOrNearestCity": "Orlando",
        "romanticOrientationSelectAllThatApply": "homoromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Hufflepuff, ambivert, snarky"
    },
    {
        "timestamp": "2020-01-06T19:13:44.176Z",
        "discordId": "rollingstones#0111",
        "age": 25,
        "pronouns": "He/Him",
        "country": "UK",
        "regionOrNearestCity": "London",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Ambitious Over-thinker Calm "
    },
    {
        "timestamp": "2020-01-06T23:50:38.886Z",
        "discordId": "rere#1314",
        "age": 21,
        "pronouns": "she/her",
        "country": "usa",
        "regionOrNearestCity": "florida",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "sad cad memes"
    },
    {
        "timestamp": "2020-01-07T12:47:40.907Z",
        "discordId": "demadamy#8162",
        "age": 22,
        "pronouns": "she/her",
        "country": "the Netherlands",
        "regionOrNearestCity": "South-Holland",
        "romanticOrientationSelectAllThatApply": "panromantic, aroflux, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Adventurous, awkward, easy-going"
    },
    {
        "timestamp": "2020-01-07T23:11:40.646Z",
        "discordId": "Aisha#5369",
        "age": 27,
        "pronouns": "They/She",
        "country": "England ",
        "regionOrNearestCity": "West Midlands",
        "romanticOrientationSelectAllThatApply": "biromantic, panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Passionate about life"
    },
    {
        "timestamp": "2020-01-08T09:21:45.931Z",
        "discordId": "GlassWolf#0602",
        "age": 22,
        "pronouns": "He/Him",
        "country": "USA",
        "regionOrNearestCity": "East-ish Midwest",
        "romanticOrientationSelectAllThatApply": "heteromantic, gyneromantic, neutroisromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Kind, Smart, Eccentric"
    },
    {
        "timestamp": "2020-01-08T14:36:47.971Z",
        "discordId": "f(t)#7017",
        "age": 23,
        "pronouns": "he/they",
        "country": "UK",
        "regionOrNearestCity": "~south",
        "romanticOrientationSelectAllThatApply": "heteromantic, aromantic, demiromantic, greyromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "nerd, shy, uwu"
    },
    {
        "timestamp": "2020-01-08T23:10:09.840Z",
        "discordId": "Jan-Sen (Pitch Black)#1453",
        "age": 19,
        "pronouns": "He/Him",
        "country": "United Kingdom",
        "regionOrNearestCity": "Nottingham",
        "romanticOrientationSelectAllThatApply": "heteromantic, aromantic, aroflux, alterous",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "A massive nerd"
    },
    {
        "timestamp": "2020-01-08T23:10:42.159Z",
        "discordId": "NickTWriter #8566",
        "age": "29 (30 on the 11th)",
        "pronouns": "He/Him",
        "country": "US",
        "regionOrNearestCity": "Seattle",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Kind, Creative, Playful"
    },
    {
        "timestamp": "2020-01-08T23:41:08.933Z",
        "discordId": "lei#1740",
        "age": 20,
        "pronouns": "she+/they+",
        "country": "United States of America",
        "regionOrNearestCity": "Washington DC",
        "romanticOrientationSelectAllThatApply": "aroflux, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Lawful, Easy-going, Independent"
    },
    {
        "timestamp": "2020-01-08T23:41:34.167Z",
        "discordId": "zulthar#7781",
        "age": 17,
        "pronouns": "They/Them",
        "country": "Canada",
        "regionOrNearestCity": "Vancouver",
        "romanticOrientationSelectAllThatApply": "polyromantic, panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Autistic agender nerd!!!!"
    },
    {
        "timestamp": "2020-01-09T02:58:27.432Z",
        "discordId": "AndyTM6676#4833",
        "age": 19,
        "pronouns": "He/Him",
        "country": "United States",
        "regionOrNearestCity": "Lake Worth, FL",
        "romanticOrientationSelectAllThatApply": "demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Type-B, Honest, Optimistic"
    },
    {
        "timestamp": "2020-01-09T03:14:28.939Z",
        "discordId": "Yogi#9098",
        "age": 24,
        "pronouns": "He / Him",
        "country": "USA",
        "regionOrNearestCity": "Seattle, WA",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Funny, Thoughtful, and Kind"
    },
    {
        "timestamp": "2020-01-09T03:38:27.708Z",
        "discordId": "e_cat#1342",
        "age": 24,
        "pronouns": "she/her",
        "country": "USA",
        "regionOrNearestCity": "Texas (school) / Connecticut (breaks)",
        "romanticOrientationSelectAllThatApply": "biromantic, aroflux, greyromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "pensive, kind, shy"
    },
    {
        "timestamp": "2020-01-09T07:35:45.271Z",
        "discordId": "ueda#4292",
        "age": 30,
        "pronouns": "She/her",
        "country": "USA",
        "regionOrNearestCity": "Northeast",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship"
    },
    {
        "timestamp": "2020-01-09T09:13:33.083Z",
        "discordId": "Angel Tears#1291",
        "age": 18,
        "pronouns": "He/Him",
        "country": "Canada",
        "regionOrNearestCity": "Quebec ",
        "romanticOrientationSelectAllThatApply": "heteromantic, aromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Artist, metal head, objective "
    },
    {
        "timestamp": "2020-01-09T09:51:51.410Z",
        "discordId": "Nika#6896",
        "age": 24,
        "pronouns": "She/her, they/them",
        "country": "Germany",
        "regionOrNearestCity": "Hamburg",
        "romanticOrientationSelectAllThatApply": "biromantic, polyromantic, panromantic, lith/akoi/apromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Curious, good-humored, pensive"
    },
    {
        "timestamp": "2020-01-09T09:57:09.506Z",
        "discordId": "Ako#8590",
        "age": 22,
        "pronouns": "She/her",
        "country": "Sweden",
        "regionOrNearestCity": "Stockholm",
        "romanticOrientationSelectAllThatApply": "panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Empathetic, funny, sensible"
    },
    {
        "timestamp": "2020-01-09T12:40:16.182Z",
        "discordId": "Vosur#2714",
        "age": 24,
        "pronouns": "He/Him",
        "country": "Germany",
        "regionOrNearestCity": "Hessia",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Nerdy Cuddly Silly"
    },
    {
        "timestamp": "2020-01-09T15:20:05.163Z",
        "discordId": "Quinn, Lord of ambivalence#9334 ",
        "age": 19,
        "pronouns": "they/them",
        "country": "Scotland ",
        "regionOrNearestCity": "Highlands ",
        "romanticOrientationSelectAllThatApply": "homoromantic, biromantic, polyromantic, aromantic, aroflux, cupioromantic, quoiromantic",
        "whatAreYouLookingForSelectAllThatApply": "QPR, Friendship",
        "describeYourselfIn3Words": "Hyper sweet edgy "
    },
    {
        "timestamp": "2020-01-09T17:33:59.030Z",
        "discordId": "Kell887#1185",
        "age": 30,
        "pronouns": "She/they",
        "country": "United states",
        "regionOrNearestCity": "Springfield, Mo",
        "romanticOrientationSelectAllThatApply": "heteromantic, aroflux",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Quirky, honest, hopeful "
    },
    {
        "timestamp": "2020-01-09T21:55:04.057Z",
        "discordId": "VytalGifted#2366",
        "age": 23,
        "pronouns": "She/her/hers",
        "country": "Canada",
        "regionOrNearestCity": "Vancouver",
        "romanticOrientationSelectAllThatApply": "polyromantic, demiromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Nerdy, Considerate, Conversational"
    },
    {
        "timestamp": "2020-01-10T04:35:34.291Z",
        "discordId": "newyearnewtea#2806",
        "age": 19,
        "pronouns": "she/her",
        "country": "United States",
        "regionOrNearestCity": "Tennessee",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, Friendship",
        "describeYourselfIn3Words": "Funny? Rebellious? Friendly? (Trivago.)"
    },
    {
        "timestamp": "2020-01-10T05:16:43.622Z",
        "discordId": "decurion#0567",
        "age": 18,
        "pronouns": "He/him",
        "country": "United States",
        "regionOrNearestCity": "New York State",
        "romanticOrientationSelectAllThatApply": "heteromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR",
        "describeYourselfIn3Words": "Introvert, overwatch, memes"
    },
    {
        "timestamp": "2020-01-11T06:41:35.605Z",
        "discordId": "Luke#1509",
        "age": 25,
        "pronouns": "He/Him",
        "country": "United States of America",
        "regionOrNearestCity": "Atlanta",
        "romanticOrientationSelectAllThatApply": "homoromantic, panromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Dorky, Talkative, Coffee! "
    },
    {
        "timestamp": "2020-01-11T07:05:48.582Z",
        "discordId": "Bookofcircus#1289",
        "age": 25,
        "pronouns": "She/they",
        "country": "United States",
        "regionOrNearestCity": "Colorado",
        "romanticOrientationSelectAllThatApply": "biromantic, androromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance",
        "describeYourselfIn3Words": "Weird, clever, crafty"
    },
    {
        "timestamp": "2020-01-11T09:34:29.063Z",
        "discordId": "Blox#0047",
        "age": 26,
        "pronouns": "Him/He",
        "country": "United States",
        "regionOrNearestCity": "Williamsburg, Virginia",
        "romanticOrientationSelectAllThatApply": "homoromantic, biromantic, demiromantic, greyromantic, lith/akoi/apromantic",
        "whatAreYouLookingForSelectAllThatApply": "Romance, QPR, Friendship",
        "describeYourselfIn3Words": "Timid, Sarcastic, Low-key"
    }
]

var alphaOrder=[]; // alphabetical order
for (var i = 0; i < candidates.length; i++) { //initialize
	alphaOrder[i]=i;
}
alphaOrder.sort( //sort order (case insensitive)
	function(a,b){
		var x = candidates[a].discordId.toLowerCase();
		var y = candidates[b].discordId.toLowerCase();
		if(x<y){return -1;} 
		if(x>y){return 1;} 
		return 0;
	})

// the profile selection part
var profilePart = document.createElement('span');
profilePart.id = 'profilePart';
profilePart.style = 'display:none;';
var matchQuestion = document.createElement('div');
matchQuestion.innerHTML = '<h3>Who do you want to match with? Choose up to 10 profiles.</h3>When you&#39;re done choosing, please scroll to bottom to submit :)<br><br>';
profilePart.append(matchQuestion);
for (var ii = 0; ii < candidates.length; ii++) { // ii is index in alphaOrder 
  var i = alphaOrder[ii]; // index in candidates
  var name = candidates[i].discordId;
  var age = candidates[i].age;
  var pronouns = candidates[i].pronouns;
  var country = candidates[i].country;
  var region = candidates[i].regionOrNearestCity;
  var orientations = candidates[i].romanticOrientationSelectAllThatApply;
  var seeking = candidates[i].whatAreYouLookingForSelectAllThatApply;
  var words = candidates[i].describeYourselfIn3Words;
  var profile = document.createElement('div');
  var ID = i+1;
  profile.className = 'profile';
  profile.id = "profile_"+ID;
  profile.innerHTML =
    '<div class="profile-content">' +
    '<span class="name"><b>Name: </b>' + name + '</span>' +
    '<span class="name"><b>Age: </b>' + age + '</span>' +
    '<span class="name"><b>Pronouns: </b>' + pronouns + '</span>' +
    '<span class="name"><b>Location: </b>' + country + ', ' + region + '</span>' +
    '<span class="name"><b>Orientation: </b>' + orientations + '</span>' +
    '<span class="name"><b>Looking for: </b>' + seeking + '</span>' +
    '<span class="name"><b>3 Words: </b>' + words + '</span>' +
	'<span class="name"><b><div>Interested? <select name="form_field_' + ID + '" id="form_field_' + ID + '" '+
	'onchange="updateProfiles(' + ID + ')">'+
	'<option value="'+BLANK_STR+'"></option>'+
	'<option value="' + name + '">I&#39;m interested</option>'+
	'<option value="*' + name + '">I&#39;m <i>very</i> interested ;)</option></select></div></b></span>' +
    '</div>';
  profilePart.append(profile);
}
// display number selected
var cutieCount = document.createElement('div'); 
cutieCount.id = 'selectCount';
cutieCount.style = 'background-color: #333;color: #fff;' +
	'padding: 8px;position: fixed;bottom: 10px;left: 10%;';
cutieCount.innerHTML = '0 cuties selected';
profilePart.append(cutieCount);
// display warning
var cutieWarn = document.createElement('div'); 
cutieWarn.style = 'background-color: #833;color: #fff;display:none;' + 
	'padding: 8px;position: fixed;bottom: 10px;right: 10%;';
cutieWarn.innerHTML = 'Sorry, you are limited to ' + MAX_CUTIES + ' cuties.';
profilePart.append(cutieWarn);
document.getElementById('test-form').prepend(profilePart);

$(document).ready(function() {
    $('.profile').each(function () {
        var hue = 'rgb(' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ',' + (Math.floor((256-199)*Math.random()) + 200) + ')';
        $(this).css("background-color", hue);
    });
});

var dropdown= document.createElement('div');
dropdown.className = 'dropdown';
var buildHTML;
var optionHTML;

for (var ii = 0; ii < candidates.length; ii++) {
  var i = alphaOrder[ii]; // index in candidates
  var name = candidates[i].discordId;
  optionHTML +=
    '<option value="' + name + '">' + name + '</option>'
}

buildHTML = '<h3>Who are you?</h3><br>' + 
	'<select name="discordName" id="discordID" onchange="showContent(profilePart)"><option value="noneSelected">Please Select</option>' + optionHTML + '</select><br><br><br>'

dropdown.innerHTML = buildHTML;
document.getElementById('test-form').prepend(dropdown);

$('.profile').on('click', function() {
            var checkbox = $(this).find('*').filter(':input:visible:first');
            checkbox.attr("checked", true);    
        });
$(".profile input").on("click", function(e){
    e.stopPropagation();
});

 /*
var dropdownSelect = $("#discordID").children("option:selected").val();


if (dropdownSelect == "noneSelected") {
	alert("please select your username from the dropdown");
} */