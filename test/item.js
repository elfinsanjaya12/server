const app = require('../app');
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect;
const clearUser = require('../helpers/clearUser')

chai.use(chaiHttp)

let token = '';
let user_id = '';
let token_buyer = '';

before(function(done) {
  let data = {
    name : 'Rangga Kusuma',
    phone : '0812345678',
    address : 'Hacktiv8 Jakarta Selatan',
    username: 'rangga123',
    role: 'seller',
    password: 'ranggarangga',
    brand: 'mie ayam'
}
  //NOTE: CHAI REGISTER & LOGIN    
  chai
  .request(app)
  .post('/register')
  .send(data)
  .end(function(err, result) {
    // user_id = result.body.data._id;
    chai
    .request(app)
    .post('/login')
    .send(data)
    .end(function(err, result) {
      token = result.body.token;

      let dataBuyer = {
        name : 'Hedya',
        phone : '0812345678',
        address : 'Hacktiv8 Jakarta Selatan',
        username: 'hedya',
        role: 'buyer',
        password: 'hedya',
      }
      chai
      .request(app)
      .post('/register')
      .send(dataBuyer)
      .end(function(err, result) {
        chai
        .request(app)
        .post('/login')
        .send(dataBuyer)
        .end(function(err, result) {
          token_buyer = result.body.token;
          // user_id = result.body.data._id;
          done();
        })
      })
    })
  })
})

describe('Testing for create item', () => {
  it('Should return success created item', (done) => {
    const namaBarang = {
      name: 'bakso',
      price: 15000,
    }
    chai.request(app)
        .post('/items')
        .set('auth', token)
        .send(namaBarang)
        .end((err, result) => {
          expect(result).to.have.status(201)
          expect(result.body).to.have.property('_id')
          expect(result.body).to.have.property('itemList')
          expect(result.body.itemList).to.be.an('array')
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('_id')
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('name')
          expect(result.body.itemList[result.body.itemList.length-1].name).to.equal(namaBarang.name)
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('price')
          expect(result.body.itemList[result.body.itemList.length-1].price).to.equal(namaBarang.price)
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('picture')
          done()
        })
  })
  it('Should return success create new item with image :', (done) => {
    const namaBarang = {
      name: 'bakso',
      price: 15000,
    }
    chai.request(app)
        .post('/items')
        .set('auth', token)
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .field('Content-Type', 'multipart/form-data')
        .field('fileName', 'girl.png')
        .field('name', namaBarang.name)
        .field('price', namaBarang.price)
        .attach('file', './girl.png')
        .end((err, result) => {
          expect(result).to.have.status(201)
          expect(result.body).to.have.property('_id')
          expect(result.body).to.have.property('itemList')
          expect(result.body.itemList).to.be.an('array')
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('_id')
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('name')
          expect(result.body.itemList[result.body.itemList.length-1].name).to.equal(namaBarang.name)
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('price')
          expect(result.body.itemList[result.body.itemList.length-1].price).to.equal(namaBarang.price)
          expect(result.body.itemList[result.body.itemList.length-1]).to.have.property('picture')
          done()
        })
  })
  it('Should return error name item required', (done) => {
    const namaBarang = {
      nama: 'bakso',
      price: 15000,
    }
    chai.request(app)
        .post('/items')
        .set('auth', token)
        .send(namaBarang)
        .end((err, result) => {
          expect(result).to.have.status(401)
          expect(result.body).to.have.property('name')
          expect(result.body.name).to.be.an('object')
          expect(result.body.name).to.have.property('message')
          expect(result.body.name.message).to.equal('Name of item is required')
          done()
        })
  })
  it('Should return error price item minimum is Rp. 100', (done) => {
    const namaBarang = {
      name: 'bakso',
      price: '',
    }
    chai.request(app)
        .post('/items')
        .set('auth', token)
        .send(namaBarang)
        .end((err, result) => {
          expect(result).to.have.status(401)
          expect(result.body).to.have.property('price')
          expect(result.body.price).to.be.an('object')
          expect(result.body.price).to.have.property('message')
          expect(result.body.price.message).to.equal('Minimum price of item is Rp. 100')
          done()
        })
  })
  it('Should return error price item NAN', (done) => {
    const namaBarang = {
      name: 'bakso',
      harga: 15000,
    }
    chai.request(app)
        .post('/items')
        .set('auth', token)
        .send(namaBarang)
        .end((err, result) => {
          expect(result).to.have.status(401)
          expect(result.body).to.have.property('price')
          expect(result.body.price).to.be.an('object')
          expect(result.body.price).to.have.property('message')
          expect(result.body.price.message).to.equal('Cast to Number failed for value "NaN" at path "price"')
          done()
        })
  })
  it('Should return error not authorized', (done) => {
    const namaBarang = {
      name: 'bakso',
      price: 15000,
    }
    chai.request(app)
        .post('/items')
        .set('auth', token_buyer)
        .send(namaBarang)
        .end((err, result) => {
          expect(result).to.have.status(400)
          expect(result.body).to.have.property('message')
          expect(result.body.message).to.equal('You are not authorized to access')
          done()
        })
  })
})

describe('Testing for find item', () => {
  it('Should return all item list', (done) => {
    chai.request(app)
        .get('/items')
        .set('auth', token)
        .end((err, result) => {
          expect(result).to.have.status(200)
          expect(result.body).to.have.property('_id')
          expect(result.body).to.have.property('itemList')
          expect(result.body.itemList).to.be.an('array')
          expect(result.body).to.have.property('brand')
          done()
        })
  })
  it('Should return error not authorized getting item list', (done) => {
    chai.request(app)
        .get('/items')
        .set('auth', token_buyer)
        .end((err, result) => {
          expect(result).to.have.status(400)
          expect(result.body).to.have.property('message')
          expect(result.body.message).to.equal('You are not authorized to access')
          done()
        })
  })
})