// ==UserScript==
// @name        TW - Improvments// @namespace   http://userscripts.org/users/1
// @description TW - Improvments// @include     *://*.tribalwars.net/*// @version     1// @grant       none
// ==/UserScript==

$(function(){

/* Universal functions */
unsafeWindow.md5 = function(str){
	var xl;

	var rotateLeft = function (lValue, iShiftBits) {
		return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
	};

	var addUnsigned = function (lX, lY) {
		var lX4,
		lY4,
		lX8,
		lY8,
		lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult^0x80000000^lX8^lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult^0xC0000000^lX8^lY8);
			} else {
				return (lResult^0x40000000^lX8^lY8);
			}
		} else {
			return (lResult^lX8^lY8);
		}
	};

	var _F = function (x, y, z) {
		return (x & y) | ((~x) & z);
	};
	var _G = function (x, y, z) {
		return (x & z) | (y & (~z));
	};
	var _H = function (x, y, z) {
		return (x^y^z);
	};
	var _I = function (x, y, z) {
		return (y^(x | (~z)));
	};

	var _FF = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_F(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _GG = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_G(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _HH = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_H(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var _II = function (a, b, c, d, x, s, ac) {
		a = addUnsigned(a, addUnsigned(addUnsigned(_I(b, c, d), x), ac));
		return addUnsigned(rotateLeft(a, s), b);
	};

	var convertToWordArray = function (str) {
		var lWordCount;
		var lMessageLength = str.length;
		var lNumberOfWords_temp1 = lMessageLength + 8;
		var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
		var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
		var lWordArray = new Array(lNumberOfWords - 1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while (lByteCount < lMessageLength) {
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (str.charCodeAt(lByteCount) << lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount - (lByteCount % 4)) / 4;
		lBytePosition = (lByteCount % 4) * 8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
		lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
		lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
		return lWordArray;
	};

	var wordToHex = function (lValue) {
		var wordToHexValue = '',
		wordToHexValue_temp = '',
		lByte,
		lCount;
		for (lCount = 0; lCount <= 3; lCount++) {
			lByte = (lValue >>> (lCount * 8)) & 255;
			wordToHexValue_temp = '0' + lByte.toString(16);
			wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
		}
		return wordToHexValue;
	};

	var x = [],
	k,
	AA,
	BB,
	CC,
	DD,
	a,
	b,
	c,
	d,
	S11 = 7,
	S12 = 12,
	S13 = 17,
	S14 = 22,
	S21 = 5,
	S22 = 9,
	S23 = 14,
	S24 = 20,
	S31 = 4,
	S32 = 11,
	S33 = 16,
	S34 = 23,
	S41 = 6,
	S42 = 10,
	S43 = 15,
	S44 = 21;
	
	x = convertToWordArray(str);
	a = 0x67452301;
	b = 0xEFCDAB89;
	c = 0x98BADCFE;
	d = 0x10325476;

	xl = x.length;
	for (k = 0; k < xl; k += 16) {
		AA = a;
		BB = b;
		CC = c;
		DD = d;
		a = _FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
		d = _FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
		c = _FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
		b = _FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
		a = _FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
		d = _FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
		c = _FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
		b = _FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
		a = _FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
		d = _FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
		c = _FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
		b = _FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
		a = _FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
		d = _FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
		c = _FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
		b = _FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
		a = _GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
		d = _GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
		c = _GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
		b = _GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
		a = _GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
		d = _GG(d, a, b, c, x[k + 10], S22, 0x2441453);
		c = _GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
		b = _GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
		a = _GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
		d = _GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
		c = _GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
		b = _GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
		a = _GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
		d = _GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
		c = _GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
		b = _GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
		a = _HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
		d = _HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
		c = _HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
		b = _HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
		a = _HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
		d = _HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
		c = _HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
		b = _HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
		a = _HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
		d = _HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
		c = _HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
		b = _HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
		a = _HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
		d = _HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
		c = _HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
		b = _HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
		a = _II(a, b, c, d, x[k + 0], S41, 0xF4292244);
		d = _II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
		c = _II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
		b = _II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
		a = _II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
		d = _II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
		c = _II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
		b = _II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
		a = _II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
		d = _II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
		c = _II(c, d, a, b, x[k + 6], S43, 0xA3014314);
		b = _II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
		a = _II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
		d = _II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
		c = _II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
		b = _II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
		a = addUnsigned(a, AA);
		b = addUnsigned(b, BB);
		c = addUnsigned(c, CC);
		d = addUnsigned(d, DD);
	}

	var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);

	return temp.toLowerCase();
}
/* End */

/* World configs */
if(typeof localStorage.n2_world_speed == 'undefined'){
	(function(){var defaultOptions={attrkey:'$',charkey:'_',normalize:false,explicitArray:false};function parseXML(data){var xml,tmp;if(!data||typeof data!=="string"){return null;}
try{if(window.DOMParser){tmp=new DOMParser();xml=tmp.parseFromString(data,"text/xml");}else{xml=new ActiveXObject("Microsoft.XMLDOM");xml.async="false";xml.loadXML(data);}}catch(e){xml=undefined;}
if(!xml||!xml.documentElement||xml.getElementsByTagName("parsererror").length){throw new Error("Invalid XML: "+data);}
return xml;}
function normalize(value,options){if(!!options.normalize){return(value||'').trim();}
return value;}
function xml2jsonImpl(xml,options){var i,result={},attrs={},node,child,name;result[options.attrkey]=attrs;if(xml.attributes&&xml.attributes.length>0){for(i=0;i<xml.attributes.length;i++){var item=xml.attributes.item(i);attrs[item.nodeName]=item.value;}}
if(xml.childElementCount===0){result[options.charkey]=normalize(xml.textContent,options);}
for(i=0;i<xml.childNodes.length;i++){node=xml.childNodes[i];if(node.nodeType===1){if(node.attributes.length===0&&node.childElementCount===0){child=normalize(node.textContent,options);}else{child=xml2jsonImpl(node,options);}
name=node.nodeName;if(result.hasOwnProperty(name)){var val=result[name];if(!Array.isArray(val)){val=[val];result[name]=val;}
val.push(child);}else if(options.explicitArray===true){result[name]=[child];}else{result[name]=child;}}}
return result;}
function xml2json(xml,options){var n;if(!xml){return xml;}
options=options||{};for(n in defaultOptions){if(defaultOptions.hasOwnProperty(n)&&options[n]===undefined){options[n]=defaultOptions[n];}}
if(typeof xml==='string'){xml=parseXML(xml).documentElement;}
var root={};if(typeof xml.attributes==='undefined'){root[xml.nodeName]=xml2jsonImpl(xml,options);}else if(xml.attributes.length===0&&xml.childElementCount===0){root[xml.nodeName]=normalize(xml.textContent,options);}else{root[xml.nodeName]=xml2jsonImpl(xml,options);}
return root;}
if(typeof jQuery!=='undefined'){jQuery.extend({xml2json:xml2json});}else if(typeof module!=='undefined'){module.exports=xml2json;}else if(typeof window!=='undefined'){window.xml2json=xml2json;}})();
	
	$.ajax({ 
		url : '/interface.php?func=get_config' 
	})
	.done(function(data){
		var get_config = $.xml2json(data);
		localStorage.n2_world_speed = get_config['#document'].config.speed;
		localStorage.n2_units_speed = get_config['#document'].config.unit_speed;
	});
}
/* End */

/* Bot Protection Alert */
if($('#bot_check_image').length > 0){
	var notify = new Audio();
	notify.preload = 'auto';
	if(md5(game_data.player.name) == 'b83789c8ce9ae93fb672165e95858d46'){
		notify.src = 'https://127.0.0.1/University/Online Game/resources/sounds/notify_2.wav';
	}else{
		notify.src = 'https://a1f39cddb04c309a570bd5d844e49e9b38415fb3.googledrive.com/host/0B_efZvwT5JgUaUJhUHhpeGVUUHc/notify_2.wav';
	}
	notify.play();
}
/* End */

/* Nice Date and Time */
$('.server_info').css({
	'position': 'fixed', 
	'z-index': '99999', 
	'left': '10px', 
	'top': '13px', 
	'background': 'none', 
	'font-size': '10pt', 
	'color': '#FFFFFF' 
});
/* End */

/* Get URL parameters */
var urlParams;
(window.onpopstate = function () {
    var match,
        pl     = /\+/g, 
        search = /([^&=]+)=?([^&]*)/g, 
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); }, 
        query  = window.location.search.substring(1);

    urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
})();

unsafeWindow.urlParams = urlParams;
/* End */

/* Better Looking Warnings */
$('<style type="text/css">.warn_90 {border: 2px solid #AA6600; border-radius: 3px;} .warn {border: 2px solid #AA0000; border-radius: 3px;}</style>').appendTo('head');
/* End */

/* Nice Shortcuts */
var url_base = 'http://' + document.location.host + '/game.php?village=' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&screen=';

$('body').append($(
	'<div class="n2_shortcuts">' + 
		'<a href="' + url_base + 'main">HQ</a>' + 
		'<a href="' + url_base + 'place">RP</a>' + 
		'<a href="' + url_base + 'place&mode=units">RP-T</a>' + 
		'<a href="' + url_base + 'place&mode=call">RP-R</a>' + 
		'<a href="' + url_base + 'snob">AC</a>' + 
		'<a href="' + url_base + 'snob&mode=coin">AC-C</a>' + 
		'<a href="' + url_base + 'train">RC</a>' + 
		'<br>' + 
		'<a href="' + url_base + 'market">MK</a>' + 
		'<a href="' + url_base + 'market&mode=send">MK-S</a>' + 
		'<a href="' + url_base + 'market&mode=call">MK-R</a>' + 
		'<a href="' + url_base + 'smith">SM</a>' + 
		'<a href="' + url_base + 'am_overview&mode=village">AM</a>' + 
		'<a href="javascript: void(0);" onclick="$(\'#topContainer, .top_bar, .top_shadow, #bottom, .server_info, .n2_shortcuts, .n2_map_villages\').remove();">ScShot</a>' + 
	'</div>'
));

$('.n2_shortcuts').css({
	'padding': '5px', 
	'position': 'fixed', 
	'z-index': '9998', 
	'left': '0px', 
	'top': '50px', 
	'background': 'rgba(255, 255, 255, 0.75)', 
	'font-size': '7pt', 
	'color': '#FFFFFF', 
	'box-shadow': '0px 0px 10px 0px #000000', 
	'border-radius': '0px 0px 10px 0px' 
});

$('.n2_shortcuts a').css({
	'margin': '5px', 
	'display': 'inline-block' 
});
/* End */

/* Notebook */
$('body').append($(
	'<div class="n2_map_villages">' + 
		'<div style="position: absolute; right: 0px; top: 0px; background-color: #FFFFFF; color: #000000; cursor: pointer; padding: 0px 2px;" onclick="$(this).parent().hide();$(\'.n2_shortcuts\').hide();">x</div>' + 
		'<textarea id="n2_map_villages" wrap="off" onfocus="$(\'#n2_map_villages\').val(load_map_villages());" onblur="save_map_villages();"></textarea>' + 
	'</div>'
));

$('.n2_map_villages').css({
	'padding': '5px', 
	'position': 'fixed', 
	'z-index': '99997', 
	'left': '0px', 
	'top': '110px', 
	'background': 'rgba(255, 255, 255, 0.75)', 
	'font-size': '8pt', 
	'color': '#FFFFFF', 
	'box-shadow': '0px 0px 10px 0px #000000', 
	'border-radius': '0px 0px 10px 0px' 
});

$('.n2_map_villages textarea').css({
	'width': '150px', 
	'height': '445px',  
	'background-color': '#000000', 
	'border': '0px none', 
	'font-size': '8pt', 
	'color': '#FFFFFF', 
	'border-radius': '0px 0px 7px 0px' 
});

unsafeWindow.save_map_villages = function(){
	var date = new Date();
	date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
	
	var data = $('#n2_map_villages').val().split(/\n/);
	var data_string = data.join(',');
	
	document.cookie = 'n2_map_villages=' + data_string + '; expires=' + date.toGMTString() + '; path=/';
}

unsafeWindow.load_map_villages = function(){
	var nameEQ = 'n2_map_villages=';
	var ca = document.cookie.split(';');
	
	var out = '';
	
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) out = c.substring(nameEQ.length, c.length);
	}
	
	var data = out.split(',');
	out = data.join("\n");
	
	return out;
}

