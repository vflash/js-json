
'use strict';

var module;
if (typeof exports === 'object' && this == exports) {
	module = module.exports;
};


module.parse = module.parser = function(s) {
	try {
		return JSON.parse(toJSON(s));

	} catch(e) {
		throw e;
	};
};

module.conv = toJSON;



function genRegExp(a) {
	return new RegExp(a.map(function(x){return x.source || '('+genRegExp(x).source+')' }).join('|'), 'g')
}

var regx = genRegExp([
	/[a-z_]\w*(?=[ \t]*\:)/,  // свойство хеша
	/"(?:\\(?:[^"]|")|[^"\n\\])*"/, // строка в двойной кавычке
	/'(?:\\(?:[^']|')|[^'\n\\])*'/, // строка в одерной кавычке
	/-?\d[\d\.e-]*/, // число
	
	/\/(?:\\\\|\\\/|[^\/\n])+\/\w+/,  // регулярка

	/(?:,\s*)+[\]\}]/, // запитая в конце хеша
	/[\[\{](?:\s*,)+/, // запятая в начале массива
]);


var regc = genRegExp([
	[
		/"(?:\\(?:[^"]|")|[^"\n\\])*"/, // строка в двойной кавычке
		/'(?:\\(?:[^']|')|[^'\n\\])*'/, // строка в одерной кавычке
		/\/(?:\\\\|\\\/|[^\/\n])+\/\w+/,  // регулярка
	],

	/\/\*(?:[^*]|\*(?=[^\/]))*\*\//, // комментарий /* .... */
	/\/\/[^\n]*/, // комментарий 
]);


//var regx = /(,\s*)+[\]\}]|[\[\{](\s*,)+|'(\\([^']|')|[^'\n\\])*'|"(\\([^"]|")|[^"\n\\])*"|-?\d[\d\.e-]*|[a-z_]\w*(?=[ \t]*\:)/ig;

function toJSON(s) {
	return (s+'').replace(regc, '$1').replace(regx, re_toJSON);
};

function re_toJSON(s) {
	switch(s.charCodeAt(0)) {
		case 34: /* ["] */ return s;
		case 47: /* [/] */ return JSON.stringify(s);

		case 39: /* ['] */ 
			return '"' + s.substr(1, s.length-2).replace(/\\(.)|(")/g, '\\$1$2') + '"';

		case 44: /* [,] */
			return s.charCodeAt(s.length-1) === 93 ? ']' : '}';

		case 91:  /* "[" */
			return '[';

		case 123: /* "{" */
			return '{';

		case 45:case 48:case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
			return s;


		default:
			return JSON.stringify(s);
	};
};





