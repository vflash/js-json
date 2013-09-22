Преобразует JS в JSON
---------------------------

допустим берем такой js-json файл example.json

```
{
	aaa: 777,
	bbb: 'ccc eee',
	"ddd": {
		, eee: 1  // xxxx
		, uuu: 2
	},

	/*
		bla bla bla bla
		bla bla bla bla
	*/

	qqq: [
		, 'sssss ssss'
		, 'ggg "ggg" gg'
	]
}

```

как json этот файл не валиден. но его можно преобразовать в правильный json и распарсить стандартными средствами

```
var jsjson = require('js-json');

require('fs').readFile('./example.json', function (err, data) {
	if (err) {
		console.log('file:// not load');
		return;
	};

	var data = data.toString('utf8');
	if (data.charCodeAt(0) === 65279) {
		data = data.substr(1); // UTF8 BOM
	};

	console.log( jsjson.parse(data) );

});

```

в итоге получаем следующий обьект

```
{
	aaa: 777,
	bbb: 'ccc eee',
	ddd: {
		eee: 1,
		uuu: 2 
	},
	qqq: [
		'sssss ssss',
		'ggg "ggg" gg'
	]
}
```