$('#n2_map_villages').val(load_map_villages());
/* End */

if('screen' in urlParams == true){
	/* Shortcuts on Overviews */
	if(urlParams['screen'] == 'overview_villages'){
		$('<style type="text/css">#combined_table tr.nowrap td:nth-child(14) {background-color: #DDAA66;} #combined_table tr.nowrap td:nth-child(15) {background-color: #DADADD;} #units_table tbody tr:nth-child(3) td {background-color: #DDAA66;}</style>').appendTo('head');
		
		$('#production_table tr.nowrap, #combined_table tr.nowrap, #units_table tbody tr:first-child').each(function(i){
			var table_id = $(this).parent().parent().attr('id');
			
			if(!unsafeWindow.premium){
				var first_td = $('td:first', this);
				var third_td = $($('td', this)[2]);
			}else{
				if(table_id == 'units_table'){
					var first_td = $($('td', this)[0]);
					var third_td = $($('td', this)[0]);
				}else{
					var first_td = $($('td', this)[1]);
					var third_td = $($('td', this)[3]);
				}
			}
			
			var first_td_span = $('span.quickedit-vn', first_td);
			var village_id = first_td_span.attr('data-id');
			var url_base_ov = 'http://' + document.location.host + '/game.php?village=' + village_id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&screen=';
			
			first_td.append($(
				'<div class="n2_ov_villages" style="text-align: right; font-size: 7pt; font-family: \'Lucida Console\'; line-height: 6.5pt;">' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'main">HQ</a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'place">RP</a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'am_farm"><b>FA</b></a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'flags">FL</a> ' + 
					'<br>' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'map">MP</a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'market">MK</a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'train"><b>RC</b></a> ' + 
					'<a style="font-weight: normal;" href="' + url_base_ov + 'snob">AC</a> ' + 
				'</div>'
			));
			
			/* Send Resources in Production Overview */
			if(table_id == 'production_table'){
				if($('span.wood, span.stone, span.iron', this).length > 0){
					var wood = $('span.wood', this).html().replace(/\D/mg, '');
					var clay = $('span.stone', this).html().replace(/\D/mg, '');
					var iron = $('span.iron', this).html().replace(/\D/mg, '');
				}
				
				third_td.append($(
					'<div class="n2_ov_villages" style="text-align: right; font-size: 7pt; font-family: \'Lucida Console\'; line-height: 6.5pt;">' + 
						'<a style="font-weight: normal;" href="javascript: send_res_set(' + village_id + ', ' + wood + ', ' + clay + ', ' + iron + ');" class="send_res" id="send_res_' + village_id + '">Set From</a> ' + 
						'<br>' + 
						'<a style="font-weight: normal;" href="javascript: send_res(' + village_id + ');">Send To</a> ' + 
					'</div>'
				));
			}
			/* End */
		});
		
		unsafeWindow.send_res_from = 0;
		unsafeWindow.send_res_wood = 0;
		unsafeWindow.send_res_clay = 0;
		unsafeWindow.send_res_iron = 0;
		
		unsafeWindow.send_res_set = function(from, wood, clay, iron){
			unsafeWindow.send_res_from = from;
			unsafeWindow.send_res_wood = wood;
			unsafeWindow.send_res_clay = clay;
			unsafeWindow.send_res_iron = iron;
			
			$('.send_res').removeAttr('style');
			$('.send_res').css({'font-weight' : 'normal'});
			$('#send_res_' + from).css({'color' : '#FF0000'});
		}
		
		unsafeWindow.send_res = function(to){
			if(unsafeWindow.send_res_from != 0){
				var wood = prompt('Wood', unsafeWindow.send_res_wood);
				var clay = prompt('Clay', unsafeWindow.send_res_clay);
				var iron = prompt('Iron', unsafeWindow.send_res_iron);
				
				if(wood != null && clay != null && iron != null){
					$.ajax({
						type: 'POST', 
						url: 'http://' + document.location.host + '/game.php?village=' + unsafeWindow.send_res_from + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&screen=market&ajaxaction=map_send&h=' + unsafeWindow.game_data.csrf, 
						data: {target_id: to, wood: wood.trim(), stone: clay.trim(), iron: iron.trim()}
					}).done(
						function(msg){
							try{
								var j = JSON.parse(msg);
								
								if(j.error){
									UI.ErrorMessage(j.error);
									return;
								}
							}catch(err){}
							
							UI.SuccessMessage('Done!');
						}
					);
				}
			}
		}
	}
	/* End */
	
	/* Farm Shaper */
	if(urlParams['screen'] == 'report'){
		var buildings = $('#attack_spy_buildings_left tr, #attack_spy_buildings_right tr');
		
		if(buildings.length > 0){
			var buildings_array = {};
			
			buildings.each(function(i){
				var buildings_td = $('td', this);
				if(buildings_td.length == 2 && buildings_td[1].className == 'middle'){
					var building_name = $('span.middle', $(buildings_td[0])).html().toString().trim().toLowerCase();
					buildings_array[building_name] = buildings_td[1].innerHTML.toString().trim();
					$(buildings_td[1]).append('<a style="float: right;" href="http://' + document.location.host + '/game.php?village=' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&target=' + $('#attack_info_def span.village_anchor').attr('data-id') + '&screen=place&target_building=' + building_name + '&target_level=' + buildings_array[building_name] + '" target="_blank">[ Shaper ]</a>');
				}
			});
			
			var target_building;
			var target_level;
			
			if(typeof buildings_array['wall'] != 'undefined'){
				target_building = 'wall';
				target_level = buildings_array['wall'];
			}else{
				for(var key in buildings_array){
					if(key != 'timber camp' && key != 'clay pit' && key != 'iron mine' && key != 'warehouse' && key != 'hiding place' && key != 'church' && key != 'first church'){
						if(buildings_array[key] == '1' && (key == 'headquarters' || key == 'farm')){
							continue;
						}else{
							target_building = key;
							target_level = buildings_array[key];
							break;
						}
					}
				}
			}
			
			if(typeof target_building != 'undefined'){
				var target = $('#attack_info_def span.village_anchor').attr('data-id');
				
				$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" onclick="window.location = \'http://' + document.location.host + '/game.php?village=' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&target=' + target + '&screen=place&target_building=' + target_building + '&target_level=' + target_level + '\';" value="Farm Shaper (' + target_building + ' ' + target_level + ')"></div>');
			}
		}
	}
	
	if(urlParams['screen'] == 'place' && $('#unit_input_catapult').length > 0 && typeof urlParams['target_building'] != 'undefined'){
		$('form#units_form').attr('action', $('form#units_form').attr('action') + '&target_building=' + urlParams['target_building']);
		
		var catapult_levels = [];
		catapult_levels[1] = 2;
		catapult_levels[2] = 6;
		catapult_levels[3] = 10;
		catapult_levels[4] = 15;
		catapult_levels[5] = 21;
		catapult_levels[6] = 28;
		catapult_levels[7] = 36;
		catapult_levels[8] = 45;
		catapult_levels[9] = 56;
		catapult_levels[10] = 68;
		catapult_levels[11] = 82;
		catapult_levels[12] = 98;
		catapult_levels[13] = 115;
		catapult_levels[14] = 136;
		catapult_levels[15] = 159;
		catapult_levels[16] = 185;
		catapult_levels[17] = 215;
		catapult_levels[18] = 248;
		catapult_levels[19] = 286;
		catapult_levels[20] = 328;
		catapult_levels[21] = 376;
		catapult_levels[22] = 430;
		catapult_levels[23] = 490;
		catapult_levels[24] = 558;
		catapult_levels[25] = 634;
		catapult_levels[26] = 720;
		catapult_levels[27] = 815;
		catapult_levels[28] = 922;
		catapult_levels[29] = 1041;
		catapult_levels[30] = 1175;
		
		var cats_needed = catapult_levels[parseInt(urlParams['target_level'])];
		var cats_available = parseInt($('#unit_input_catapult').next().html().match(/\d+/));
		var scts_available = parseInt($('#unit_input_spy').next().html().match(/\d+/));
		
		if(cats_available < cats_needed){
			$('#unit_input_catapult').val(cats_available);
		}else{
			$('#unit_input_catapult').val(cats_needed);
		}
		
		$('#unit_input_axe').val(50);
		
		if(scts_available >= 4){
			$('#unit_input_spy').val(4);
		}
	}else if(urlParams['screen'] == 'place' && urlParams['try'] == 'confirm' && typeof urlParams['target_building'] != 'undefined'){
		$('select[name=building] option').each(function(i){
			if($(this).html().toString().trim().toLowerCase() == urlParams['target_building']){
				$(this).attr('selected', 'selected');
			}
		});
	}
	/* End */
	
	
	/* Report Renamer */
	if(urlParams['screen'] == 'report' && 'view' in urlParams == true){
		unsafeWindow.report_renamer = function(){
			var report_title = $('.quickedit[data-id=' + urlParams['view'] + '] .quickedit-label');
			
			var attacker_player = $('#attack_info_att th:nth-child(2) a[href!=#]');
			var attacker_village = $('#attack_info_att span.village_anchor a[href!=#]');
			var defender_player = $('#attack_info_def th:nth-child(2) a[href!=#]');
			var defender_village = $('#attack_info_def span.village_anchor a[href!=#]');
			
			var report_title_new = '';
			
			if(attacker_player.length > 0){
				report_title_new += '[' + attacker_player.html() + '] ';
			}
			
			if(attacker_village.length > 0){
				report_title_new += attacker_village.html() + ' ';
			}
			
			report_title_new += 'attacks ';
			
			if(defender_player.length > 0){
				report_title_new += '[' + defender_player.html() + '] ';
			}
			
			if(defender_village.length > 0){
				report_title_new += defender_village.html();
			}
			
			var url = TribalWars.buildURL('POST', 'report', {ajaxaction: 'edit_subject', report_id: urlParams['view']});
			TribalWars.post(url, {}, {text: report_title_new}, function(data){
				report_title.html(report_title_new);
			}, {});
		}
		
		$('body').append('<div style="position: fixed; z-index: 99999; top: 30px; right: 0px; padding: 4px 6px;"><input type="button" onclick="report_renamer();" value="Rename Report (R)"></div>');
		
		$(document).keydown(function(e){
			if(e.which == 114 || e.which == 82){
				// R: Rename Report
				report_renamer();
			}
		});
	}
	/* End */
	
	/* Distance Calculator */
	if(urlParams['screen'] == 'info_command'){
		var c_table = $($('#content_value .vis')[0]);
		
		var origin = $('.village_anchor a[href!=#]', c_table)[0];
		var destination = $('.village_anchor a[href!=#]', c_table)[1];
		
		var x_1 = origin.innerHTML.substr(-12, 3);
		var y_1 = origin.innerHTML.substr(-8, 3);
		var x_2 = destination.innerHTML.substr(-12, 3);
		var y_2 = destination.innerHTML.substr(-8, 3);
		
		var dif = Math.sqrt(((x_1 - x_2) * (x_1 - x_2)) + ((y_1 - y_2) * (y_1 - y_2)));
		var xdif = dif / parseFloat(localStorage.n2_world_speed);
		var units_speed = parseFloat(localStorage.n2_units_speed);
		
		var sword = 1320 * units_speed;
		var axe   = 1080 * units_speed;
		var scout = 540  * units_speed;
		var light = 600  * units_speed;
		var heavy = 660  * units_speed;
		var ram   = 1800 * units_speed;
		var noble = 2100 * units_speed;
		
		function clock(time){
			if(!time){
				return '-';
			}else{
				time = Math.round(time);
				var hours = Math.floor(time / 3600);
				var minutes = Math.floor((time - (hours * 3600)) / 60);
				var seconds = Math.floor(time - (hours * 3600) - (minutes * 60));
				var cl = hours + ':';
				
				if(minutes <= 9){
					cl = cl + '0' + minutes + ':';
				}else{
					cl = cl + minutes + ':';
				}
				
				if(seconds <= 9){
					cl = cl + '0' + seconds;
				}else{
					cl = cl + seconds;
				}
				
				return cl;
			}
		}
		
		c_table.append($(
			'<tr>' + 
				'<td colspan="2" style="text-align: right; font-weight: bold;">' + 
					'Scout<br>' + 
					'LC<br>' + 
					'HC<br>' + 
					'Axe<br>' + 
					'SW<br>' + 
					'Ram<br>' + 
					'Noble<br>' + 
				'</td>' + 
				'<td colspan="1">' + 
					clock(scout * xdif) + '<br>' + 
					clock(light * xdif) + '<br>' + 
					clock(heavy * xdif) + '<br>' + 
					clock(axe * xdif)   + '<br>' + 
					clock(sword * xdif) + '<br>' + 
					clock(ram * xdif)   + '<br>' + 
					clock(noble * xdif) + '<br>' + 
				'</td>' + 
			'</tr>'
		));
	}
	/* End */
	
	/* Incomings Auto Tag */
	if(urlParams['mode'] == 'incomings'){
		// We are in incomings tagger page
		
		unsafeWindow.tauto_do = function(){
			var tauto_refresh_rate = parseInt(sessionStorage.tauto_refresh_rate);
			setTimeout(function(){window.location = window.location.href;}, tauto_refresh_rate * 60000);
			
			$('#incomings_table span.quickedit-label').each(function(i){
				if($(this).html().trim() == 'Attack'){
					// There are untagged attacks, tag them
					$('#incomings_table input[type=checkbox]').attr('checked', true);
					$('#incomings_table input[name=label]').click();
				}
			});
		}
		
		if(typeof sessionStorage.tauto_refresh_rate == 'undefined'){
			// No auto tag is set, show button
			unsafeWindow.tauto = function(){
				var tauto_refresh_rate = prompt('Enter refresh rate in minutes', '5');
				
				if(tauto_refresh_rate == null){
					return;
				}
				
				$('#tauto_button').attr('disabled', true);
				
				sessionStorage.tauto_refresh_rate = parseInt(tauto_refresh_rate.trim());
				
				tauto_do();
			}
			
			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" id="tauto_button" onclick="tauto();" value="Auto Tag"></div>');
		}else{
			// Do auto tag
			tauto_do();
			
			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px; background-color: #DD0000; color: #FFFFFF;">Auto tag is active!<br>Refresh rate: Every ' + parseInt(sessionStorage.tauto_refresh_rate) + ' minute(s)<br>To stop it, close the tab!</div>');
		}
	}
	/* End */
	
	/* Auto Faker */
	if(urlParams['screen'] == 'place' && $('#unit_input_ram').length > 0){
		// We are in send troops pages
		
		unsafeWindow.fauto_do = function(){
			var fauto_attacks_count = parseInt(sessionStorage.fauto_attacks_count);
			
			var fauto_troops_ram = parseInt($('#unit_input_ram').next().html().match(/\d+/));
			var fauto_troops_cat = parseInt($('#unit_input_catapult').next().html().match(/\d+/));
			var fauto_troops_sct = parseInt($('#unit_input_spy').next().html().match(/\d+/));
			
			var defaults = fauto_settings(false);
			
			if(fauto_attacks_count <= 0 || (fauto_troops_ram < defaults[0] && fauto_troops_cat < defaults[1])){
				// Fakes count limit is reached or out of troops, stop
				
				if(sessionStorage.fauto_on_finish == 'n'){
					// Go to next village
					sessionStorage.fauto_attacks_count = sessionStorage.fauto_attacks_count_org;
					window.location = 'http://' + document.location.host + '/game.php?village=n' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'];
				}else{
					// Stop
					delete sessionStorage.fauto_coords;
					delete sessionStorage.fauto_send_scouts;
					delete sessionStorage.fauto_attacks_count_org;
					delete sessionStorage.fauto_attacks_count;
					delete sessionStorage.fauto_on_finish;
					$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px; background-color: #DD0000; color: #FFFFFF;">Auto fakes finished!<br>Close the tab!</div>');
				}
			}else{
				// Fakes count limit is not reached and there are still troops, continue
				sessionStorage.fauto_attacks_count = fauto_attacks_count - 1;
				
				if(fauto_troops_ram >= defaults[0] && defaults[0] != 0){
					$('#unit_input_ram').val(defaults[0]);
				}else{
					$('#unit_input_catapult').val(defaults[1]);
				}
				
				if(sessionStorage.fauto_send_scouts == 'y' && fauto_troops_sct >= defaults[2]){
					$('#unit_input_spy').val(defaults[2]);
				}
				
				var coords = sessionStorage.fauto_coords.split(' ');
				var coord_random = coords[Math.round(Math.random() * (coords.length - 1))];
				var coord_random_splited = coord_random.split('|');
				
				$('input[name=x]').val(coord_random_splited[0]);
				$('input[name=y]').val(coord_random_splited[1]);
				$('#place_target input[type=text]').val(coord_random);
				$('#target_attack').click();
			}
		}
		
		unsafeWindow.fauto_settings = function(do_set){
			if(do_set == true){
				var defaults = fauto_settings(false);
				
				var fauto_s_rams = prompt('Standard number of Rams for fakes in this world:', defaults[0]);
				if(fauto_s_rams != null){
					localStorage.fauto_s_rams = parseInt(fauto_s_rams.trim());
				}
				
				var fauto_s_cats = prompt('Standard number of Catapults for fakes in this world:', defaults[1]);
				if(fauto_s_cats != null){
					localStorage.fauto_s_cats = parseInt(fauto_s_cats.trim());
				}
				
				var fauto_s_scouts = prompt('Standard number of Scouts for fakes in this world:', defaults[2]);
				if(fauto_s_scouts != null){
					localStorage.fauto_s_scouts = parseInt(fauto_s_scouts.trim());
				}
			}else{
				var fauto_s_rams = (typeof localStorage.fauto_s_rams != 'undefined' ? localStorage.fauto_s_rams : 1);
				var fauto_s_cats = (typeof localStorage.fauto_s_cats != 'undefined' ? localStorage.fauto_s_cats : 1);
				var fauto_s_scouts = (typeof localStorage.fauto_s_scouts != 'undefined' ? localStorage.fauto_s_scouts : 4);
				
				return [fauto_s_rams, fauto_s_cats, fauto_s_scouts];
			}
		}
		
		if(typeof sessionStorage.fauto_coords == 'undefined'){
			// No auto fake is set, show auto fake button
			unsafeWindow.fauto = function(){
				var fauto_coords = prompt('Enter fake target coords.\r\nFormat: XXX|YYY XXX|YYY XXX|YYY');
				var fauto_send_scouts = prompt('Send scouts if available?\r\ny: Yes\r\nn: No', 'y');
				var fauto_attacks_count = prompt('How many fakes (limit)?', '20');
				var fauto_on_finish = prompt('What to do when no troops or fakes limit reached?\r\ns: Stop, do nothing\r\nn: Go to next village', 's');
				
				if(fauto_coords == null || fauto_send_scouts == null || fauto_attacks_count == null || fauto_on_finish == null){
					return;
				}
				
				$('#fauto_button, #fauto_s_button').attr('disabled', true);
				
				sessionStorage.fauto_coords = fauto_coords.trim();
				sessionStorage.fauto_send_scouts = fauto_send_scouts.trim();
				sessionStorage.fauto_attacks_count_org = fauto_attacks_count.trim();
				sessionStorage.fauto_attacks_count = fauto_attacks_count.trim();
				sessionStorage.fauto_on_finish = fauto_on_finish.trim();
				
				fauto_do();
			}
			
			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" id="fauto_button" onclick="fauto();" value="Fakes"><br><input type="button" id="fauto_s_button" onclick="fauto_settings(true);" value="Settings" style="font-size: 7pt;"></div>');
		}else{
			// Auto fake is set, do actions
			fauto_do();
		}
	}else if(urlParams['screen'] == 'place' && urlParams['try'] == 'confirm'){
		// We are in confirm send troops pages
		if(typeof sessionStorage.fauto_coords != 'undefined'){
			$('#troop_confirm_go').click();
		}
	}
	/* End */
	
	if(urlParams['screen'] == 'am_farm'){
		/* FA Key Press Edited Auto Load */
		if(md5(game_data.player.name) == 'b83789c8ce9ae93fb672165e95858d46'){
			$.getScript('https://127.0.0.1/Temp/TW%20-%20Farming/fakeypress_1-97.js');
		}else{
			$.getScript('https://a1f39cddb04c309a570bd5d844e49e9b38415fb3.googledrive.com/host/0B_efZvwT5JgUaUJhUHhpeGVUUHc/fakeypress_1-97.js');
		}
		
		$('#farm_units').parent().css({
			'position' : 'fixed', 
			'background-color' : '#FFFFFF', 
			'top' : '35px' 
		});
		
		$('#header_info').css({
			'position' : 'fixed', 
			'margin-left' : '17px', 
			'width' : '866px', 
			'top' : '103px' 
		});
		
		$('#content_value').css({
			'padding-top' : '35px' 
		});
		/* End */
		
		/* FA Resources Filter */
		var div=document.getElementById("am_widget_Farm");var table=$('#plunder_list')[0];var rows=table.getElementsByTagName("tr");var savedMinRess,ressArray,ressInt,cells;savedMinRess=localStorage.getItem("tm4rkus_savedMinRess");cells=rows[0].getElementsByTagName("th");var input=document.createElement("input");input.size=6;input.value=savedMinRess;input.style.marginRight="5px";cells[5].insertBefore(input,cells[5].getElementsByTagName("img")[0]);function filter(){savedMinRess=input.value;localStorage.setItem("tm4rkus_savedMinRess",savedMinRess);for(var i=1;i<rows.length;i++){cells=rows[i].getElementsByTagName("td");if(cells.length>=10){var cellBackup=String(cells[5].innerHTML);var res=$(cells[5]).find('.res, .warn_90, .warn').get();var ressInt=0;for(var r=0;r<res.length;r++){res[r]=Number($(res[r]).text().replace('.',''));ressInt+=res[r];}cells[5].innerHTML=cellBackup;if(ressInt<input.value){rows[i].style.display="none";}else{rows[i].style.display="";}}}}input.addEventListener("keyup",filter,false);filter();
		/* End */
		
		/* Looted Villages Marker On Map */
		var json_farmings;
		
		if(typeof localStorage['farmings'] == 'undefined'){
			json_farmings = {};
		}else{
			json_farmings = JSON.parse(localStorage['farmings']);
		}
		
		$('#plunder_list tr.row_a, #plunder_list tr.row_b').each(function(i){
			var tr_village_id = $(this).attr('id').substr(8);
			json_farmings[tr_village_id] = 1;
		});
		
		localStorage.setItem('farmings', JSON.stringify(json_farmings));
		/* End */
		
		/* Auto Farmer */
		unsafeWindow.fauto_timer = null;
		unsafeWindow.fauto_timer_delay = 201;
		
		unsafeWindow.fauto_do_first_run = function(){
			$('#plunder_list tr:visible:has(td)').each(function(i){
				if(parseFloat($('td:nth-child(8)', this).html()) > parseFloat(sessionStorage.fauto_distance)){
					this.remove();
				}
			});
		}
		
		unsafeWindow.fauto_do = function(){
			// Check rows
			var current_row = $('#plunder_list tr:visible').eq(1);
			
			if(current_row.length == 0){
				setTimeout(function(){
					window.location = 'http://' + document.location.host + '/game.php?village=n' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'];
				}, 2000);
				return;
			}
			
			// Check troops
			var total_farmin_troops_left = 0;
			var total_farmin_scouts_left = parseInt($('#spy').html());
			
			if($('input[name=spear]').is(':checked'))
				total_farmin_troops_left += parseInt($('#spear').html());
			
			if($('input[name=sword]').is(':checked'))
				total_farmin_troops_left += parseInt($('#sword').html());
			
			if($('input[name=axe]').is(':checked'))
				total_farmin_troops_left += parseInt($('#axe').html());
			
			if($('input[name=light]').is(':checked'))
				total_farmin_troops_left += (parseInt($('#light').html()) * 4);
			
			if($('input[name=heavy]').is(':checked'))
				total_farmin_troops_left += (parseInt($('#heavy').html()) * 6);
			
			if($('input[name=knight]').is(':checked'))
				total_farmin_troops_left += (parseInt($('#knight').html()) * 10);
			
			if(total_farmin_troops_left < 100 && total_farmin_scouts_left < 4){
				window.location = 'http://' + document.location.host + '/game.php?village=n' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'];
				return;
			}
			
			// Run next farming
			fauto_timer = setTimeout(fauto_do, fauto_timer_delay);
			
			// Continue to farming
			var btn_a = $('td a.farm_icon_a', current_row);
			var btn_b = $('td a.farm_icon_b', current_row);
			var btn_c = $('td a.farm_icon_c', current_row);
			
			if(total_farmin_troops_left >= 100){
				if(btn_c.length > 0 && !btn_c.hasClass('farm_icon_disabled')){
					btn_c.click();
				}else if(btn_a.length > 0 && !btn_a.hasClass('farm_icon_disabled')){
					btn_a.click();
				}else if(btn_b.length > 0 && !btn_b.hasClass('farm_icon_disabled')){
					btn_b.click();
				}
				
				current_row.remove();
				return;
			}else{
				$('#plunder_list tr:visible:has(td a.farm_icon_c)').remove();
				
				current_row = $('#plunder_list tr:visible').eq(1);
				
				if(current_row.length > 0){
					btn_b = $('td a.farm_icon_b', current_row);
					btn_c = $('td a.farm_icon_c', current_row);
					
					if(btn_a.length > 0 && !btn_a.hasClass('farm_icon_disabled')){
						btn_a.click();
					}else if(btn_b.length > 0 && !btn_b.hasClass('farm_icon_disabled')){
						btn_b.click();
					}
					
					current_row.remove();
					return;
				}
			}
		}
		
		unsafeWindow.fauto = function(){
			var fauto_distance = prompt('Enter the max farming distance:', 30);
			
			if(fauto_distance == null){
				return;
			}
			
			alert('Farming will now start, it will first send C, if C not avaible then A, if A not avaible then B.\r\nAfter the end of current page, it will go to next village.\r\nThe only way to stop it is closing the tab it is open in.');
			
			$('#fauto_button').val('Farm - Stop');
			$('#fauto_button').attr('onclick', 'fauto_stop();');
			
			sessionStorage.fauto_distance = fauto_distance.trim();
			
			fauto_do_first_run();
			fauto_do();
		}
		
		unsafeWindow.fauto_stop = function(){
			delete sessionStorage.fauto_distance;
			clearTimeout(fauto_timer);
			fauto_timer = null;
			$('#fauto_button').val('Farm');
			$('#fauto_button').attr('onclick', 'fauto();');
		}
		
		if(typeof sessionStorage.fauto_distance == 'undefined'){
			// No auto farm is set, show auto farm button
			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" id="fauto_button" onclick="fauto();" value="Farm"></div>');
		}else{
			// Auto farm is set, do actions
			fauto_do_first_run();
			fauto_do();
			
			$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" id="fauto_button" onclick="fauto_stop();" value="Farm - Stop"></div>');
		}
	/* End */		
	}
	
	unsafeWindow.map_highlight = function(){
		var json_farmings;
		if(typeof localStorage['farmings'] == 'undefined'){
			json_farmings = {};
		}else{
			json_farmings = JSON.parse(localStorage['farmings']);
		}
		
		$('[id^=map_village_]').css({
			'opacity': '1' 
		});
		
		for(var key in json_farmings){
			$('#map_village_' + key).css({
				'opacity': '0.5' 
			});
		}
	}
	
	$(document).mouseup(function(e){
		if(urlParams['screen'] == 'map'){
			map_highlight();
		}
	});
	
	/* TWStats For Tribes */
	if(urlParams['screen'] == 'info_ally'){
		$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" onclick="window.open(\'http://www.twstats.com/' + document.location.host.split('.')[0] + '/index.php?page=tribe&id=' + urlParams['id'] + '\');" value="TWStats"></div>');
	}
	/* End */
	
	/* TWStats For Players */
	if(urlParams['screen'] == 'info_player'){
		$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" onclick="window.open(\'http://www.twstats.com/' + document.location.host.split('.')[0] + '/index.php?page=player&id=' + urlParams['id'] + '\');" value="TWStats"></div>');
	}
	/* End */
	
	/* TWStats For Villages */
	if(urlParams['screen'] == 'info_village'){
		$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" onclick="window.open(\'http://www.twstats.com/' + document.location.host.split('.')[0] + '/index.php?page=village&id=' + urlParams['id'] + '\');" value="TWStats"></div>');
	}
	/* End */
	
	/* Show Ram Times */
	if(urlParams['screen'] == 'map'){
		setTimeout(map_highlight, 500);
		$('body').append('<div style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px;"><input type="button" onclick="delete localStorage.farmings; map_highlight();" value="Clear Looted Villages Log"><br><input type="button" onclick="show_ram_times();" value="Show Ram Times (R)"></div>');
		
		$(document).keydown(function(e){
			if(e.which == 114 || e.which == 82){
				// R: Show Ram Times
				show_ram_times();
			}
		});
		
		unsafeWindow.show_ram_times = function(){
			function clock(time){
				if(!time){
					return '-';
				}else{
					time = Math.round(time);
					var hours = Math.floor(time / 3600);
					var minutes = Math.floor((time - (hours * 3600)) / 60);
					var seconds = Math.floor(time - (hours * 3600) - (minutes * 60));
					var cl = hours + ':';
					
					if(minutes <= 9){
						cl = cl + '0' + minutes + ':';
					}else{
						cl = cl + minutes + ':';
					}
					
					if(seconds <= 9){
						cl = cl + '0' + seconds;
					}else{
						cl = cl + seconds;
					}
					
					return cl;
				}
			}
			
			$('span', $('[id^=map_village_]').parent()).remove();
			$('[id^=map_village_]').each(function(i){
				var v_id = parseInt($(this).attr('id').toString().substr(12));
				var v_cords = TWMap.villageKey[v_id];
				var v_cords_x = v_cords.toString().substr(0, 3);
				var v_cords_y = v_cords.toString().substr(3);
				var dif = Math.sqrt(((game_data.village.x - v_cords_x) * (game_data.village.x - v_cords_x)) + ((game_data.village.y - v_cords_y) * (game_data.village.y - v_cords_y)));
				var xdif = dif / parseFloat(localStorage.n2_world_speed);
				var units_speed = parseFloat(localStorage.n2_units_speed);
				var ram = 1800 * units_speed;
				$(this).parent().append('<span style="font-size: 7pt; font-weight: normal; font-family: Verdana; color: #FFFFFF; text-shadow: 1px 1px 0px #000000; position: absolute; z-index: 10; top: ' + ($(this).position().top + 9) + 'px; left: ' + $(this).position().left + 'px;">' + clock(ram * xdif) + '<br>' + clock((ram * xdif) * 2) + '</span>');
			});
		};
	}
	/* End */
	
	/* Key Press Actions */
	$(document).keydown(function(e){
		var tag = e.target.tagName.toLowerCase();
		
		if(urlParams['screen'] == 'map'){
			/* Auto Insert Resources */
			if($('#market-send-form').length > 0){
				if((e.which == 113 || e.which == 81) && e.ctrlKey != true){
					// q: Insert Max
					Market.Modes.send.insertMax('wood');
					Market.Modes.send.insertMax('stone');
					Market.Modes.send.insertMax('iron');
					$('.btn', $('#market-send-form')).click();
				}else if((e.which == 119 || e.which == 87) && e.ctrlKey != true){
					// w: Insert Equal
					
					if(Market.Memory.freeCapacity == null){
						Market.Modes.send.recalcFreeCapacity();
					}
					
					var r_amount = Math.floor(Market.Memory.freeCapacity / 3);
					
					if(game_data.village.wood < r_amount){
						$("input[name='wood']").val(game_data.village.wood);
					}else{
						$("input[name='wood']").val(r_amount);
					}
					
					if(game_data.village.stone < r_amount){
						$("input[name='stone']").val(game_data.village.stone);
					}else{
						$("input[name='stone']").val(r_amount);
					}
					
					if(game_data.village.iron < r_amount){
						$("input[name='iron']").val(game_data.village.iron);
					}else{
						$("input[name='iron']").val(r_amount);
					}
					
					$('.btn', $('#market-send-form')).click();
				}else if((e.which == 101 || e.which == 69) && e.ctrlKey != true){
					// e: Insert Balanced
					
					if(Market.Memory.freeCapacity == null){
						Market.Modes.send.recalcFreeCapacity();
					}
					
					var r_amount = Math.floor(Market.Memory.freeCapacity / 3);
					
					var r_amount_total = game_data.village.wood + game_data.village.stone + game_data.village.iron;
					var r_amount_total_p = (r_amount_total / Market.Memory.freeCapacity).toFixed(2);
					var r_amount_total_p = Math.ceil((r_amount_total / Market.Memory.freeCapacity) * 100) / 100;
					
					var r_amount_w = Math.floor(game_data.village.wood / r_amount_total_p);
					var r_amount_c = Math.floor(game_data.village.stone / r_amount_total_p);
					var r_amount_i = Math.floor(game_data.village.iron / r_amount_total_p);
					
					if(game_data.village.wood < r_amount_w){
						$("input[name='wood']").val(game_data.village.wood);
					}else{
						$("input[name='wood']").val(r_amount_w);
					}
					
					if(game_data.village.stone < r_amount_c){
						$("input[name='stone']").val(game_data.village.stone);
					}else{
						$("input[name='stone']").val(r_amount_c);
					}
					
					if(game_data.village.iron < r_amount_i){
						$("input[name='iron']").val(game_data.village.iron);
					}else{
						$("input[name='iron']").val(r_amount_i);
					}
					
					$('.btn', $('#market-send-form')).click();
				}
			}else if($('#market-confirm-form').length > 0){
				if((e.which == 113 || e.which == 119 || e.which == 101 || e.which == 81 || e.which == 87 || e.which == 69) && e.ctrlKey != true){
					$('.btn', $('#market-confirm-form')).click();
				}
			}
			/* End */
		}
		
		/* Next/Prev Villages Hotkeys */
		if(tag != 'input' && tag != 'textarea' && e.ctrlKey == true && (e.which == 44 || e.which == 188 || e.which == 46 || e.which == 190 || ((e.key == 'ArrowLeft' || e.key == 'ArrowRight' || e.which == 37 || e.which == 39) && urlParams['screen'] != 'mail' && urlParams['screen'] != 'ally' && urlParams['screen'] != 'forum'))){
			window.location = 'http://' + document.location.host + '/game.php?village=' + (e.which == 44 || e.which == 188 || e.which == 37 || e.key == 'ArrowLeft' ? 'p' : 'n') + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'];
		}
		/* End */
		
		/* New Window Attack/Support */
		if(urlParams['screen'] == 'place' && urlParams['try'] != 'confirm'){
			if(e.ctrlKey == true && e.altKey == true && (e.which == 97 || e.which == 65)){
				// CTRL+ALT+a
				$('#units_form').attr('target', '_blank');
				UI.SuccessMessage('New Window Attack/Support!');
			}
		}
		/* End */
		
		/* Remove Flag */
		if(urlParams['screen'] == 'flags'){
			if(e.which == 114 || e.which == 82){
				// R: Remove Flag
				FlagsScreen.unassignFlag(game_data.village.id);
			}
		}
		/* End */
		
		if(urlParams['screen'] == 'place' && urlParams['try'] == 'confirm'){
			/* Auto Attack Launcher */
			unsafeWindow.laucnh_it = null;
			unsafeWindow.laucnh_it_type = null;
			unsafeWindow.arrival_check_timer = null;
			
			unsafeWindow.format_date = function(timestamp, only_time){
				var local_offset_from_utc = new Date().getTimezoneOffset() * 60;
				var adjusted_timestamp = timestamp + local_offset_from_utc + unsafeWindow.server_utc_diff;
				var date = new Date(adjusted_timestamp * 1e3);
				var year = date.getYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();
				var hours = date.getHours();
				var minutes = date.getMinutes();
				var seconds = date.getSeconds();
				var miliseconds = date.getMilliseconds();
				
				var pad = function (n, l) {
					n = '' + n;
					return n.length === l - 1 ? '0' + n : n;
				};
				
				if(only_time == true){
					return [pad(hours, 2), pad(minutes, 2), pad(seconds, 2), pad(miliseconds, 3).toString().substr(0, 1)];
				}
				
				var time_string = pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ':' + miliseconds.toString().substr(0, 1);
				var date_string = pad(day, 2) + '.' + pad(month, 2) + '.';
				var today = new Date(new Date().getTime() + local_offset_from_utc * 1e3 + unsafeWindow.server_utc_diff * 1e3);
				var tomorrow = new Date(today);
				tomorrow.setDate(today.getDate() + 1);
				if (today.getDate() === date.getDate()) {
					return 'today at %s'.replace('%s', time_string);
				} else if (tomorrow.getDate() === date.getDate()) {
					return 'tomorrow at %s'.replace('%s', time_string);
				} else
					return 'on %1 at %2'.replace('%1', date_string).replace('%2', time_string);
			}
			
			unsafeWindow.arrival_check = function(){
				var arrival = (((Timing.getCurrentServerTime() + Timing.offset_to_server)) + ($('.relative_time').data('duration') * 1000)) / 1000;
				$('#arrival_time').html(format_date(arrival));
				
				if(laucnh_it != null){
					// Auto Launch Check
					var arrival_array = format_date(arrival, true);
					
					var current_hh, current_mm, current_ss, current_ms;
					var target_hh, target_mm, target_ss, target_ms;
					
					laucnh_it = laucnh_it.trim();
					var target = laucnh_it.split(':');
					target_hh = target[0];
					target_mm = target[1];
					target_ss = target[2];
					target_ms = (target.length == 4 ? target[3] : 0);
					
					if(laucnh_it_type == 1){
						var current = $('#serverTime').html().split(':');
						
						current_hh = current[0];
						current_mm = current[1];
						current_ss = current[2];
					}else if(laucnh_it_type == 2){
						current_hh = arrival_array[0];
						current_mm = arrival_array[1];
						current_ss = arrival_array[2];
					}
					
					current_ms = arrival_array[3];
					
					if(parseInt(current_hh) == parseInt(target_hh) && parseInt(current_mm) == parseInt(target_mm) && parseInt(current_ss) >= parseInt(target_ss) && parseInt(current_ms) >= parseInt(target_ms)){
						var notify = new Audio();
						notify.preload = 'auto';
						if(md5(game_data.player.name) == 'b83789c8ce9ae93fb672165e95858d46'){
							notify.src = 'https://127.0.0.1/University/Online Game/resources/sounds/notify_2.wav';
						}else{
							notify.src = 'https://a1f39cddb04c309a570bd5d844e49e9b38415fb3.googledrive.com/host/0B_efZvwT5JgUaUJhUHhpeGVUUHc/notify_2.wav';
						}
						notify.play();
						
						
						$('#troop_confirm_go').click();
						laucnh_it_type = null;
					}
				}
			}
			
			unsafeWindow.arrival_check_start = function(){
				if(arrival_check_timer == null){
					$('#date_arrival').append('<div id="arrival_time" style=""></div>');
					$('.relative_time').hide();
					arrival_check = setInterval(arrival_check, 100);
				}
			}
			
			if(e.ctrlKey != true && (e.which == 113 || e.which == 81 || e.which == 119 || e.which == 87)){
				if(e.which == 113 || e.which == 81){
					// Key: Q
					laucnh_it = prompt('Enter the time to launch the attack on it.\r\nFormat: hh:mm:ss:m');
				}else if(e.which == 119 || e.which == 87){
					// Key: W
					laucnh_it = prompt('Enter the time for attack to arrive at it.\r\nFormat: hh:mm:ss:m');
				}
				
				if(laucnh_it != null){
					arrival_check_start();
					
					if(e.which == 113 || e.which == 81){
						laucnh_it_type = 1;
						$('body').append('<div id="laucnh_it_on_interval" style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px; background-color: #DD0000; color: #FFFFFF;">Launch On: ' + laucnh_it + '</div>');
					}else if(e.which == 119 || e.which == 87){
						laucnh_it_type = 2;
						$('body').append('<div id="laucnh_it_on_interval" style="position: fixed; z-index: 99999; top: 5px; right: 0px; padding: 4px 6px; background-color: #0000DD; color: #FFFFFF;">Arrive On: ' + laucnh_it + '</div>');
					}
					
					UI.SuccessMessage('Auto launcher has been set!');
				}else{
					laucnh_it_type = null;
					$('#laucnh_it_on_interval').remove();
					
					UI.ErrorMessage('Auto launcher has been unset!');
				}
			}
			/* End */
			
			/* Miliseonds for attacks */
			if(e.ctrlKey != true && (e.which == 116 || e.which == 84)){
				// Key: T
				arrival_check_start();
			}
			/* End */
		}
		
		/* Mint Coin Hotkey */
		if(urlParams['screen'] == 'snob'){
			if(e.which == 113 || e.which == 81){
				window.location = 'http://' + document.location.host + '/game.php?village=' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + '&screen=' + urlParams['screen'] + '&action=coin&h=' + unsafeWindow.game_data.csrf;
			}
		}
		/* End */
	});
	
	/* Next/Prev Villages */
	if(!unsafeWindow.premium){
		$('#menu_row2_village').prepend($(
				'<a style="vertical-align: middle;" href="http://' + document.location.host + '/game.php?village=p' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'] + '"><img src="http://dsen.innogamescdn.com/8.26.1/21831/graphic/arrow-left.png"></a> ' + 
				'<a style="vertical-align: middle;" href="http://' + document.location.host + '/game.php?village=n' + game_data.village.id + ('t' in urlParams == true ? '&t=' + urlParams['t'] : '') + ('mode' in urlParams == true ? '&mode=' + urlParams['mode'] : '') + '&screen=' + urlParams['screen'] + '"><img src="http://dsen.innogamescdn.com/8.26.1/21831/graphic/arrow-right.png"></a>' 
		));
	}
	/* End */
}

