import * as express from 'express';
import * as exphbs from 'express-handlebars';
import * as path from 'path';
import { Request, Response, Router } from 'express';
import { Packs, Pack, User, firebaseApp } from '@often/often-core';

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

app.use('/public/', express.static(path.join(__dirname, 'public')) as Router);

app.get('/', function (req, res) {
	res.render('home', {
		title: 'Often',
		url: req.protocol + '://' + req.get('host') + req.originalUrl
	});
});

app.get('/about', function (req, res) {
	res.render('about');
});

app.get('/privacy', function(req, res) {
	res.render('privacy');
});

app.get('/keyboards', (req: Request, res: Response) => {
	let data = packs
		.filter(pack => !pack.isFavorites && !pack.isRecents && !pack.deleted && pack.published)
		.map(pack => pack.toJSON());

	res.render('packs', {
		title: "Packs - Often",
		items: data,
		url: req.protocol + '://' + req.get('host') + req.originalUrl
	});
});

app.get('/k(eyboard)?/:id', (req: Request, res: Response) => {
	let pack = packs.get(req.params.id);

	pack.syncData().then(() => {
		let data = pack.toJSON();

		for (let item of data.items) {
			item.isGIF = item.type === "gif";
		}

		res.render('pack', Object.assign({}, data, {
			title: data.name + " - Often",
			url: req.protocol + '://' + req.get('host') + req.originalUrl
		}));
	});
});

app.get('/@:username', (req: Request, res: Response) => {
	let database = firebaseApp.database();
	let hash = new Buffer(String(req.params.username)).toString('base64');

	let usernameRef = database.ref().child('/usernames').child(hash);

	usernameRef.on('value', snapshot => {
		let data = snapshot.val();
		console.log(data);

		new User({id: data.userid}).syncData().then((user) => {
			let userData = user.toJSON();

			res.render('user', Object.assign({}, userData, {
				title: userData.name + " - Often",
				url: req.protocol + '://' + req.get('host') + req.originalUrl,
				mobileURL: 'tryoften://user/' + data.userid
			}));
		});
	});
});

app.listen(process.env.PORT || '8080', () => {
	console.log('Listening on port 8080');
});
