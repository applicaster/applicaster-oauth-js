
import axios from 'axios';

const endpoints = {
    authUrl: 'https://accounts.applicaster.com/oauth/authorize?response_type=token',
    userData: 'https://accounts.applicaster.com/api/v1/users/current.json',
    accountData: 'https://accounts.applicaster.com/api/v1/accounts.json'
};


class ApplicasterOauth {
    constructor(app, options) {
        if (!options.client_id) {
            throw 'ApplicasterOauth : no client_id provided';
        }

        if (!options.redirect_url) {
            throw 'ApplicasterOauth : no redirect_uri provided';
        }

        this.client_id = options.client_id;
        this.redirect_url = options.redirect_url;

        app.get('/auth/applicaster/callback', (req, res) => {
            res.sendFile(__dirname+'/auth.html');
        });


        options.user_route && app.get('/applicaster/user', (req, res) => {
            const token = req.cookies.appliAuth_token;
            this.getUserData(token)
            .then(user => res.json(user))
            .catch(error => res.status(500));
        })


        options.accounts_route && app.get('/applicaster/accounts', (req, res) => {
            const token = req.cookies.appliAuth_token;
            this.getAccountInfo(token)
            .then(accounts => res.json(accounts))
            .catch(error => res.status(500));
        })
    }

    authenticate() {
        return (req, res, next) => {

            if (req.cookies && req.cookies.appliAuth_token) {
                this.getUserData(req.cookies.appliAuth_token)
                .catch(error => console.log('error %s', error))
                .then(() => next());
            } else {

                if (req.query.access_token) {
                    this.getUserData(req.query.access_token)
                    .then(() => {
                        res.cookie('appliAuth_token', req.query.access_token, {});
                        next();
                    })
                    .catch(() => {
                        res.send(500);
                    })
                } else {
                    res.redirect(`${endpoints.authUrl}&client_id=${this.client_id}&redirect_uri=${this.redirect_url}`);
                }

            }
        }

    }

    getUserData(token) {
        return new Promise( (resolve, reject) => {
            return token ?
                axios.get(`${endpoints.userData}?access_token=${token}`)
                .catch(() => reject('invalid token'))
                .then(response => { return resolve(response.data); })
                : reject('invalid token');
        });
    }

    getAccountInfo(token) {
        return new Promise( (resolve, reject) => {
            return token ?
                axios.get(`${endpoints.accountData}?access_token=${token}`)
                .catch(() => { return reject('invalid token'); })
                .then((response) => { return resolve(response.data); })
                : reject('invalid token');
        });
    }
}

export default ApplicasterOauth;