/* Add Sound To Notifications */
unsafeWindow.UI.Notification.show = function(img, title, content, callback){
	"use strict";
	if (!this.enabled)
		return;
	var html = '<div class="side-notification"><div class="img-container"><img src="' + img + '" alt="" /></div><div class="content"><strong>' + title + '</strong><p>' + content + '</p></div></div>',
	$container = $('#side-notification-container');
	if (!$container.length)
		$container = $('<div id="side-notification-container"></div>').appendTo('body');
	var slot = null;
	for (var i = 0; i < 10; i++)
		if (!this._stack.hasOwnProperty(i)) {
			slot = i;
			break
		};
	if (slot === null)
		return;
	var $notification = $(html);
	$notification.css({
		bottom : (slot * this.WIDGET_HEIGHT) + 'px',
		'z-index' : 12200 - slot
	}).on('click', callback);
	$notification.prependTo($container).addClass('side-notification-visible');
	
	var notify = new Audio();
	notify.preload = 'auto';
	if(md5(game_data.player.name) == 'b83789c8ce9ae93fb672165e95858d46'){
		notify.src = 'https://127.0.0.1/University/Online Game/resources/sounds/notify_2.wav';
	}else{
		notify.src = 'https://a1f39cddb04c309a570bd5d844e49e9b38415fb3.googledrive.com/host/0B_efZvwT5JgUaUJhUHhpeGVUUHc/notify_2.wav';
	}
	notify.play();
	this.SHOW_TIME = 15000;
	
	this._stack[slot] = $notification;
	var self = this;
	setTimeout(function () {
		delete self._stack[slot];
		var end = function () {
			$notification.remove()
		};
		if (Modernizr.cssanimations) {
			$notification.removeClass('side-notification-visible').addClass('side-notification-hide');
			$notification.on('animationend webkitAnimationEnd', function () {
				$notification.remove()
			})
		} else
			end()
	}, this.SHOW_TIME)
};
/* End */

});
