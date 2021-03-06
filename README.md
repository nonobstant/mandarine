![mame](https://github.com/nonobstant/mandarine/blob/master/assets/images/Mandarine128.png)

# mandarine
prismFlower theme and server

## prism System
**prism** are the XP, you gain **prism** by
* Create ( **+20** )
* Give + to people ( **+10** )
* Play game

When you get **100** prism you get a **new random flower** + **One GiveAwayTicket**

### Flower
Flower are PixelArt Rank, you can choose one flower to be on your profile page, each flower five you a Rank Title.

### GiveAwayTicket
**One GiveAway / month**
* Unlimited participation
* Everyone can participate
* **One** Winner / GiveAway

### Game
* 2048 | Convert your score to **prism**
* Digitus | **prism** per win

---

## Lux Advantage (subscription)
* **10** GiveAwayTicket's / month
* XP boost ( x2 )
* 2048 special theme

---

## Architecture

### Content Managing System
**Ghost ( Yokai )**
* Digital Ocean ( host )
* Mailgun ( email )
* Getform ( register )

### Back-End
* **NodeJS Server**
  * Heroku ( host )
  * Scaling with DigitalOcean + Docker
* Express + http
* SocketIO ( server )
* LowDB
* sanityze-html

### Front-End
* Mandarine theme ( handlebars )
* VueJS + SocketIO

---

## Creators

### Profile Modification
* Image
* Description
* Website

: : **Modification on Account page**
: : **Take affect on Profile page**

### Creations Modification
* Modify ( title/img/content )
* Remove

: : **Modification on Creation page**

---

## Development

**Theme** Release
* Home
* Creation
* Profile
* Login / Register
* Tag
* Draw-Box
* Color Theme
* Dark / Light mode

**Theme** Progress
* Create
* Account
* GiveAway
* Chat
* Private Chat
* Create Environment variable for socketIO client-side

Install / Development

```bash
# Install
yarn

# Run build & watch for changes
$ yarn dev
```
Production

```bash
yarn zip
```

**Server** Release
* SocketIO
  * Chat
    * Sanityzed HTML
  * Create
    * Verify creator
* Ghost admin
  * App connexion

**Server** Progress
* SockectIO + Ghost admin
  * Remove / Edit Creation
  * Edit profile
* Ghost admin
  * Auth connection
* LowDB
  * Create the Database
  * Users
    * prism, Flower, GiveAwayTicket
  * Interaction system


Install / Development

```bash
# Install
npm install

# Run the server
$ npm start
```
