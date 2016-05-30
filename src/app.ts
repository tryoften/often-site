/// <reference path="../typings/tsd.d.ts" />

import * as express from 'express';
import * as exphbs from 'express-handlebars';
import * as path from 'path';
import { Request, Response } from 'express';
import Packs from '../app/Collections/Packs';
let app = express();
let packs = new Packs([], {autoSync: true});

app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', exphbs({
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'views/layouts/'),
	partialsDir: path.join(__dirname, 'views/partials/'),
	extname: ".hbs"
}));
app.set('view engine', '.hbs');

app.use('/public/', express.static(path.join(__dirname, '../client')));

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/about', function (req, res) {
	res.render('about');
})

app.get('/css/style.css', function (req, res) {
	res.sendFile(path.join(__dirname, 'css/style.css'));
});

app.get('/packs', (req: Request, res: Response) => {
	let data = packs
		.filter(pack => !pack.isFavorites && !pack.isRecents && !pack.deleted && pack.published)
		.map(pack => pack.toJSON());

	res.render('packs', {
		title: "Packs",
		items: data,
		layout: 'pack-page'
	});
});

app.get('/pack/:id', (req: Request, res: Response) => {
	let pack = packs.get(req.params.id);

	pack.syncData().then(() => {
		let data = pack.toJSON();

		for (let item of data.items) {
			item.isGIF = item.type === "gif";
		}

		res.render('pack', Object.assign({}, data, {
			title: data.name,
			layout: 'pack-page'
		}));
	});
});

app.listen(8080, () => {
	console.log('Listening on port 8080');
});